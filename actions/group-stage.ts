import { prisma } from "@/lib/prisma";

export async function getGroupStageMatches() {
  const activeSeason = await prisma.season.findFirst({
    where: {
      isActive: true,
      deletedAt: null,
    },
    include: {
      tournaments: {
        where: {
          isPublished: true,
          deletedAt: null,
        },
        include: {
          stages: {
            where: {
              slug: "group-stage",
            },
            include: {
              matches: {
                where: {
                  status: {
                    not: "DRAFT",
                  },
                },
                orderBy: {
                  matchNumber: "asc",
                },
                include: {
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
              },
            },
          },
        },
      },
    },
  });

  const tournament = activeSeason?.tournaments[0];

  if (!tournament) {
    return [];
  }

  const stage = tournament.stages[0];

  if (!stage) {
    return [];
  }

  return stage.matches
    .filter((match) => match.participants.length >= 2)
    .map((match) => {
      const teamA = match.participants.find(
        (participant) => participant.side === "TEAM_A",
      );

      const teamB = match.participants.find(
        (participant) => participant.side === "TEAM_B",
      );

      return {
        id: match.id,

        matchNumber: match.matchNumber,

        teamA: teamA
          ? {
              id: teamA.tournamentRegistration.team.id,
              name: teamA.tournamentRegistration.team.name,
              logo:
                teamA.tournamentRegistration.team.logo?.url ??
                null,
            }
          : null,

        teamB: teamB
          ? {
              id: teamB.tournamentRegistration.team.id,
              name: teamB.tournamentRegistration.team.name,
              logo:
                teamB.tournamentRegistration.team.logo?.url ??
                null,
            }
          : null,

        scheduledAt: match.scheduledAt?.toISOString() ?? null,

        bestOf: match.bestOf,

        streamUrl: match.streamUrl,

        status: match.status,
      };
    })
    .filter(
      (match) =>
        match.teamA !== null &&
        match.teamB !== null,
    );
}