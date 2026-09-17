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
    <section className="bg-slate-50 py-8 sm:py-16 lg:py-20">
        <div className="w-full px-4 sm:px-8">

        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">

          <div>
            <div className="mb-2 flex items-center gap-3 sm:mb-3">
              <span className="h-px w-6 bg-amber-500 sm:w-8" />

              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-600 sm:text-xs sm:tracking-[0.2em]">
                Tournament Rules
              </span>
            </div>

            <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Play Fair.
              <br />
              Compete With Integrity.
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:mt-4 sm:text-sm sm:leading-6 lg:text-base">
              Every participant is expected to follow the official
              Elite Battlegrounds Series tournament rules to ensure
              a fair, competitive, and enjoyable experience.
            </p>
          </div>

          <Link
            href="/rules"
            className="
              inline-flex
              min-h-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              py-2.5
              text-xs
              font-black
              uppercase
              tracking-wide
              text-slate-900
              transition
              hover:border-amber-500
              hover:bg-amber-400
              sm:min-h-0
              sm:px-5
              sm:py-3
              sm:text-sm
            "
          >
            View All Rules
          </Link>
        </div>

        {/* Rules */}
        {previewRules.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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