import DataTable, {
  type DataTableColumn,
} from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import TeamLogo from "@/components/common/TeamLogo";

export interface ScheduleMatch {
  id: string;

  matchNumber: number;

  stage: string;

  bestOf: string;

  scheduledAt: string;

  status:
    | "upcoming"
    | "live"
    | "completed";

  teamA: {
    name: string;
    logo?: string | null;
  };

  teamB: {
    name: string;
    logo?: string | null;
  };
}

interface ScheduleTableProps {
  matches: ScheduleMatch[];
  loading?: boolean;
}

export default function ScheduleTable({
  matches,
  loading = false,
}: Readonly<ScheduleTableProps>) {
  const columns: DataTableColumn<ScheduleMatch>[] = [
    {
      key: "match",
      header: "Match",
      render: (match) => (
        <div className="font-semibold text-white">
          Match #{match.matchNumber}
        </div>
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
      header: "Format",
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
  ];

  return (
    <DataTable
      data={matches}
      columns={columns}
      loading={loading}
      rowKey={(match) => match.id}
      emptyTitle="No Matches Scheduled"
      emptyDescription="Tournament matches will appear here once they have been created."
    />
  );
}