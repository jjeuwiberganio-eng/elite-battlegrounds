"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import DataTable, {
  type DataTableColumn,
} from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import TeamLogo from "@/components/common/TeamLogo";

export interface AdminTeam {
  id: string;

  name: string;

  logo?: string | null;

  captain: string;

  barangay: string;

  players: number;

  status: "active" | "inactive";

  createdAt: string;
}

interface TeamTableProps {
  teams: AdminTeam[];

  loading?: boolean;

  onDelete: (team: AdminTeam) => void;
}

export default function TeamTable({
  teams,
  loading = false,
  onDelete,
}: Readonly<TeamTableProps>) {
  const columns: DataTableColumn<AdminTeam>[] = [
    {
      key: "team",
      header: "Team",
      render: (team) => (
        <div className="flex items-center gap-3">

          <TeamLogo
            src={team.logo}
            alt={team.name}
            size="sm"
          />

          <span className="font-semibold text-white">
            {team.name}
          </span>

        </div>
      ),
    },

    {
      key: "captain",
      header: "Captain",
    },

    {
      key: "barangay",
      header: "Barangay",
    },

    {
      key: "players",
      header: "Players",
      className: "text-center",
    },

    {
      key: "status",
      header: "Status",
      render: (team) => (
        <StatusBadge status={team.status} />
      ),
    },

    {
      key: "createdAt",
      header: "Registered",
      render: (team) =>
        new Date(team.createdAt).toLocaleDateString(),
    },

    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (team) => (
        <div className="flex justify-end gap-2">

          <Link
            href={`/admin/teams/${team.id}`}
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
            aria-label={`View ${team.name}`}
          >
            <Eye className="h-5 w-5" />
          </Link>

          <Link
            href={`/admin/teams/${team.id}/edit`}
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
            aria-label={`Edit ${team.name}`}
          >
            <Pencil className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(team)}
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
            aria-label={`Delete ${team.name}`}
          >
            <Trash2 className="h-5 w-5" />
          </button>

        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={teams}
      columns={columns}
      loading={loading}
      rowKey={(team) => team.id}
      emptyTitle="No Teams Found"
      emptyDescription="Registered teams will appear here."
    />
  );
}