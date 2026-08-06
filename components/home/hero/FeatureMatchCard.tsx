import TeamLogo from "@/components/common/TeamLogo";
import CountdownTimer from "@/components/common/CountdownTimer";

interface FeaturedMatchCardProps {
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
  } | null;
}

export default function FeaturedMatchCard({
  match,
}: Readonly<FeaturedMatchCardProps>) {
  if (!match) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex h-72 items-center justify-center">

          <p className="text-center text-slate-300">
            No featured match has been scheduled yet.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

      {/* Header */}
      <div className="flex items-center justify-between">

        <h2 className="text-lg font-bold text-white">
          Featured Match
        </h2>

        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-950">
          {match.bestOf}
        </span>

      </div>

      {/* Teams */}
      <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-6">

        {/* Team A */}
        <div className="flex flex-col items-center text-center">

          <TeamLogo
            src={match.teamA.logo}
            alt={match.teamA.name}
            size="xl"
          />

          <h3 className="mt-4 text-lg font-bold text-white">
            {match.teamA.name}
          </h3>

        </div>

        {/* VS */}
        <div className="flex flex-col items-center">

          <span className="rounded-full border border-amber-500 bg-amber-500/10 px-5 py-3 text-xl font-black text-amber-400">
            VS
          </span>

        </div>

        {/* Team B */}
        <div className="flex flex-col items-center text-center">

          <TeamLogo
            src={match.teamB.logo}
            alt={match.teamB.name}
            size="xl"
          />

          <h3 className="mt-4 text-lg font-bold text-white">
            {match.teamB.name}
          </h3>

        </div>

      </div>

      {/* Match Info */}
      <div className="mt-10 rounded-2xl bg-slate-950/40 p-5">

        <p className="text-center text-sm uppercase tracking-widest text-slate-400">
          Match Starts
        </p>

        <p className="mt-2 text-center text-xl font-bold text-white">
          {match.matchTime}
        </p>

        <div className="mt-6">

          <CountdownTimer
            targetDate={match.matchTime}
          />

        </div>

      </div>

    </div>
  );
}