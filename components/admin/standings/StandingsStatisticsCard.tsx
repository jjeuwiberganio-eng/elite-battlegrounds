import {
  Layers,
  Users,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface StandingsStatistics {
  totalGroups: number;
  teamsTracked: number;
  teamsPending: number;
  lastUpdated: string | null;
}

interface StandingsStatisticsCardProps {
  statistics: StandingsStatistics;
}

export default function StandingsStatisticsCard({
  statistics,
}: Readonly<StandingsStatisticsCardProps>) {
  const lastUpdatedLabel =
    statistics.lastUpdated
      ? new Date(
          statistics.lastUpdated,
        ).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Never";

  const stats = [
    {
      label: "Groups",
      value: statistics.totalGroups,
      icon: Layers,
    },
    {
      label: "Teams Tracked",
      value: statistics.teamsTracked,
      icon: Users,
    },
    {
      label: "Pending Recalculation",
      value: statistics.teamsPending,
      icon: AlertTriangle,
      warn: statistics.teamsPending > 0,
    },
    {
      label: "Last Updated",
      value: lastUpdatedLabel,
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-slate-900 p-5"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                stat.warn
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-white/5 text-slate-300"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <p
              className={`text-xl font-black ${
                stat.warn
                  ? "text-amber-400"
                  : "text-white"
              }`}
            >
              {stat.value}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
