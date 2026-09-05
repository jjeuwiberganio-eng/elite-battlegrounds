"use server";

import { prisma } from "@/lib/prisma";

/*
|--------------------------------------------------------------------------
| Current Tournament
|--------------------------------------------------------------------------
*/

async function getCurrentTournament() {
  return prisma.tournament.findFirst({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      season: true,
    },
  });
}

async function getGroupStage(tournamentId: string) {
  return prisma.tournamentStage.findFirst({
    where: {
      tournamentId,
      type: {
        in: ["GROUP_STAGE", "ROUND_ROBIN"],
      },
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Tournament Control
|--------------------------------------------------------------------------
*/

export async function getTournamentControl() {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return {
      name: "Elite Battlegrounds Series",
      season: "Season 1",
      playoffSize: 8,
    };
  }

  const playoffStage =
    await prisma.tournamentStage.findFirst({
      where: {
        tournamentId: tournament.id,
        type: {
          in: [
            "DOUBLE_ELIMINATION",
            "SINGLE_ELIMINATION",
            "GRAND_FINAL",
          ],
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

  return {
    name: tournament.name,
    season: tournament.season.name,
    playoffSize:
      playoffStage?.maxTeams ?? 8,
  };
}

/*
|--------------------------------------------------------------------------
| Standings
|--------------------------------------------------------------------------
*/

export interface StandingsGroup {
  id: string;
  name: string;
  slug: string;
}

export interface StandingRow {
  id: string;
  groupSlug: string;
  rank: number;
  team: {
    id: string;
    name: string;
    logo: string | null;
  };
  played: number;
  wins: number;
  losses: number;
  winRate: number;
  gameWins: number;
  gameLosses: number;
  points: number;
  gameDiff: number;
}

export interface StandingsData {
  groups: StandingsGroup[];
  defaultGroup: string;
  rows: StandingRow[];
}

export async function getStandings(): Promise<StandingsData> {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return {
      groups: [],
      defaultGroup: "",
      rows: [],
    };
  }

  const groupStage =
    await getGroupStage(tournament.id);

  if (!groupStage) {
    return {
      groups: [],
      defaultGroup: "",
      rows: [],
    };
  }

  const groups =
    await prisma.tournamentGroup.findMany({
      where: {
        tournamentStageId: groupStage.id,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

  const standings =
    await prisma.standing.findMany({
      where: {
        tournamentStageId: groupStage.id,
      },
      orderBy: [
        { points: "desc" },
        { gameWins: "desc" },
      ],
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

  const groupSlugById = new Map(
    groups.map((group) => [
      group.id,
      group.slug,
    ]),
  );

  const rankCounters = new Map<
    string,
    number
  >();

  const rows: StandingRow[] = standings.map(
    (standing) => {
      const groupSlug =
        standing.tournamentGroupId
          ? (groupSlugById.get(
              standing.tournamentGroupId,
            ) ?? "")
          : "";

      const nextRank =
        (rankCounters.get(groupSlug) ?? 0) +
        1;

      rankCounters.set(groupSlug, nextRank);

      return {
        id: standing.id,
        groupSlug,
        rank: standing.rank ?? nextRank,
        team: {
          id: standing
            .tournamentRegistration.team.id,
          name: standing
            .tournamentRegistration.team
            .name,
          logo:
            standing.tournamentRegistration
              .team.logo?.url ?? null,
        },
        played: standing.played,
        wins: standing.wins,
        losses: standing.losses,
        winRate:
          standing.played > 0
            ? Math.round(
                (standing.wins /
                  standing.played) *
                  1000,
              ) / 10
            : 0,
        gameWins: standing.gameWins,
        gameLosses: standing.gameLosses,
        points: standing.points,
        gameDiff:
          standing.gameWins -
          standing.gameLosses,
      };
    },
  );

  return {
    groups: groups.map((group) => ({
      id: group.id,
      name: group.name,
      slug: group.slug,
    })),
    defaultGroup: groups[0]?.slug ?? "",
    rows,
  };
}

/*
|--------------------------------------------------------------------------
| Playoff Qualifiers
|--------------------------------------------------------------------------
*/

export interface PlayoffQualifier {
  seed: number;
  team: {
    id: string;
    name: string;
    logo: string | null;
  };
  groupName: string;
}

export async function getPlayoffQualifiers(): Promise<
  PlayoffQualifier[]
> {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return [];
  }

  const qualifications =
    await prisma.playoffQualification.findMany(
      {
        where: {
          tournamentId: tournament.id,
        },
        orderBy: {
          seed: "asc",
        },
        include: {
          tournamentRegistration: {
            include: {
              team: {
                include: {
                  logo: true,
                },
              },
              tournamentGroup: true,
            },
          },
        },
      },
    );

  return qualifications.map(
    (qualification) => ({
      seed: qualification.seed,
      team: {
        id: qualification
          .tournamentRegistration.team
          .id,
        name: qualification
          .tournamentRegistration.team
          .name,
        logo:
          qualification.tournamentRegistration
            .team.logo?.url ?? null,
      },
      groupName:
        qualification.tournamentRegistration
          .tournamentGroup?.name ?? "",
    }),
  );
}

/*
|--------------------------------------------------------------------------
| Tournament Statistics
|--------------------------------------------------------------------------
*/

export interface TournamentStatistics {
  totalTeams: number;
  matchesPlayed: number;
  totalGames: number;
  avgGameDuration: string;
}

export async function getTournamentStatistics(): Promise<TournamentStatistics> {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return {
      totalTeams: 0,
      matchesPlayed: 0,
      totalGames: 0,
      avgGameDuration: "0m 0s",
    };
  }

  const [
    totalTeams,
    matchesPlayed,
    games,
  ] = await Promise.all([
    prisma.tournamentRegistration.count({
      where: {
        tournamentId: tournament.id,
        status: "APPROVED",
      },
    }),

    prisma.match.count({
      where: {
        tournamentStage: {
          tournamentId: tournament.id,
        },
        status: "COMPLETED",
      },
    }),

    prisma.matchGame.findMany({
      where: {
        match: {
          tournamentStage: {
            tournamentId: tournament.id,
          },
          status: "COMPLETED",
        },
        durationSeconds: {
          not: null,
        },
      },
      select: {
        durationSeconds: true,
      },
    }),
  ]);

  const totalGames = games.length;

  const avgSeconds =
    totalGames > 0
      ? Math.round(
          games.reduce(
            (sum, game) =>
              sum +
              (game.durationSeconds ?? 0),
            0,
          ) / totalGames,
        )
      : 0;

  const minutes = Math.floor(
    avgSeconds / 60,
  );

  const seconds = avgSeconds % 60;

  return {
    totalTeams,
    matchesPlayed,
    totalGames,
    avgGameDuration: `${minutes}m ${seconds}s`,
  };
}

/*
|--------------------------------------------------------------------------
| Recent Match Results
|--------------------------------------------------------------------------
*/

export interface RecentMatchResult {
  id: string;
  teamA: {
    id: string;
    name: string;
    logo: string | null;
    score: number;
  };
  teamB: {
    id: string;
    name: string;
    logo: string | null;
    score: number;
  };
  completedAt: string;
}

export async function getRecentMatchResults(): Promise<
  RecentMatchResult[]
> {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return [];
  }

  const matches =
    await prisma.match.findMany({
      where: {
        tournamentStage: {
          tournamentId: tournament.id,
        },
        status: "COMPLETED",
      },
      orderBy: {
        completedAt: "desc",
      },
      take: 5,
      include: {
        participants: {
          orderBy: {
            side: "asc",
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
        },
      },
    });

  return matches.map((match) => {
    const teamAParticipant =
      match.participants.find(
        (participant) =>
          participant.side === "TEAM_A",
      );

    const teamBParticipant =
      match.participants.find(
        (participant) =>
          participant.side === "TEAM_B",
      );

    return {
      id: match.id,
      teamA: {
        id:
          teamAParticipant
            ?.tournamentRegistration.team
            .id ?? "",
        name:
          teamAParticipant
            ?.tournamentRegistration.team
            .name ?? "TBD",
        logo:
          teamAParticipant
            ?.tournamentRegistration.team
            .logo?.url ?? null,
        score:
          teamAParticipant?.score ?? 0,
      },
      teamB: {
        id:
          teamBParticipant
            ?.tournamentRegistration.team
            .id ?? "",
        name:
          teamBParticipant
            ?.tournamentRegistration.team
            .name ?? "TBD",
        logo:
          teamBParticipant
            ?.tournamentRegistration.team
            .logo?.url ?? null,
        score:
          teamBParticipant?.score ?? 0,
      },
      completedAt:
        match.completedAt?.toISOString() ??
        "",
    };
  });
}

/*
|--------------------------------------------------------------------------
| Admin: Standings Statistics
|--------------------------------------------------------------------------
*/

export interface StandingsStatistics {
  totalGroups: number;
  teamsTracked: number;
  teamsPending: number;
  lastUpdated: string | null;
}

export async function getStandingsStatistics(): Promise<StandingsStatistics> {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return {
      totalGroups: 0,
      teamsTracked: 0,
      teamsPending: 0,
      lastUpdated: null,
    };
  }

  const groupStage =
    await getGroupStage(tournament.id);

  if (!groupStage) {
    return {
      totalGroups: 0,
      teamsTracked: 0,
      teamsPending: 0,
      lastUpdated: null,
    };
  }

  const [
    totalGroups,
    standingsEntries,
    approvedRegistrations,
  ] = await Promise.all([
    prisma.tournamentGroup.count({
      where: {
        tournamentStageId: groupStage.id,
      },
    }),

    prisma.standing.findMany({
      where: {
        tournamentStageId: groupStage.id,
      },
      select: {
        updatedAt: true,
      },
    }),

    prisma.tournamentRegistration.count({
      where: {
        tournamentId: tournament.id,
        status: "APPROVED",
        tournamentGroupId: {
          not: null,
        },
      },
    }),
  ]);

  const lastUpdated =
    standingsEntries.length > 0
      ? standingsEntries
          .map(
            (entry) =>
              entry.updatedAt.getTime(),
          )
          .reduce((latest, current) =>
            current > latest
              ? current
              : latest,
          )
      : null;

  return {
    totalGroups,
    teamsTracked: standingsEntries.length,
    teamsPending: Math.max(
      approvedRegistrations -
        standingsEntries.length,
      0,
    ),
    lastUpdated: lastUpdated
      ? new Date(
          lastUpdated,
        ).toISOString()
      : null,
  };
}

/*
|--------------------------------------------------------------------------
| Admin: Recalculate Standings
|--------------------------------------------------------------------------
*/

export async function recalculateStandings(): Promise<{
  success: boolean;
  message: string;
}> {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return {
      success: false,
      message: "No active tournament found.",
    };
  }

  const groupStage =
    await getGroupStage(tournament.id);

  if (!groupStage) {
    return {
      success: false,
      message: "No group stage found for this tournament.",
    };
  }

  const registrations =
    await prisma.tournamentRegistration.findMany(
      {
        where: {
          tournamentId: tournament.id,
          status: "APPROVED",
          tournamentGroupId: {
            not: null,
          },
        },
        include: {
          participants: {
            include: {
              match: true,
            },
          },
        },
      },
    );

  await prisma.$transaction(
    registrations.map((registration) => {
      const completedParticipations =
        registration.participants.filter(
          (participant) =>
            participant.match.status ===
            "COMPLETED",
        );

      const wins =
        completedParticipations.filter(
          (participant) =>
            participant.isWinner,
        ).length;

      const losses =
        completedParticipations.length -
        wins;

      const gameWins =
        completedParticipations.reduce(
          (sum, participant) =>
            sum + participant.score,
          0,
        );

      const gameLosses =
        completedParticipations.reduce(
          (sum, participant) => {
            const opponent =
              registration.participants.find(
                (other) =>
                  other.matchId ===
                    participant.matchId &&
                  other
                    .tournamentRegistrationId !==
                    participant.tournamentRegistrationId,
              );

            return (
              sum + (opponent?.score ?? 0)
            );
          },
          0,
        );

      return prisma.standing.upsert({
        where: {
          tournamentStageId_tournamentRegistrationId:
            {
              tournamentStageId:
                groupStage.id,
              tournamentRegistrationId:
                registration.id,
            },
        },
        create: {
          tournamentStageId: groupStage.id,
          tournamentGroupId:
            registration.tournamentGroupId,
          tournamentRegistrationId:
            registration.id,
          played:
            completedParticipations.length,
          wins,
          losses,
          gameWins,
          gameLosses,
          points: wins * 3,
        },
        update: {
          played:
            completedParticipations.length,
          wins,
          losses,
          gameWins,
          gameLosses,
          points: wins * 3,
        },
      });
    }),
  );

  return {
    success: true,
    message: "Standings recalculated successfully.",
  };
}
