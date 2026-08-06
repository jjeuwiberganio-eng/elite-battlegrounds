import DataTable, {
  type DataTableColumn,
} from "@/components/common/DataTable";
import TeamLogo from "@/components/common/TeamLogo";
import StatusBadge from "@/components/common/StatusBadge";

export interface StandingTeam {
  id: string;

  rank: number;

  team: {
    name: string;
    logo?: string | null;
  };

  wins: number;
  losses: number;

  matchPoints: number;

  winRate: number;

  qualified: boolean;
}

interface StandingsTableProps {
  standings: StandingTeam[];
  loading?: boolean;
}

export default function StandingsTable({
  standings,
  loading = false,
}: Readonly<StandingsTableProps>) {
  const columns: DataTableColumn<StandingTeam>[] = [
    {
      key: "rank",
      header: "#",
      className: "w-20",
    },

    {
      key: "team",
      header: "Team",
      render: (team) => (
        <div className="flex items-center gap-3">

          <TeamLogo
            src={team.team.logo}
            alt={team.team.name}
            size="sm"
          />

          <span className="font-semibold text-white">
            {team.team.name}
          </span>

        </div>
      ),
    },

    {
      key: "wins",
      header: "W",
      className: "text-center",
    },

    {
      key: "losses",
      header: "L",
      className: "text-center",
    },

    {
      key: "matchPoints",
      header: "Points",
      className: "text-center",
    },

    {
      key: "winRate",
      header: "Win %",
      className: "text-center",
      render: (team) => (
        <span>
          {team.winRate.toFixed(1)}%
        </span>
      ),
    },

    {
      key: "qualified",
      header: "Playoffs",
      render: (team) =>
        team.qualified ? (
          <StatusBadge status="active" />
        ) : (
          <StatusBadge status="inactive" />
        ),
    },
  ];

  return (
    <DataTable
      data={standings}
      columns={columns}
      loading={loading}
      rowKey={(team) => team.id}
      emptyTitle="No Standings Available"
      emptyDescription="Standings will appear once tournament matches have been played."
    />
  );
}