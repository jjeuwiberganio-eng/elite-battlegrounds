"use server";

import { revalidatePath } from "next/cache";
import { getGroupStageScheduleDays } from "@/actions/schedule-days";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

export async function getAdminMatches() {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  return prisma.match.findMany({
    orderBy: [
      {
        scheduledAt: "asc",
      },
      {
        matchNumber: "asc",
      },
    ],

    include: {
      tournamentStage: {
        select: {
          id: true,
          name: true,
          tournamentId: true,
        },
      },

      scheduleDay: {
      select: {
        id: true,
        name: true,
        dayNumber: true,
      },
    },

      participants: {
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
          side: "asc",
        },
      },
    },
  });
}

export async function getMatchFormData() {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const tournament = await prisma.tournament.findFirst({
    where: {
      deletedAt: null,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      stages: {
        orderBy: {
          displayOrder: "asc",
        },
      },

      registrations: {
        where: {
          status: "APPROVED",
        },

        include: {
          team: {
            include: {
              logo: true,
            },
          },
        },

        orderBy: {
          team: {
            name: "asc",
          },
        },
      },
    },
  });

  if (!tournament) {
    return {
      tournament: null,
      stages: [],
      teams: [],
      scheduleDays: [],
    };
  }
  const scheduleDays =
  await getGroupStageScheduleDays();
  return {
    tournament: {
      id: tournament.id,
      name: tournament.name,
    },

    stages: tournament.stages.map((stage) => ({
      id: stage.id,
      name: stage.name,
      tournamentId: stage.tournamentId,
    })),

    teams: tournament.registrations.map((registration) => ({
      id: registration.team.id,
      name: registration.team.name,
      registrationId: registration.id,
      logo: registration.team.logo,
    })),
    scheduleDays,
  };
}

export async function createMatch(data: {
  matchNumber: number;
  tournamentStageId: string;
  teamAId: string;
  teamBId: string;
  bestOf: "BO1" | "BO3" | "BO5" | "BO7";
  scheduledAt?: string;
  refereeId?: string;
  streamUrl?: string;
  scheduleDayId?: string;
}) {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  if (!data.tournamentStageId) {
    throw new Error("Tournament stage is required.");
  }

  if (!data.teamAId || !data.teamBId) {
    throw new Error("Both teams are required.");
  }

  if (data.teamAId === data.teamBId) {
    throw new Error("Teams must be different.");
  }

  const stage = await prisma.tournamentStage.findUnique({
    where: {
      id: data.tournamentStageId,
    },

    select: {
      id: true,
      tournamentId: true,
      slug: true,
    },
  });

  if (!stage) {
    throw new Error("Tournament stage not found.");
  }

  const isGroupStage =
  stage.slug.trim().toLowerCase() === "group-stage";

let scheduleDayId: string | null = null;

if (isGroupStage) {
  if (!data.scheduleDayId) {
    throw new Error(
      "Schedule day is required for Group Stage matches.",
    );
  }

  const scheduleDay =
    await prisma.tournamentScheduleDay.findFirst({
      where: {
        id: data.scheduleDayId,
        stageId: stage.id,
        tournamentId: stage.tournamentId,
      },
      select: {
        id: true,
      },
    });

  if (!scheduleDay) {
    throw new Error(
      "Selected schedule day does not belong to this Group Stage.",
    );
  }

  scheduleDayId = scheduleDay.id;
}

  const registrations =
    await prisma.tournamentRegistration.findMany({
      where: {
        tournamentId: stage.tournamentId,

        teamId: {
          in: [data.teamAId, data.teamBId],
        },

        status: "APPROVED",
      },

      select: {
        id: true,
        teamId: true,
      },
    });

  const teamARegistration = registrations.find(
    (registration) =>
      registration.teamId === data.teamAId,
  );

  const teamBRegistration = registrations.find(
    (registration) =>
      registration.teamId === data.teamBId,
  );

  if (!teamARegistration || !teamBRegistration) {
    throw new Error(
      "Both teams must have an approved tournament registration.",
    );
  }

  const existingMatch =
    await prisma.match.findFirst({
      where: {
        tournamentStageId:
          data.tournamentStageId,

        matchNumber: data.matchNumber,
      },

      select: {
        id: true,
      },
    });

  if (existingMatch) {
    throw new Error(
      `Match #${data.matchNumber} already exists in this stage.`,
    );
  }

  const match = await prisma.match.create({
    data: {
      matchNumber: data.matchNumber,

      roundName: "Match",

      tournamentStageId:
        data.tournamentStageId,

      scheduleDayId,

      bestOf: data.bestOf,

      scheduledAt: data.scheduledAt
        ? new Date(data.scheduledAt)
        : null,

      refereeId:
        data.refereeId || null,

      streamUrl:
        data.streamUrl || null,

      participants: {
        create: [
          {
            tournamentRegistrationId:
              teamARegistration.id,

            side: "TEAM_A",
          },

          {
            tournamentRegistrationId:
              teamBRegistration.id,

            side: "TEAM_B",
          },
        ],
      },
    },

    include: {
      participants: true,
    },
  });

  revalidatePath("/admin/matches");
  revalidatePath("/admin/schedule/matches");
  revalidatePath("/");

  return {
    success: true,
    match,
  };
}

export async function deleteMatch(
  matchId: string,
) {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  if (!matchId) {
    throw new Error("Match ID is required.");
  }

  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },

    select: {
      id: true,
    },
  });

  if (!match) {
    throw new Error("Match not found.");
  }

  await prisma.match.delete({
    where: {
      id: matchId,
    },
  });

  revalidatePath("/admin/schedule/matches");
  revalidatePath("/admin/matches");
  revalidatePath("/");

  return {
    success: true,
  };
}