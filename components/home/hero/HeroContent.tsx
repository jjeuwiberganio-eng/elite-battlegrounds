import HeroActions from "./HeroActions";

interface HeroContentProps {
  hero: {
    title: string;
    subtitle: string;
  };
  tournament: {
    name: string;
    season: string;
    registrationOpen: boolean;
    registrationUrl?: string;
  };
}

export default function HeroContent({
  hero,
  tournament,
}: Readonly<HeroContentProps>) {
  return (
    <div className="relative z-10 w-full max-w-[680px] px-2 sm:px-4 lg:px-6">

      <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-900 sm:text-sm">
        {tournament.name}
      </p>
<h1 className="mt-8 text-[4.2rem] font-black uppercase leading-[0.82] tracking-[-0.055em] text-slate-950 sm:text-[5.8rem] lg:text-[6.8rem]">
     Elite
     </h1>

<h2 className="mt-3 text-[3rem] font-black uppercase leading-[0.9] tracking-[-0.04em] text-amber-600 sm:text-[4rem] lg:text-[4.8rem]">
    Battlegrounds
    </h2>

  <div className="mt-3 flex w-full max-w-[570px] items-center justify-center gap-3">
        <span className="h-[2px] w-10 bg-amber-600 sm:w-14" />

        <span className="text-base font-black uppercase tracking-[0.42em] text-slate-950 sm:text-lg">
          Series
        </span>

        <span className="h-[2px] w-10 bg-amber-600 sm:w-14" />
      </div>

      <div className="mt-10">
        <p className="text-xl font-black uppercase italic leading-[1.05] text-slate-950 sm:text-2xl">
          Play Together.
          <br />
          Win Together.
        </p>

        <p className="mt-3 text-xl font-black uppercase italic text-amber-600 sm:text-2xl">
          Have Fun!
        </p>
      </div>

      {hero.subtitle && (
        <p className="mt-5 max-w-md text-sm leading-6 text-slate-600">
          {hero.subtitle}
        </p>
      )}

      <div className="mt-8">
        <HeroActions
          registrationOpen={tournament.registrationOpen}
          registrationUrl={tournament.registrationUrl}
        />
      </div>

    </div>
  );
}