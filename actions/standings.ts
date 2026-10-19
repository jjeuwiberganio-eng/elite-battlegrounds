"use server";

import { revalidatePath } from "next/cache";
import { getPlayoffLayout, slotSeed } from "@/lib/playoff-slots";
import { TIEBREAKER_ROUND_NAME } from "@/lib/tiebreaker-constants";
import { getTiebreakerRecords } from "@/lib/tiebreakers";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

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

  /* Completed tiebreaker matches - they do not count toward the stats above. */
  tiebreaker: {
    wins: number;
    losses: number;
  };
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

        /*
         * Exclude standings whose team was deleted (soft-deleted via
         * deleteTeam - deletedAt set, not a hard delete). Without this,
         * a removed team's row keeps showing up here even though
         * admins can no longer see or manage that team anywhere else.
         */
        tournamentRegistration: {
          team: {
            deletedAt: null,
          },
        },
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

  const tiebreakers = await getTiebreakerRecords(
    tournament.id,
  );

  /*
   * Order: points, then game wins (as before), then - only for teams
   * still level - whoever won their tiebreaker match ranks higher.
   * Array.sort is stable, so anything still tied keeps its order.
   */
  const orderedStandings = [...standings].sort(
    (a, b) =>
      b.points - a.points ||
      b.gameWins - a.gameWins ||
      (tiebreakers.get(
        b.tournamentRegistrationId,
      )?.wins ?? 0) -
        (tiebreakers.get(
          a.tournamentRegistrationId,
        )?.wins ?? 0),
  );

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

  const rows: StandingRow[] = orderedStandings.map(
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
        tiebreaker: tiebreakers.get(
          standing.tournamentRegistrationId,
        ) ?? { wins: 0, losses: 0 },
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

export interface PlayoffQualifierSlot {
  rank: number;
  team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
}

export interface PlayoffQualifierGroup {
  id: string;
  name: string;
  slots: PlayoffQualifierSlot[];
}

/*
 * Qualifiers laid out per group (Group A: Top 1/2/3, Group B: ...).
 * Empty slots come back with team: null so the page can show "TBD".
 * See lib/playoff-slots.ts for how a slot maps to the stored seed.
 */
export async function getPlayoffQualifiers(): Promise<
  PlayoffQualifierGroup[]
> {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return [];
  }

  const groupStage =
    await getGroupStage(tournament.id);

  if (!groupStage) {
    return [];
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

  if (groups.length === 0) {
    return [];
  }

  const control =
    await getTournamentControl();

  const { perGroup } = getPlayoffLayout(
    control.playoffSize,
    groups.length,
  );

  const qualifications =
    await prisma.playoffQualification.findMany(
      {
        where: {
          tournamentId: tournament.id,

          // Same reasoning as getStandings() above - a soft-deleted
          // team's qualification slot shouldn't still show publicly.
          tournamentRegistration: {
            team: {
              deletedAt: null,
            },
          },
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
    );

  return groups.map((group, groupIndex) => ({
    id: group.id,
    name: group.name,
    slots: Array.from(
      { length: perGroup },
      (_, index) => {
        const rank = index + 1;

        const qualification =
          qualifications.find(
            (item) =>
              item.seed ===
                slotSeed(
                  groupIndex,
                  rank,
                  perGroup,
                ) &&
              // A team moved to another group since being placed
              // no longer holds a place in this one.
              item.tournamentRegistration
                .tournamentGroupId === group.id,
          );

        const team =
          qualification?.tournamentRegistration
            .team;

        return {
          rank,
          team: team
            ? {
                id: team.id,
                name: team.name,
                logo: team.logo?.url ?? null,
              }
            : null,
        };
      },
    ),
  }));
}

/*
|--------------------------------------------------------------------------
| Playoff Standings
|--------------------------------------------------------------------------
| Calculated live from the bracket: whenever the Super Admin records (or
| resets) a playoff result in the bracket, these numbers follow - there
| is no separate table to keep in sync. Every team currently placed in a
| bracket slot is listed, with 0 played until its first result.
*/

export interface PlayoffStandingRow {
  rank: number;
  registrationId: string;
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
  gameDiff: number;
  eliminated: boolean;
}

export interface PlayoffStandingsData {
  rows: PlayoffStandingRow[];

  /* Losses that knock a team out (2 for double elimination, 1 for single). */
  eliminationLosses: number;

  hasResults: boolean;
}

export async function getPlayoffStandings(): Promise<PlayoffStandingsData> {
  const empty: PlayoffStandingsData = {
    rows: [],
    eliminationLosses: 2,
    hasResults: false,
  };

  const tournament = await getCurrentTournament();

  if (!tournament) {
    return empty;
  }

  const [playoffStage, bracket] = await Promise.all([
    prisma.tournamentStage.findFirst({
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
      select: {
        type: true,
      },
    }),

    prisma.playoffBracket.findUnique({
      where: {
        tournamentId: tournament.id,
      },
      include: {
        slots: {
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
    }),
  ]);

  const eliminationLosses =
    playoffStage?.type === "SINGLE_ELIMINATION" ? 1 : 2;

  if (!bracket) {
    return { ...empty, eliminationLosses };
  }

  type Tally = {
    registrationId: string;
    team: { id: string; name: string; logo: string | null };
    played: number;
    wins: number;
    losses: number;
    gameWins: number;
    gameLosses: number;
  };

  const tallies = new Map<string, Tally>();

  function tallyFor(
    registration:
      | {
          id: string;
          team: {
            id: string;
            name: string;
            deletedAt: Date | null;
            logo: { url: string } | null;
          };
        }
      | null,
  ) {
    if (!registration || registration.team.deletedAt) {
      return null;
    }

    let tally = tallies.get(registration.id);

    if (!tally) {
      tally = {
        registrationId: registration.id,
        team: {
          id: registration.team.id,
          name: registration.team.name,
          logo: registration.team.logo?.url ?? null,
        },
        played: 0,
        wins: 0,
        losses: 0,
        gameWins: 0,
        gameLosses: 0,
      };

      tallies.set(registration.id, tally);
    }

    return tally;
  }

  let hasResults = false;

  for (const slot of bracket.slots) {
    const teamA = tallyFor(slot.teamARegistration);
    const teamB = tallyFor(slot.teamBRegistration);

    if (!slot.isCompleted || !teamA || !teamB) {
      continue;
    }

    /*
     * The recorded winner decides the result. If a winner wasn't
     * stored, fall back to the higher score; a level score with no
     * winner can't be counted.
     */
    const winnerId =
      slot.winnerRegistrationId ??
      (slot.scoreA > slot.scoreB
        ? teamA.registrationId
        : slot.scoreB > slot.scoreA
          ? teamB.registrationId
          : null);

    if (!winnerId) {
      continue;
    }

    hasResults = true;

    teamA.played += 1;
    teamB.played += 1;

    teamA.gameWins += slot.scoreA;
    teamA.gameLosses += slot.scoreB;
    teamB.gameWins += slot.scoreB;
    teamB.gameLosses += slot.scoreA;

    if (winnerId === teamA.registrationId) {
      teamA.wins += 1;
      teamB.losses += 1;
    } else {
      teamB.wins += 1;
      teamA.losses += 1;
    }
  }

  const sorted = [...tallies.values()].sort(
    (a, b) =>
      b.wins - a.wins ||
      a.losses - b.losses ||
      b.gameWins -
        b.gameLosses -
        (a.gameWins - a.gameLosses) ||
      a.team.name.localeCompare(b.team.name),
  );

  return {
    eliminationLosses,
    hasResults,
    rows: sorted.map((tally, index) => ({
      rank: index + 1,
      registrationId: tally.registrationId,
      team: tally.team,
      played: tally.played,
      wins: tally.wins,
      losses: tally.losses,
      winRate:
        tally.played > 0
          ? Math.round((tally.wins / tally.played) * 1000) / 10
          : 0,
      gameWins: tally.gameWins,
      gameLosses: tally.gameLosses,
      gameDiff: tally.gameWins - tally.gameLosses,
      eliminated: tally.losses >= eliminationLosses,
    })),
  };
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
}

export async function getTournamentStatistics(): Promise<TournamentStatistics> {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return {
      totalTeams: 0,
      matchesPlayed: 0,
      totalGames: 0,
    };
  }

  const [
    totalTeams,
    matchesPlayed,
    gamesPlayed,
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
        roundName: {
          not: TIEBREAKER_ROUND_NAME,
        },
      },
    }),

    /*
     * "Total Games" used to read from MatchGame, a table meant to hold
     * one row per individual game within a Best-of-N match - but
     * nothing in the admin UI ever creates those rows, so this was
     * always stuck at zero. Instead, sum MatchParticipant.score across
     * completed matches: that's the data Record Result actually
     * writes, so a 2-1 result correctly contributes 3 games.
     */
    prisma.matchParticipant.aggregate({
      where: {
        match: {
          tournamentStage: {
            tournamentId: tournament.id,
          },
          status: "COMPLETED",
          roundName: {
            not: TIEBREAKER_ROUND_NAME,
          },
        },
      },
      _sum: {
        score: true,
      },
    }),
  ]);

  return {
    totalTeams,
    matchesPlayed,
    totalGames: gamesPlayed._sum.score ?? 0,
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
  /*
   * Server actions are public endpoints - without this, anyone could
   * trigger a recalculation.
   */
  await requireRole(USER_ROLES.SUPER_ADMIN);

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
              /*
               * The match's OWN participants are needed to find each
               * opponent's score. registration.participants only holds
               * this team's side, so the opponent could never be found
               * and "game losses" always came out as 0.
               */
              match: {
                include: {
                  participants: true,
                },
              },
            },
          },
        },
      },
    );

  await prisma.$transaction(
    registrations.map((registration) => {
      /*
       * Only completed GROUP STAGE matches count, and tiebreaker
       * matches are skipped on purpose - they decide who ranks higher
       * when teams are level, but never add wins, losses, maps or
       * points.
       */
      const completedParticipations =
        registration.participants.filter(
          (participant) =>
            participant.match.status ===
              "COMPLETED" &&
            participant.match
              .tournamentStageId ===
              groupStage.id &&
            participant.match.roundName !==
              TIEBREAKER_ROUND_NAME,
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
              participant.match.participants.find(
                (other) =>
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
          /*
           * Refresh the group too, not just the stats - a team's
           * Standing row is created once and then only ever updated
           * from here on. Without this, moving a team to a different
           * group (via Edit Team) updates its registration correctly
           * but leaves this already-existing row pinned to whatever
           * group it was in the first time standings were calculated,
           * so the team keeps showing under its old group forever.
           */
          tournamentGroupId:
            registration.tournamentGroupId,
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

  revalidatePath("/standings");
  revalidatePath("/admin/standings");

  return {
    success: true,
    message: "Standings recalculated successfully.",
  };
}