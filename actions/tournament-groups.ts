"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

const SUPER_ADMIN = USER_ROLES.SUPER_ADMIN;

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface AdminGroup {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;

  _count: {
    registrations: number;
    matches: number;
    standings: number;
  };
}

export async function getGroupsForStage(
  stageId: string,
): Promise<AdminGroup[]> {
  await requireRole(SUPER_ADMIN);

  if (!stageId) {
    throw new Error(
      "Stage ID is required.",
    );
  }

  const groups =
    await prisma.tournamentGroup.findMany({
      where: {
        tournamentStageId: stageId,
      },
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        _count: {
          select: {
            registrations: true,
            matches: true,
            standings: true,
          },
        },
      },
    });

  return groups;
}

export async function createGroup(data: {
  stageId: string;
  name: string;
}) {
  await requireRole(SUPER_ADMIN);

  const name = data.name.trim();

  if (!data.stageId) {
    throw new Error(
      "Stage ID is required.",
    );
  }

  if (!name) {
    throw new Error(
      "Group name is required.",
    );
  }

  const slug = slugify(name);

  if (!slug) {
    throw new Error(
      "Group name must contain at least one letter or number.",
    );
  }

  const stage =
    await prisma.tournamentStage.findUnique({
      where: {
        id: data.stageId,
      },
    });

  if (!stage) {
    throw new Error(
      "Stage not found.",
    );
  }

  const existing =
    await prisma.tournamentGroup.findFirst({
      where: {
        tournamentStageId: data.stageId,
        slug,
      },
    });

  if (existing) {
    throw new Error(
      `A group named "${name}" already exists in this stage.`,
    );
  }

  const highest =
    await prisma.tournamentGroup.findFirst({
      where: {
        tournamentStageId: data.stageId,
      },
      orderBy: {
        displayOrder: "desc",
      },
    });

  const nextOrder =
    (highest?.displayOrder ?? 0) + 1;

  await prisma.tournamentGroup.create({
    data: {
      name,
      slug,
      tournamentStageId: data.stageId,
      displayOrder: nextOrder,
    },
  });

  revalidatePath(
    "/admin/tournament/stages",
  );
  revalidatePath("/standings");

  return {
    success: true,
    message: `${name} created.`,
  };
}

export async function updateGroup(data: {
  groupId: string;
  name: string;
}) {
  await requireRole(SUPER_ADMIN);

  const name = data.name.trim();

  if (!data.groupId) {
    throw new Error(
      "Group ID is required.",
    );
  }

  if (!name) {
    throw new Error(
      "Group name is required.",
    );
  }

  const group =
    await prisma.tournamentGroup.findUnique({
      where: {
        id: data.groupId,
      },
    });

  if (!group) {
    throw new Error(
      "Group not found.",
    );
  }

  const slug = slugify(name);

  if (!slug) {
    throw new Error(
      "Group name must contain at least one letter or number.",
    );
  }

  const existing =
    await prisma.tournamentGroup.findFirst({
      where: {
        tournamentStageId:
          group.tournamentStageId,
        slug,
        id: {
          not: data.groupId,
        },
      },
    });

  if (existing) {
    throw new Error(
      `A group named "${name}" already exists in this stage.`,
    );
  }

  await prisma.tournamentGroup.update({
    where: {
      id: data.groupId,
    },
    data: {
      name,
      slug,
    },
  });

  revalidatePath(
    "/admin/tournament/stages",
  );
  revalidatePath("/standings");

  return {
    success: true,
    message: "Group updated.",
  };
}

export async function deleteGroup(
  groupId: string,
) {
  await requireRole(SUPER_ADMIN);

  if (!groupId) {
    throw new Error(
      "Group ID is required.",
    );
  }

  const group =
    await prisma.tournamentGroup.findUnique({
      where: {
        id: groupId,
      },
      include: {
        _count: {
          select: {
            registrations: true,
            matches: true,
            standings: true,
          },
        },
      },
    });

  if (!group) {
    throw new Error(
      "Group not found.",
    );
  }

  if (group._count.registrations > 0) {
    throw new Error(
      `Can't delete "${group.name}" - ${group._count.registrations} team(s) are still assigned to it. Reassign or remove those teams first.`,
    );
  }

  if (
    group._count.matches > 0 ||
    group._count.standings > 0
  ) {
    throw new Error(
      `Can't delete "${group.name}" - it already has matches or standings recorded.`,
    );
  }

  await prisma.tournamentGroup.delete({
    where: {
      id: groupId,
    },
  });

  revalidatePath(
    "/admin/tournament/stages",
  );
  revalidatePath("/standings");

  return {
    success: true,
    message: `${group.name} deleted.`,
  };
}
