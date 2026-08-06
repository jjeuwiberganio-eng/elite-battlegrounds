import TeamLogo from "@/components/common/TeamLogo";
import CountdownTimer from "@/components/common/CountdownTimer";

interface UpcomingMatchCardProps {
  match: {
    id: string;
    teamA: {
      name: string;
      logo?: string | null;
    };
    teamB: {
      name: string;
      logo?: string | null;
    };
    matchTime: string;
    bestOf: string;
  };

  countdown?: string;

  isLive: boolean;
}

export default function UpcomingMatchCard({
  match,
  countdown,
  isLive,
}: Readonly<UpcomingMatchCardProps>) {
  return (
    <article
      className="
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-xl
        shadow-2xl
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 p-6">

        <div>

          <p className="text-sm uppercase tracking-widest text-slate-400">
            Next Match
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            Elite Battlegrounds Series
          </h3>

        </div>

        <div className="flex items-center gap-3">

          <span className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950">
            {match.bestOf}
          </span>

          {isLive && (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">

              <span className="relative flex h-3 w-3">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />

              </span>

              LIVE

            </span>
          )}

        </div>

      </div>

      {/* Teams */}

      <div className="grid gap-10 p-10 md:grid-cols-3 md:items-center">

        {/* Team A */}

        <div className="flex flex-col items-center text-center">

          <TeamLogo
            src={match.teamA.logo}
            alt={match.teamA.name}
            size="2xl"
          />

          <h4 className="mt-5 text-2xl font-bold text-white">
            {match.teamA.name}
          </h4>

        </div>

        {/* VS */}

        <div className="text-center">

          <div className="inline-flex rounded-full border border-amber-500 bg-amber-500/10 px-8 py-5 text-3xl font-black text-amber-400">
            VS
          </div>

          <p className="mt-6 text-slate-400">
            {match.matchTime}
          </p>

        </div>

        {/* Team B */}

        <div className="flex flex-col items-center text-center">

          <TeamLogo
            src={match.teamB.logo}
            alt={match.teamB.name}
            size="2xl"
          />

          <h4 className="mt-5 text-2xl font-bold text-white">
            {match.teamB.name}
          </h4>

        </div>

      </div>

      {/* Countdown */}

      <div className="border-t border-white/10 bg-slate-950/40 p-8">

        <p className="mb-4 text-center text-sm uppercase tracking-widest text-slate-400">
          Match Countdown
        </p>

        <CountdownTimer
          targetDate={countdown ?? match.matchTime}
        />

      </div>

    </article>
  );
}