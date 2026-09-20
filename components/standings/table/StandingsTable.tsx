"use client";

import { useMemo, useState, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Crown } from "lucide-react";

import TeamLogo from "@/components/common/TeamLogo";

interface StandingRow {
  id: string;
  groupSlug: string;
  rank: number;
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
  points: number;
  gameDiff: number;
}

interface StandingsData {
  groups: {
    id: string;
    name: string;
    slug: string;
  }[];
  defaultGroup: string;
  rows: StandingRow[];
}

interface StandingsTableProps {
  standings: StandingsData;
}

export default function StandingsTable({
  standings,
}: Readonly<StandingsTableProps>) {
  const searchParams = useSearchParams();
  const activeGroup =
    searchParams.get("group") ||
    standings.defaultGroup;

  const [search, setSearch] = useState("");

  const activeGroupName =
    standings.groups.find(
      (group) => group.slug === activeGroup,
    )?.name ?? "";

  const rows = useMemo(() => {
    return standings.rows
      .filter(
        (row) =>
          row.groupSlug === activeGroup,
      )
      .filter((row) =>
        row.team.name
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
      .sort((a, b) => a.rank - b.rank);
  }, [standings.rows, activeGroup, search]);

  // Where the qualification line falls in the currently-visible rows -
  // only shown when both a qualifying and a non-qualifying row are
  // actually visible (naturally hides itself while searching narrows
  // the list past the cutoff).
  const cutoffIndex = rows.findIndex(
    (row) => row.rank > 3,
  );
  const showCutoff = cutoffIndex > 0;

  return (
    <div className="mt-6">
      {/* Search */}
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:max-w-xs">
        <Search className="h-4 w-4 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search team..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-500">
          No teams found
          {activeGroupName
            ? ` in ${activeGroupName}`
            : ""}
          .
        </div>
      ) : (
        <>
          {/* Mobile - stacked cards, every stat visible, no hidden columns */}
          <div className="space-y-3 sm:hidden">
            {rows.map((row, index) => (
              <div key={row.id}>
                {showCutoff &&
                  index === cutoffIndex && (
                    <div className="my-3 flex items-center gap-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300" />
                      <span className="text-[9px] font-black uppercase tracking-wide text-amber-500">
                        Qualification Line
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300" />
                    </div>
                  )}

                <div
                  className={`overflow-hidden rounded-2xl border shadow-sm ${
                    row.rank <= 3
                      ? "border-amber-300 bg-amber-50/30"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 px-4 pt-4">
                    <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                      {row.rank === 1 && (
                        <Crown className="absolute -top-2.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 text-amber-400 drop-shadow-sm" />
                      )}

                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                          row.rank === 1
                            ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-sm ring-2 ring-amber-200"
                            : row.rank === 2
                              ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm ring-2 ring-slate-200"
                              : row.rank === 3
                                ? "bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-sm ring-2 ring-orange-200"
                                : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {row.rank}
                      </span>
                    </span>

                    <TeamLogo
                      src={row.team.logo}
                      alt={row.team.name}
                      size="sm"
                    />

                    <span className="min-w-0 flex-1 truncate text-sm font-bold uppercase text-slate-900">
                      {row.team.name}
                    </span>

                    <span className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-100 px-2.5 py-1 text-base font-black text-amber-600 shadow-sm ring-1 ring-amber-200/70">
                      {row.points}
                    </span>
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
                        {row.winRate.toFixed(0)}%
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
                      <p
                        className={`text-xs font-bold ${
                          row.gameDiff > 0
                            ? "text-emerald-600"
                            : row.gameDiff < 0
                              ? "text-red-500"
                              : "text-slate-700"
                        }`}
                      >
                        {row.gameDiff > 0 ? "+" : ""}
                        {row.gameDiff}
                      </p>
                      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Diff
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop - full table, sized generously so nothing needs zooming */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:block">
            <div className="h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />

            <table className="w-full border-collapse text-left text-sm lg:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-xs uppercase tracking-wider text-slate-300 shadow-[0_1px_0_0_rgba(245,158,11,0.4)] lg:text-sm">
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

                  <th className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                    Win Rate
                  </th>

                  <th className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                    Maps
                    <br />
                    <span className="font-normal normal-case text-slate-400">
                      W - L
                    </span>
                  </th>

                  <th className="px-4 py-4 text-center font-bold text-amber-400 lg:px-5 lg:py-5">
                    Points
                  </th>

                  <th className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                    Game
                    <br />
                    <span className="font-normal normal-case text-slate-400">
                      Win
                    </span>
                  </th>

                  <th className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                    Game
                    <br />
                    <span className="font-normal normal-case text-slate-400">
                      Loss
                    </span>
                  </th>

                  <th className="px-4 py-4 text-center font-bold lg:px-5 lg:py-5">
                    Game Diff
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <Fragment key={row.id}>
                    {showCutoff &&
                      index === cutoffIndex && (
                        <tr aria-hidden>
                          <td
                            colSpan={9}
                            className="bg-amber-50 px-5 py-1.5 text-center"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                                Qualification Line
                              </span>
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300" />
                            </div>
                          </td>
                        </tr>
                      )}

                    <tr
                      className={`group border-b border-slate-100 transition-colors last:border-0 hover:bg-amber-50/50 ${
                        index % 2 === 1
                          ? "bg-slate-50/60"
                          : "bg-white"
                      } ${
                        row.rank <= 3
                          ? "border-l-4 border-l-amber-400 bg-amber-50/30"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-4 lg:px-5 lg:py-5">
                        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center lg:h-9 lg:w-9">
                          {row.rank === 1 && (
                            <Crown className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 text-amber-400 drop-shadow-sm lg:h-5 lg:w-5" />
                          )}

                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black lg:h-9 lg:w-9 lg:text-sm ${
                              row.rank === 1
                                ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-sm ring-2 ring-amber-200"
                                : row.rank === 2
                                  ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm ring-2 ring-slate-200"
                                  : row.rank === 3
                                    ? "bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-sm ring-2 ring-orange-200"
                                    : "bg-slate-100 text-slate-500"
                            }`}
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

                      <td className="px-4 py-4 text-center font-semibold text-slate-700 lg:px-5 lg:py-5">
                        {row.winRate.toFixed(1)}
                        %
                      </td>

                      <td className="px-4 py-4 text-center font-semibold text-slate-700 lg:px-5 lg:py-5">
                        {row.gameWins} -{" "}
                        {row.gameLosses}
                      </td>

                      <td className="px-4 py-4 text-center lg:px-5 lg:py-5">
                        <span className="inline-flex min-w-[2.75rem] items-center justify-center rounded-lg bg-amber-100 px-2.5 py-1 text-base font-black text-amber-600 shadow-sm ring-1 ring-amber-200/70 transition-colors group-hover:bg-amber-200/70 lg:min-w-[3.25rem] lg:px-3 lg:py-1.5 lg:text-lg">
                          {row.points}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center font-semibold text-slate-700 lg:px-5 lg:py-5">
                        {row.gameWins}
                      </td>

                      <td className="px-4 py-4 text-center font-semibold text-slate-700 lg:px-5 lg:py-5">
                        {row.gameLosses}
                      </td>

                      <td
                        className={`px-4 py-4 text-center font-bold lg:px-5 lg:py-5 ${
                          row.gameDiff > 0
                            ? "text-emerald-600"
                            : row.gameDiff < 0
                              ? "text-red-500"
                              : "text-slate-500"
                        }`}
                      >
                        {row.gameDiff > 0
                          ? "+"
                          : ""}
                        {row.gameDiff}
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Standings are updated automatically
        after each match.
      </p>
    </div>
  );
}