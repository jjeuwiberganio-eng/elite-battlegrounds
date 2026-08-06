import TeamLogo from "@/components/common/TeamLogo";
import StatusBadge from "@/components/common/StatusBadge";

export interface StandingRowData {
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

interface StandingRowProps {
  standing: StandingRowData;
}

export default function StandingRow({
  standing,
}: Readonly<StandingRowProps>) {
  return (
    <article
      className="
        rounded-3xl
        border
        border-white/10
        bg-slate-900
        p-6
        transition-all
        duration-300
        hover:border-amber-500/40
        hover:bg-slate-800/80
      "
    >
      <div className="flex items-center justify-between">

        {/* Rank */}

        <div className="text-center">

          <p className="text-sm uppercase tracking-widest text-slate-400">
            Rank
          </p>

          <h2 className="mt-2 text-4xl font-black text-amber-400">
            #{standing.rank}
          </h2>

        </div>

        <StatusBadge
          status={
            standing.qualified
              ? "active"
              : "inactive"
          }
        />

      </div>

      {/* Team */}

      <div className="mt-8 flex items-center gap-5">

        <TeamLogo
          src={standing.team.logo}
          alt={standing.team.name}
          size="md"
        />

        <div>

          <h3 className="text-xl font-bold text-white">
            {standing.team.name}
          </h3>

          <p className="mt-1 text-slate-400">
            {standing.matchPoints} Match Points
          </p>

        </div>

      </div>

      {/* Stats */}

      <div className="mt-8 grid grid-cols-3 gap-4">

        <div className="rounded-2xl bg-slate-800 p-4 text-center">

          <p className="text-sm uppercase tracking-wide text-slate-400">
            Wins
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {standing.wins}
          </p>

        </div>

        <div className="rounded-2xl bg-slate-800 p-4 text-center">

          <p className="text-sm uppercase tracking-wide text-slate-400">
            Losses
          </p>

          <p className="mt-2 text-2xl font-bold text-red-400">
            {standing.losses}
          </p>

        </div>

        <div className="rounded-2xl bg-slate-800 p-4 text-center">

          <p className="text-sm uppercase tracking-wide text-slate-400">
            Win Rate
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {standing.winRate.toFixed(1)}%
          </p>

        </div>

      </div>

    </article>
  );
}