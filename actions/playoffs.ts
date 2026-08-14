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
 * Get the current tournament's teams that are available
 * for manual playoff assignment.
 */
export async function getPlayoffTeams() {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const registrations =
    await prisma.tournamentRegistration.findMany({
      where: {
        tournamentId: tournament.id,
        status: "APPROVED",
      },
      include: {
        team: {
          include: {
            logo: true,
            players: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
        tournamentGroup: true,
        playoffQualification: true,
      },
      orderBy: [
        {
          tournamentGroup: {
            displayOrder: "asc",
          },
        },
        {
          team: {
            name: "asc",
          },
        },
      ],
    });

  return registrations.map((registration) => ({
    registrationId: registration.id,
    teamId: registration.team.id,
    name: registration.team.name,
    abbreviation:
      registration.team.abbreviation,
    logo:
      registration.team.logo?.url ?? null,

    playerCount:
      registration.team.players.length,

    qualified:
      registration.playoffQualification !== null,

    seed:
      registration.playoffQualification?.seed ??
      null,
  }));
}

/**
 * Get the playoff qualifications manually configured
 * by the Super Admin.
 */
export async function getPlayoffQualifications() {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const qualifications =
    await prisma.playoffQualification.findMany({
      where: {
        tournamentId: tournament.id,
      },
      include: {
        tournamentRegistration: {
          include: {
            team: {
              include: {
                logo: true,
              },
            },
          },
        },
      },
      orderBy: {
        seed: "asc",
      },
    });

  return qualifications.map((qualification) => ({
    id: qualification.id,
    seed: qualification.seed,

    registrationId:
      qualification.tournamentRegistrationId,

   team: {
        id:
            qualification.tournamentRegistration.team.id,

        name:
            qualification.tournamentRegistration.team.name,

        abbreviation:
            qualification.tournamentRegistration.team.abbreviation,

        logo:
            qualification.tournamentRegistration.team.logo
            ?.url ?? null,
        },
  }));
}

/**
 * Manually qualify a team for the playoffs.
 *
 * The seed is controlled by the Super Admin.
 */
export async function assignPlayoffQualification(
  tournamentRegistrationId: string,
  seed: number,
) {
  await requireRole(SUPER_ADMIN);

  if (!tournamentRegistrationId) {
    throw new Error(
      "Tournament registration is required.",
    );
  }

  if (
    !Number.isInteger(seed) ||
    seed < 1
  ) {
    throw new Error(
      "Seed must be a positive number.",
    );
  }

  const tournament =
    await getCurrentTournament();

  const registration =
    await prisma.tournamentRegistration.findFirst({
      where: {
        id: tournamentRegistrationId,
        tournamentId: tournament.id,
        status: "APPROVED",
      },
    });

  if (!registration) {
    throw new Error(
      "The selected team is not an approved registration for this tournament.",
    );
  }

  const existingSeed =
    await prisma.playoffQualification.findFirst({
      where: {
        tournamentId: tournament.id,
        seed,
      },
    });

  if (
    existingSeed &&
    existingSeed.tournamentRegistrationId !==
      tournamentRegistrationId
  ) {
    throw new Error(
      `Seed ${seed} is already assigned to another team.`,
    );
  }

  const qualification =
    await prisma.playoffQualification.upsert({
      where: {
        tournamentRegistrationId,
      },

      create: {
        tournamentId: tournament.id,
        tournamentRegistrationId,
        seed,
      },

      update: {
        seed,
      },

      include: {
        tournamentRegistration: {
          include: {
            team: {
              include: {
                logo: true,
              },
            },
          },
        },
      },
    });

  revalidatePath("/admin/playoffs");

  return {
    success: true,
    qualification: {
      id: qualification.id,
      seed: qualification.seed,
      registrationId:
        qualification.tournamentRegistrationId,
    team: {
    id:
        qualification.tournamentRegistration.team.id,

    name:
        qualification.tournamentRegistration.team.name,

    abbreviation:
        qualification.tournamentRegistration.team.abbreviation,

    logo:
        qualification.tournamentRegistration.team.logo
        ?.url ?? null,
    },
    },
  };
}

/**
 * Remove a team from playoff qualification.
 */
export async function removePlayoffQualification(
  tournamentRegistrationId: string,
) {
  await requireRole(SUPER_ADMIN);

  if (!tournamentRegistrationId) {
    throw new Error(
      "Tournament registration is required.",
    );
  }

  const tournament =
    await getCurrentTournament();

  await prisma.playoffQualification.deleteMany({
    where: {
      tournamentId: tournament.id,
      tournamentRegistrationId,
    },
  });

  revalidatePath("/admin/playoffs");

  return {
    success: true,
  };
}

export async function getTournamentControl() {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  return {
    id: tournament.id,
    name: tournament.name,
    season: "Season 1",
    playoffSize: 8,
  };
}

export async function getQualifiedTeams() {
  return getPlayoffQualifications();
}

export async function saveQualifiedTeams(
  teams: Array<{
    registrationId: string;
    seed: number;
  }>,
) {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const seenRegistrations = new Set<string>();
  const seenSeeds = new Set<number>();

  for (const team of teams) {
    if (seenRegistrations.has(team.registrationId)) {
      throw new Error("A team cannot be assigned more than once.");
    }

    if (seenSeeds.has(team.seed)) {
      throw new Error(`Seed ${team.seed} is assigned more than once.`);
    }

    seenRegistrations.add(team.registrationId);
    seenSeeds.add(team.seed);

    const registration =
      await prisma.tournamentRegistration.findFirst({
        where: {
          id: team.registrationId,
          tournamentId: tournament.id,
          status: "APPROVED",
        },
      });

    if (!registration) {
      throw new Error(
        "One or more selected teams are not approved registrations.",
      );
    }

    if (!Number.isInteger(team.seed) || team.seed < 1) {
      throw new Error(
        "Every playoff seed must be a positive number.",
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.playoffQualification.deleteMany({
      where: {
        tournamentId: tournament.id,
      },
    });

    if (teams.length > 0) {
      await tx.playoffQualification.createMany({
        data: teams.map((team) => ({
          tournamentId: tournament.id,
          tournamentRegistrationId: team.registrationId,
          seed: team.seed,
        })),
      });
    }
  });

  revalidatePath("/admin/playoffs");
  revalidatePath("/standings");
  revalidatePath("/schedule");

  return {
    success: true,
  };
}

export type PlayoffBracketSlotData = {
  id: string;
  slotKey: string;
  label: string;
  bracketSide: string;
  roundOrder: number;
  slotOrder: number;
  positionX: number | null;
  positionY: number | null;

  scoreA: number;
  scoreB: number;
  isCompleted: boolean;

  teamA: {
    registrationId: string;
    name: string;
    abbreviation: string | null;
    logo: string | null;
  } | null;

  teamB: {
    registrationId: string;
    name: string;
    abbreviation: string | null;
    logo: string | null;
  } | null;

  winnerRegistrationId: string | null;
};

export type PlayoffBracketData = {
  id: string;
  name: string;
  slots: PlayoffBracketSlotData[];
};

/**
 * Get the current tournament's saved manual playoff bracket.
 */
export async function getManualPlayoffBracket(): Promise<PlayoffBracketData> {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const bracket = await prisma.playoffBracket.findUnique({
    where: {
      tournamentId: tournament.id,
    },
    include: {
      slots: {
        orderBy: [
          {
            bracketSide: "asc",
          },
          {
            roundOrder: "asc",
          },
          {
            slotOrder: "asc",
          },
        ],
        include: {
          teamARegistration: {
            include: {
              team: {
                include: {
                  logo: true,
                },
              },
            },
          },
          teamBRegistration: {
            include: {
              team: {
                include: {
                  logo: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!bracket) {
    return {
      id: "",
      name: "Playoffs",
      slots: [],
    };
  }

  return {
    id: bracket.id,
    name: bracket.name,

    slots: bracket.slots.map((slot) => ({
      id: slot.id,
      slotKey: slot.slotKey,
      label: slot.label,
      bracketSide: slot.bracketSide,
      roundOrder: slot.roundOrder,
      slotOrder: slot.slotOrder,

      positionX: slot.positionX,
      positionY: slot.positionY,

      scoreA: slot.scoreA,
      scoreB: slot.scoreB,

      isCompleted: slot.isCompleted,

      winnerRegistrationId:
        slot.winnerRegistrationId,

      teamA: slot.teamARegistration
        ? {
            registrationId:
              slot.teamARegistration.id,

            name:
              slot.teamARegistration.team.name,

            abbreviation:
              slot.teamARegistration.team
                .abbreviation,

            logo:
              slot.teamARegistration.team.logo
                ?.url ?? null,
          }
        : null,

      teamB: slot.teamBRegistration
        ? {
            registrationId:
              slot.teamBRegistration.id,

            name:
              slot.teamBRegistration.team.name,

            abbreviation:
              slot.teamBRegistration.team
                .abbreviation,

            logo:
              slot.teamBRegistration.team.logo
                ?.url ?? null,
          }
        : null,
    })),
  };
}

/**
 * Get the current tournament's saved manual playoff bracket.
 */
export async function createPlayoffBracketSlot(data: {
  slotKey: string;
  label: string;
  bracketSide: string;
  roundOrder: number;
  slotOrder: number;
  positionX?: number | null;
  positionY?: number | null;
}) {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const bracket =
    await prisma.playoffBracket.findUnique({
      where: {
        tournamentId: tournament.id,
      },
    });

  if (!bracket) {
    throw new Error(
      "Create a playoff bracket first.",
    );
  }

  if (!data.slotKey.trim()) {
    throw new Error(
      "Slot key is required.",
    );
  }

  if (!data.label.trim()) {
    throw new Error(
      "Slot label is required.",
    );
  }

  if (!Number.isInteger(data.roundOrder)) {
    throw new Error(
      "Round order must be a whole number.",
    );
  }

  if (!Number.isInteger(data.slotOrder)) {
    throw new Error(
      "Slot order must be a whole number.",
    );
  }

  const slot =
    await prisma.playoffBracketSlot.create({
      data: {
        bracketId: bracket.id,

        slotKey: data.slotKey.trim(),
        label: data.label.trim(),

        bracketSide:
          data.bracketSide.trim() || "UPPER",

        roundOrder: data.roundOrder,
        slotOrder: data.slotOrder,

        positionX:
          data.positionX ?? null,

        positionY:
          data.positionY ?? null,
      },
    });

  revalidatePath("/admin/playoffs");

  return {
    success: true,
    slotId: slot.id,
  };
}

/**
 * Manually place a team into Team A or Team B.
 */
export async function assignTeamToPlayoffSlot(data: {
  slotId: string;
  side: "A" | "B";
  registrationId: string | null;
}) {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const slot =
    await prisma.playoffBracketSlot.findFirst({
      where: {
        id: data.slotId,

        bracket: {
          tournamentId: tournament.id,
        },
      },
    });

  if (!slot) {
    throw new Error(
      "Playoff slot not found.",
    );
  }

  if (data.registrationId) {
    const registration =
      await prisma.tournamentRegistration.findFirst({
        where: {
          id: data.registrationId,
          tournamentId: tournament.id,
          status: "APPROVED",
        },
      });

    if (!registration) {
      throw new Error(
        "The selected team is not an approved tournament registration.",
      );
    }
  }

  const updateData =
    data.side === "A"
      ? {
          teamARegistrationId:
            data.registrationId,
        }
      : {
          teamBRegistrationId:
            data.registrationId,
        };

  await prisma.playoffBracketSlot.update({
    where: {
      id: slot.id,
    },
    data: updateData,
  });

  revalidatePath("/admin/playoffs");
  revalidatePath("/schedule");
  revalidatePath("/standings");

  return {
    success: true,
  };
}
/**
 * Move a team from one bracket slot to another.
 */
export async function movePlayoffTeam(data: {
  sourceSlotId: string;
  sourceSide: "A" | "B";
  targetSlotId: string;
  targetSide: "A" | "B";
  replaceExisting?: boolean;
}) {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const slots =
    await prisma.playoffBracketSlot.findMany({
      where: {
        id: {
          in: [
            data.sourceSlotId,
            data.targetSlotId,
          ],
        },

        bracket: {
          tournamentId: tournament.id,
        },
      },
    });

  const source = slots.find(
    (slot) =>
      slot.id === data.sourceSlotId,
  );

  const target = slots.find(
    (slot) =>
      slot.id === data.targetSlotId,
  );

  if (!source || !target) {
    throw new Error(
      "Source or target bracket slot was not found.",
    );
  }

  const teamRegistrationId =
    data.sourceSide === "A"
      ? source.teamARegistrationId
      : source.teamBRegistrationId;

  if (!teamRegistrationId) {
    throw new Error(
      "There is no team in the selected source slot.",
    );
  }

  const existingTargetTeam =
    data.targetSide === "A"
      ? target.teamARegistrationId
      : target.teamBRegistrationId;

  if (
    existingTargetTeam &&
    !data.replaceExisting
  ) {
    throw new Error(
      "The destination slot already contains a team.",
    );
  }

  await prisma.$transaction([
    prisma.playoffBracketSlot.update({
      where: {
        id: source.id,
      },

      data:
        data.sourceSide === "A"
          ? {
              teamARegistrationId: null,
            }
          : {
              teamBRegistrationId: null,
            },
    }),

    prisma.playoffBracketSlot.update({
      where: {
        id: target.id,
      },

      data:
        data.targetSide === "A"
          ? {
              teamARegistrationId:
                teamRegistrationId,
            }
          : {
              teamBRegistrationId:
                teamRegistrationId,
            },
    }),
  ]);

  revalidatePath("/admin/playoffs");
  revalidatePath("/schedule");
  revalidatePath("/standings");

  return {
    success: true,
  };
}
/**
 * Remove a team from one side of a bracket slot.
 */
export async function removeTeamFromPlayoffSlot(data: {
  slotId: string;
  side: "A" | "B";
}) {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const slot =
    await prisma.playoffBracketSlot.findFirst({
      where: {
        id: data.slotId,

        bracket: {
          tournamentId: tournament.id,
        },
      },
    });

  if (!slot) {
    throw new Error(
      "Playoff slot not found.",
    );
  }

  await prisma.playoffBracketSlot.update({
    where: {
      id: slot.id,
    },

    data:
      data.side === "A"
        ? {
            teamARegistrationId: null,
          }
        : {
            teamBRegistrationId: null,
          },
  });

  revalidatePath("/admin/playoffs");
  revalidatePath("/schedule");

  return {
    success: true,
  };
}/**
 * Manually record a playoff result.
 */
export async function updatePlayoffResult(data: {
  slotId: string;
  scoreA: number;
  scoreB: number;
  winnerRegistrationId: string | null;
  isCompleted: boolean;
}) {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const slot =
    await prisma.playoffBracketSlot.findFirst({
      where: {
        id: data.slotId,

        bracket: {
          tournamentId: tournament.id,
        },
      },
    });

  if (!slot) {
    throw new Error(
      "Playoff slot not found.",
    );
  }

  if (
    !Number.isInteger(data.scoreA) ||
    data.scoreA < 0
  ) {
    throw new Error(
      "Team A score must be a non-negative number.",
    );
  }

  if (
    !Number.isInteger(data.scoreB) ||
    data.scoreB < 0
  ) {
    throw new Error(
      "Team B score must be a non-negative number.",
    );
  }

  const participants = [
    slot.teamARegistrationId,
    slot.teamBRegistrationId,
  ].filter(Boolean);

  if (
    data.winnerRegistrationId &&
    !participants.includes(
      data.winnerRegistrationId,
    )
  ) {
    throw new Error(
      "Winner must be one of the teams assigned to this match.",
    );
  }

  if (
    data.isCompleted &&
    !data.winnerRegistrationId
  ) {
    throw new Error(
      "Select a winner before marking the match as completed.",
    );
  }

  if (
    data.isCompleted &&
    data.scoreA === data.scoreB
  ) {
    throw new Error(
      "A completed playoff match cannot have a tied score.",
    );
  }

  await prisma.playoffBracketSlot.update({
    where: {
      id: slot.id,
    },

    data: {
      scoreA: data.scoreA,
      scoreB: data.scoreB,

      winnerRegistrationId:
        data.winnerRegistrationId,

      isCompleted:
        data.isCompleted,
    },
  });

  revalidatePath("/admin/playoffs");
  revalidatePath("/schedule");
  revalidatePath("/standings");

  return {
    success: true,
  };
}

/**
 * Reset the result of a playoff match.
 *
 * This does NOT remove the teams.
 */
export async function resetPlayoffResult(
  slotId: string,
) {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const slot =
    await prisma.playoffBracketSlot.findFirst({
      where: {
        id: slotId,

        bracket: {
          tournamentId: tournament.id,
        },
      },
    });

  if (!slot) {
    throw new Error(
      "Playoff slot not found.",
    );
  }

  await prisma.playoffBracketSlot.update({
    where: {
      id: slot.id,
    },

    data: {
      scoreA: 0,
      scoreB: 0,
      winnerRegistrationId: null,
      isCompleted: false,
    },
  });

  revalidatePath("/admin/playoffs");
  revalidatePath("/schedule");

  return {
    success: true,
  };
}

export async function getPlayoffBracket() {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const bracket = await prisma.playoffBracket.findUnique({
    where: {
      tournamentId: tournament.id,
    },
    include: {
      slots: {
        orderBy: [
          {
            bracketSide: "asc",
          },
          {
            roundOrder: "asc",
          },
          {
            slotOrder: "asc",
          },
        ],
        include: {
          teamARegistration: {
            include: {
              team: {
                include: {
                  logo: true,
                },
              },
            },
          },
          teamBRegistration: {
            include: {
              team: {
                include: {
                  logo: true,
                },
              },
            },
          },
          winnerRegistration: {
            include: {
              team: true,
            },
          },
        },
      },
    },
  });

  if (!bracket) {
    return null;
  }

  return {
    id: bracket.id,
    name: bracket.name,
    slots: bracket.slots.map((slot) => ({
      id: slot.id,
      slotKey: slot.slotKey,
      label: slot.label,
      bracketSide: slot.bracketSide,
      roundOrder: slot.roundOrder,
      slotOrder: slot.slotOrder,
      positionX: slot.positionX,
      positionY: slot.positionY,

      teamA: slot.teamARegistration
        ? {
            registrationId: slot.teamARegistration.id,
            id: slot.teamARegistration.team.id,
            name: slot.teamARegistration.team.name,
            logo:
              slot.teamARegistration.team.logo?.url ?? null,
          }
        : null,

      teamB: slot.teamBRegistration
        ? {
            registrationId: slot.teamBRegistration.id,
            id: slot.teamBRegistration.team.id,
            name: slot.teamBRegistration.team.name,
            logo:
              slot.teamBRegistration.team.logo?.url ?? null,
          }
        : null,

      scoreA: slot.scoreA,
      scoreB: slot.scoreB,

      winner: slot.winnerRegistration
        ? {
            registrationId: slot.winnerRegistration.id,
            teamId: slot.winnerRegistration.team.id,
          }
        : null,

      isCompleted: slot.isCompleted,
    })),
  };
}

export async function createPlayoffBracket() {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const existing = await prisma.playoffBracket.findUnique({
    where: {
      tournamentId: tournament.id,
    },
  });

  if (existing) {
    return {
      success: true,
      bracketId: existing.id,
      created: false,
    };
  }

  const bracket = await prisma.playoffBracket.create({
    data: {
      tournamentId: tournament.id,
      name: "Playoffs",
      slots: {
        create: [
          // Upper Bracket
          {
            slotKey: "UB-R1-1",
            label: "Upper Bracket — Round 1 — Match 1",
            bracketSide: "UPPER",
            roundOrder: 1,
            slotOrder: 1,
          },
          {
            slotKey: "UB-R1-2",
            label: "Upper Bracket — Round 1 — Match 2",
            bracketSide: "UPPER",
            roundOrder: 1,
            slotOrder: 2,
          },
          {
            slotKey: "UB-R1-3",
            label: "Upper Bracket — Round 1 — Match 3",
            bracketSide: "UPPER",
            roundOrder: 1,
            slotOrder: 3,
          },
          {
            slotKey: "UB-R1-4",
            label: "Upper Bracket — Round 1 — Match 4",
            bracketSide: "UPPER",
            roundOrder: 1,
            slotOrder: 4,
          },
          {
            slotKey: "UB-R2-1",
            label: "Upper Bracket — Round 2 — Match 1",
            bracketSide: "UPPER",
            roundOrder: 2,
            slotOrder: 1,
          },
          {
            slotKey: "UB-R2-2",
            label: "Upper Bracket — Round 2 — Match 2",
            bracketSide: "UPPER",
            roundOrder: 2,
            slotOrder: 2,
          },
          {
            slotKey: "UB-FINAL",
            label: "Upper Bracket Final",
            bracketSide: "UPPER",
            roundOrder: 3,
            slotOrder: 1,
          },

          // Lower Bracket
          {
            slotKey: "LB-R1-1",
            label: "Lower Bracket — Round 1 — Match 1",
            bracketSide: "LOWER",
            roundOrder: 1,
            slotOrder: 1,
          },
          {
            slotKey: "LB-R1-2",
            label: "Lower Bracket — Round 1 — Match 2",
            bracketSide: "LOWER",
            roundOrder: 1,
            slotOrder: 2,
          },
          {
            slotKey: "LB-R2-1",
            label: "Lower Bracket — Round 2 — Match 1",
            bracketSide: "LOWER",
            roundOrder: 2,
            slotOrder: 1,
          },
          {
            slotKey: "LB-R2-2",
            label: "Lower Bracket — Round 2 — Match 2",
            bracketSide: "LOWER",
            roundOrder: 2,
            slotOrder: 2,
          },
          {
            slotKey: "LB-R3-1",
            label: "Lower Bracket — Round 3 — Match 1",
            bracketSide: "LOWER",
            roundOrder: 3,
            slotOrder: 1,
          },
          {
            slotKey: "LB-FINAL",
            label: "Lower Bracket Final",
            bracketSide: "LOWER",
            roundOrder: 4,
            slotOrder: 1,
          },

          // Grand Finals
          {
            slotKey: "GRAND-FINAL",
            label: "Grand Finals",
            bracketSide: "GRAND_FINAL",
            roundOrder: 1,
            slotOrder: 1,
          },
        ],
      },
    },
  });

  

  revalidatePath("/admin/playoffs");
  revalidatePath("/admin/playoffs/bracket");

  return {
    success: true,
    bracketId: bracket.id,
    created: true,
  };
}

export async function rebuildCurrentPlayoffBracketStructure() {
  await requireRole(SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  const bracket =
    await prisma.playoffBracket.findUnique({
      where: {
        tournamentId: tournament.id,
      },
      include: {
        slots: {
          select: {
            id: true,
            teamARegistrationId: true,
            teamBRegistrationId: true,
            winnerRegistrationId: true,
            scoreA: true,
            scoreB: true,
            isCompleted: true,
          },
        },
      },
    });

  if (!bracket) {
    throw new Error(
      "Create a playoff bracket first.",
    );
  }

  const hasExistingResults =
    bracket.slots.some(
      (slot) =>
        slot.teamARegistrationId !== null ||
        slot.teamBRegistrationId !== null ||
        slot.winnerRegistrationId !== null ||
        slot.scoreA !== 0 ||
        slot.scoreB !== 0 ||
        slot.isCompleted,
    );

  if (hasExistingResults) {
    throw new Error(
      "The current bracket already contains teams or results. The structure cannot be rebuilt.",
    );
  }

  const slots = [
    // =====================================================
    // UPPER BRACKET — ROUND 1
    // =====================================================

    {
      slotKey: "UB-R1-1",
      label: "Upper Bracket — Round 1 — Match 1",
      bracketSide: "UPPER",
      roundOrder: 1,
      slotOrder: 1,
    },
    {
      slotKey: "UB-R1-2",
      label: "Upper Bracket — Round 1 — Match 2",
      bracketSide: "UPPER",
      roundOrder: 1,
      slotOrder: 2,
    },
    {
      slotKey: "UB-R1-3",
      label: "Upper Bracket — Round 1 — Match 3",
      bracketSide: "UPPER",
      roundOrder: 1,
      slotOrder: 3,
    },
    {
      slotKey: "UB-R1-4",
      label: "Upper Bracket — Round 1 — Match 4",
      bracketSide: "UPPER",
      roundOrder: 1,
      slotOrder: 4,
    },

    // =====================================================
    // UPPER BRACKET — QUARTERFINALS
    // =====================================================

    {
      slotKey: "UB-QF-1",
      label: "Upper Bracket — Quarterfinal — Match 1",
      bracketSide: "UPPER",
      roundOrder: 2,
      slotOrder: 1,
    },
    {
      slotKey: "UB-QF-2",
      label: "Upper Bracket — Quarterfinal — Match 2",
      bracketSide: "UPPER",
      roundOrder: 2,
      slotOrder: 2,
    },
    {
      slotKey: "UB-QF-3",
      label: "Upper Bracket — Quarterfinal — Match 3",
      bracketSide: "UPPER",
      roundOrder: 2,
      slotOrder: 3,
    },
    {
      slotKey: "UB-QF-4",
      label: "Upper Bracket — Quarterfinal — Match 4",
      bracketSide: "UPPER",
      roundOrder: 2,
      slotOrder: 4,
    },

    // =====================================================
    // UPPER BRACKET — SEMIFINALS
    // =====================================================

    {
      slotKey: "UB-SF-1",
      label: "Upper Bracket — Semifinal — Match 1",
      bracketSide: "UPPER",
      roundOrder: 3,
      slotOrder: 1,
    },
    {
      slotKey: "UB-SF-2",
      label: "Upper Bracket — Semifinal — Match 2",
      bracketSide: "UPPER",
      roundOrder: 3,
      slotOrder: 2,
    },

    // =====================================================
    // UPPER BRACKET — FINAL
    // =====================================================

    {
      slotKey: "UB-FINAL",
      label: "Upper Bracket Final",
      bracketSide: "UPPER",
      roundOrder: 4,
      slotOrder: 1,
    },

// =====================================================
// LOWER BRACKET — ROUND 1
// =====================================================

{
  slotKey: "LB-R1-1",
  label: "Lower Bracket — Round 1 — Match 1",
  bracketSide: "LOWER",
  roundOrder: 1,
  slotOrder: 1,
},
{
  slotKey: "LB-R1-2",
  label: "Lower Bracket — Round 1 — Match 2",
  bracketSide: "LOWER",
  roundOrder: 1,
  slotOrder: 2,
},
{
  slotKey: "LB-R1-3",
  label: "Lower Bracket — Round 1 — Match 3",
  bracketSide: "LOWER",
  roundOrder: 1,
  slotOrder: 3,
},
{
  slotKey: "LB-R1-4",
  label: "Lower Bracket — Round 1 — Match 4",
  bracketSide: "LOWER",
  roundOrder: 1,
  slotOrder: 4,
},

// =====================================================
// LOWER BRACKET — ROUND 2
// =====================================================

{
  slotKey: "LB-R2-1",
  label: "Lower Bracket — Round 2 — Match 1",
  bracketSide: "LOWER",
  roundOrder: 2,
  slotOrder: 1,
},
{
  slotKey: "LB-R2-2",
  label: "Lower Bracket — Round 2 — Match 2",
  bracketSide: "LOWER",
  roundOrder: 2,
  slotOrder: 2,
},

// =====================================================
// LOWER BRACKET — ROUND 3
// =====================================================

{
  slotKey: "LB-R3-1",
  label: "Lower Bracket — Round 3 — Match 1",
  bracketSide: "LOWER",
  roundOrder: 3,
  slotOrder: 1,
},
{
  slotKey: "LB-R3-2",
  label: "Lower Bracket — Round 3 — Match 2",
  bracketSide: "LOWER",
  roundOrder: 3,
  slotOrder: 2,
},

// =====================================================
// LOWER BRACKET — ROUND 4
// =====================================================

{
  slotKey: "LB-R4-1",
  label: "Lower Bracket — Round 4 — Match 1",
  bracketSide: "LOWER",
  roundOrder: 4,
  slotOrder: 1,
},

// =====================================================
// LOWER BRACKET — FINAL
// =====================================================

{
  slotKey: "LB-FINAL",
  label: "Lower Bracket Final",
  bracketSide: "LOWER",
  roundOrder: 5,
  slotOrder: 1,
},

// =====================================================
// GRAND FINALS
// =====================================================

  {
    slotKey: "GRAND-FINAL-RESET",
    label: "Grand Final — Reset",
    bracketSide: "GRAND_FINAL",
    roundOrder: 2,
    slotOrder: 1,
  },
  ];

  await prisma.$transaction(async (tx) => {
    await tx.playoffBracketSlot.deleteMany({
      where: {
        bracketId: bracket.id,
      },
    });

    await tx.playoffBracketSlot.createMany({
      data: slots.map((slot) => ({
        bracketId: bracket.id,
        slotKey: slot.slotKey,
        label: slot.label,
        bracketSide: slot.bracketSide,
        roundOrder: slot.roundOrder,
        slotOrder: slot.slotOrder,
        positionX: null,
        positionY: null,
      })),
    });
  });

  revalidatePath("/admin/playoffs");
  revalidatePath("/admin/playoffs/bracket");
  revalidatePath("/schedule");

  return {
    success: true,
    slotCount: slots.length,
  };
}