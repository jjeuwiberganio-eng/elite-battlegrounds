"use server";

import { prisma } from "@/lib/prisma";

export interface AdminDashboardOverview {
  totalTeams: number;
  totalPlayers: number;
  activeTournaments: number;
  matchesToday: number;
  pendingRegistrations: number;
  recentActivities: number;
}

export interface AdminActivity {
  id: string;
  type:
    | "team_registered"
    | "match_completed"
    | "match_created"
    | "rule_updated"
    | "user_login"
    | "tournament_updated";
  title: string;
  description?: string;
  actor?: string;
  createdAt: Date;
}

/**
 * Admin Dashboard Statistics
 */
export async function getAdminDashboardOverview(): Promise<AdminDashboardOverview> {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const [
    totalTeams,
    totalPlayers,
    activeTournaments,
    matchesToday,
    pendingRegistrations,
    matchActivities,
    registrationActivities,
    tournamentActivities,
  ] = await Promise.all([
    prisma.team.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.player.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.tournament.count({
      where: {
        deletedAt: null,
        status: {
          notIn: ["DRAFT", "COMPLETED", "CANCELLED"],
        },
      },
    }),

    prisma.match.count({
      where: {
        scheduledAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    prisma.tournamentRegistration.count({
      where: {
        status: "SUBMITTED",
      },
    }),

    prisma.match.count(),

    prisma.tournamentRegistration.count(),

    prisma.tournament.count({
      where: {
        deletedAt: null,
      },
    }),
  ]);

  return {
    totalTeams,
    totalPlayers,
    activeTournaments,
    matchesToday,
    pendingRegistrations,
    recentActivities:
      matchActivities +
      registrationActivities +
      tournamentActivities,
  };
}

/**
 * Recent Dashboard Activity
 *
 * There is no AuditLog model in the current Prisma schema,
 * so activities are generated from existing database records.
 */
export async function getRecentActivities(
  limit = 10,
): Promise<AdminActivity[]> {
  const [registrations, matches, tournaments] = await Promise.all([
    prisma.tournamentRegistration.findMany({
      take: limit,
      orderBy: {
        submittedAt: "desc",
      },
      include: {
        team: {
          select: {
            name: true,
          },
        },
        tournament: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.match.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tournamentStage: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.tournament.findMany({
      take: limit,
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        deletedAt: null,
      },
    }),
  ]);

  const activities: AdminActivity[] = [];

  for (const registration of registrations) {
    activities.push({
      id: `registration-${registration.id}`,
      type: "team_registered",
      title: "Team Registration Submitted",
      description: `${registration.team.name} submitted a registration for ${registration.tournament.name}.`,
      actor: registration.team.name,
      createdAt: registration.submittedAt,
    });
  }

  for (const match of matches) {
    activities.push({
      id: `match-${match.id}`,
      type:
        match.status === "COMPLETED"
          ? "match_completed"
          : "match_created",
      title:
        match.status === "COMPLETED"
          ? "Match Completed"
          : "Match Created",
      description: `Match #${match.matchNumber} — ${match.tournamentStage.name}.`,
      createdAt: match.createdAt,
    });
  }

  for (const tournament of tournaments) {
    activities.push({
      id: `tournament-${tournament.id}`,
      type: "tournament_updated",
      title: "Tournament Updated",
      description: `${tournament.name} was recently updated.`,
      createdAt: tournament.updatedAt,
    });
  }

  return activities
    .sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime(),
    )
    .slice(0, limit);
}