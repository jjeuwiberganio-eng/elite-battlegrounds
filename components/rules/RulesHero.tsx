import {
  ShieldCheck,
  Scale,
  Trophy,
} from "lucide-react";

import SectionHeader from "@/components/common/SectionHeader";

interface RulesHeroProps {
  title: string;
  description: string;
}

export default function RulesHero({
  title,
  description,
}: Readonly<RulesHeroProps>) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">

      {/* Background Glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[520px]
          w-[520px]
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
          badge="Official Tournament Rules"
          title={title}
          description={description}
        />

        {/* Rule Highlights */}

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
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-amber-500/40
            "
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              Fair Play
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              Every player is expected to compete honestly,
              respect opponents, and uphold the integrity of
              the tournament.
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
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-amber-500/40
            "
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <Scale className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              Consistent Enforcement
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              Tournament officials apply the same rules and
              penalties equally to all participating teams.
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
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-amber-500/40
            "
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <Trophy className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              Competitive Integrity
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              Every match is conducted under official tournament
              procedures to ensure a professional esports
              experience.
            </p>

          </article>

        </div>

      </div>

    </section>
  );
}