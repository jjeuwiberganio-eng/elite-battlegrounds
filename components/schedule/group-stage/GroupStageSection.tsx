"use client";

import { CalendarDays, Clock3, Play } from "lucide-react";
import { useState } from "react";

interface Team {
  name: string;
  logo: string | null;
  score?: number;
}

interface Match {
  id: string;
  matchNumber?: number;
  startTime: string;
  teamA: Team;
  teamB: Team;
  bestOf: string;
  streamUrl?: string;
  status?: string;
}

interface Day {
  id: string;
  title: string;
  date: string;
  matches: Match[];
}

interface GroupStageSectionProps {
  days: Day[];
}

const TBD = "TBD";

/*
 * Groups matches by their exact shared start time so simultaneous
 * matches share ONE row. Slots are ordered chronologically (TBD last)
 * and matches inside a slot are ordered by match number.
 */
function groupByStartTime(matches: Match[]) {
  const groups = new Map<string, Match[]>();

  for (const match of matches) {
    const key = match.startTime || TBD;
    groups.set(key, [...(groups.get(key) ?? []), match]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === TBD) return 1;
      if (b === TBD) return -1;
      return new Date(a).getTime() - new Date(b).getTime();
    })
    .map(([startTime, slotMatches]) => ({
      startTime,
      matches: [...slotMatches].sort(
        (a, b) => (a.matchNumber ?? 0) - (b.matchNumber ?? 0),
      ),
    }));
}

function formatTime(startTime: string) {
  if (startTime === TBD) return TBD;

  return new Date(startTime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

/*
 * The stored value is a date-only timestamp, so it is formatted in UTC.
 * That keeps it from shifting a day in other timezones and keeps the
 * server render identical to the client render.
 */
function formatDate(date: string) {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function getStatus(status?: string) {
  switch (status) {
    case "LIVE":
      return {
        label: "Live",
        className: "bg-red-50 text-red-600",
        dot: "animate-pulse bg-red-500",
      };
    case "PAUSED":
      return {
        label: "Paused",
        className: "bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
      };
    case "COMPLETED":
      return {
        label: "Final",
        className: "bg-slate-200 text-slate-700",
        dot: "bg-slate-500",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-slate-100 text-slate-500",
        dot: "bg-slate-400",
      };
    default:
      return {
        label: "Upcoming",
        className: "bg-slate-100 text-slate-600",
        dot: "bg-slate-400",
      };
  }
}

/* Only ever link to real web URLs. */
function isSafeUrl(url?: string) {
  return !!url && /^https?:\/\//i.test(url);
}

function TeamBlock({
  team,
  dimmed = false,
}: Readonly<{ team: Team; dimmed?: boolean }>) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
        {team.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={team.logo}
            alt={team.name}
            loading="lazy"
            className="h-12 w-12 object-contain"
          />
        ) : (
          <span className="text-lg font-black text-slate-400">
            {team.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Two-line reserve keeps both sides the same height, so the cards stay level. */}
      <p
        title={team.name}
        className={`mt-3 line-clamp-2 min-h-10 w-full break-words text-sm font-bold leading-5 ${
          dimmed ? "text-slate-400" : "text-slate-900"
        }`}
      >
        {team.name}
      </p>
    </div>
  );
}

function MatchCard({ match }: Readonly<{ match: Match }>) {
  const status = getStatus(match.status);
  const isFinal = match.status === "COMPLETED";
  const showScore = isFinal || match.status === "LIVE";

  const scoreA = match.teamA.score ?? 0;
  const scoreB = match.teamB.score ?? 0;

  const canWatch =
    isSafeUrl(match.streamUrl) && match.status !== "CANCELLED";

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5">
      {/* Card header: match number + status left, format right */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {match.matchNumber ? `Match ${match.matchNumber}` : "Match"}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${status.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        <span className="shrink-0 rounded-full border border-amber-500 px-3 py-0.5 text-xs font-bold uppercase text-amber-600">
          {match.bestOf}
        </span>
      </div>

      {/*
       * Fixed [1fr_auto_1fr] grid: team name length can never move the
       * centre marker. It is centred on the logo row, not the whole block.
       * Live/final matches show the score there instead of VS.
       */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <TeamBlock
          team={match.teamA}
          dimmed={isFinal && scoreA < scoreB}
        />

        {showScore ? (
          <span className="flex h-16 items-center px-1 text-2xl font-black tabular-nums text-slate-900">
            {scoreA}
            <span className="mx-1.5 text-slate-300">-</span>
            {scoreB}
          </span>
        ) : (
          <span className="flex h-16 items-center px-1 text-lg font-black text-amber-500">
            VS
          </span>
        )}

        <TeamBlock
          team={match.teamB}
          dimmed={isFinal && scoreB < scoreA}
        />
      </div>

      {/* Watch link: only when this match actually has a stream URL */}
      {canWatch && (
        <a
          href={match.streamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            match.status === "LIVE"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Play className="h-4 w-4" />
          {match.status === "LIVE"
            ? "Watch live"
            : isFinal
              ? "Watch replay"
              : "Watch"}
        </a>
      )}
    </div>
  );
}

export default function GroupStageSection({
  days,
}: Readonly<GroupStageSectionProps>) {
  const [requestedDayId, setSelectedDayId] = useState<string | null>(
    days[0]?.id ?? null,
  );

  /*
   * Derived, not synced via an effect: if the requested day no longer
   * exists in the current data, fall back to the first available day.
   */
  const selectedDay =
    days.find((day) => day.id === requestedDayId) ?? days[0];

  const selectedDayId = selectedDay?.id ?? null;

  const slots = selectedDay ? groupByStartTime(selectedDay.matches) : [];
  const formattedDate = selectedDay ? formatDate(selectedDay.date) : "";

  return (
    <section className="bg-white py-8 sm:py-14">
      {/* Same horizontal padding as ScheduleTabs so both line up on mobile */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* DAY NAVIGATION */}
        {days.length > 0 && (
          <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mb-8 sm:px-0">
            <div className="flex min-w-max justify-start gap-2 sm:justify-center">
              {days.map((day) => {
                const isSelected = day.id === selectedDayId;

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedDayId(day.id)}
                    className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold uppercase transition sm:px-6 sm:py-3 sm:text-sm ${
                      isSelected
                        ? "bg-amber-500 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* NO SCHEDULE DAYS */}
        {days.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-8">
            <p className="font-semibold text-slate-500">
              No schedule days available yet.
            </p>
          </div>
        )}

        {/* SELECTED DAY */}
        {selectedDay && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
            {/* Day header */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5 sm:gap-4 sm:px-8 sm:py-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 sm:h-12 sm:w-12">
                <CalendarDays className="h-5 w-5 text-amber-500 sm:h-6 sm:w-6" />
              </span>

              <div className="min-w-0">
                <h2 className="text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                  {selectedDay.title}
                </h2>

                {formattedDate && (
                  <p className="mt-0.5 text-sm text-slate-500">
                    {formattedDate}
                  </p>
                )}
              </div>
            </div>

            {/* NO MATCHES FOR THIS DAY */}
            {slots.length === 0 ? (
              <div className="px-6 py-12 text-center sm:px-8">
                <p className="font-semibold text-slate-500">
                  No matches scheduled for {selectedDay.title} yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {slots.map(({ startTime, matches }) => (
                  <div
                    key={startTime}
                    className="px-4 py-6 sm:px-8 sm:py-8 lg:grid lg:grid-cols-[10rem_1fr] lg:gap-8"
                  >
                    {/*
                     * Time, shown once per slot. Mobile: sits above the
                     * cards with the match count on the right. Desktop: a
                     * fixed-width left column, so every slot's cards start
                     * at the same x-position.
                     */}
                    <div className="mb-5 flex items-center justify-between gap-3 lg:mb-0 lg:block">
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          Match Time
                        </p>

                        <p
                          suppressHydrationWarning
                          className="mt-1 text-2xl font-black text-slate-900"
                        >
                          {formatTime(startTime)}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 lg:mt-3 lg:inline-block">
                        {matches.length}{" "}
                        {matches.length === 1 ? "match" : "matches"}
                      </span>
                    </div>

                    {/* Cards: 1 per row on phones, 2 on tablet, 4 on wide desktop */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {matches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
