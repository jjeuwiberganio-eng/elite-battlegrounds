import Link from "next/link";

import UpcomingMatchCard from "./UpcomingMatchCard";

interface UpcomingMatch {
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
  countdown?: string;
}

interface UpcomingMatchSectionProps {
  match: UpcomingMatch | null;
  countdown?: string;
  isLive: boolean;
}

export default function UpcomingMatchSection({
  match,
  countdown,
  isLive,
}: Readonly<UpcomingMatchSectionProps>) {
  return (
    <section className="bg-slate-900 py-20">

      <div className="container">

        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
              Upcoming Match
            </span>

            <h2 className="mt-5 text-4xl font-black text-white md:text-5xl">
              Don't Miss
              <br />
              The Next Battle
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Stay updated with the next scheduled match and
              follow the road to becoming the Elite Battlegrounds Champion.
            </p>

          </div>

          <Link
            href="/schedule"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              border
              border-amber-500
              px-6
              py-3
              font-semibold
              text-amber-400
              transition-all
              duration-200
              hover:bg-amber-500
              hover:text-slate-950
            "
          >
            View Full Schedule
          </Link>

        </div>

        {/* Match Card */}
        {match ? (
          <UpcomingMatchCard
            match={match}
            countdown={countdown}
            isLive={isLive}
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700 p-16 text-center">

            <h3 className="text-2xl font-bold text-white">
              No Upcoming Match
            </h3>

            <p className="mt-4 text-slate-400">
              The next tournament match will appear here once
              it has been scheduled.
            </p>

          </div>
        )}

      </div>

    </section>
  );
}