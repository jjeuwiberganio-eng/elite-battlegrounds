"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

export interface AttentionMatch {
  id: string;
  matchNumber: number;
  status: string;
  scheduledAt: string | null;
  teamA: string;
  teamB: string;
}

export interface AdminAttention {
  liveMatches: AttentionMatch[];
  needsResult: AttentionMatch[];
  needsResultCount: number;
  upNext: AttentionMatch[];
  teamsWithoutGroup: number;
  matchesWithoutDay: number;
}

const matchSelect = {
  id: true,
  matchNumber: true,
  status: true,
  scheduledAt: true,
  participants: {
    orderBy: {
      side: "asc",
    },

    select: {
      side: true,
      tournamentRegistration: {
        select: {
          team: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
} as const;

type MatchRow = {
  id: string;
  matchNumber: number;
  status: string;
  scheduledAt: Date | null;
  participants: {
    side: string;
    tournamentRegistration: { team: { name: string } };
  }[];
};

function toAttentionMatch(match: MatchRow): AttentionMatch {
  const nameFor = (side: string) =>
    match.participants.find(
      (participant) => participant.side === side,
    )?.tournamentRegistration.team.name ?? "TBD";

  return {
    id: match.id,
    matchNumber: match.matchNumber,
    status: match.status,
    scheduledAt: match.scheduledAt
      ? match.scheduledAt.toISOString()
      : null,
    teamA: nameFor("TEAM_A"),
    teamB: nameFor("TEAM_B"),
  };
}

/*
 * What needs the admin's attention right now, for the dashboard:
 * live matches, matches whose time has passed without a result, the
 * next matches coming up, teams not yet in a group, and group-stage
 * matches that have no schedule day (those never show on the public
 * schedule).
 */
export async function getAdminAttention(): Promise<AdminAttention> {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const now = new Date();

  const tournament = await prisma.tournament.findFirst({
    where: {
      deletedAt: null,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
    },
  });

  const unfinishedStatuses = [
    "DRAFT",
    "READY",
    "LIVE",
    "PAUSED",
  ] as const;

  const [
    liveMatches,
    needsResult,
    needsResultCount,
    upNext,
    teamsWithoutGroup,
    matchesWithoutDay,
  ] = await Promise.all([
    prisma.match.findMany({
      where: {
        status: "LIVE",
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 6,
      select: matchSelect,
    }),

    prisma.match.findMany({
      where: {
        status: {
          in: [...unfinishedStatuses],
        },
        scheduledAt: {
          lt: now,
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 6,
      select: matchSelect,
    }),

    prisma.match.count({
      where: {
        status: {
          in: [...unfinishedStatuses],
        },
        scheduledAt: {
          lt: now,
        },
      },
    }),

    prisma.match.findMany({
      where: {
        status: {
          in: ["DRAFT", "READY"],
        },
        scheduledAt: {
          gte: now,
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 4,
      select: matchSelect,
    }),

    tournament
      ? prisma.tournamentRegistration.count({
          where: {
            tournamentId: tournament.id,
            status: "APPROVED",
            tournamentGroupId: null,
            team: {
              deletedAt: null,
            },
          },
        })
      : Promise.resolve(0),

    prisma.match.count({
      where: {
        scheduleDayId: null,
        tournamentStage: {
          slug: "group-stage",
        },
      },
    }),
  ]);

  return {
    liveMatches: liveMatches.map(toAttentionMatch),
    needsResult: needsResult.map(toAttentionMatch),
    needsResultCount,
    upNext: upNext.map(toAttentionMatch),
    teamsWithoutGroup,
    matchesWithoutDay,
  };
}
