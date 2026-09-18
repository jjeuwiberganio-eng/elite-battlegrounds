"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

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
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-900 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-3 py-4 font-bold sm:px-4">
                  #
                </th>

                <th className="px-3 py-4 font-bold sm:px-4">
                  Team
                </th>

                <th className="px-3 py-4 text-center font-bold sm:px-4">
                  <span className="hidden sm:inline">
                    Matches
                    <br />
                  </span>
                  <span className="sm:font-normal sm:normal-case sm:text-slate-400">
                    W - L
                  </span>
                </th>

                <th className="px-3 py-4 text-center font-bold sm:px-4">
                  Win Rate
                </th>

                {/* Hidden on mobile - reference design drops these columns for small screens */}
                <th className="hidden px-4 py-4 text-center font-bold sm:table-cell">
                  Maps
                  <br />
                  <span className="font-normal normal-case text-slate-400">
                    W - L
                  </span>
                </th>

                <th className="px-3 py-4 text-center font-bold text-amber-400 sm:px-4">
                  Points
                </th>

                <th className="hidden px-4 py-4 text-center font-bold sm:table-cell">
                  Game
                  <br />
                  <span className="font-normal normal-case text-slate-400">
                    Win
                  </span>
                </th>

                <th className="hidden px-4 py-4 text-center font-bold sm:table-cell">
                  Game
                  <br />
                  <span className="font-normal normal-case text-slate-400">
                    Loss
                  </span>
                </th>

                <th className="hidden px-4 py-4 text-center font-bold sm:table-cell">
                  Game Diff
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`group border-b border-slate-100 transition-colors last:border-0 hover:bg-amber-50/50 ${
                    index % 2 === 1
                      ? "bg-slate-50/60"
                      : "bg-white"
                  } ${
                    row.rank <= 2
                      ? "border-l-4 border-l-amber-400 bg-amber-50/30"
                      : ""
                  }`}
                >
                  <td className="px-3 py-4 sm:px-4">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
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
                  </td>

                  <td className="px-3 py-4 sm:px-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <TeamLogo
                        src={row.team.logo}
                        alt={row.team.name}
                        size="sm"
                      />

                      <span className="truncate font-bold uppercase text-slate-900">
                        {row.team.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-4 text-center font-semibold text-slate-700 sm:px-4">
                    {row.wins} - {row.losses}
                  </td>

                  <td className="px-3 py-4 text-center font-semibold text-slate-700 sm:px-4">
                    {row.winRate.toFixed(1)}
                    %
                  </td>

                  <td className="hidden px-4 py-4 text-center font-semibold text-slate-700 sm:table-cell">
                    {row.gameWins} -{" "}
                    {row.gameLosses}
                  </td>

                  <td className="px-3 py-4 text-center sm:px-4">
                    <span className="inline-flex min-w-[2.75rem] items-center justify-center rounded-lg bg-amber-100 px-2.5 py-1 text-base font-black text-amber-600 shadow-sm ring-1 ring-amber-200/70 transition-colors group-hover:bg-amber-200/70">
                      {row.points}
                    </span>
                  </td>

                  <td className="hidden px-4 py-4 text-center font-semibold text-slate-700 sm:table-cell">
                    {row.gameWins}
                  </td>

                  <td className="hidden px-4 py-4 text-center font-semibold text-slate-700 sm:table-cell">
                    {row.gameLosses}
                  </td>

                  <td
                    className={`hidden px-4 py-4 text-center font-bold sm:table-cell ${
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Standings are updated automatically
        after each match.
      </p>
    </div>
  );
}