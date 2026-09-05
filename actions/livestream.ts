"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

const SUPER_ADMIN = USER_ROLES.SUPER_ADMIN;

/*
|--------------------------------------------------------------------------
| Public: Live Status
|--------------------------------------------------------------------------
*/

export interface LiveStatus {
  enabled: boolean;
  url: string;
  matchLabel: string | null;
}

export async function getLiveStatus(): Promise<LiveStatus> {
  const liveMatch = await prisma.match.findFirst({
    where: {
      status: "LIVE",
      streamUrl: {
        not: null,
      },
    },
    include: {
      participants: {
        include: {
          tournamentRegistration: {
            include: {
              team: true,
            },
          },
        },
      },
    },
  });

  if (!liveMatch || !liveMatch.streamUrl) {
    return {
      enabled: false,
      url: "",
      matchLabel: null,
    };
  }

  const teamA =
    liveMatch.participants.find(
      (participant) =>
        participant.side === "TEAM_A",
    )?.tournamentRegistration.team.name;

  const teamB =
    liveMatch.participants.find(
      (participant) =>
        participant.side === "TEAM_B",
    )?.tournamentRegistration.team.name;

  return {
    enabled: true,
    url: liveMatch.streamUrl,
    matchLabel:
      teamA && teamB
        ? `${teamA} vs ${teamB}`
        : null,
  };
}

/*
|--------------------------------------------------------------------------
| Admin: Livestream Control
|--------------------------------------------------------------------------
*/

export interface LivestreamCandidate {
  id: string;
  label: string;
  status: string;
  streamUrl: string | null;
}

export async function getLivestreamCandidates(): Promise<
  LivestreamCandidate[]
> {
  await requireRole(SUPER_ADMIN);

  const matches = await prisma.match.findMany({
    where: {
      status: {
        in: ["READY", "LIVE", "PAUSED"],
      },
    },
    orderBy: {
      scheduledAt: "asc",
    },
    include: {
      participants: {
        include: {
          tournamentRegistration: {
            include: {
              team: true,
            },
          },
        },
      },
    },
  });

  return matches.map((match) => {
    const teamA =
      match.participants.find(
        (participant) =>
          participant.side === "TEAM_A",
      )?.tournamentRegistration.team
        .name ?? "TBD";

    const teamB =
      match.participants.find(
        (participant) =>
          participant.side === "TEAM_B",
      )?.tournamentRegistration.team
        .name ?? "TBD";

    return {
      id: match.id,
      label: `${teamA} vs ${teamB}`,
      status: match.status,
      streamUrl: match.streamUrl,
    };
  });
}

export async function setMatchLive(data: {
  matchId: string;
  streamUrl: string;
}) {
  await requireRole(SUPER_ADMIN);

  const url = data.streamUrl.trim();

  if (!url) {
    throw new Error(
      "A stream URL is required to go live.",
    );
  }

  await prisma.$transaction([
    // Only one match live at a time - drop any other live match back to READY.
    prisma.match.updateMany({
      where: {
        status: "LIVE",
        id: {
          not: data.matchId,
        },
      },
      data: {
        status: "READY",
      },
    }),

    prisma.match.update({
      where: {
        id: data.matchId,
      },
      data: {
        status: "LIVE",
        streamUrl: url,
      },
    }),
  ]);

  revalidatePath("/admin/livestream");
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Match is now live.",
  };
}

export async function endLivestream(
  matchId: string,
) {
  await requireRole(SUPER_ADMIN);

  await prisma.match.update({
    where: {
      id: matchId,
    },
    data: {
      status: "READY",
    },
  });

  revalidatePath("/admin/livestream");
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Livestream ended.",
  };
}
