import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";

interface HeroSectionProps {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  tournament: {
    name: string;
    season: string;
    registrationOpen: boolean;
    registrationUrl?: string;
  };
}

export default function HeroSection({
  hero,
  tournament,
}: Readonly<HeroSectionProps>) {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-white sm:min-h-[720px] lg:min-h-[680px]">
      <HeroBackground image={hero.backgroundImage} />
    <div
      className="
        pointer-events-none
        absolute
        left-[-180px]
        top-1/2
        h-[520px]
        w-[520px]
        -translate-y-1/2
        rounded-full
        bg-amber-500/[0.06]
        blur-3xl
      "
    />

    <div
      className="
        pointer-events-none
        absolute
        left-0
        top-0
        h-full
        w-[52%]
        bg-gradient-to-r
        from-white
        via-white/95
        to-transparent
      "
    />
  <div className="relative z-10 mx-auto flex min-h-[680px] max-w-[1280px] items-center px-5 pb-12 pt-40 sm:min-h-[720px] sm:px-8 lg:min-h-[680px] lg:px-10 lg:pb-8 lg:pt-40">
    <div className="w-full lg:w-[54%] lg:translate-x-2 lg:-translate-y-1">
          <HeroContent
            hero={hero}
            tournament={tournament}
          />
        </div>
      </div>
    </section>
  );
}