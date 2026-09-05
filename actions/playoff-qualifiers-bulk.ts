"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

const SUPER_ADMIN = USER_ROLES.SUPER_ADMIN;

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

/**
 * Removes every assigned playoff qualifier for the current
 * tournament in one go - useful when the group stage hasn't
 * actually finished yet and slots were assigned prematurely.
 * Does not touch playoff size (TournamentStage.maxTeams) or
 * anything else - only the team-to-seed assignments themselves.
 */
export async function clearAllPlayoffQualifications() {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const result = await prisma.playoffQualification.deleteMany({
    where: {
      tournamentId: tournament.id,
    },
  });

  revalidatePath("/admin/playoffs");
  revalidatePath("/standings");

  return {
    success: true,
    message:
      result.count > 0
        ? `Cleared ${result.count} qualifier(s).`
        : "There were no qualifiers to clear.",
  };
}