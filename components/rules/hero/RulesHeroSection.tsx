import { ScrollText } from "lucide-react";

interface RulesHeroSectionProps {
  tournament: {
    name: string;
    season: string;
  };
}

export default function RulesHeroSection({
  tournament,
}: Readonly<RulesHeroSectionProps>) {
  return (
    <section className="relative z-0 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f59e0b,transparent_60%)] opacity-10" />

      <div className="container mx-auto max-w-7xl px-6 pb-6 pt-5 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-40">
        <div className="flex justify-center">
          <div className="rounded-full border border-amber-300 bg-white p-2 shadow-md sm:p-4">
            <ScrollText className="h-4 w-4 text-amber-500 sm:h-8 sm:w-8" />
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-3 sm:mt-6 sm:gap-4">
          <div className="h-px w-12 bg-amber-400 sm:w-20" />
          <span className="text-base text-amber-500 sm:text-xl">★</span>
          <div className="h-px w-12 bg-amber-400 sm:w-20" />
        </div>

        <div className="mt-2.5 text-center sm:mt-8">
          <h1 className="text-2xl font-black uppercase tracking-tight sm:text-5xl">
            <span className="text-slate-900">Tournament</span>{" "}
            <span className="text-amber-500">Rules</span>
          </h1>

          <p className="mt-2 text-xs text-slate-600 sm:mt-5 sm:text-lg">
            Everything you need to know before stepping onto the battleground.
          </p>

          <p className="mt-1.5 text-[9px] uppercase tracking-[0.15em] text-slate-400 sm:mt-3 sm:text-sm sm:tracking-[0.35em]">
            {tournament.name} • {tournament.season}
          </p>
        </div>
      </div>
    </section>
  );
}