"use client";

import { useState } from "react";

import {
  createMatch,
  deleteMatch,
} from "@/actions/matches";

import MatchForm, {
  type MatchFormValues,
} from "@/components/admin/matches/MatchForm";

import AddScheduleDayButton from "@/components/schedule/AddScheduleDayButton";

interface TeamOption {
  id: string;
  name: string;
  registrationId: string;
  logo?: unknown;
}

interface StageOption {
  id: string;
  name: string;
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

  tournamentStage: {
    id: string;
    name: string;
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

export default function MatchManagement({
  initialMatches,
  teams,
  stages,
  scheduleDays,
}: Readonly<MatchManagementProps>) {
  const [matches, setMatches] =
    useState(initialMatches);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  async function handleCreateMatch(
    values: MatchFormValues,
  ) {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await createMatch({
        matchNumber:
          values.matchNumber,

        tournamentStageId:
          values.tournamentStageId,

    scheduleDayId:
     values.scheduleDayId || undefined,

        teamAId:
          values.teamAId,

        teamBId:
          values.teamBId,

        bestOf:
          values.bestOf,

        scheduledAt:
          values.scheduledAt || undefined,

        /*
         * Your current form calls this "referee".
         * The backend expects refereeId.
         *
         * Until we build the referee selector,
         * leave it undefined rather than sending
         * a referee name as an ID.
         */
        refereeId:
          undefined,

        /*
         * Every match gets its own URL.
         */
        streamUrl:
          values.streamUrl || undefined,
      });

      setMessage(
        `Match #${values.matchNumber} created successfully.`,
      );

      /*
       * Reload the server page so the new
       * database match appears immediately.
       */
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create match.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMatch(
    matchId: string,
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this match?",
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await deleteMatch(matchId);

      setMatches((current) =>
        current.filter(
          (match) =>
            match.id !== matchId,
        ),
      );

      setMessage(
        "Match deleted successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete match.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Success message */}
      {message && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300">
          {message}
        </div>
      )}

       {/* Error message */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
        <div className="border-b border-white/10 bg-white/[0.03] px-6 py-6 md:px-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            Super Admin
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Create Match
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Add a match manually, assign the participating teams, set the schedule,
            and attach its individual livestream.
          </p>
        </div>

        <AddScheduleDayButton />
      </div>
    </div>

    <div className="p-6 md:p-8">
      <MatchForm
        teams={teams}
        stages={stages}
        scheduleDays={scheduleDays}
        loading={loading}
        submitLabel="Create Match"
        onSubmit={handleCreateMatch}
      />
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
              Manage your scheduled matches and
              livestream assignments.
            </p>
          </div>

          <div className="w-fit rounded-full bg-amber-500 px-4 py-2 text-sm font-black text-slate-950">
            {matches.length}{" "}
            {matches.length === 1
              ? "Match"
              : "Matches"}
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="px-6 py-12 text-center md:px-8">
            <p className="font-semibold text-slate-300">
              No matches have been created yet.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Create your first match using the
              form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {matches.map((match) => {
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

              const teamAName =
                teamA?.tournamentRegistration
                  .team.name ??
                "Team A";

              const teamBName =
                teamB?.tournamentRegistration
                  .team.name ??
                "Team B";

              return (
                <article
                  key={match.id}
                  className="p-6 transition hover:bg-white/[0.025] md:p-8"
                >
                  <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                    {/* LEFT */}
                    <div className="space-y-5">
                      {/* Match title */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black uppercase text-slate-950">
                          Match #
                          {
                            match.matchNumber
                          }
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-slate-300">
                          {match.bestOf}
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-slate-400">
                          {match.status}
                        </span>
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
                          {
                            match
                              .tournamentStage
                              .name
                          }
                        </p>                     
                      </div>

                      {/* Teams */}
                      <div className="flex flex-wrap items-center gap-3 text-lg font-black text-white">
                        <span>
                          {teamAName}
                        </span>

                        <span className="text-amber-400">
                          VS
                        </span>

                        <span>
                          {teamBName}
                        </span>
                      </div>

                      {/* Schedule */}
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Scheduled
                          </p>

                          <p className="mt-1 text-slate-300">
                            {match.scheduledAt
                              ? new Date(
                                  match.scheduledAt,
                                ).toLocaleString(
                                  "en-PH",
                                  {
                                    dateStyle:
                                      "medium",
                                    timeStyle:
                                      "short",
                                  },
                                )
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
                              href={
                                match.streamUrl
                              }
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
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-start lg:justify-end">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          handleDeleteMatch(
                            match.id,
                          )
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-red-500/30
                          px-5
                          py-3
                          text-sm
                          font-bold
                          text-red-400
                          transition
                          hover:bg-red-500/10
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                          lg:w-auto
                        "
                      >
                        Delete Match
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}