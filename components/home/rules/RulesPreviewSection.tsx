import Link from "next/link";
import RulePreviewCard from "./RulePreviewCard";

interface Rule {
  title: string;
  description: string;
  icon: string;
}

interface RulesPreviewSectionProps {
  rules: Rule[];
}

export default function RulesPreviewSection({
  rules,
}: Readonly<RulesPreviewSectionProps>) {
  const previewRules = rules.slice(0, 4);

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
        <div className="w-full px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-amber-500" />

              <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">
                Tournament Rules
              </span>
            </div>

            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 sm:text-4xl">
              Play Fair.
              <br />
              Compete With Integrity.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Every participant is expected to follow the official
              Elite Battlegrounds Series tournament rules to ensure
              a fair, competitive, and enjoyable experience.
            </p>
          </div>

          <Link
            href="/rules"
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-300
              bg-white
              px-5
              py-3
              text-sm
              font-black
              uppercase
              tracking-wide
              text-slate-900
              transition
              hover:border-amber-500
              hover:bg-amber-400
            "
          >
            View All Rules
          </Link>
        </div>

        {/* Rules */}
        {previewRules.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {previewRules.map((rule, index) => (
              <RulePreviewCard
                key={`${rule.title}-${index}`}
                rule={rule}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-black uppercase text-slate-900">
              Rules Coming Soon
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Tournament rules will be published before
              registration opens.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}