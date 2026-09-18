import {
  Users,
  Swords,
  Gamepad2,
  Timer,
} from "lucide-react";

interface TournamentStatistics {
  totalTeams: number;
  matchesPlayed: number;
  totalGames: number;
  avgGameDuration: string;
}

interface TournamentStatisticsSectionProps {
  statistics: TournamentStatistics;
}

export default function TournamentStatisticsSection({
  statistics,
}: Readonly<TournamentStatisticsSectionProps>) {
  const stats = [
    {
      label: "Total Teams",
      value: statistics.totalTeams,
      icon: Users,
    },
    {
      label: "Matches Played",
      value: statistics.matchesPlayed,
      icon: Swords,
    },
    {
      label: "Total Games",
      value: statistics.totalGames,
      icon: Gamepad2,
    },
    {
      label: "Avg Game Duration",
      value: statistics.avgGameDuration,
      icon: Timer,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-amber-200" />

        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">
          Tournament Statistics
        </h2>

        <div className="h-px flex-1 bg-amber-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 px-3 py-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-amber-200 hover:bg-white hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-1 ring-amber-100">
                <Icon className="h-5 w-5" />
              </div>

              <p className="text-3xl font-black text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}