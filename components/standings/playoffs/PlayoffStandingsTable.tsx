import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

import TeamLogo from "@/components/common/TeamLogo";

interface PlayoffStandingRow {
  rank: number;
  registrationId: string;
  team: {
    id: string;
    name: string;
    logo: string | null;
  };
  played: number;
  wins: number;
  losses: number;
  winRate: number;
  gameWins: number;
  gameLosses: number;
  gameDiff: number;
  eliminated: boolean;
}

interface PlayoffStandingsTableProps {
  rows: PlayoffStandingRow[];
  eliminationLosses: number;
  hasResults: boolean;
}

function rankBadgeClassName(rank: number, active: boolean) {
  if (!active) {
    return "bg-slate-100 text-slate-400";
  }

  switch (rank) {
    case 1:
      return "bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-sm ring-2 ring-amber-200";
    case 2:
      return "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm ring-2 ring-slate-200";
    case 3:
      return "bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-sm ring-2 ring-orange-200";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

function StatusPill({
  eliminated,
  played,
}: Readonly<{ eliminated: boolean; played: number }>) {
  if (eliminated) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-red-600 ring-1 ring-red-200">
        Eliminated
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
      {played === 0 ? "Awaiting match" : "Active"}
    </span>
  );
}

function DiffValue({ value }: Readonly<{ value: number }>) {
  return (
    <span
      className={
        value > 0
          ? "text-emerald-600"
          : value < 0
            ? "text-red-500"
            : "text-slate-500"
      }
    >
      {value > 0 ? "+" : ""}
      {value}
    </span>
  );
}

/*
 * Playoff standings: every team in the bracket with its record. The rows
 * come from the bracket itself, so they update by themselves whenever a
 * playoff result is recorded - nothing to maintain here.
 */
export default function PlayoffStandingsTable({
  rows,
  eliminationLosses,
  hasResults,
}: Readonly<PlayoffStandingsTableProps>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
        <p className="font-semibold text-slate-600">
          Playoff standings aren&apos;t available yet.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          They appear once teams are placed in the playoff
          bracket.
        </p>

        <Link
          href="/schedule?tab=playoffs"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-amber-600 transition hover:bg-amber-500 hover:text-white"
        >
          View Playoff Bracket
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {rows.map((row) => (
          <div
            key={row.registrationId}
            className={`overflow-hidden rounded-2xl border shadow-sm ${
              row.eliminated
                ? "border-slate-200 bg-slate-50/70"
                : "border-amber-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-2.5 px-4 pt-4">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${rankBadgeClassName(
                  row.rank,
                  hasResults && !row.eliminated,
                )}`}
              >
                {row.rank}
              </span>

              <TeamLogo
                src={row.team.logo}
                alt={row.team.name}
                size="sm"
              />

              <span
                className={`min-w-0 flex-1 truncate text-sm font-bold uppercase ${
                  row.eliminated
                    ? "text-slate-500"
                    : "text-slate-900"
                }`}
              >
                {row.team.name}
              </span>
            </div>

            <div className="px-4 pt-2.5">
              <StatusPill
                eliminated={row.eliminated}
                played={row.played}
              />
            </div>

            <div className="mt-3 grid grid-cols-4 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/60 text-center">
              <div className="px-1.5 py-2.5">
                <p className="text-xs font-bold text-slate-700">
                  {row.wins}-{row.losses}
                </p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  Match
                </p>
              </div>

              <div className="px-1.5 py-2.5">
                <p className="text-xs font-bold text-slate-700">
                  {row.played > 0
                    ? `${row.winRate.toFixed(0)}%`
                    : "—"}
                </p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  Win Rate
                </p>
              </div>

              <div className="px-1.5 py-2.5">
                <p className="text-xs font-bold text-slate-700">
                  {row.gameWins}-{row.gameLosses}
                </p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  Maps
                </p>
              </div>

              <div className="px-1.5 py-2.5">
                <p className="text-xs font-bold">
                  <DiffValue value={row.gameDiff} />
                </p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  Diff
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:block">
        <div className="h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />

        <table className="w-full border-collapse text-left text-sm lg:text-base">
          <thead>
            <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-xs uppercase tracking-wider text-slate-300 lg:text-sm">
              <th className="px-4 py-4 font-bold lg:px-5 lg:py-5">
                #
              </th>

              <th className="px-4 py-4 font-bold lg:px-5 lg:py-5">
                Team
              </th>

              <th className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                Matches
                <br />
                <span className="font-normal normal-case text-slate-400">
                  W - L
                </span>
              </th>

              <th className="px-4 py-4 text-center font-bold text-amber-400 lg:px-5 lg:py-5">
                Win Rate
              </th>

              <th className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                Maps
                <br />
                <span className="font-normal normal-case text-slate-400">
                  W - L
                </span>
              </th>

              <th className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                Game Diff
              </th>

              <th className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.registrationId}
                className={`border-b border-slate-100 transition-colors last:border-0 hover:bg-amber-50/50 ${
                  index % 2 === 1
                    ? "bg-slate-50/60"
                    : "bg-white"
                } ${row.eliminated ? "opacity-70" : ""}`}
              >
                <td className="px-4 py-4 lg:px-5 lg:py-5">
                  <span className="relative flex h-7 w-7 items-center justify-center lg:h-9 lg:w-9">
                    {row.rank === 1 &&
                      hasResults &&
                      !row.eliminated && (
                        <Crown className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 text-amber-400 lg:h-5 lg:w-5" />
                      )}

                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black lg:h-9 lg:w-9 lg:text-sm ${rankBadgeClassName(
                        row.rank,
                        hasResults && !row.eliminated,
                      )}`}
                    >
                      {row.rank}
                    </span>
                  </span>
                </td>

                <td className="px-4 py-4 lg:px-5 lg:py-5">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <TeamLogo
                      src={row.team.logo}
                      alt={row.team.name}
                      size="md"
                    />

                    <span className="truncate font-bold uppercase text-slate-900">
                      {row.team.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-center font-semibold text-slate-700 lg:px-5 lg:py-5">
                  {row.wins} - {row.losses}
                </td>

                <td className="px-4 py-4 text-center lg:px-5 lg:py-5">
                  <span className="inline-flex min-w-[3.5rem] items-center justify-center rounded-lg bg-amber-100 px-2.5 py-1 font-black text-amber-600 ring-1 ring-amber-200/70">
                    {row.played > 0
                      ? `${row.winRate.toFixed(1)}%`
                      : "—"}
                  </span>
                </td>

                <td className="px-4 py-4 text-center font-semibold text-slate-700 lg:px-5 lg:py-5">
                  {row.gameWins} - {row.gameLosses}
                </td>

                <td className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                  <DiffValue value={row.gameDiff} />
                </td>

                <td className="px-4 py-4 text-center lg:px-5 lg:py-5">
                  <StatusPill
                    eliminated={row.eliminated}
                    played={row.played}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          Playoff standings update automatically as results
          are recorded in the bracket. A team is eliminated
          after {eliminationLosses}{" "}
          {eliminationLosses === 1 ? "loss" : "losses"}.
        </p>

        <Link
          href="/schedule?tab=playoffs"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-amber-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-amber-600 transition hover:bg-amber-500 hover:text-white"
        >
          View Playoff Bracket
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
