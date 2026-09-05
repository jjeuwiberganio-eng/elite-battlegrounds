import { Trophy } from "lucide-react";

interface AboutHeroSectionProps {
  hero: {
    title: string;
    highlight: string;
    tagline: string;
  };
}

export default function AboutHeroSection({
  hero,
}: Readonly<AboutHeroSectionProps>) {
  return (
    <section className="relative z-0 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f59e0b,transparent_60%)] opacity-10" />

      <div className="container mx-auto max-w-7xl px-6 pb-16 lg:pb-20" style={{ paddingTop: 130 }}>
        <div className="flex justify-center">
          <div className="rounded-full border border-amber-300 bg-white p-4 shadow-md">
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px w-20 bg-amber-400" />
          <span className="text-xl text-amber-500">★</span>
          <div className="h-px w-20 bg-amber-400" />
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-5xl font-black uppercase tracking-tight">
            <span className="text-slate-900">{hero.title}</span>
          </h1>

          <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-amber-500 sm:text-4xl">
            {hero.highlight}
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            {hero.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
