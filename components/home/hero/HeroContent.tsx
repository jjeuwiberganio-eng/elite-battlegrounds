interface HeroContentProps {
  hero: {
    title: string;
    subtitle: string;
  };

  tournament: {
    name: string;
    season: string;
  };

  liveStatus: {
    enabled: boolean;
  };
}

export default function HeroContent({
  hero,
  tournament,
  liveStatus,
}: Readonly<HeroContentProps>) {
  return (
    <div className="max-w-2xl">

      {/* Tournament Badge */}
      <div className="flex flex-wrap items-center gap-3">

        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-amber-300">
          {tournament.name}
        </span>

        <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur">
          {tournament.season}
        </span>

        {liveStatus.enabled && (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1 text-sm font-bold text-white">

            <span className="relative flex h-3 w-3">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />

            </span>

            LIVE NOW

          </span>
        )}

      </div>

      {/* Hero Title */}
      <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
        {hero.title}
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 md:text-xl">
        {hero.subtitle}
      </p>

      {/* Tournament Info */}
      <div className="mt-10 flex flex-wrap gap-8">

        <div>

          <p className="text-sm uppercase tracking-wider text-slate-400">
            Tournament
          </p>

          <p className="mt-1 text-lg font-bold text-white">
            {tournament.name}
          </p>

        </div>

        <div>

          <p className="text-sm uppercase tracking-wider text-slate-400">
            Season
          </p>

          <p className="mt-1 text-lg font-bold text-white">
            {tournament.season}
          </p>

        </div>

      </div>

    </div>
  );
}