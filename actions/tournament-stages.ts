"use server";

import { revalidatePath } from "next/cache";
import { Prisma, TournamentStageType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

interface StageInput {
  name: string;
  slug: string;
  type: TournamentStageType;
  displayOrder: number;
  bestOf: "BO1" | "BO3" | "BO5" | "BO7";
  maxTeams?: number | null;
  isFinalStage: boolean;
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

/**
 * Get all stages for the current tournament.
 */
export async function getAdminStages() {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    return {
      tournament: null,
      stages: [],
    };
  }

  const stages =
    await prisma.tournamentStage.findMany({
      where: {
        tournamentId: tournament.id,
      },
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        _count: {
          select: {
            matches: true,
            groups: true,
            standings: true,
          },
        },
      },
    });

  return {
    tournament: {
      id: tournament.id,
      name: tournament.name,
    },
    stages,
  };
}

/**
 * Get stage types for the form.
 *
 * We use the generated Prisma enum so we never
 * hard-code enum values that may differ from
 * your schema.
 */
export async function getStageFormData() {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const tournament =
    await getCurrentTournament();

  return {
    tournament: tournament
      ? {
          id: tournament.id,
          name: tournament.name,
        }
      : null,

    stageTypes:
      Object.values(TournamentStageType),
  };
}

/**
 * Create a new tournament stage.
 */
export async function createTournamentStage(
  data: StageInput,
) {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    throw new Error(
      "No tournament has been created yet.",
    );
  }

  const name =
    data.name.trim();

  const slug =
    data.slug.trim().toLowerCase();

  if (!name) {
    throw new Error(
      "Stage name is required.",
    );
  }

  if (!slug) {
    throw new Error(
      "Stage slug is required.",
    );
  }

  if (
    !Number.isInteger(
      data.displayOrder,
    ) ||
    data.displayOrder < 1
  ) {
    throw new Error(
      "Display order must be a positive number.",
    );
  }

  if (
    data.maxTeams !== null &&
    data.maxTeams !== undefined &&
    (!Number.isInteger(data.maxTeams) ||
      data.maxTeams < 1)
  ) {
    throw new Error(
      "Maximum teams must be a positive number.",
    );
  }

  const existingSlug =
    await prisma.tournamentStage.findFirst({
      where: {
        tournamentId: tournament.id,
        slug,
      },
      select: {
        id: true,
      },
    });

  if (existingSlug) {
    throw new Error(
      "A stage with this slug already exists.",
    );
  }

  const existingOrder =
    await prisma.tournamentStage.findFirst({
      where: {
        tournamentId: tournament.id,
        displayOrder:
          data.displayOrder,
      },
      select: {
        id: true,
      },
    });

  if (existingOrder) {
    throw new Error(
      `Display order ${data.displayOrder} is already being used.`,
    );
  }

  const stage =
    await prisma.tournamentStage.create({
      data: {
        tournamentId:
          tournament.id,

        name,

        slug,

        type: data.type,

        displayOrder:
          data.displayOrder,

        bestOf:
          data.bestOf,

        maxTeams:
          data.maxTeams ?? null,

        isFinalStage:
          data.isFinalStage,
      },
    });

  revalidatePath(
    "/admin/tournament/stages",
  );

  revalidatePath(
    "/admin/matches",
  );

  revalidatePath("/");

  return {
    success: true,
    stage,
  };
}

/**
 * Update an existing tournament stage.
 */
export async function updateTournamentStage(
  stageId: string,
  data: StageInput,
) {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  if (!stageId) {
    throw new Error(
      "Stage ID is required.",
    );
  }

  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    throw new Error(
      "No tournament has been created yet.",
    );
  }

  const existingStage =
    await prisma.tournamentStage.findFirst({
      where: {
        id: stageId,
        tournamentId: tournament.id,
      },
      include: {
        _count: {
          select: {
            matches: true,
            groups: true,
            standings: true,
          },
        },
      },
    });

  if (!existingStage) {
    throw new Error(
      "Tournament stage not found.",
    );
  }

  const name =
    data.name.trim();

  const slug =
    data.slug.trim().toLowerCase();

  if (!name) {
    throw new Error(
      "Stage name is required.",
    );
  }

  if (!slug) {
    throw new Error(
      "Stage slug is required.",
    );
  }

  const duplicateSlug =
    await prisma.tournamentStage.findFirst({
      where: {
        tournamentId: tournament.id,
        slug,
        NOT: {
          id: stageId,
        },
      },
      select: {
        id: true,
      },
    });

  if (duplicateSlug) {
    throw new Error(
      "Another stage already uses this slug.",
    );
  }

  const duplicateOrder =
    await prisma.tournamentStage.findFirst({
      where: {
        tournamentId: tournament.id,
        displayOrder:
          data.displayOrder,
        NOT: {
          id: stageId,
        },
      },
      select: {
        id: true,
      },
    });

  if (duplicateOrder) {
    throw new Error(
      `Display order ${data.displayOrder} is already being used.`,
    );
  }

  const stage =
    await prisma.tournamentStage.update({
      where: {
        id: stageId,
      },
      data: {
        name,

        slug,

        type: data.type,

        displayOrder:
          data.displayOrder,

        bestOf:
          data.bestOf,

        maxTeams:
          data.maxTeams ?? null,

        isFinalStage:
          data.isFinalStage,
      },
    });

  revalidatePath(
    "/admin/tournament/stages",
  );

  revalidatePath(
    "/admin/matches",
  );

  revalidatePath("/");

  return {
    success: true,
    stage,
  };
}

/**
 * Delete a tournament stage.
 *
 * We protect stages that already have
 * matches, groups, or standings.
 */
export async function deleteTournamentStage(
  stageId: string,
) {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  if (!stageId) {
    throw new Error(
      "Stage ID is required.",
    );
  }

  const tournament =
    await getCurrentTournament();

  if (!tournament) {
    throw new Error(
      "No tournament has been created yet.",
    );
  }

  const stage =
    await prisma.tournamentStage.findFirst({
      where: {
        id: stageId,
        tournamentId: tournament.id,
      },
      include: {
        _count: {
          select: {
            matches: true,
            groups: true,
            standings: true,
          },
        },
      },
    });

  if (!stage) {
    throw new Error(
      "Tournament stage not found.",
    );
  }

  if (stage._count.matches > 0) {
    throw new Error(
      "This stage cannot be deleted because it already has matches.",
    );
  }

  if (stage._count.groups > 0) {
    throw new Error(
      "This stage cannot be deleted because it already has groups.",
    );
  }

  if (stage._count.standings > 0) {
    throw new Error(
      "This stage cannot be deleted because it already has standings.",
    );
  }

  await prisma.tournamentStage.delete({
    where: {
      id: stageId,
    },
  });

  revalidatePath(
    "/admin/tournament/stages",
  );

  revalidatePath(
    "/admin/matches",
  );

  revalidatePath("/");

  return {
    success: true,
  };
}