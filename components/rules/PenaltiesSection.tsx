import {
  AlertTriangle,
  ShieldAlert,
  Ban,
} from "lucide-react";

export interface PenaltyCategory {
  id: string;
  severity: "minor" | "major" | "severe";
  title: string;
  description: string;
  examples: string[];
}

interface PenaltiesSectionProps {
  penalties: PenaltyCategory[];
}

const severityConfig = {
  minor: {
    title: "Minor Violations",
    icon: AlertTriangle,
    badge: "Warning",
    iconClass: "text-amber-400",
    badgeClass:
      "bg-amber-500/10 border-amber-500/30 text-amber-400",
  },

  major: {
    title: "Major Violations",
    icon: ShieldAlert,
    badge: "Match Penalty",
    iconClass: "text-orange-400",
    badgeClass:
      "bg-orange-500/10 border-orange-500/30 text-orange-400",
  },

  severe: {
    title: "Severe Violations",
    icon: Ban,
    badge: "Disqualification",
    iconClass: "text-red-400",
    badgeClass:
      "bg-red-500/10 border-red-500/30 text-red-400",
  },
} as const;

export default function PenaltiesSection({
  penalties,
}: Readonly<PenaltiesSectionProps>) {
  return (
    <section className="bg-slate-950 py-24">

      <div className="container">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-red-400">
            Penalties
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Violations & Consequences
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Tournament penalties are applied fairly and consistently
            to preserve competitive integrity and provide an enjoyable
            experience for every participant.
          </p>

        </div>

        <div className="space-y-8">

          {penalties.map((penalty) => {
            const config =
              severityConfig[penalty.severity];

            const Icon = config.icon;

            return (
              <article
                key={penalty.id}
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.05]
                  p-8
                  backdrop-blur-xl
                "
              >
                <div className="flex flex-wrap items-start justify-between gap-6">

                  <div className="flex gap-5">

                    <div
                      className={[
                        "flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5",
                        config.iconClass,
                      ].join(" ")}
                    >
                      <Icon className="h-8 w-8" />
                    </div>

                    <div>

                      <h3 className="text-2xl font-bold text-white">
                        {penalty.title}
                      </h3>

                      <p className="mt-3 leading-7 text-slate-400">
                        {penalty.description}
                      </p>

                    </div>

                  </div>

                  <span
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-wider",
                      config.badgeClass,
                    ].join(" ")}
                  >
                    {config.badge}
                  </span>

                </div>

                <div className="mt-8">

                  <h4 className="text-sm uppercase tracking-widest text-slate-400">
                    Common Examples
                  </h4>

                  <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-300">

                    {penalty.examples.map((example) => (
                      <li key={example}>
                        {example}
                      </li>
                    ))}

                  </ul>

                </div>

              </article>
            );
          })}

        </div>

      </div>

    </section>
  );
}