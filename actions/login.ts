"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  assertNotRateLimited,
  recordFailedLoginAttempt,
  generateAndSendOtp,
} from "@/src/auth/auth-security";

export async function requestLoginOtp(data: {
  email: string;
  password: string;
}) {
  const email = data.email
    .trim()
    .toLowerCase();

  if (!email || !data.password) {
    throw new Error(
      "Email and password are required.",
    );
  }

  await assertNotRateLimited(email);

  const user = await prisma.user.findUnique(
    {
      where: {
        email,
      },
    },
  );

  if (!user || !user.passwordHash) {
    await recordFailedLoginAttempt(email);

    throw new Error(
      "Invalid email or password.",
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

  if (!passwordMatches) {
    await recordFailedLoginAttempt(email);

    throw new Error(
      "Invalid email or password.",
    );
  }

  await generateAndSendOtp(email);

  return {
    success: true,
    message: `A login code was sent to ${email}.`,
  };
}
