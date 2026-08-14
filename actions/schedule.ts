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
| Group Stage Schedule
|--------------------------------------------------------------------------
*/

export async function getGroupStageSchedule() {
  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    return {
      days: [],
    };
  }

  const groupStage =
    await prisma.tournamentStage.findFirst({
      where: {
        tournamentId: tournament.id,
        type: {
          in: [
            "GROUP_STAGE",
            "ROUND_ROBIN",
          ],
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

  if (!groupStage) {
    return {
      days: [],
    };
  }

  const scheduleDays =
    await prisma.tournamentScheduleDay.findMany({
      where: {
        tournamentId: tournament.id,
        stageId: groupStage.id,
      },

      orderBy: {
        dayNumber: "asc",
      },

      include: {
        matches: {
          orderBy: [
            {
              scheduledAt: "asc",
            },
            {
              matchNumber: "asc",
            },
          ],

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
        },
      },
    });

  return {
    days: scheduleDays.map(
      (day) => ({
        id: day.id,

        title:
          day.name ||
          `Day ${day.dayNumber}`,

        date:
          day.scheduledDate
            ? day.scheduledDate.toISOString()
            : "",

        matches:
          day.matches.map(
            (match) => {
              const teamA =
                match.participants.find(
                  (participant) =>
                    participant.side ===
                    "TEAM_A",
                );

              const teamB =
                match.participants.find(
                  (participant) =>
                    participant.side ===
                    "TEAM_B",
                );

              return {
                id: match.id,

                matchNumber:
                  match.matchNumber,

                startTime:
                  match.scheduledAt
                    ?.toISOString() ??
                  "",

                bestOf:
                  match.bestOf,

                streamUrl:
                  match.streamUrl ??
                  undefined,

                teamA: {
                  id:
                    teamA
                      ?.tournamentRegistration
                      .team.id ?? "",

                  name:
                    teamA
                      ?.tournamentRegistration
                      .team.name ??
                    "TBD",

                  logo:
                    teamA
                      ?.tournamentRegistration
                      .team.logo
                      ?.url ??
                    null,
                },

                teamB: {
                  id:
                    teamB
                      ?.tournamentRegistration
                      .team.id ?? "",

                  name:
                    teamB
                      ?.tournamentRegistration
                      .team.name ??
                    "TBD",

                  logo:
                    teamB
                      ?.tournamentRegistration
                      .team.logo
                      ?.url ??
                    null,
                },
              };
            },
          ),
      }),
    ),
  };
}

/*
|--------------------------------------------------------------------------
| Playoff Bracket
|--------------------------------------------------------------------------
*/

export async function getPlayoffBracket() {
  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    return {
      upperBracket: [],
      lowerBracket: [],
      grandFinals: [],
    };
  }

  const bracket =
    await prisma.playoffBracket.findUnique({
      where: {
        tournamentId:
          tournament.id,
      },

      include: {
        slots: {
          orderBy: [
            {
              roundOrder: "asc",
            },
            {
              slotOrder: "asc",
            },
          ],

          include: {
            match: {
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
            },

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
      upperBracket: [],
      lowerBracket: [],
      grandFinals: [],
    };
  }

  function getTeam(
    registration:
      | {
          team: {
            id: string;
            name: string;
            logo: {
              url: string;
            } | null;
          };
        }
      | null
      | undefined,
  ) {
    if (!registration) {
      return null;
    }

    return {
      id: registration.team.id,
      name: registration.team.name,
      logo:
        registration.team.logo?.url ??
        null,
    };
  }

  function getMatchTeam(
    match:
      | {
          participants: Array<{
            side: string;
            tournamentRegistration: {
              team: {
                id: string;
                name: string;
                logo: {
                  url: string;
                } | null;
              };
            };
          }>;
        }
      | null
      | undefined,

    side: "TEAM_A" | "TEAM_B",
  ) {
    const participant =
      match?.participants.find(
        (item) =>
          item.side === side,
      );

    if (!participant) {
      return null;
    }

    return {
      id:
        participant
          .tournamentRegistration
          .team.id,

      name:
        participant
          .tournamentRegistration
          .team.name,

      logo:
        participant
          .tournamentRegistration
          .team.logo?.url ??
        null,
    };
  }

  const mapped =
    bracket.slots.map(
      (slot) => ({
        id: slot.id,

        round:
          slot.label ||
          `Round ${slot.roundOrder}`,

        roundOrder: slot.roundOrder,
        slotOrder: slot.slotOrder,
        scoreA: slot.scoreA,
        scoreB: slot.scoreB,
        isCompleted: slot.isCompleted,

        teamA:
          getTeam(
            slot.teamARegistration,
          ) ??
          getMatchTeam(
            slot.match,
            "TEAM_A",
          ),

        teamB:
          getTeam(
            slot.teamBRegistration,
          ) ??
          getMatchTeam(
            slot.match,
            "TEAM_B",
          ),

        winner:
          slot.winnerRegistrationId,

        bracketSide:
          slot.bracketSide,
      }),
    );

  return {
    upperBracket:
      mapped.filter(
        (slot) =>
          slot.bracketSide
            .toLowerCase() ===
          "upper",
      ),

    lowerBracket:
      mapped.filter(
        (slot) =>
          slot.bracketSide
            .toLowerCase() ===
          "lower",
      ),

    grandFinals:
      mapped.filter(
        (slot) => {
          const side =
            slot.bracketSide.toLowerCase();

          return (
            side === "grand-finals" ||
            side === "grand_final" ||
            side === "grandfinals"
          );
        },
      ),
  };
}

/*
|--------------------------------------------------------------------------
| Upcoming Playoff Matches
|--------------------------------------------------------------------------
*/

export async function getUpcomingPlayoffMatches() {
  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    return [];
  }

  const playoffStages =
    await prisma.tournamentStage.findMany({
      where: {
        tournamentId:
          tournament.id,

        type: {
          in: [
            "DOUBLE_ELIMINATION",
            "SINGLE_ELIMINATION",
            "GRAND_FINAL",
          ],
        },
      },

      select: {
        id: true,
      },
    });

  const stageIds =
    playoffStages.map(
      (stage) => stage.id,
    );

  if (stageIds.length === 0) {
    return [];
  }

  const matches =
    await prisma.match.findMany({
      where: {
        tournamentStageId: {
          in: stageIds,
        },

        /*
         * Playoff matches do NOT
         * belong to a Schedule Day.
         */
        scheduleDayId: null,

        scheduledAt: {
          not: null,
        },

        status: {
          notIn: [
            "COMPLETED",
            "CANCELLED",
          ],
        },
      },

      orderBy: [
        {
          scheduledAt: "asc",
        },
        {
          matchNumber: "asc",
        },
      ],

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

  return matches.map(
    (match) => {
      const teamA =
        match.participants.find(
          (participant) =>
            participant.side ===
            "TEAM_A",
        );

      const teamB =
        match.participants.find(
          (participant) =>
            participant.side ===
            "TEAM_B",
        );

      return {
        id: match.id,

        matchNumber:
          match.matchNumber,

        roundName:
          match.roundName,

        startTime:
          match.scheduledAt
            ?.toISOString() ?? "",

        bestOf:
          match.bestOf,

        status:
          match.status,

        streamUrl:
          match.streamUrl ??
          undefined,

        teamA: teamA
          ? {
              id:
                teamA
                  .tournamentRegistration
                  .team.id,

              name:
                teamA
                  .tournamentRegistration
                  .team.name,

              logo:
                teamA
                  .tournamentRegistration
                  .team.logo
                  ?.url ?? null,
            }
          : null,

        teamB: teamB
          ? {
              id:
                teamB
                  .tournamentRegistration
                  .team.id,

              name:
                teamB
                  .tournamentRegistration
                  .team.name,

              logo:
                teamB
                  .tournamentRegistration
                  .team.logo
                  ?.url ?? null,
            }
          : null,
      };
    },
  );
}