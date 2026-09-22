import Image from "next/image";

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
          pt-8
          sm:px-8
          sm:pt-10
          lg:min-h-[680px]
          lg:flex-row
          lg:items-center
          lg:px-10
          lg:pb-8
          lg:pt-40
        "
      >
        {/*
          Desktop artwork - a fixed-size box docked to this SAME 1280px
          container's own right edge (not the full browser window). Anchoring
          it to the container the text also lives in means their relative
          positions never drift apart, at any screen width from 1024px up to
          a 4K monitor - unlike a full-bleed image positioned via the raw
          viewport width, which requires the emblem to be masked with math
          that only holds at one specific width.
        */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[440px] overflow-hidden lg:block xl:w-[560px]">
          <Image
            src={hero.backgroundImage}
            alt=""
            fill
            priority
            sizes="560px"
            className="object-cover object-left"
          />

          {/* Soft fade on this box's own left edge, blending into the white
              page background - no longer needs to track the text's position
              at all, since the box itself is already placed safely clear
              of the text column. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
        </div>

        <div
          className="
            pointer-events-none
            absolute
            left-[-180px]
            top-1/2
            hidden
            h-[520px]
            w-[520px]
            -translate-y-1/2
            rounded-full
            bg-amber-500/[0.06]
            blur-3xl
            lg:block
          "
        />

        <div className="relative z-10 w-full lg:w-[54%] lg:translate-x-2 lg:-translate-y-1">
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