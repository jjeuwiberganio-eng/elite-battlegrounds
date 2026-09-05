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
        className="container mx-auto max-w-7xl px-6 pb-16 lg:pb-20"
        style={{ paddingTop: 190 }}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full border border-amber-300 bg-white p-4 shadow-md">
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px w-20 bg-amber-400" />
          <span className="text-xl text-amber-500">
            ★
          </span>
          <div className="h-px w-20 bg-amber-400" />
        </div>

        {/* Heading */}
        <div className="mt-8 text-center">
          <h1 className="text-5xl font-black uppercase tracking-tight">
            <span className="text-slate-900">
              Tournament
            </span>{" "}
            <span className="text-amber-500">
              Standings
            </span>
          </h1>

          <p className="mt-5 text-lg text-slate-600">
            Track the rankings of all
            competing teams.
          </p>

          <p className="mt-3 text-sm uppercase tracking-[0.35em] text-slate-400">
            {tournament.name} •{" "}
            {tournament.season}
          </p>
        </div>
      </div>
    </section>
  );
}