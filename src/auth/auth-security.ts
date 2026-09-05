"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  sendEmail,
  otpEmailHtml,
  newDeviceAlertHtml,
} from "@/lib/email";

const OTP_EXPIRY_MINUTES = 10;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
| Keyed by email (identifier) - a DB-backed counter rather than
| in-memory, since serverless deployments don't share memory across
| instances/restarts.
*/

export async function assertNotRateLimited(
  identifier: string,
) {
  const record =
    await prisma.loginAttempt.findUnique({
      where: {
        identifier,
      },
    });

  if (
    record?.lockedUntil &&
    record.lockedUntil > new Date()
  ) {
    const minutesLeft = Math.ceil(
      (record.lockedUntil.getTime() -
        Date.now()) /
        60000,
    );

    throw new Error(
      `Too many failed attempts. Try again in ${minutesLeft} minute(s).`,
    );
  }
}

export async function recordFailedLoginAttempt(
  identifier: string,
) {
  const record =
    await prisma.loginAttempt.upsert({
      where: {
        identifier,
      },
      create: {
        identifier,
        attempts: 1,
      },
      update: {
        attempts: {
          increment: 1,
        },
      },
    });

  if (
    record.attempts >= MAX_FAILED_ATTEMPTS
  ) {
    await prisma.loginAttempt.update({
      where: {
        identifier,
      },
      data: {
        lockedUntil: new Date(
          Date.now() +
            LOCKOUT_MINUTES * 60000,
        ),
      },
    });
  }
}

export async function resetLoginAttempts(
  identifier: string,
) {
  await prisma.loginAttempt.deleteMany({
    where: {
      identifier,
    },
  });
}

/*
|--------------------------------------------------------------------------
| OTP
|--------------------------------------------------------------------------
| Reuses the standard (and previously unused) VerificationToken model:
| identifier = email, token = hashed 6-digit code, expires = expiry.
*/

function generateOtpCode() {
  return crypto
    .randomInt(100000, 999999)
    .toString();
}

export async function generateAndSendOtp(
  email: string,
) {
  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(
    code,
    10,
  );

  await prisma.verificationToken.deleteMany(
    {
      where: {
        identifier: email,
      },
    },
  );

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: codeHash,
      expires: new Date(
        Date.now() +
          OTP_EXPIRY_MINUTES * 60000,
      ),
    },
  });

  await sendEmail({
    to: email,
    subject:
      "Your Elite Battlegrounds Series login code",
    html: otpEmailHtml(code),
  });
}

export async function verifyOtpCode(
  email: string,
  code: string,
): Promise<boolean> {
  const record =
    await prisma.verificationToken.findFirst(
      {
        where: {
          identifier: email,
        },
      },
    );

  if (!record) {
    return false;
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany(
      {
        where: {
          identifier: email,
        },
      },
    );

    return false;
  }

  const matches = await bcrypt.compare(
    code,
    record.token,
  );

  // Single-use - delete regardless of outcome once checked, so a
  // leaked/guessed code can't be reused.
  await prisma.verificationToken.deleteMany(
    {
      where: {
        identifier: email,
      },
    },
  );

  return matches;
}

/*
|--------------------------------------------------------------------------
| Activity Log (Audit Trail)
|--------------------------------------------------------------------------
*/

type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "APPROVE"
  | "REJECT";

export async function logActivity(data: {
  userId?: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        description: data.description,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  } catch (error) {
    // Logging must never break the actual flow it's observing.
    console.error(
      "Failed to write activity log:",
      error,
    );
  }
}

/*
|--------------------------------------------------------------------------
| New Device / Location Detection
|--------------------------------------------------------------------------
*/

export async function isKnownLoginSource(
  userId: string,
  ipAddress: string,
): Promise<boolean> {
  if (
    !ipAddress ||
    ipAddress === "unknown"
  ) {
    // Can't identify the source - treat as unknown/new rather than
    // silently skipping the alert.
    return false;
  }

  const existing =
    await prisma.activityLog.findFirst({
      where: {
        userId,
        action: "LOGIN",
        ipAddress,
        description: {
          startsWith: "Successful",
        },
      },
    });

  return Boolean(existing);
}

export async function sendNewDeviceAlert(
  email: string,
  ipAddress: string,
  userAgent: string,
) {
  await sendEmail({
    to: email,
    subject:
      "New sign-in to your Elite Battlegrounds Series admin account",
    html: newDeviceAlertHtml({
      ipAddress,
      userAgent,
      time: new Date().toLocaleString(
        "en-US",
        {
          dateStyle: "medium",
          timeStyle: "short",
        },
      ),
    }),
  });
}

/*
|--------------------------------------------------------------------------
| Request Metadata Helpers
|--------------------------------------------------------------------------
*/

export async function extractIpAddress(
  headers:
    | Record<string, string | string[]>
    | undefined,
): Promise<string> {
  const forwarded =
    headers?.["x-forwarded-for"];

  if (Array.isArray(forwarded)) {
    return forwarded[0] ?? "unknown";
  }

  if (typeof forwarded === "string") {
    return (
      forwarded.split(",")[0]?.trim() ??
      "unknown"
    );
  }

  return "unknown";
}

export async function extractUserAgent(
  headers:
    | Record<string, string | string[]>
    | undefined,
): Promise<string> {
  const userAgent = headers?.["user-agent"];

  if (Array.isArray(userAgent)) {
    return userAgent[0] ?? "unknown";
  }

  return (
    (userAgent as string) ?? "unknown"
  );
}
