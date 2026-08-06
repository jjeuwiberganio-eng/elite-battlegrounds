import TeamLogo from "@/components/common/TeamLogo";
import StatusBadge from "@/components/common/StatusBadge";
import CountdownTimer from "@/components/common/CountdownTimer";

interface MatchDetailsCardProps {
  match: {
    id: string;

    stage: string;

    bestOf: string;

    scheduledAt: string;

    status:
      | "upcoming"
      | "live"
      | "completed";

    streamUrl?: string | null;

    referee?: string | null;

    notes?: string | null;

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

    winner?: string | null;

    mvp?: string | null;
  };
}

export default function MatchDetailsCard({
  match,
}: Readonly<MatchDetailsCardProps>) {
  return (
    <article
      className="
        rounded-3xl
        border
        border-white/10
        bg-slate-900
        shadow-2xl
        overflow-hidden
      "
    >
      {/* Header */}

      <div className="border-b border-white/10 p-8">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <p className="text-sm uppercase tracking-widest text-slate-400">
              {match.stage}
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Match Details
            </h2>

          </div>

          <div className="flex items-center gap-3">

            <span className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950">
              {match.bestOf}
            </span>

            <StatusBadge
              status={match.status}
            />

          </div>

        </div>

      </div>

      {/* Teams */}

      <div className="grid gap-10 p-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">

        {/* Team A */}

        <div className="flex flex-col items-center text-center">

          <TeamLogo
            src={match.teamA.logo}
            alt={match.teamA.name}
            size="xl"
          />

          <h3 className="mt-5 text-2xl font-bold text-white">
            {match.teamA.name}
          </h3>

          {match.teamA.score !== undefined && (
            <p className="mt-2 text-lg text-slate-300">
              Score: {match.teamA.score}
            </p>
          )}

        </div>

        {/* Center */}

        <div className="text-center">

          <div className="inline-flex rounded-full border border-amber-500 bg-amber-500/10 px-8 py-5 text-3xl font-black text-amber-400">
            VS
          </div>

          <p className="mt-6 text-slate-400">
            {new Date(
              match.scheduledAt,
            ).toLocaleString()}
          </p>

        </div>

        {/* Team B */}

        <div className="flex flex-col items-center text-center">

          <TeamLogo
            src={match.teamB.logo}
            alt={match.teamB.name}
            size="xl"
          />

          <h3 className="mt-5 text-2xl font-bold text-white">
            {match.teamB.name}
          </h3>

          {match.teamB.score !== undefined && (
            <p className="mt-2 text-lg text-slate-300">
              Score: {match.teamB.score}
            </p>
          )}

        </div>

      </div>

      {/* Countdown */}

      {match.status === "upcoming" && (
        <div className="border-t border-white/10 bg-slate-950/40 p-8">

          <p className="mb-5 text-center text-sm uppercase tracking-widest text-slate-400">
            Match Starts In
          </p>

          <CountdownTimer
            targetDate={match.scheduledAt}
          />

        </div>
      )}

      {/* Information */}

      <div className="border-t border-white/10 p-8">

        <div className="grid gap-8 md:grid-cols-2">

          <div>

            <h4 className="text-sm uppercase tracking-widest text-slate-400">
              Winner
            </h4>

            <p className="mt-2 text-lg font-semibold text-white">
              {match.winner ?? "TBD"}
            </p>

          </div>

          <div>

            <h4 className="text-sm uppercase tracking-widest text-slate-400">
              MVP
            </h4>

            <p className="mt-2 text-lg font-semibold text-white">
              {match.mvp ?? "TBD"}
            </p>

          </div>

          <div>

            <h4 className="text-sm uppercase tracking-widest text-slate-400">
              Referee
            </h4>

            <p className="mt-2 text-lg text-white">
              {match.referee ?? "Not Assigned"}
            </p>

          </div>

          <div>

            <h4 className="text-sm uppercase tracking-widest text-slate-400">
              Livestream
            </h4>

            {match.streamUrl ? (
              <a
                href={match.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-semibold text-amber-400 hover:text-amber-300"
              >
                Watch Live
              </a>
            ) : (
              <p className="mt-2 text-white">
                Not Available
              </p>
            )}

          </div>

        </div>

        {match.notes && (

          <div className="mt-8">

            <h4 className="text-sm uppercase tracking-widest text-slate-400">
              Match Notes
            </h4>

            <p className="mt-3 leading-7 text-slate-300">
              {match.notes}
            </p>

          </div>

        )}

      </div>

    </article>
  );
}