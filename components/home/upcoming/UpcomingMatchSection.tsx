"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Radio,
  Swords,
} from "lucide-react";

interface MatchTeam {
  id?: string;
  name: string;
  logo?: string | null;
}

interface Match {
  id: string;

  matchNumber?: number;

  startTime?: string | null;
  scheduledAt?: string | null;

  teamA: MatchTeam | null;
  teamB: MatchTeam | null;

  bestOf?: string;

  stage?: string;
  roundName?: string;

  status?: "upcoming" | "live" | "completed" | string;

  streamUrl?: string | null;
}

interface UpcomingMatchSectionProps {
  matches: Match[];
}

function getMatchTime(match: Match) {
  return match.scheduledAt ?? match.startTime ?? "";
}

function formatDate(dateString: string) {
  if (!dateString) return "Date TBA";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date TBA";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  if (!dateString) return "Time TBA";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Time TBA";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusLabel(status?: string) {
  if (status === "live") {
    return "LIVE NOW";
  }

  if (status === "completed") {
    return "COMPLETED";
  }

  return "UPCOMING";
}

export default function UpcomingMatchSection({
  matches,
}: Readonly<UpcomingMatchSectionProps>) {
    const normalizedMatches = useMemo(() => {
      return [...(matches ?? [])]
        .filter(
          (
            match,
          ): match is Match & {
            teamA: MatchTeam;
            teamB: MatchTeam;
          } =>
            match.teamA !== null &&
            match.teamB !== null,
        )
        .sort((a, b) => {
        const timeA = new Date(
          getMatchTime(a),
        ).getTime();

        const timeB = new Date(
          getMatchTime(b),
        ).getTime();

        return timeA - timeB;
      });
  }, [matches]);

  const [selectedMatchId, setSelectedMatchId] =
    useState<string>(
      normalizedMatches[0]?.id ?? "",
    );

  const selectedMatch =
    normalizedMatches.find(
      (match) =>
        match.id === selectedMatchId,
    ) ??
    normalizedMatches[0];

  if (!selectedMatch) {
    return (
      <section className="bg-slate-950 py-8 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 text-center sm:rounded-3xl sm:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 sm:text-xs sm:tracking-[0.3em]">
              Upcoming Match
            </p>

            <h2 className="mt-2 text-xl font-black uppercase text-white sm:mt-3 sm:text-3xl">
              No Matches Scheduled
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-400 sm:mt-3 sm:text-sm sm:leading-6">
              Matches will appear here when they are
              added by the tournament administrator.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const matchTime =
    getMatchTime(selectedMatch);

  const isLive =
    selectedMatch.status === "live";

  const hasStream =
    Boolean(selectedMatch.streamUrl);

return (
  <section className="relative overflow-hidden bg-white py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

      {/* Section heading */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2">
          <Swords className="h-4 w-4 text-amber-500" />

          <span className="text-xs font-black uppercase tracking-[0.28em] text-amber-600">
            Elite Battlegrounds Series
          </span>
        </div>

        <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-slate-950 sm:text-4xl">
          Upcoming Match
        </h2>
      </div>

      {/* Main match panel */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">

        <div className="grid lg:grid-cols-[300px_1fr]">

          {/* Match selector */}
          <aside className="border-b border-slate-200 bg-slate-100 p-5 lg:border-b-0 lg:border-r lg:p-6">

            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                Schedule
              </p>

              <h3 className="mt-1 text-lg font-black uppercase text-slate-950">
                Select Match
              </h3>
            </div>

            <div className="relative">
              <select
                id="homepage-match-selector"
                value={selectedMatch.id}
                onChange={(event) =>
                  setSelectedMatchId(event.target.value)
                }
                className="
                  w-full
                  appearance-none
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  pr-11
                  text-sm
                  font-bold
                  text-slate-900
                  outline-none
                  transition
                  focus:border-amber-500
                  focus:ring-2
                  focus:ring-amber-500/20
                "
              >
                {normalizedMatches.map(
                  (match, index) => {
                    const time = getMatchTime(match);

                    return (
                      <option
                        key={match.id}
                        value={match.id}
                      >
                        Match {match.matchNumber ?? index + 1} —{" "}
                        {match.teamA.name} vs {match.teamB.name}
                      </option>
                    );
                  },
                )}
              </select>

              <ChevronDown
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  h-5
                  w-5
                  -translate-y-1/2
                  text-amber-500
                "
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Choose a scheduled match to view the
              teams, schedule, and livestream.
            </p>

            {/* Match list */}
            <div className="mt-6 hidden space-y-2 lg:block">
              {normalizedMatches.map(
                (match, index) => {
                  const active =
                    match.id === selectedMatch.id;

                  return (
                    <button
                      key={match.id}
                      type="button"
                      onClick={() =>
                        setSelectedMatchId(match.id)
                      }
                      className={[
                        "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition",
                        active
                          ? "bg-slate-950 text-white shadow-md"
                          : "bg-white text-slate-700 hover:bg-slate-200",
                      ].join(" ")}
                    >
                      <span className="text-xs font-black uppercase">
                        Match{" "}
                        {match.matchNumber ??
                          index + 1}
                      </span>

                      {active && (
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </aside>

          {/* Selected match */}
          <main className="bg-white">

            {/* Match top information */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-8">

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-950">
                  Match{" "}
                  {selectedMatch.matchNumber ??
                    normalizedMatches.indexOf(
                      selectedMatch,
                    ) + 1}
                </span>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {selectedMatch.stage ??
                    selectedMatch.roundName ??
                    "Group Stage"}
                </span>

                {selectedMatch.status && (
                  <span
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide",
                      isLive
                        ? "bg-red-600 text-white"
                        : selectedMatch.status ===
                            "completed"
                          ? "bg-slate-200 text-slate-500"
                          : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    {isLive && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                    )}

                    {getStatusLabel(
                      selectedMatch.status,
                    )}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Radio
                  className={[
                    "h-4 w-4",
                    hasStream
                      ? "text-red-500"
                      : "text-slate-300",
                  ].join(" ")}
                />

                {hasStream
                  ? "Livestream available"
                  : "Livestream link not available"}
              </div>
            </div>

            {/* Teams */}
            <div className="px-5 py-10 sm:px-10 sm:py-14">

              <div className="mx-auto grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-10">

                {/* Team A */}
                <div className="flex min-w-0 flex-col items-center text-center">

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 bg-slate-50 sm:h-32 sm:w-32">
                    {selectedMatch.teamA.logo ? (
                      <Image
                        src={selectedMatch.teamA.logo}
                        alt={selectedMatch.teamA.name}
                        fill
                        sizes="128px"
                        className="object-contain p-3"
                      />
                    ) : (
                      <span className="text-3xl font-black text-slate-300">
                        {selectedMatch.teamA.name
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 max-w-[180px] truncate text-sm font-black uppercase text-slate-950 sm:text-lg">
                    {selectedMatch.teamA.name}
                  </h3>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center">

                  <span className="text-2xl font-black italic text-slate-950 sm:text-4xl">
                    VS
                  </span>

                  <span className="mt-2 rounded-full bg-amber-400 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-950">
                    {selectedMatch.bestOf ?? "BO3"}
                  </span>
                </div>

                {/* Team B */}
                <div className="flex min-w-0 flex-col items-center text-center">

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 bg-slate-50 sm:h-32 sm:w-32">
                    {selectedMatch.teamB.logo ? (
                      <Image
                        src={selectedMatch.teamB.logo}
                        alt={selectedMatch.teamB.name}
                        fill
                        sizes="128px"
                        className="object-contain p-3"
                      />
                    ) : (
                      <span className="text-3xl font-black text-slate-300">
                        {selectedMatch.teamB.name
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 max-w-[180px] truncate text-sm font-black uppercase text-slate-950 sm:text-lg">
                    {selectedMatch.teamB.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Match information */}
            <div className="grid border-t border-slate-200 bg-slate-50 sm:grid-cols-3">

              <div className="flex items-center justify-center gap-3 border-b border-slate-200 px-5 py-5 sm:border-b-0 sm:border-r">
                <CalendarDays className="h-5 w-5 text-amber-500" />

                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-950">
                    {formatDate(matchTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 border-b border-slate-200 px-5 py-5 sm:border-b-0 sm:border-r">
                <Clock3 className="h-5 w-5 text-amber-500" />

                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-950">
                    {formatTime(matchTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center px-5 py-5">
                {hasStream ? (
                  <a
                    href={
                      selectedMatch.streamUrl ??
                      undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-red-600
                      px-6
                      py-3
                      text-sm
                      font-black
                      uppercase
                      tracking-wide
                      text-white
                      shadow-lg
                      transition
                      hover:bg-red-500
                      hover:shadow-xl
                      focus:outline-none
                      focus:ring-2
                      focus:ring-red-500
                    "
                  >
                    <Radio className="h-4 w-4" />
                    Watch Live
                  </a>
                ) : (
                  <span
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-200
                      px-6
                      py-3
                      text-sm
                      font-bold
                      text-slate-400
                    "
                  >
                    Stream Not Available
                  </span>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Multiple match notice */}
      {normalizedMatches.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs font-medium text-slate-400">
          <Radio className="h-4 w-4 text-red-500" />

          <span>
            Each match has its own livestream link.
            Select a match above to watch its assigned
            stream.
          </span>
        </div>
      )}
    </div>
  </section>
);
}