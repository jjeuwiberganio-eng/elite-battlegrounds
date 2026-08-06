import {
  Shield,
  Trophy,
  Users,
} from "lucide-react";

import SectionHeader from "@/components/common/SectionHeader";

interface AboutHeroProps {
  title: string;
  description: string;
}

export default function AboutHero({
  title,
  description,
}: Readonly<AboutHeroProps>) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">

      {/* Background Glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-amber-500/10
          blur-3xl
        "
      />

      <div className="container relative z-10">

        <SectionHeader
          align="center"
          badge="About Elite Battlegrounds"
          title={title}
          description={description}
        />

        {/* Highlights */}

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          <article
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              p-8
              text-center
              backdrop-blur-xl
            "
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <Shield className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              Fair Competition
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              Every tournament is organized with clear rules,
              fair officiating, and competitive integrity.
            </p>

          </article>

          <article
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              p-8
              text-center
              backdrop-blur-xl
            "
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <Users className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              Community First
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              We build tournaments that connect players,
              teams, and esports enthusiasts in one community.
            </p>

          </article>

          <article
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              p-8
              text-center
              backdrop-blur-xl
            "
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <Trophy className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              Competitive Excellence
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              From local qualifiers to championship finals,
              every match is designed to showcase the best talent.
            </p>

          </article>

        </div>

      </div>

    </section>
  );
}