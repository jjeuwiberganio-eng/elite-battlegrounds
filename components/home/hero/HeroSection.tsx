import Image from "next/image";

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
    <section className="relative isolate overflow-hidden bg-white lg:min-h-[680px]">
      {/*
        Desktop: full-bleed artwork behind the typography.
        Hidden on mobile, where the artwork gets its own compact panel below
        instead (object-cover object-center used to crop straight past the
        emblem, which sits on the left of hero-bg.jpg).
      */}
      <div className="hidden lg:block">
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
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          max-w-[1280px]
          flex-col
          px-5
          pb-10
          pt-32
          sm:px-8
          sm:pt-36
          lg:min-h-[680px]
          lg:flex-row
          lg:items-center
          lg:px-10
          lg:pb-8
          lg:pt-40
        "
      >
        <div className="w-full lg:w-[54%] lg:translate-x-2 lg:-translate-y-1">
          <HeroContent hero={hero} tournament={tournament} />
        </div>

        {/* Mobile-only compact emblem panel */}
        <div
          className="
            relative
            mt-8
            aspect-[16/10]
            w-full
            overflow-hidden
            rounded-2xl
            sm:aspect-[16/9]
            lg:hidden
          "
        >
          <Image
            src={hero.backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-left"
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-white
              via-transparent
              to-transparent
            "
          />
        </div>
      </div>
    </section>
  );
}