"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

const GROUP_STAGE_SLUG = "group-stage";

export interface ScheduleDayOption {
  id: string;
  name: string;
  dayNumber: number;
  scheduledDate: Date | null;
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

export async function createNextScheduleDay(): Promise<ScheduleDayOption> {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  if (!tournament) {
    throw new Error("No tournament has been created yet.");
  }

  const stage = await prisma.tournamentStage.findFirst({
    where: {
      tournamentId: tournament.id,
      slug: GROUP_STAGE_SLUG,
    },
    select: {
      id: true,
    },
  });

  if (!stage) {
    throw new Error("Group Stage has not been created yet.");
  }

  const lastDay = await prisma.tournamentScheduleDay.findFirst({
    where: {
      stageId: stage.id,
    },
    orderBy: {
      dayNumber: "desc",
    },
    select: {
      dayNumber: true,
    },
  });

  const nextDayNumber = (lastDay?.dayNumber ?? 0) + 1;

  const day = await prisma.tournamentScheduleDay.create({
    data: {
      tournamentId: tournament.id,
      stageId: stage.id,
      dayNumber: nextDayNumber,
      name: `Day ${nextDayNumber}`,
    },
  });

  revalidatePath("/admin/matches");
  revalidatePath("/schedule");

  return day;
}

export interface AdminScheduleDay {
  id: string;
  name: string;
  dayNumber: number;
  scheduledDate: string | null;
  matchCount: number;
}

export async function getScheduleDays(): Promise<
  AdminScheduleDay[]
> {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const tournament = await getCurrentTournament();

  if (!tournament) {
    return [];
  }

  const stage = await prisma.tournamentStage.findFirst({
    where: {
      tournamentId: tournament.id,
      slug: GROUP_STAGE_SLUG,
    },
    select: {
      id: true,
    },
  });

  if (!stage) {
    return [];
  }

  const days = await prisma.tournamentScheduleDay.findMany({
    where: {
      stageId: stage.id,
    },
    orderBy: {
      dayNumber: "asc",
    },
    include: {
      _count: {
        select: {
          matches: true,
        },
      },
    },
  });

  return days.map((day) => ({
    id: day.id,
    name: day.name,
    dayNumber: day.dayNumber,
    scheduledDate:
      day.scheduledDate?.toISOString() ??
      null,
    matchCount: day._count.matches,
  }));
}

export async function updateScheduleDay(data: {
  dayId: string;
  name: string;
  scheduledDate?: string;
}) {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const name = data.name.trim();

  if (!name) {
    throw new Error(
      "Day name is required.",
    );
  }

  await prisma.tournamentScheduleDay.update({
    where: {
      id: data.dayId,
    },
    data: {
      name,
      scheduledDate: data.scheduledDate
        ? new Date(data.scheduledDate)
        : null,
    },
  });

  revalidatePath("/admin/schedule");
  revalidatePath("/admin/schedule/days");
  revalidatePath("/schedule");

  return {
    success: true,
    message: "Day updated.",
  };
}

export async function deleteScheduleDay(
  dayId: string,
) {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const day = await prisma.tournamentScheduleDay.findUnique({
    where: {
      id: dayId,
    },
    include: {
      _count: {
        select: {
          matches: true,
        },
      },
    },
  });

  if (!day) {
    throw new Error(
      "Schedule day not found.",
    );
  }

  if (day._count.matches > 0) {
    throw new Error(
      `Can't delete "${day.name}" - it has ${day._count.matches} match(es) scheduled on it. Remove or reassign those matches first.`,
    );
  }

  await prisma.tournamentScheduleDay.delete({
    where: {
      id: dayId,
    },
  });

  revalidatePath("/admin/schedule");
  revalidatePath("/admin/schedule/days");
  revalidatePath("/schedule");

  return {
    success: true,
    message: "Day deleted.",
  };
}
export async function getGroupStageScheduleDays(): Promise<
  ScheduleDayOption[]
> {
  const tournament = await getCurrentTournament();

  if (!tournament) {
    return [];
  }

  const stage = await prisma.tournamentStage.findFirst({
    where: {
      tournamentId: tournament.id,
      slug: GROUP_STAGE_SLUG,
    },
    select: {
      id: true,
    },
  });

  if (!stage) {
    return [];
  }

  return prisma.tournamentScheduleDay.findMany({
    where: {
      stageId: stage.id,
    },
    orderBy: {
      dayNumber: "asc",
    },
    select: {
      id: true,
      name: true,
      dayNumber: true,
      scheduledDate: true,
    },
  });
}