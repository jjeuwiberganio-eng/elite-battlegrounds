"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import DataTable, {
  type DataTableColumn,
} from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import TeamLogo from "@/components/common/TeamLogo";

export interface AdminMatch {
  id: string;

  matchNumber: number;

  stage: string;

  bestOf: string;

  scheduledAt: string;

  status: "upcoming" | "live" | "completed";

  teamA: {
    name: string;
    logo?: string | null;
  };

  teamB: {
    name: string;
    logo?: string | null;
  };
}

interface MatchTableProps {
  matches: AdminMatch[];
  loading?: boolean;
  onDelete: (match: AdminMatch) => void;
}

export default function MatchTable({
  matches,
  loading = false,
  onDelete,
}: Readonly<MatchTableProps>) {
  const columns: DataTableColumn<AdminMatch>[] = [
    {
      key: "match",
      header: "Match",
      render: (match) => (
        <span className="font-semibold text-white">
          Match #{match.matchNumber}
        </span>
      ),
    },

    {
      key: "teams",
      header: "Teams",
      render: (match) => (
        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2">

            <TeamLogo
              src={match.teamA.logo}
              alt={match.teamA.name}
              size="sm"
            />

            <span>{match.teamA.name}</span>

          </div>

          <span className="font-bold text-amber-400">
            VS
          </span>

          <div className="flex items-center gap-2">

            <TeamLogo
              src={match.teamB.logo}
              alt={match.teamB.name}
              size="sm"
            />

            <span>{match.teamB.name}</span>

          </div>

        </div>
      ),
    },

    {
      key: "stage",
      header: "Stage",
    },

    {
      key: "bestOf",
      header: "BO",
      render: (match) => (
        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950">
          {match.bestOf}
        </span>
      ),
    },

    {
      key: "scheduledAt",
      header: "Schedule",
      render: (match) =>
        new Date(
          match.scheduledAt,
        ).toLocaleString(),
    },

    {
      key: "status",
      header: "Status",
      render: (match) => (
        <StatusBadge
          status={match.status}
        />
      ),
    },

    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (match) => (
        <div className="flex justify-end gap-2">

          <Link
            href={`/admin/matches/${match.id}`}
            className="
              rounded-xl
              border
              border-slate-700
              p-2
              text-slate-300
              transition
              hover:border-cyan-500
              hover:text-cyan-400
            "
            aria-label={`View Match ${match.matchNumber}`}
          >
            <Eye className="h-5 w-5" />
          </Link>

          <Link
            href={`/admin/matches/${match.id}/edit`}
            className="
              rounded-xl
              border
              border-slate-700
              p-2
              text-slate-300
              transition
              hover:border-amber-500
              hover:text-amber-400
            "
            aria-label={`Edit Match ${match.matchNumber}`}
          >
            <Pencil className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(match)}
            className="
              rounded-xl
              border
              border-slate-700
              p-2
              text-slate-300
              transition
              hover:border-red-500
              hover:text-red-400
            "
            aria-label={`Delete Match ${match.matchNumber}`}
          >
            <Trash2 className="h-5 w-5" />
          </button>

        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={matches}
      columns={columns}
      loading={loading}
      rowKey={(match) => match.id}
      emptyTitle="No Matches Found"
      emptyDescription="Tournament matches will appear here once created."
    />
  );
}