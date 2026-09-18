import { Trophy } from "lucide-react";

interface TournamentControlData {
  name: string;
  season: string;
  playoffSize: number;
}

interface StandingsHeroSectionProps {
  tournament: TournamentControlData;
}

export default function StandingsHeroSection({
  tournament,
}: Readonly<StandingsHeroSectionProps>) {
  return (
    <section className="relative z-0 overflow-hidden bg-white">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f59e0b,transparent_60%)] opacity-10" />

      <div
        className="container mx-auto max-w-[1500px] px-6 pb-8 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-[220px]"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full border border-amber-300 bg-white p-2.5 shadow-md sm:p-4">
            <Trophy className="h-5 w-5 text-amber-500 sm:h-8 sm:w-8" />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 flex items-center justify-center gap-3 sm:mt-6 sm:gap-4">
          <div className="h-px w-12 bg-amber-400 sm:w-20" />
          <span className="text-base text-amber-500 sm:text-xl">
            ★
          </span>
          <div className="h-px w-12 bg-amber-400 sm:w-20" />
        </div>

        {/* Heading */}
        <div className="mt-4 text-center sm:mt-8">
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
            <span className="text-slate-900">
              Tournament
            </span>{" "}
            <span className="text-amber-500">
              Standings
            </span>
          </h1>

          <p className="mt-2 text-sm text-slate-600 sm:mt-5 sm:text-lg">
            Track the rankings of all
            competing teams.
          </p>

          <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-slate-400 sm:mt-3 sm:text-sm sm:tracking-[0.35em]">
            {tournament.name} •{" "}
            {tournament.season}
          </p>
        </div>
      </div>
    </section>
  );
}