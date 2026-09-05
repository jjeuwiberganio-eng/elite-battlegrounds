"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import DataTable, {
  type DataTableColumn,
} from "@/components/common/DataTable";
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

interface AdminStandingsTableProps {
  standings: StandingsData;
  playoffSize: number;
}

export default function AdminStandingsTable({
  standings,
  playoffSize,
}: Readonly<AdminStandingsTableProps>) {
  const searchParams = useSearchParams();
  const activeGroup =
    searchParams.get("group") ||
    standings.defaultGroup;

  const rows = useMemo(() => {
    return standings.rows
      .filter(
        (row) =>
          row.groupSlug === activeGroup,
      )
      .sort((a, b) => a.rank - b.rank);
  }, [standings.rows, activeGroup]);

  const columns: DataTableColumn<StandingRow>[] =
    [
      {
        key: "rank",
        header: "#",
        render: (row) => (
          <span className="font-bold text-white">
            {row.rank}
          </span>
        ),
      },
      {
        key: "team",
        header: "Team",
        render: (row) => (
          <div className="flex items-center gap-3">
            <TeamLogo
              src={row.team.logo}
              alt={row.team.name}
              size="sm"
            />

            <span className="font-semibold text-white">
              {row.team.name}
            </span>
          </div>
        ),
      },
      {
        key: "played",
        header: "Matches (W-L)",
        render: (row) => (
          <span>
            {row.played} ({row.wins}-
            {row.losses})
          </span>
        ),
      },
      {
        key: "winRate",
        header: "Win Rate",
        render: (row) => (
          <span>
            {row.winRate.toFixed(1)}%
          </span>
        ),
      },
      {
        key: "gameWins",
        header: "Maps (W-L)",
        render: (row) => (
          <span>
            {row.gameWins}-{row.gameLosses}
          </span>
        ),
      },
      {
        key: "points",
        header: "Points",
        render: (row) => (
          <span className="text-lg font-black text-amber-400">
            {row.points}
          </span>
        ),
      },
      {
        key: "gameDiff",
        header: "Game Diff",
        render: (row) => (
          <span
            className={
              row.gameDiff > 0
                ? "font-semibold text-emerald-400"
                : row.gameDiff < 0
                  ? "font-semibold text-red-400"
                  : "text-slate-400"
            }
          >
            {row.gameDiff > 0 ? "+" : ""}
            {row.gameDiff}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (row) =>
          row.rank <= playoffSize ? (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-400">
              Qualified
            </span>
          ) : (
            <span className="text-slate-500">
              —
            </span>
          ),
      },
    ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      rowKey={(row) => row.id}
      emptyTitle="No Standings Yet"
      emptyDescription="Run 'Recalculate Standings' after group stage matches are completed to generate rankings."
    />
  );
}
