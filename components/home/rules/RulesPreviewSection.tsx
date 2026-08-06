import Link from "next/link";

import RulePreviewCard from "./RulePreviewCard";

interface Rule {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface RulesPreviewSectionProps {
  rules: Rule[];
}

export default function RulesPreviewSection({
  rules,
}: Readonly<RulesPreviewSectionProps>) {
  const previewRules = rules.slice(0, 4);

  return (
    <section className="bg-slate-900 py-20">

      <div className="container">

        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
              Tournament Rules
            </span>

            <h2 className="mt-5 text-4xl font-black text-white md:text-5xl">
              Play Fair.
              <br />
              Compete With Integrity.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Every participant is expected to follow the official
              Elite Battlegrounds Series tournament rules to ensure
              a fair, competitive, and enjoyable experience.
            </p>

          </div>

          <Link
            href="/rules"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              border
              border-amber-500
              px-6
              py-3
              font-semibold
              text-amber-400
              transition-all
              duration-200
              hover:bg-amber-500
              hover:text-slate-950
            "
          >
            View All Rules
          </Link>

        </div>

        {previewRules.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">

            {previewRules.map((rule) => (
              <RulePreviewCard
                key={rule.id}
                rule={rule}
              />
            ))}

          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700 py-20 text-center">

            <h3 className="text-2xl font-bold text-white">
              Rules Coming Soon
            </h3>

            <p className="mt-4 text-slate-400">
              Tournament rules will be published before
              registration opens.
            </p>

          </div>
        )}

      </div>

    </section>
  );
}