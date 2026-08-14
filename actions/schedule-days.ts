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