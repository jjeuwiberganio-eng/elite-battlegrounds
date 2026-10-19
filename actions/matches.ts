"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { getGroupStageScheduleDays } from "@/actions/schedule-days";
import { recalculateStandings } from "@/actions/standings";
import { actionError, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { TIEBREAKER_ROUND_NAME } from "@/lib/tiebreaker-constants";
import { USER_ROLES } from "@/src/lib/constants";

export async function getAdminMatches() {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  return prisma.match.findMany({
    orderBy: [
      {
        scheduledAt: "asc",
      },
      {
        matchNumber: "asc",
      },
    ],

    include: {
      tournamentStage: {
        select: {
          id: true,
          name: true,
          slug: true,
          tournamentId: true,
        },
      },

      scheduleDay: {
      select: {
        id: true,
        name: true,
        dayNumber: true,
      },
    },

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
  });
}

export async function getMatchFormData() {
  await requireRole(USER_ROLES.SUPER_ADMIN);

  const tournament = await prisma.tournament.findFirst({
    where: {
      deletedAt: null,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      stages: {
        orderBy: {
          displayOrder: "asc",
        },
      },

      registrations: {
        where: {
          status: "APPROVED",
        },

        include: {
          team: {
            include: {
              logo: true,
            },
          },
          tournamentGroup: true,
        },

        orderBy: {
          team: {
            name: "asc",
          },
        },
      },
    },
  });

  if (!tournament) {
    return {
      tournament: null,
      stages: [],
      teams: [],
      scheduleDays: [],
    };
  }
  const scheduleDays =
  await getGroupStageScheduleDays();
  return {
    tournament: {
      id: tournament.id,
      name: tournament.name,
    },

    stages: tournament.stages.map((stage) => ({
      id: stage.id,
      name: stage.name,
      slug: stage.slug,
      tournamentId: stage.tournamentId,
    })),

    teams: tournament.registrations.map((registration) => ({
      id: registration.team.id,
      name: registration.team.name,
      registrationId: registration.id,
      logo: registration.team.logo,
      groupId: registration.tournamentGroupId,
      groupName: registration.tournamentGroup?.name ?? null,
    })),
    scheduleDays,
  };
}

/*
|--------------------------------------------------------------------------
| Shared helpers (not exported - "use server" files only export actions)
|--------------------------------------------------------------------------
*/

type BestOf = "BO1" | "BO3" | "BO5" | "BO7";

type CreateStatus = "upcoming" | "live" | "completed";

const BEST_OF_VALUES: BestOf[] = ["BO1", "BO3", "BO5", "BO7"];

const MAX_BULK_MATCHES = 12;

interface MatchInput {
  matchNumber: number;
  tournamentStageId: string;
  teamAId: string;
  teamBId: string;
  bestOf: BestOf;
  scheduledAt?: string;
  streamUrl?: string;
  scheduleDayId?: string;
  status?: CreateStatus;
}

function revalidateMatchPaths() {
  const paths = [
    "/admin",
    "/admin/matches",
    "/admin/schedule/matches",
    "/admin/standings",
    "/standings",
    "/schedule",
    "/",
  ];

  for (const path of paths) {
    revalidatePath(path);
  }
}

/*
 * Standings are derived from match results, so anything that changes a
 * result (record, reset, delete, team swap) refreshes them straight
 * away instead of relying on the admin to click "Recalculate". A
 * standings failure must never fail the match change itself.
 */
async function refreshStandings() {
  try {
    await recalculateStandings();
  } catch (error) {
    console.error("Standings recalculation failed:", error);
  }
}

function parseScheduledAt(value: string | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid scheduled date and time.");
  }

  return date;
}

function normalizeStreamUrl(value: string | null | undefined) {
  const url = value?.trim() ?? "";

  if (!url) {
    return null;
  }

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Please enter a valid stream URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("The stream URL must start with http:// or https://.");
  }

  return url;
}

function assertBestOf(value: string): asserts value is BestOf {
  if (!BEST_OF_VALUES.includes(value as BestOf)) {
    throw new Error("Invalid match format.");
  }
}

/*
 * Validates one match and returns the data to insert. Shared by the
 * single-create and bulk-create actions so both enforce exactly the
 * same rules.
 */
async function prepareMatch(
  data: MatchInput,
): Promise<Prisma.MatchUncheckedCreateInput> {
  if (!data.tournamentStageId) {
    throw new Error("Tournament stage is required.");
  }

  if (!data.teamAId || !data.teamBId) {
    throw new Error("Both teams are required.");
  }

  if (data.teamAId === data.teamBId) {
    throw new Error("Teams must be different.");
  }

  if (!Number.isInteger(data.matchNumber) || data.matchNumber < 1) {
    throw new Error("Match number must be a whole number of 1 or more.");
  }

  assertBestOf(data.bestOf);

  const scheduledAt = parseScheduledAt(data.scheduledAt);
  const streamUrl = normalizeStreamUrl(data.streamUrl);

  const stage = await prisma.tournamentStage.findUnique({
    where: { id: data.tournamentStageId },
    select: { id: true, tournamentId: true, slug: true },
  });

  if (!stage) {
    throw new Error("Tournament stage not found.");
  }

  const isGroupStage =
    stage.slug.trim().toLowerCase() === "group-stage";

  let scheduleDayId: string | null = null;

  if (isGroupStage) {
    if (!data.scheduleDayId) {
      throw new Error(
        "Schedule day is required for Group Stage matches.",
      );
    }

    const scheduleDay =
      await prisma.tournamentScheduleDay.findFirst({
        where: {
          id: data.scheduleDayId,
          stageId: stage.id,
          tournamentId: stage.tournamentId,
        },
        select: { id: true },
      });

    if (!scheduleDay) {
      throw new Error(
        "Selected schedule day does not belong to this Group Stage.",
      );
    }

    scheduleDayId = scheduleDay.id;
  }

  const registrations =
    await prisma.tournamentRegistration.findMany({
      where: {
        tournamentId: stage.tournamentId,
        teamId: { in: [data.teamAId, data.teamBId] },
        status: "APPROVED",
      },
      select: { id: true, teamId: true },
    });

  const teamARegistration = registrations.find(
    (registration) => registration.teamId === data.teamAId,
  );

  const teamBRegistration = registrations.find(
    (registration) => registration.teamId === data.teamBId,
  );

  if (!teamARegistration || !teamBRegistration) {
    throw new Error(
      "Both teams must have an approved tournament registration.",
    );
  }

  const existingMatch = await prisma.match.findFirst({
    where: {
      tournamentStageId: data.tournamentStageId,
      matchNumber: data.matchNumber,
    },
    select: { id: true },
  });

  if (existingMatch) {
    throw new Error(
      `Match #${data.matchNumber} already exists in this stage.`,
    );
  }

  const statusMap = {
    upcoming: "READY",
    live: "LIVE",
    completed: "COMPLETED",
  } as const;

  return {
    matchNumber: data.matchNumber,
    roundName: "Match",
    tournamentStageId: data.tournamentStageId,
    scheduleDayId,
    status: statusMap[data.status ?? "upcoming"],
    bestOf: data.bestOf,
    scheduledAt,
    streamUrl,
    participants: {
      create: [
        {
          tournamentRegistrationId: teamARegistration.id,
          side: "TEAM_A",
        },
        {
          tournamentRegistrationId: teamBRegistration.id,
          side: "TEAM_B",
        },
      ],
    },
  };
}

/*
|--------------------------------------------------------------------------
| Create Match
|--------------------------------------------------------------------------
| scheduledAt must be a full ISO string. The admin forms convert the
| browser's datetime-local value with .toISOString() first, so the
| server never has to guess a timezone.
|
| status: the create form's own "upcoming" / "live" / "completed" labels,
| mapped to a real MatchStatus. Defaults to "upcoming" (-> READY) rather
| than Prisma's column default (DRAFT), since a match an admin just
| finished scheduling is ready to show on the site.
*/
export async function createMatch(
  data: MatchInput,
): Promise<ActionResult<{ matchId: string }>> {
  try {
    await requireRole(USER_ROLES.SUPER_ADMIN);

    const payload = await prepareMatch(data);

    const match = await prisma.match.create({
      data: payload,
      select: { id: true },
    });

    revalidateMatchPaths();

    return { ok: true, matchId: match.id };
  } catch (error) {
    return actionError(error, "Failed to create the match.");
  }
}

/*
|--------------------------------------------------------------------------
| Create Tiebreaker Match
|--------------------------------------------------------------------------
| A Group Stage match between two teams of the SAME group that are level
| on the standings. It is recorded like any other match (Record Result),
| but it never counts toward wins, losses, maps or points - the standings
| only show a "Tiebreaker Win / Loss" tag and rank the winner higher.
| See lib/tiebreaker-constants.ts.
|
| The match number is the next free one in the Group Stage, so it never
| clashes with a regular match.
*/
export async function createTiebreakerMatch(data: {
  teamAId: string;
  teamBId: string;
  scheduleDayId: string;
  scheduledAt: string;
  bestOf: BestOf;
  streamUrl?: string;
}): Promise<ActionResult<{ matchId: string; matchNumber: number }>> {
  try {
    await requireRole(USER_ROLES.SUPER_ADMIN);

    if (!data.teamAId || !data.teamBId) {
      throw new Error("Both teams are required.");
    }

    if (data.teamAId === data.teamBId) {
      throw new Error("Teams must be different.");
    }

    if (!data.scheduleDayId) {
      throw new Error("Choose a schedule day.");
    }

    if (!data.scheduledAt) {
      throw new Error("Choose the start time.");
    }

    const tournament = await prisma.tournament.findFirst({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
    });

    if (!tournament) {
      throw new Error("No tournament found.");
    }

    const groupStage = await prisma.tournamentStage.findFirst({
      where: {
        tournamentId: tournament.id,
        slug: "group-stage",
      },
      select: {
        id: true,
      },
    });

    if (!groupStage) {
      throw new Error("No Group Stage found for this tournament.");
    }

    const registrations =
      await prisma.tournamentRegistration.findMany({
        where: {
          tournamentId: tournament.id,
          teamId: { in: [data.teamAId, data.teamBId] },
          status: "APPROVED",
        },
        select: {
          teamId: true,
          tournamentGroupId: true,
        },
      });

    const registrationA = registrations.find(
      (registration) => registration.teamId === data.teamAId,
    );

    const registrationB = registrations.find(
      (registration) => registration.teamId === data.teamBId,
    );

    if (!registrationA || !registrationB) {
      throw new Error(
        "Both teams must have an approved tournament registration.",
      );
    }

    if (
      !registrationA.tournamentGroupId ||
      registrationA.tournamentGroupId !==
        registrationB.tournamentGroupId
    ) {
      throw new Error(
        "A tiebreaker is played between two teams of the same group.",
      );
    }

    const highest = await prisma.match.aggregate({
      where: { tournamentStageId: groupStage.id },
      _max: { matchNumber: true },
    });

    const matchNumber = (highest._max.matchNumber ?? 0) + 1;

    const payload = await prepareMatch({
      matchNumber,
      tournamentStageId: groupStage.id,
      scheduleDayId: data.scheduleDayId,
      scheduledAt: data.scheduledAt,
      bestOf: data.bestOf,
      streamUrl: data.streamUrl,
      teamAId: data.teamAId,
      teamBId: data.teamBId,
      status: "upcoming",
    });

    const match = await prisma.match.create({
      data: {
        ...payload,
        roundName: TIEBREAKER_ROUND_NAME,
        tournamentGroupId: registrationA.tournamentGroupId,
      },
      select: { id: true },
    });

    revalidateMatchPaths();

    return { ok: true, matchId: match.id, matchNumber };
  } catch (error) {
    return actionError(
      error,
      "Failed to create the tiebreaker match.",
    );
  }
}

/*
|--------------------------------------------------------------------------
| Bulk Create Matches
|--------------------------------------------------------------------------
| The tournament runs several simultaneous matches per time slot, so this
| creates them all at once. Everything is validated BEFORE anything is
| written, and the inserts run in one transaction: either every match is
| created or none are.
*/
export async function createMatchesBulk(data: {
  tournamentStageId: string;
  scheduleDayId?: string;
  scheduledAt: string;
  bestOf: BestOf;
  status?: CreateStatus;
  matches: {
    matchNumber: number;
    teamAId: string;
    teamBId: string;
    streamUrl?: string;
  }[];
}): Promise<ActionResult<{ created: number }>> {
  try {
    await requireRole(USER_ROLES.SUPER_ADMIN);

    if (!data.scheduledAt) {
      throw new Error("A start time is required.");
    }

    if (data.matches.length === 0) {
      throw new Error("Add at least one match.");
    }

    if (data.matches.length > MAX_BULK_MATCHES) {
      throw new Error(
        `You can create at most ${MAX_BULK_MATCHES} matches at once.`,
      );
    }

    const numbers = new Set<number>();
    const teams = new Set<string>();

    for (const row of data.matches) {
      if (numbers.has(row.matchNumber)) {
        throw new Error(
          `Match #${row.matchNumber} is listed more than once.`,
        );
      }

      numbers.add(row.matchNumber);

      for (const teamId of [row.teamAId, row.teamBId]) {
        if (teams.has(teamId)) {
          throw new Error(
            "A team can't play two matches at the same time slot.",
          );
        }

        if (teamId) {
          teams.add(teamId);
        }
      }
    }

    const payloads: Prisma.MatchUncheckedCreateInput[] = [];

    for (const row of data.matches) {
      try {
        payloads.push(
          await prepareMatch({
            matchNumber: row.matchNumber,
            tournamentStageId: data.tournamentStageId,
            scheduleDayId: data.scheduleDayId,
            scheduledAt: data.scheduledAt,
            bestOf: data.bestOf,
            status: data.status,
            teamAId: row.teamAId,
            teamBId: row.teamBId,
            streamUrl: row.streamUrl,
          }),
        );
      } catch (error) {
        const reason =
          error instanceof Error
            ? error.message
            : "Invalid match.";

        throw new Error(`Match #${row.matchNumber}: ${reason}`);
      }
    }

    await prisma.$transaction(
      payloads.map((payload) =>
        prisma.match.create({ data: payload, select: { id: true } }),
      ),
    );

    revalidateMatchPaths();

    return { ok: true, created: payloads.length };
  } catch (error) {
    return actionError(error, "Failed to create the matches.");
  }
}

/*
|--------------------------------------------------------------------------
| Duplicate Match
|--------------------------------------------------------------------------
| Copies stage, day, time, format and teams into a new match with the
| next free match number in the same stage. The stream URL is NOT copied
| (every match has its own stream) and the result starts empty.
*/
export async function duplicateMatch(
  matchId: string,
): Promise<ActionResult<{ matchId: string; matchNumber: number }>> {
  try {
    await requireRole(USER_ROLES.SUPER_ADMIN);

    if (!matchId) {
      throw new Error("Match ID is required.");
    }

    const source = await prisma.match.findUnique({
      where: { id: matchId },
      include: { participants: true },
    });

    if (!source) {
      throw new Error("Match not found.");
    }

    const highest = await prisma.match.aggregate({
      where: { tournamentStageId: source.tournamentStageId },
      _max: { matchNumber: true },
    });

    const matchNumber = (highest._max.matchNumber ?? 0) + 1;

    const copy = await prisma.match.create({
      data: {
        matchNumber,
        roundName: source.roundName,
        tournamentStageId: source.tournamentStageId,
        scheduleDayId: source.scheduleDayId,
        status: "READY",
        bestOf: source.bestOf,
        scheduledAt: source.scheduledAt,
        participants: {
          create: source.participants.map((participant) => ({
            tournamentRegistrationId:
              participant.tournamentRegistrationId,
            side: participant.side,
          })),
        },
      },
      select: { id: true },
    });

    revalidateMatchPaths();

    return { ok: true, matchId: copy.id, matchNumber };
  } catch (error) {
    return actionError(error, "Failed to duplicate the match.");
  }
}

/*
|--------------------------------------------------------------------------
| Delete Match
|--------------------------------------------------------------------------
*/
export async function deleteMatch(
  matchId: string,
): Promise<ActionResult> {
  try {
    await requireRole(USER_ROLES.SUPER_ADMIN);

    if (!matchId) {
      throw new Error("Match ID is required.");
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: { id: true, status: true },
    });

    if (!match) {
      throw new Error("Match not found.");
    }

    await prisma.match.delete({ where: { id: matchId } });

    /* A deleted finished match changes the standings. */
    if (match.status === "COMPLETED") {
      await refreshStandings();
    }

    revalidateMatchPaths();

    return { ok: true };
  } catch (error) {
    return actionError(error, "Failed to delete the match.");
  }
}

/*
|--------------------------------------------------------------------------
| Update Match (schedule / format / stream / schedule day / teams)
|--------------------------------------------------------------------------
| Only fields that are passed (not undefined) are updated.
|
| Teams: pass teamAId / teamBId (team IDs, not registration IDs) to swap
| the opponents. Refused when the match already has a recorded result
| (reset it first) or is wired into the playoff bracket (the bracket
| stores its own copy of each team - change those from the bracket page).
*/
export async function updateMatch(
  matchId: string,
  data: {
    scheduledAt?: string;
    bestOf?: BestOf;
    streamUrl?: string | null;
    scheduleDayId?: string | null;
    teamAId?: string;
    teamBId?: string;
  },
): Promise<ActionResult> {
  try {
    await requireRole(USER_ROLES.SUPER_ADMIN);

    if (!matchId) {
      throw new Error("Match ID is required.");
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        status: true,
        tournamentStage: {
          select: { id: true, slug: true, tournamentId: true },
        },
        participants: {
          select: {
            side: true,
            tournamentRegistration: { select: { teamId: true } },
          },
        },
        playoffBracketSlots: { select: { id: true } },
      },
    });

    if (!match) {
      throw new Error("Match not found.");
    }

    const updateData: Prisma.MatchUncheckedUpdateInput = {};

    if (data.scheduledAt !== undefined) {
      const scheduledAt = parseScheduledAt(data.scheduledAt);

      if (!scheduledAt) {
        throw new Error("Invalid scheduled date and time.");
      }

      updateData.scheduledAt = scheduledAt;
    }

    if (data.bestOf !== undefined) {
      assertBestOf(data.bestOf);
      updateData.bestOf = data.bestOf;
    }

    if (data.streamUrl !== undefined) {
      updateData.streamUrl = normalizeStreamUrl(data.streamUrl);
    }

    if (data.scheduleDayId !== undefined) {
      const isGroupStage =
        match.tournamentStage.slug.trim().toLowerCase() ===
        "group-stage";

      if (data.scheduleDayId) {
        const scheduleDay =
          await prisma.tournamentScheduleDay.findFirst({
            where: {
              id: data.scheduleDayId,
              stageId: match.tournamentStage.id,
              tournamentId: match.tournamentStage.tournamentId,
            },
            select: { id: true },
          });

        if (!scheduleDay) {
          throw new Error(
            "Selected schedule day does not belong to this match's stage.",
          );
        }

        updateData.scheduleDayId = scheduleDay.id;
      } else if (isGroupStage) {
        throw new Error(
          "Schedule day is required for Group Stage matches.",
        );
      } else {
        updateData.scheduleDayId = null;
      }
    }

    /* ---- Team swap ---- */
    const currentA = match.participants.find(
      (participant) => participant.side === "TEAM_A",
    )?.tournamentRegistration.teamId;

    const currentB = match.participants.find(
      (participant) => participant.side === "TEAM_B",
    )?.tournamentRegistration.teamId;

    const nextA = data.teamAId ?? currentA;
    const nextB = data.teamBId ?? currentB;

    const teamsChanged =
      (data.teamAId !== undefined || data.teamBId !== undefined) &&
      (nextA !== currentA || nextB !== currentB);

    let newParticipants:
      | { registrationAId: string; registrationBId: string }
      | null = null;

    if (teamsChanged) {
      if (match.status === "COMPLETED") {
        throw new Error(
          "Reset this match's result before changing its teams.",
        );
      }

      if (match.playoffBracketSlots.length > 0) {
        throw new Error(
          "This match is part of the playoff bracket. Change its teams from the bracket page.",
        );
      }

      if (!nextA || !nextB) {
        throw new Error("Both teams are required.");
      }

      if (nextA === nextB) {
        throw new Error("Teams must be different.");
      }

      const registrations =
        await prisma.tournamentRegistration.findMany({
          where: {
            tournamentId: match.tournamentStage.tournamentId,
            teamId: { in: [nextA, nextB] },
            status: "APPROVED",
          },
          select: { id: true, teamId: true },
        });

      const registrationA = registrations.find(
        (registration) => registration.teamId === nextA,
      );

      const registrationB = registrations.find(
        (registration) => registration.teamId === nextB,
      );

      if (!registrationA || !registrationB) {
        throw new Error(
          "Both teams must have an approved tournament registration.",
        );
      }

      newParticipants = {
        registrationAId: registrationA.id,
        registrationBId: registrationB.id,
      };
    }

    if (Object.keys(updateData).length === 0 && !newParticipants) {
      return { ok: true };
    }

    const operations: Prisma.PrismaPromise<unknown>[] = [];

    if (newParticipants) {
      operations.push(
        prisma.matchParticipant.deleteMany({
          where: { matchId },
        }),
        prisma.matchParticipant.createMany({
          data: [
            {
              matchId,
              tournamentRegistrationId:
                newParticipants.registrationAId,
              side: "TEAM_A",
            },
            {
              matchId,
              tournamentRegistrationId:
                newParticipants.registrationBId,
              side: "TEAM_B",
            },
          ],
        }),
      );
    }

    if (Object.keys(updateData).length > 0) {
      operations.push(
        prisma.match.update({
          where: { id: matchId },
          data: updateData,
        }),
      );
    }

    await prisma.$transaction(operations);

    revalidateMatchPaths();

    return { ok: true };
  } catch (error) {
    return actionError(error, "Failed to update the match.");
  }
}

/*
|--------------------------------------------------------------------------
| Quick Status Change
|--------------------------------------------------------------------------
| One-click "Go Live" / "Pause" / "Back to Upcoming" / "Cancel" from the
| matches list. COMPLETED is deliberately not allowed here: a match only
| becomes completed by recording a result (it needs the score).
*/
export async function updateMatchStatus(
  matchId: string,
  status: "READY" | "LIVE" | "PAUSED" | "CANCELLED",
): Promise<ActionResult> {
  try {
    await requireRole(USER_ROLES.SUPER_ADMIN);

    if (!["READY", "LIVE", "PAUSED", "CANCELLED"].includes(status)) {
      throw new Error("Invalid match status.");
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        status: true,
        startedAt: true,
        participants: { select: { side: true } },
      },
    });

    if (!match) {
      throw new Error("Match not found.");
    }

    if (match.status === "COMPLETED") {
      throw new Error(
        "This match is completed. Reset its result first to change the status.",
      );
    }

    if (status === "LIVE" && match.participants.length < 2) {
      throw new Error(
        "Assign both teams before taking a match live.",
      );
    }

    await prisma.match.update({
      where: { id: matchId },
      data: {
        status,
        startedAt:
          status === "LIVE"
            ? (match.startedAt ?? new Date())
            : status === "READY"
              ? null
              : match.startedAt,
      },
    });

    revalidateMatchPaths();

    return { ok: true };
  } catch (error) {
    return actionError(error, "Failed to change the match status.");
  }
}

/*
|--------------------------------------------------------------------------
| Record / Reset Match Result
|--------------------------------------------------------------------------
| This is the one place that decides who won a match. Nothing in the
| schedule/bracket admin infers a winner automatically - the Super
| Admin enters the final score for each side here, and this writes
| MatchParticipant.score/isWinner + Match.status/winner/completedAt.
| Standings are refreshed automatically afterwards.
*/
export async function recordMatchResult(data: {
  matchId: string;
  scoreA: number;
  scoreB: number;
}): Promise<ActionResult<{ message: string }>> {
  try {
    await requireRole(USER_ROLES.SUPER_ADMIN);

    if (!data.matchId) {
      throw new Error("Match ID is required.");
    }

    if (
      !Number.isInteger(data.scoreA) ||
      !Number.isInteger(data.scoreB) ||
      data.scoreA < 0 ||
      data.scoreB < 0
    ) {
      throw new Error("Scores must be whole numbers of 0 or more.");
    }

    if (data.scoreA === data.scoreB) {
      throw new Error(
        "Scores can't be tied - there has to be a winner.",
      );
    }

    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
      include: { participants: true },
    });

    if (!match) {
      throw new Error("Match not found.");
    }

    const participantA = match.participants.find(
      (participant) => participant.side === "TEAM_A",
    );

    const participantB = match.participants.find(
      (participant) => participant.side === "TEAM_B",
    );

    if (!participantA || !participantB) {
      throw new Error(
        "Both teams must be assigned to this match before recording a result.",
      );
    }

    const winnerSide =
      data.scoreA > data.scoreB ? "TEAM_A" : "TEAM_B";

    await prisma.$transaction([
      prisma.matchParticipant.update({
        where: {
          matchId_tournamentRegistrationId: {
            matchId: match.id,
            tournamentRegistrationId:
              participantA.tournamentRegistrationId,
          },
        },
        data: {
          score: data.scoreA,
          isWinner: winnerSide === "TEAM_A",
        },
      }),

      prisma.matchParticipant.update({
        where: {
          matchId_tournamentRegistrationId: {
            matchId: match.id,
            tournamentRegistrationId:
              participantB.tournamentRegistrationId,
          },
        },
        data: {
          score: data.scoreB,
          isWinner: winnerSide === "TEAM_B",
        },
      }),

      prisma.match.update({
        where: { id: match.id },
        data: {
          status: "COMPLETED",
          winner: winnerSide,
          completedAt: new Date(),
        },
      }),
    ]);

    await refreshStandings();
    revalidateMatchPaths();

    return {
      ok: true,
      message: "Result recorded and standings updated.",
    };
  } catch (error) {
    return actionError(error, "Failed to record the result.");
  }
}

export async function resetMatchResult(
  matchId: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    await requireRole(USER_ROLES.SUPER_ADMIN);

    if (!matchId) {
      throw new Error("Match ID is required.");
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { participants: true },
    });

    if (!match) {
      throw new Error("Match not found.");
    }

    await prisma.$transaction([
      ...match.participants.map((participant) =>
        prisma.matchParticipant.update({
          where: {
            matchId_tournamentRegistrationId: {
              matchId: match.id,
              tournamentRegistrationId:
                participant.tournamentRegistrationId,
            },
          },
          data: {
            score: 0,
            isWinner: false,
          },
        }),
      ),

      prisma.match.update({
        where: { id: match.id },
        data: {
          status: "READY",
          winner: null,
          completedAt: null,
        },
      }),
    ]);

    await refreshStandings();
    revalidateMatchPaths();

    return {
      ok: true,
      message: "Result reset and standings updated.",
    };
  } catch (error) {
    return actionError(error, "Failed to reset the result.");
  }
}
