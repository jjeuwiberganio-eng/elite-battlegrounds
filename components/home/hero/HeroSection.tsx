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
        Desktop artwork - genuinely full-bleed this time: a direct child of
        the SECTION (not the padded 1280px content container below), so its
        width is a percentage of the real browser viewport, not of the
        content column. w-[150%] anchored to the section's own right-0 means
        the image always reaches the true right edge of the browser, at any
        width, with 50% extra width bleeding off-screen to the left (clipped
        by overflow-hidden) - that overflow is what keeps the tournament
        emblem (which sits in the source image's left portion) permanently
        cropped out of view, leaving just the abstract light-streak artwork
        visible behind the text. Verified with real Chromium screenshots
        from 1024px up to 3440px ultrawide.
      */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[150%] overflow-hidden lg:block">
        <Image
          src={hero.backgroundImage}
          alt=""
          fill
          priority
          sizes="150vw"
          className="object-cover object-[right_center]"
        />
      </div>

      {/*
        Left cover - solid white, matching the page background, for
        everything to the left of where the centered 1280px content
        container begins. Sized from the same 1280px constant the container
        itself uses, so it only ever appears once the viewport is wider than
        the container (exactly when the full-bleed image above would
        otherwise show raw, unmasked artwork in that dead zone).
      */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden bg-white lg:block"
        style={{ width: "max(0px, calc((100% - 1280px) / 2))" }}
      />

      {/*
        Readability gradient - anchored INSIDE the same 1280px container the
        text uses (not a raw percentage of the viewport), so it always
        tracks the text column no matter how wide the browser window is.
        This is the lesson from the previous full-bleed attempt: the mask
        and the text must share one coordinate system, or they drift apart
        at different widths.
      */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-full max-w-[1280px] lg:mx-auto lg:block">
        <div className="absolute inset-y-0 left-0 w-[64%] bg-gradient-to-r from-white from-0% via-white via-[58%] to-transparent" />
      </div>

      {/*
        Top fade - full section width (not confined to the 1280px content
        container), covering roughly the Navbar's own height (h-40 matches
        the lg:pt-40 used below). The floating Navbar uses a WIDER max-w-1500
        container than this content column's max-w-1280, so without this the
        artwork could still show unmasked directly behind the nav's
        rightmost links on some window widths. This keeps that whole band
        consistently light regardless of horizontal position.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-white from-0% via-white/60 via-[55%] to-transparent lg:block" />

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