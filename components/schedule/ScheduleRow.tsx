import StatusBadge from "@/components/common/StatusBadge";
import TeamLogo from "@/components/common/TeamLogo";

export interface ScheduleRowData {
  id: string;
  matchNumber: number;
  stage: string;
  bestOf: string;
  scheduledAt: string;
  status: "upcoming" | "live" | "completed";

  teamA: {
    name: string;
    logo?: string | null;
    score?: number;
  };

  teamB: {
    name: string;
    logo?: string | null;
    score?: number;
  };
}

interface ScheduleRowProps {
  match: ScheduleRowData;
}

export default function ScheduleRow({
  match,
}: Readonly<ScheduleRowProps>) {
  return (
    <div
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
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <p className="text-sm uppercase tracking-widest text-slate-400">
            Match #{match.matchNumber}
          </p>

          <h3 className="mt-2 text-xl font-bold text-white">
            {match.stage}
          </h3>

        </div>

        <div className="flex items-center gap-3">

          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950">
            {match.bestOf}
          </span>

          <StatusBadge
            status={match.status}
          />

        </div>

      </div>

      {/* Teams */}

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">

        {/* Team A */}

        <div className="flex items-center gap-4">

          <TeamLogo
            src={match.teamA.logo}
            alt={match.teamA.name}
            size="md"
          />

          <div>

            <h4 className="font-bold text-white">
              {match.teamA.name}
            </h4>

            {match.teamA.score !== undefined && (
              <p className="text-slate-400">
                Score: {match.teamA.score}
              </p>
            )}

          </div>

        </div>

        {/* VS */}

        <div className="text-center">

          <span className="rounded-full border border-amber-500 bg-amber-500/10 px-6 py-3 text-lg font-black text-amber-400">
            VS
          </span>

        </div>

        {/* Team B */}

        <div className="flex items-center justify-end gap-4">

          <div className="text-right">

            <h4 className="font-bold text-white">
              {match.teamB.name}
            </h4>

            {match.teamB.score !== undefined && (
              <p className="text-slate-400">
                Score: {match.teamB.score}
              </p>
            )}

          </div>

          <TeamLogo
            src={match.teamB.logo}
            alt={match.teamB.name}
            size="md"
          />

        </div>

      </div>

      {/* Footer */}

      <div className="mt-8 border-t border-white/10 pt-6">

        <p className="text-center text-sm text-slate-400">
          {new Date(match.scheduledAt).toLocaleString()}
        </p>

      </div>

    </div>
  );
}