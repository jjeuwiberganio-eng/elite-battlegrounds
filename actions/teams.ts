"use server";

import { revalidatePath } from "next/cache";
import { PlayerRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

const SUPER_ADMIN = USER_ROLES.SUPER_ADMIN;

const MAX_PLAYERS = 6;

const ALLOWED_GROUPS = [
  "Group A",
  "Group B",
  "Group C",
  "Group D",
] as const;

export type TeamPlayerInput = {
  id?: string;
  inGameName: string;
  role: PlayerRole;
  isCaptain?: boolean;
  isSubstitute?: boolean;
};

export type CreateTeamInput = {
  name: string;
  slug: string;
  abbreviation?: string;
  description?: string;
  logoMediaId?: string | null;
  posterMediaId: string;
  groupName: (typeof ALLOWED_GROUPS)[number];
  players: TeamPlayerInput[];
};

export type UpdateTeamInput = {
  name: string;
  slug: string;
  abbreviation?: string;
  description?: string;
  logoMediaId?: string | null;
  posterMediaId: string;
  groupName: (typeof ALLOWED_GROUPS)[number];
  players: TeamPlayerInput[];
  status: "ACTIVE" | "INACTIVE" | "DISQUALIFIED";
};

function cleanString(value?: string | null) {
  return value?.trim() ?? "";
}

function validatePlayers(
  players: TeamPlayerInput[],
) {
  if (players.length < 1) {
    throw new Error(
      "A team must have at least one player.",
    );
  }

  if (players.length > MAX_PLAYERS) {
    throw new Error(
      `A team can have a maximum of ${MAX_PLAYERS} players.`,
    );
  }

  const seenNames = new Set<string>();

  let captainCount = 0;
  let substituteCount = 0;

  for (const player of players) {
    const inGameName =
      cleanString(player.inGameName);

    if (!inGameName) {
      throw new Error(
        "Every player must have an IGN.",
      );
    }

    const normalizedName =
      inGameName.toLowerCase();

    if (seenNames.has(normalizedName)) {
      throw new Error(
        `Duplicate player IGN: ${inGameName}`,
      );
    }

    seenNames.add(normalizedName);

    if (!player.role) {
      throw new Error(
        `A role is required for ${inGameName}.`,
      );
    }

    if (player.isCaptain) {
      captainCount += 1;
    }

    if (player.isSubstitute) {
      substituteCount += 1;
    }
  }

  if (captainCount > 1) {
    throw new Error(
      "A team can only have one captain.",
    );
  }

  if (substituteCount > 1) {
    throw new Error(
      "A team can only have one substitute.",
    );
  }
}

function validateGroup(
  groupName: string,
) {
  if (
    !ALLOWED_GROUPS.includes(
      groupName as (typeof ALLOWED_GROUPS)[number],
    )
  ) {
    throw new Error(
      "Invalid tournament group.",
    );
  }
}

async function getCurrentTournament() {
  return prisma.tournament.findFirst({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getGroupForTournament(
  tournamentId: string,
  groupName: string,
) {
  validateGroup(groupName);

  /*
   * Groups belong to a TournamentStage.
   *
   * We look for the current tournament's
   * group-stage stage first.
   */
  const stage =
    await prisma.tournamentStage.findFirst({
      where: {
        tournamentId,
        OR: [
          {
            slug: "group-stage",
          },
          {
            slug: "groupstage",
          },
          {
            name: "Group Stage",
          },
          {
            name: "GroupStage",
          },
        ],
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

  if (!stage) {
    throw new Error(
      "No Group Stage has been created for the current tournament.",
    );
  }

  const slug = groupName
    .toLowerCase()
    .replace(" ", "-");

  const group =
    await prisma.tournamentGroup.findFirst({
      where: {
        tournamentStageId: stage.id,
        OR: [
          {
            name: groupName,
          },
          {
            slug,
          },
        ],
      },
    });

  if (!group) {
    throw new Error(
      `${groupName} does not exist in the current Group Stage.`,
    );
  }

  return group;
}

/**
 * Returns the current tournament and
 * its available groups.
 */
export async function getTournamentControl() {
  await requireRole(SUPER_ADMIN);

  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    return null;
  }

  const groupStage =
    await prisma.tournamentStage.findFirst({
      where: {
        tournamentId: tournament.id,
        OR: [
          {
            slug: "group-stage",
          },
          {
            slug: "groupstage",
          },
          {
            name: "Group Stage",
          },
          {
            name: "GroupStage",
          },
        ],
      },
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        groups: {
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
    });

  return {
    id: tournament.id,
    name: tournament.name,
    maxTeams: tournament.maxTeams,
    status: tournament.status,
    isPublished: tournament.isPublished,

    registrationOpensAt:
      tournament.registrationOpensAt?.toISOString() ??
      null,

    registrationClosesAt:
      tournament.registrationClosesAt?.toISOString() ??
      null,

    groupStage: groupStage
      ? {
          id: groupStage.id,
          name: groupStage.name,
          groups: groupStage.groups.map(
            (group) => ({
              id: group.id,
              name: group.name,
              slug: group.slug,
              displayOrder:
                group.displayOrder,
            }),
          ),
        }
      : null,
  };
}

/**
 * Get all active/non-deleted teams.
 */
export async function getTeams() {
  await requireRole(SUPER_ADMIN);

  const tournament =
    await getCurrentTournament();

  const teams =
    await prisma.team.findMany({
      where: {
        deletedAt: null,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        logo: true,

        poster: true,

        players: {
          where: {
            deletedAt: null,
          },

          orderBy: {
            createdAt: "asc",
          },
        },

        registrations: {
          where: {
            tournamentId:
              tournament?.id ?? "",
          },

          include: {
            tournamentGroup: true,
          },

          take: 1,
        },
      },
    });

  return teams.map((team) => {
    const registration =
      tournament &&
      team.registrations.length > 0
        ? team.registrations[0]
        : null;

    return {
      id: team.id,
      name: team.name,
      slug: team.slug,
      abbreviation:
        team.abbreviation,
      description:
        team.description,

      logo: team.logo?.url ?? null,
      poster: team.poster?.url ?? null,

      status:
        team.status === "ACTIVE"
          ? "active"
          : "inactive",

      players: team.players.map(
        (player) => ({
          id: player.id,
          inGameName:
            player.inGameName,
          role: player.role,
          isCaptain:
            player.isCaptain,
          isSubstitute:
            player.isSubstitute,
        }),
      ),

      playerCount:
        team.players.length,

      registrationStatus:
        registration?.status ?? null,

      group:
        registration?.tournamentGroup
          ? {
              id:
                registration
                  .tournamentGroup.id,

              name:
                registration
                  .tournamentGroup.name,

              slug:
                registration
                  .tournamentGroup.slug,
            }
          : null,

      createdAt:
        team.createdAt.toISOString(),
    };
  });
}


/**
 * Get one team by ID for the Super Admin
 * team edit/details page.
 */
export async function getTeamById(
  teamId: string,
) {
  await requireRole(SUPER_ADMIN);

  if (!teamId) {
    throw new Error("Team ID is required.");
  }

  const tournament =
    await getCurrentTournament();

  const team =
    await prisma.team.findFirst({
      where: {
        id: teamId,
        deletedAt: null,
      },

      include: {
        logo: true,
        poster: true,

        players: {
          where: {
            deletedAt: null,
          },

          orderBy: {
            createdAt: "asc",
          },
        },

        registrations: {
          where: {
            tournamentId:
              tournament?.id ?? "",
          },

          include: {
            tournamentGroup: true,
          },

          take: 1,
        },
      },
    });

  if (!team) {
    throw new Error("Team not found.");
  }

  const registration =
    tournament &&
    team.registrations.length > 0
      ? team.registrations[0]
      : null;

  return {
    id: team.id,

    name: team.name,
    slug: team.slug,

    abbreviation:
      team.abbreviation,

    description:
      team.description,

    logoMediaId:
      team.logoMediaId,

    posterMediaId:
      team.posterMediaId,

    logo:
      team.logo?.url ?? null,

    poster:
      team.poster?.url ?? null,

    status:
      team.status,

    group: registration?.tournamentGroup
      ? {
          id:
            registration
              .tournamentGroup.id,

          name:
            registration
              .tournamentGroup.name,

          slug:
            registration
              .tournamentGroup.slug,
        }
      : null,

    registrationStatus:
      registration?.status ?? null,

    players:
      team.players.map(
        (player) => ({
          id: player.id,

          inGameName:
            player.inGameName,

          role:
            player.role,

          isCaptain:
            player.isCaptain,

          isSubstitute:
            player.isSubstitute,
        }),
      ),
  };
}

/**
 * Create a team, its players, and its
 * approved tournament registration.
 */
export async function createTeam(
  data: CreateTeamInput,
) {
  const user =
    await requireRole(SUPER_ADMIN);

  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    throw new Error(
      "No tournament exists.",
    );
  }

  const name =
    cleanString(data.name);

  const slug =
    cleanString(data.slug)
      .toLowerCase();

  const abbreviation =
    cleanString(
      data.abbreviation,
    );

  const description =
    cleanString(
      data.description,
    );

  const posterMediaId =
    cleanString(
      data.posterMediaId,
    );

  const logoMediaId =
    cleanString(
      data.logoMediaId,
    ) || null;

  if (!name) {
    throw new Error(
      "Team name is required.",
    );
  }

  if (!slug) {
    throw new Error(
      "Team slug is required.",
    );
  }

  if (!posterMediaId) {
    throw new Error(
      "Team poster is required.",
    );
  }

  validateGroup(
    data.groupName,
  );

  validatePlayers(
    data.players,
  );

  const duplicate =
    await prisma.team.findFirst({
      where: {
        deletedAt: null,

        OR: [
          {
            name,
          },
          {
            slug,
          },
        ],
      },
    });

  if (duplicate) {
    throw new Error(
      "A team with this name or slug already exists.",
    );
  }

  const existingRegistrationCount =
    await prisma.tournamentRegistration.count(
      {
        where: {
          tournamentId:
            tournament.id,

          status: {
            in: [
              "SUBMITTED",
              "UNDER_REVIEW",
              "APPROVED",
              "WAITLISTED",
            ],
          },
        },
      },
    );

  if (
    existingRegistrationCount >=
    tournament.maxTeams
  ) {
    throw new Error(
      "The tournament has reached its maximum number of teams.",
    );
  }

  const group =
    await getGroupForTournament(
      tournament.id,
      data.groupName,
    );

  const result =
    await prisma.$transaction(
      async (tx) => {
        const team =
          await tx.team.create({
            data: {
              name,
              slug,

              abbreviation:
                abbreviation || null,

              description:
                description || null,

              logoMediaId,

              posterMediaId,

              createdById:
                user.id,

              status: "ACTIVE",
            },
          });

        await tx.player.createMany({
          data: data.players.map(
            (player) => ({
              teamId: team.id,

              inGameName:
                cleanString(
                  player.inGameName,
                ),

              role: player.role,

              isCaptain:
                Boolean(
                  player.isCaptain,
                ),

              isSubstitute:
                Boolean(
                  player.isSubstitute,
                ),
            }),
          ),
        });

        const registration =
          await tx.tournamentRegistration.create(
            {
              data: {
                tournamentId:
                  tournament.id,

                teamId:
                  team.id,

                tournamentGroupId:
                  group.id,

                status:
                  "APPROVED",

                reviewedById:
                  user.id,

                submittedAt:
                  new Date(),

                reviewedAt:
                  new Date(),

                remarks:
                  "Created and approved by Super Admin.",
              },
            },
          );

        return {
          team,
          registration,
        };
      },
    );

  revalidatePath(
    "/admin/teams",
  );

  revalidatePath(
    "/admin/matches",
  );

  revalidatePath(
    "/admin",
  );

  revalidatePath("/");

  return {
    success: true,
    teamId:
      result.team.id,
    registrationId:
      result.registration.id,
  };
}

/**
 * Update team information, group and players.
 */
export async function updateTeam(
  teamId: string,
  data: UpdateTeamInput,
) {
  const user =
    await requireRole(SUPER_ADMIN);

  if (!teamId) {
    throw new Error(
      "Team ID is required.",
    );
  }

  const name =
    cleanString(data.name);

  const slug =
    cleanString(data.slug)
      .toLowerCase();

  const abbreviation =
    cleanString(
      data.abbreviation,
    );

  const description =
    cleanString(
      data.description,
    );

  const posterMediaId =
    cleanString(
      data.posterMediaId,
    );

  const logoMediaId =
    cleanString(
      data.logoMediaId,
    ) || null;

  if (!name) {
    throw new Error(
      "Team name is required.",
    );
  }

  if (!slug) {
    throw new Error(
      "Team slug is required.",
    );
  }

  if (!posterMediaId) {
    throw new Error(
      "Team poster is required.",
    );
  }

  validateGroup(
    data.groupName,
  );

  validatePlayers(
    data.players,
  );

  const team =
    await prisma.team.findFirst({
      where: {
        id: teamId,
        deletedAt: null,
      },
    });

  if (!team) {
    throw new Error(
      "Team not found.",
    );
  }

  const duplicate =
    await prisma.team.findFirst({
      where: {
        deletedAt: null,

        OR: [
          {
            name,
          },
          {
            slug,
          },
        ],

        NOT: {
          id: teamId,
        },
      },
    });

  if (duplicate) {
    throw new Error(
      "Another team already uses this name or slug.",
    );
  }

  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    throw new Error(
      "No tournament exists.",
    );
  }

  const group =
    await getGroupForTournament(
      tournament.id,
      data.groupName,
    );

  await prisma.$transaction(
    async (tx) => {
      await tx.team.update({
        where: {
          id: teamId,
        },

        data: {
          name,
          slug,

          abbreviation:
            abbreviation || null,

          description:
            description || null,

          logoMediaId,

          posterMediaId,

          status:
            data.status,
        },
      });

      /*
       * Replace the team's player list.
       *
       * This diffs against the existing active
       * roster instead of soft-deleting everyone
       * and recreating from scratch - the old
       * approach collided with the unique
       * (teamId, inGameName) constraint whenever
       * a player's name was unchanged, since a
       * soft-deleted row still occupies that
       * unique slot.
       */
      const existingPlayers =
        await tx.player.findMany({
          where: {
            teamId,
            deletedAt: null,
          },
        });

      const incomingPlayers =
        data.players.map((player) => ({
          ...player,
          inGameName: cleanString(
            player.inGameName,
          ),
        }));

      const incomingNames = new Set(
        incomingPlayers.map(
          (player) =>
            player.inGameName,
        ),
      );

      const removedPlayerIds =
        existingPlayers
          .filter(
            (existing) =>
              !incomingNames.has(
                existing.inGameName,
              ),
          )
          .map((existing) => existing.id);

      if (removedPlayerIds.length > 0) {
        await tx.player.updateMany({
          where: {
            id: {
              in: removedPlayerIds,
            },
          },
          data: {
            deletedAt: new Date(),
          },
        });
      }

      for (const player of incomingPlayers) {
        const existing =
          existingPlayers.find(
            (candidate) =>
              candidate.inGameName ===
              player.inGameName,
          );

        if (existing) {
          await tx.player.update({
            where: {
              id: existing.id,
            },
            data: {
              role: player.role,
              isCaptain: Boolean(
                player.isCaptain,
              ),
              isSubstitute: Boolean(
                player.isSubstitute,
              ),
              deletedAt: null,
            },
          });
        } else {
          await tx.player.create({
            data: {
              teamId,
              inGameName:
                player.inGameName,
              role: player.role,
              isCaptain: Boolean(
                player.isCaptain,
              ),
              isSubstitute: Boolean(
                player.isSubstitute,
              ),
            },
          });
        }
      }

      const registration =
        await tx.tournamentRegistration.findUnique(
          {
            where: {
              tournamentId_teamId: {
                tournamentId:
                  tournament.id,
                teamId,
              },
            },
          },
        );

      if (registration) {
        await tx.tournamentRegistration.update(
          {
            where: {
              id: registration.id,
            },

            data: {
              tournamentGroupId:
                group.id,

              status:
                "APPROVED",

              reviewedById:
                user.id,

              reviewedAt:
                new Date(),
            },
          },
        );
      } else {
        await tx.tournamentRegistration.create(
          {
            data: {
              tournamentId:
                tournament.id,

              teamId,

              tournamentGroupId:
                group.id,

              status:
                "APPROVED",

              reviewedById:
                user.id,

              submittedAt:
                new Date(),

              reviewedAt:
                new Date(),

              remarks:
                "Created and approved by Super Admin.",
            },
          },
        );
      }
    },
  );

  revalidatePath(
    "/admin/teams",
  );

  revalidatePath(
    `/admin/teams/${teamId}`,
  );

  revalidatePath(
    `/admin/teams/${teamId}/edit`,
  );

  revalidatePath(
    "/admin/matches",
  );

  revalidatePath(
    "/admin",
  );

  revalidatePath("/");

  return {
    success: true,
  };
}

/**
 * Archive a team.
 *
 * We use a soft delete because teams can be
 * referenced by registrations, players,
 * matches and standings.
 */
export async function deleteTeam(
  teamId: string,
) {
  await requireRole(SUPER_ADMIN);

  if (!teamId) {
    throw new Error(
      "Team ID is required.",
    );
  }

  const team =
    await prisma.team.findFirst({
      where: {
        id: teamId,
        deletedAt: null,
      },
    });

  if (!team) {
    throw new Error(
      "Team not found.",
    );
  }

  await prisma.team.update({
    where: {
      id: teamId,
    },

    data: {
      status: "INACTIVE",
      deletedAt:
        new Date(),
    },
  });

  revalidatePath(
    "/admin/teams",
  );

  revalidatePath(
    "/admin/matches",
  );

  revalidatePath(
    "/admin",
  );

  revalidatePath("/");

  return {
    success: true,
  };
}

/**
 * Restore an archived team.
 */
export async function restoreTeam(
  teamId: string,
) {
  await requireRole(SUPER_ADMIN);

  const team =
    await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

  if (!team) {
    throw new Error(
      "Team not found.",
    );
  }

  await prisma.team.update({
    where: {
      id: teamId,
    },

    data: {
      status: "ACTIVE",
      deletedAt: null,
    },
  });

  revalidatePath(
    "/admin/teams",
  );

  revalidatePath(
    "/admin/matches",
  );

  return {
    success: true,
  };
}