"use client";

import {
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Search } from "lucide-react";

import {
  createMatch,
  deleteMatch,
  duplicateMatch,
  updateMatchStatus,
} from "@/actions/matches";

import { useConfirm } from "@/components/admin/shared/ConfirmProvider";

import { isTiebreakerRound } from "@/lib/tiebreaker-constants";

import BulkMatchForm from "@/components/admin/matches/BulkMatchForm";
import TiebreakerMatchForm from "@/components/admin/matches/TiebreakerMatchForm";
import MatchForm, {
  type MatchFormValues,
} from "@/components/admin/matches/MatchForm";

import AddScheduleDayButton from "@/components/schedule/AddScheduleDayButton";
import RecordResultForm from "@/components/admin/matches/RecordResultForm";
import MatchEditForm from "@/components/admin/matches/MatchEditForm";

interface TeamOption {
  id: string;
  name: string;
  registrationId: string;
  logo?: unknown;
  groupId: string | null;
  groupName: string | null;
}

interface StageOption {
  id: string;
  name: string;
  slug: string;
  tournamentId: string;
}

interface ScheduleDayOption {
  id: string;
  name: string;
  dayNumber: number;
  scheduledDate: Date | null;
}

interface MatchParticipant {
  side: string;

  score: number;

  isWinner: boolean;

  tournamentRegistration: {
    team: {
      id: string;
      name: string;
      logo?: unknown;
    };
  };
}

interface AdminMatch {
  id: string;

  matchNumber: number;

  roundName: string;

  bestOf: string;

  scheduledAt: Date | null;

  streamUrl: string | null;

  status: string;

  winner: string | null;

  tournamentStage: {
    id: string;
    name: string;
    slug: string;
    tournamentId: string;
  };

  scheduleDay?: {
    id: string;
    name: string;
    dayNumber: number;
  } | null;

  participants: MatchParticipant[];
}

interface MatchManagementProps {
  initialMatches: AdminMatch[];
  teams: TeamOption[];
  stages: StageOption[];
  scheduleDays: ScheduleDayOption[];
}

type QuickStatus = "READY" | "LIVE" | "PAUSED" | "CANCELLED";

interface QuickAction {
  label: string;
  status: QuickStatus;
  tone: "live" | "neutral" | "danger";
}

/*
 * One-click status changes offered per current status. COMPLETED is
 * deliberately absent: a match only becomes completed by recording
 * its result.
 */
function getQuickActions(status: string): QuickAction[] {
  switch (status) {
    case "LIVE":
      return [
        { label: "Pause", status: "PAUSED", tone: "neutral" },
        {
          label: "Back to upcoming",
          status: "READY",
          tone: "neutral",
        },
      ];

    case "PAUSED":
      return [
        { label: "Resume live", status: "LIVE", tone: "live" },
        {
          label: "Back to upcoming",
          status: "READY",
          tone: "neutral",
        },
      ];

    case "CANCELLED":
      return [
        { label: "Reopen", status: "READY", tone: "neutral" },
      ];

    case "COMPLETED":
      return [];

    default:
      return [
        { label: "Go live", status: "LIVE", tone: "live" },
        {
          label: "Cancel match",
          status: "CANCELLED",
          tone: "danger",
        },
      ];
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "READY":
    case "DRAFT":
      return "Upcoming";
    case "LIVE":
      return "Live";
    case "PAUSED":
      return "Paused";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

function statusClassName(status: string) {
  switch (status) {
    case "LIVE":
      return "border-red-500/40 bg-red-500/10 text-red-300";
    case "COMPLETED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "PAUSED":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "CANCELLED":
      return "border-white/10 bg-white/5 text-slate-500 line-through";
    default:
      return "border-white/10 bg-white/5 text-slate-400";
  }
}

/*
 * "Now", refreshed once a minute. The server snapshot is 0, so nothing
 * that depends on the current time (Today badge, needs-result filter)
 * renders on the server - the server's clock/timezone can't differ from
 * the browser's and cause a hydration mismatch.
 */
function subscribeToMinute(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

function getMinuteSnapshot() {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

function useNow() {
  return useSyncExternalStore(
    subscribeToMinute,
    getMinuteSnapshot,
    () => 0,
  );
}

function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const selectClassName =
  "w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none";

export default function MatchManagement({
  initialMatches,
  teams,
  stages,
  scheduleDays,
}: Readonly<MatchManagementProps>) {
  const router = useRouter();
  const confirm = useConfirm();
  const now = useNow();

  /*
   * The list comes straight from the server page. After every action
   * we call router.refresh() (inside a transition) so the page
   * re-fetches without a full browser reload - no flash, and scroll
   * position and open editors survive.
   */
  const matches = initialMatches;

  const [isRefreshing, startTransition] = useTransition();

  /* Which match an action is currently running for. */
  const [busyId, setBusyId] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);

  /* Which match (if any) is open in the inline editor. */
  const [editingMatchId, setEditingMatchId] =
    useState<string | null>(null);

  /* Single vs. bulk creation. */
  const [createMode, setCreateMode] =
    useState<"single" | "bulk" | "tiebreaker">("single");

  /* Bumped after a create so the form remounts empty. */
  const [formKey, setFormKey] = useState(0);

  /* Filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [dayFilter, setDayFilter] = useState("ALL");

  const isBusy = busyId !== null || creating || isRefreshing;

  function refresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleCreateMatch(values: MatchFormValues) {
    setCreating(true);

    try {
      const result = await createMatch({
        matchNumber: values.matchNumber,

        tournamentStageId: values.tournamentStageId,

        scheduleDayId: values.scheduleDayId || undefined,

        teamAId: values.teamAId,

        teamBId: values.teamBId,

        bestOf: values.bestOf,

        /*
         * datetime-local returns a timezone-less string. The server
         * (Vercel) runs in UTC, so convert here in the browser, where
         * the real local timezone is known, and send a full UTC ISO
         * string instead.
         */
        scheduledAt: values.scheduledAt
          ? new Date(values.scheduledAt).toISOString()
          : undefined,

        /* Every match gets its own URL. */
        streamUrl: values.streamUrl || undefined,

        status: values.status,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        `Match #${values.matchNumber} created.`,
      );

      setFormKey((current) => current + 1);
      refresh();
    } catch {
      toast.error("Failed to create the match. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteMatch(match: AdminMatch) {
    const confirmed = await confirm({
      title: `Delete match #${match.matchNumber}?`,
      description:
        match.status === "COMPLETED"
          ? "This match has a recorded result. Deleting it also removes that result from the standings."
          : "This permanently removes the match from the schedule.",
      confirmLabel: "Delete match",
    });

    if (!confirmed) {
      return;
    }

    setBusyId(match.id);

    try {
      const result = await deleteMatch(match.id);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(`Match #${match.matchNumber} deleted.`);

      if (editingMatchId === match.id) {
        setEditingMatchId(null);
      }

      refresh();
    } catch {
      toast.error("Failed to delete the match. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleQuickStatus(
    match: AdminMatch,
    action: QuickAction,
  ) {
    if (action.status === "CANCELLED") {
      const confirmed = await confirm({
        title: `Cancel match #${match.matchNumber}?`,
        description:
          "The match stays in the admin list but shows as cancelled. You can reopen it later.",
        confirmLabel: "Cancel match",
      });

      if (!confirmed) {
        return;
      }
    }

    setBusyId(match.id);

    try {
      const result = await updateMatchStatus(
        match.id,
        action.status,
      );

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        `Match #${match.matchNumber} is now ${statusLabel(
          action.status,
        ).toLowerCase()}.`,
      );

      refresh();
    } catch {
      toast.error(
        "Failed to change the status. Please try again.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDuplicate(match: AdminMatch) {
    setBusyId(match.id);

    try {
      const result = await duplicateMatch(match.id);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        `Created match #${result.matchNumber}. Adjust its teams or time below.`,
      );

      setEditingMatchId(result.matchId);
      refresh();
    } catch {
      toast.error(
        "Failed to duplicate the match. Please try again.",
      );
    } finally {
      setBusyId(null);
    }
  }

  /* ---------- Filtering ---------- */

  const query = search.trim().toLowerCase();

  const visibleMatches = matches.filter((match) => {
    const teamA = match.participants.find(
      (participant) => participant.side === "TEAM_A",
    );

    const teamB = match.participants.find(
      (participant) => participant.side === "TEAM_B",
    );

    const teamAName =
      teamA?.tournamentRegistration.team.name ?? "";

    const teamBName =
      teamB?.tournamentRegistration.team.name ?? "";

    if (query) {
      const haystack = `${teamAName} ${teamBName} ${match.matchNumber}`.toLowerCase();

      if (!haystack.includes(query)) {
        return false;
      }
    }

    if (stageFilter !== "ALL" && match.tournamentStage.id !== stageFilter) {
      return false;
    }

    if (dayFilter !== "ALL" && match.scheduleDay?.id !== dayFilter) {
      return false;
    }

    const scheduledTime = match.scheduledAt
      ? new Date(match.scheduledAt)
      : null;

    switch (statusFilter) {
      case "TODAY":
        return (
          now > 0 &&
          scheduledTime !== null &&
          isSameLocalDay(scheduledTime, new Date(now))
        );

      case "NEEDS_RESULT":
        return (
          now > 0 &&
          scheduledTime !== null &&
          scheduledTime.getTime() < now &&
          !["COMPLETED", "CANCELLED"].includes(match.status)
        );

      case "UPCOMING":
        return ["READY", "DRAFT"].includes(match.status);

      case "ALL":
        return true;

      default:
        return match.status === statusFilter;
    }
  });

  const filtersActive =
    query !== "" ||
    statusFilter !== "ALL" ||
    stageFilter !== "ALL" ||
    dayFilter !== "ALL";

  function resetFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setStageFilter("ALL");
    setDayFilter("ALL");
  }

  return (
    <div className="space-y-8">
      {/* CREATE */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
        <div className="border-b border-white/10 bg-white/[0.03] px-6 py-6 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                Super Admin
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Create Matches
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Add one match, or a whole time slot at once. Every
                match gets its own teams, schedule and livestream.
              </p>
            </div>

            <AddScheduleDayButton />
          </div>

          <div className="mt-6 inline-flex rounded-xl border border-white/10 bg-slate-900 p-1">
            {(
              [
                ["single", "Single match"],
                ["bulk", "Multiple at once"],
                ["tiebreaker", "Tiebreaker"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCreateMode(mode)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  createMode === mode
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {createMode === "single" ? (
            <MatchForm
              key={formKey}
              teams={teams}
              stages={stages}
              scheduleDays={scheduleDays}
              loading={creating}
              submitLabel="Create Match"
              onSubmit={handleCreateMatch}
            />
          ) : createMode === "tiebreaker" ? (
            <TiebreakerMatchForm
              key={formKey}
              teams={teams}
              scheduleDays={scheduleDays}
              onCreated={() => {
                setFormKey((current) => current + 1);
                refresh();
              }}
            />
          ) : (
            <BulkMatchForm
              key={formKey}
              teams={teams}
              stages={stages}
              scheduleDays={scheduleDays}
              existingNumbers={matches.map((match) => ({
                stageId: match.tournamentStage.id,
                matchNumber: match.matchNumber,
              }))}
              onCreated={() => {
                setFormKey((current) => current + 1);
                refresh();
              }}
            />
          )}
        </div>
      </section>

      {/* EXISTING MATCHES */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              Tournament Schedule
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Tournament Matches
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Manage your scheduled matches, results and livestream
              assignments.
            </p>
          </div>

          <div className="w-fit rounded-full bg-amber-500 px-4 py-2 text-sm font-black text-slate-950">
            {filtersActive
              ? `${visibleMatches.length} of ${matches.length}`
              : matches.length}{" "}
            {matches.length === 1 ? "Match" : "Matches"}
          </div>
        </div>

        {/* Filters */}
        {matches.length > 0 && (
          <div className="grid gap-3 border-b border-white/10 px-6 py-5 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:px-8">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search team or match #"
                aria-label="Search matches"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter by status"
              className={selectClassName}
            >
              <option value="ALL">All statuses</option>
              <option value="TODAY">Today</option>
              <option value="NEEDS_RESULT">Needs result</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="LIVE">Live</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={stageFilter}
              onChange={(event) =>
                setStageFilter(event.target.value)
              }
              aria-label="Filter by stage"
              className={selectClassName}
            >
              <option value="ALL">All stages</option>

              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>

            <select
              value={dayFilter}
              onChange={(event) => setDayFilter(event.target.value)}
              aria-label="Filter by schedule day"
              className={selectClassName}
            >
              <option value="ALL">All days</option>

              {scheduleDays.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!filtersActive}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        )}

        {matches.length === 0 ? (
          <div className="px-6 py-12 text-center md:px-8">
            <p className="font-semibold text-slate-300">
              No matches have been created yet.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Create your first match using the form above.
            </p>
          </div>
        ) : visibleMatches.length === 0 ? (
          <div className="px-6 py-12 text-center md:px-8">
            <p className="font-semibold text-slate-300">
              No matches fit these filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 text-sm font-bold text-amber-400 hover:text-amber-300"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {visibleMatches.map((match) => {
              const teamA = match.participants.find(
                (participant) => participant.side === "TEAM_A",
              );

              const teamB = match.participants.find(
                (participant) => participant.side === "TEAM_B",
              );

              const teamAName =
                teamA?.tournamentRegistration.team.name ??
                "Team A";

              const teamBName =
                teamB?.tournamentRegistration.team.name ??
                "Team B";

              const scheduledTime = match.scheduledAt
                ? new Date(match.scheduledAt)
                : null;

              const isToday =
                now > 0 &&
                scheduledTime !== null &&
                isSameLocalDay(scheduledTime, new Date(now));

              const needsResult =
                now > 0 &&
                scheduledTime !== null &&
                scheduledTime.getTime() < now &&
                !["COMPLETED", "CANCELLED"].includes(
                  match.status,
                );

              const rowBusy = busyId === match.id;

              const quickActions = getQuickActions(match.status);

              return (
                <article
                  key={match.id}
                  className={`p-6 transition hover:bg-white/[0.025] md:p-8 ${
                    rowBusy ? "opacity-60" : ""
                  }`}
                >
                  <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                    {/* LEFT */}
                    <div className="space-y-5">
                      {/* Match title */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black uppercase text-slate-950">
                          Match #{match.matchNumber}
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-slate-300">
                          {match.bestOf}
                        </span>

                        {isTiebreakerRound(match.roundName) && (
                          <span
                            title="Doesn't count toward the standings"
                            className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase text-violet-300"
                          >
                            Tiebreaker · not counted
                          </span>
                        )}

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusClassName(
                            match.status,
                          )}`}
                        >
                          {statusLabel(match.status)}
                        </span>

                        {isToday && (
                          <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-bold text-sky-300">
                            Today
                          </span>
                        )}

                        {needsResult && (
                          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
                            Needs result
                          </span>
                        )}
                      </div>

                      {/* Stage */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Stage
                        </p>

                        {match.scheduleDay && (
                          <p className="mt-1 font-bold text-slate-300">
                            {match.scheduleDay.name}
                          </p>
                        )}

                        <p className="mt-1 font-bold text-amber-400">
                          {match.tournamentStage.name}
                        </p>
                      </div>

                      {/* Teams */}
                      <div className="flex flex-wrap items-center gap-3 text-lg font-black text-white">
                        <span>{teamAName}</span>

                        <span className="text-amber-400">VS</span>

                        <span>{teamBName}</span>
                      </div>

                      {/* Schedule */}
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Scheduled
                          </p>

                          <p className="mt-1 text-slate-300">
                            {scheduledTime
                              ? `${scheduledTime.toLocaleString(
                                  "en-PH",
                                  {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                    timeZone: "Asia/Manila",
                                  },
                                )} PHT`
                              : "Not scheduled"}
                          </p>
                        </div>

                        {/* Stream */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Livestream
                          </p>

                          {match.streamUrl ? (
                            <a
                              href={match.streamUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-2 font-semibold text-red-400 hover:text-red-300"
                            >
                              🔴 Watch Stream
                            </a>
                          ) : (
                            <p className="mt-1 text-slate-500">
                              No stream assigned
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quick status actions */}
                      {quickActions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {quickActions.map((action) => (
                            <button
                              key={action.status}
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                handleQuickStatus(match, action)
                              }
                              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                action.tone === "live"
                                  ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                                  : action.tone === "danger"
                                    ? "border-white/10 text-slate-400 hover:border-red-500/30 hover:text-red-300"
                                    : "border-white/10 text-slate-300 hover:bg-white/5"
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      {teamA && teamB ? (
                        <RecordResultForm
                          matchId={match.id}
                          teamAName={teamAName}
                          teamBName={teamBName}
                          initialScoreA={teamA.score}
                          initialScoreB={teamB.score}
                          isCompleted={match.status === "COMPLETED"}
                          winnerSide={
                            match.winner as
                              | "TEAM_A"
                              | "TEAM_B"
                              | null
                          }
                        />
                      ) : (
                        <p className="max-w-[16rem] text-xs leading-5 text-slate-500 lg:text-right">
                          Assign both teams (Edit Match) to record a
                          result.
                        </p>
                      )}

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          setEditingMatchId(
                            editingMatchId === match.id
                              ? null
                              : match.id,
                          )
                        }
                        className="w-full rounded-xl border border-amber-500/30 px-5 py-3 text-sm font-bold text-amber-400 transition hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
                      >
                        {editingMatchId === match.id
                          ? "Close Editor"
                          : "Edit Match"}
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDuplicate(match)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDeleteMatch(match)}
                        className="w-full rounded-xl border border-red-500/30 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
                      >
                        Delete Match
                      </button>
                    </div>
                  </div>

                  {/* Inline editor */}
                  {editingMatchId === match.id && (
                    <div className="mt-6">
                      <MatchEditForm
                        match={match}
                        scheduleDays={scheduleDays}
                        teams={teams}
                        showScheduleDay={
                          Boolean(match.scheduleDay) ||
                          match.tournamentStage.slug
                            .trim()
                            .toLowerCase() === "group-stage"
                        }
                        onCancel={() => setEditingMatchId(null)}
                        onSaved={() => {
                          setEditingMatchId(null);
                          refresh();
                        }}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
