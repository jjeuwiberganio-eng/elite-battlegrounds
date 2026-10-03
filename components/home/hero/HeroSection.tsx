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
      {/*
        Right-side artwork. Same width and crop as before (440px from
        1024-1279px, 560px from 1280px up, object-left so the emblem shows),
        but now anchored to the SECTION itself (the true edge of the browser
        window) instead of the 1280px content container - so on wide
        screens it reaches the real right edge instead of stopping short
        and leaving a gap.

        top-[110px] keeps it clear of the floating navbar (nav is ~110px
        tall) so the emblem never pokes up behind the nav links - simpler
        and more robust than trying to mask/fade that area, and avoids the
        drift problem from anchoring it to the raw viewport for its
        left-right position (it isn't - only its right edge is
        viewport-relative; its width is a fixed, already-calibrated value).
      */}
      <div className="pointer-events-none absolute right-0 top-[110px] bottom-0 hidden w-[440px] overflow-hidden lg:block xl:w-[560px]">
        <Image
          src={hero.backgroundImage}
          alt=""
          fill
          priority
          sizes="560px"
          className="object-cover object-left"
        />

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
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