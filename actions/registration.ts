"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

async function requireSuperAdmin() {
  await requireRole(USER_ROLES.SUPER_ADMIN);
}

async function getCurrentTournament() {
  const tournament = await prisma.tournament.findFirst({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!tournament) {
    throw new Error("No tournament found.");
  }

  return tournament;
}

export async function getRegistrationSettings() {
  await requireSuperAdmin();

  const tournament = await getCurrentTournament();

  const now = new Date();

  let status: "OPEN" | "CLOSED" | "NOT_STARTED";

  if (
    tournament.registrationOpensAt &&
    now < tournament.registrationOpensAt
  ) {
    status = "NOT_STARTED";
  } else if (
    tournament.registrationClosesAt &&
    now > tournament.registrationClosesAt
  ) {
    status = "CLOSED";
  } else {
    status = "OPEN";
  }

  return {
    tournamentId: tournament.id,
    tournamentName: tournament.name,
    status,
    registrationOpensAt:
      tournament.registrationOpensAt?.toISOString() ?? null,
    registrationClosesAt:
      tournament.registrationClosesAt?.toISOString() ?? null,
    registrationUrl: tournament.registrationUrl ?? "",
  };
}

export async function updateRegistrationSettings(data: {
  registrationOpensAt?: string;
  registrationClosesAt?: string;
  registrationUrl?: string;
}) {
  await requireSuperAdmin();

  const tournament = await getCurrentTournament();

  const opensAt = data.registrationOpensAt
    ? new Date(data.registrationOpensAt)
    : null;

  const closesAt = data.registrationClosesAt
    ? new Date(data.registrationClosesAt)
    : null;

  if (
    opensAt &&
    closesAt &&
    opensAt >= closesAt
  ) {
    throw new Error(
      "Registration opening time must be before the closing time.",
    );
  }

  let registrationUrl =
    data.registrationUrl?.trim() || null;

  if (registrationUrl) {
    try {
      const url = new URL(registrationUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error(
        "Please enter a valid registration URL.",
      );
    }
  }

  await prisma.tournament.update({
    where: {
      id: tournament.id,
    },

    data: {
      registrationOpensAt: opensAt,
      registrationClosesAt: closesAt,
      registrationUrl,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/register");

  return {
    success: true,
  };
}

export async function openRegistration() {
  await requireSuperAdmin();

  const tournament = await getCurrentTournament();

  await prisma.tournament.update({
    where: {
      id: tournament.id,
    },

    data: {
      registrationOpensAt: new Date(0),
      registrationClosesAt: null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");

  return {
    success: true,
  };
}

export async function closeRegistration() {
  await requireSuperAdmin();

  const tournament = await getCurrentTournament();

  await prisma.tournament.update({
    where: {
      id: tournament.id,
    },

    data: {
      registrationClosesAt: new Date(),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");

  return {
    success: true,
  };
}

export async function getPublicRegistrationSettings() {
  const tournament = await prisma.tournament.findFirst({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      registrationOpensAt: true,
      registrationClosesAt: true,
      registrationUrl: true,
    },
  });

  if (!tournament) {
    return {
      registrationOpen: false,
      registrationUrl: null,
    };
  }

  const now = new Date();

  const registrationOpen =
    (!tournament.registrationOpensAt ||
      now >= tournament.registrationOpensAt) &&
    (!tournament.registrationClosesAt ||
      now <= tournament.registrationClosesAt);

  return {
    registrationOpen,
    registrationUrl: tournament.registrationUrl,
  };
}