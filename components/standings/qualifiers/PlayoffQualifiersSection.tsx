import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";

import TeamLogo from "@/components/common/TeamLogo";

interface PlayoffQualifier {
  seed: number;
  team: {
    id: string;
    name: string;
    logo: string | null;
  };
  groupName: string;
}

interface PlayoffQualifiersSectionProps {
  qualifiers: PlayoffQualifier[];
  playoffSize: number;
}

export default function PlayoffQualifiersSection({
  qualifiers,
  playoffSize,
}: Readonly<PlayoffQualifiersSectionProps>) {
  const slots = Array.from(
    { length: playoffSize },
    (_, index) => {
      const seed = index + 1;

      return (
        qualifiers.find(
          (qualifier) =>
            qualifier.seed === seed,
        ) ?? null
      );
    },
  );

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
      <div className="mb-1 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 ring-1 ring-amber-200">
          <Trophy className="h-4 w-4" />
        </div>

        <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">
          Playoff Qualifiers
        </h2>
      </div>

      <p className="mb-5 text-xs text-slate-500">
        Top {playoffSize} teams advance to
        the Playoffs.
      </p>

      <div className="space-y-2">
        {slots.map((qualifier, index) => {
          const seed = index + 1;

          return (
            <div
              key={seed}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                qualifier
                  ? "border-amber-300 bg-white hover:border-amber-400 hover:bg-amber-50/40"
                  : "border-slate-100 bg-white/60"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${
                  seed === 1
                    ? "bg-gradient-to-br from-amber-300 to-amber-600 shadow-md shadow-amber-500/40 ring-2 ring-amber-200"
                    : qualifier
                      ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm ring-2 ring-amber-200/70"
                      : "bg-slate-300"
                }`}
              >
                {seed}
              </span>

              {qualifier ? (
                <>
                  <TeamLogo
                    src={qualifier.team.logo}
                    alt={qualifier.team.name}
                    size="sm"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold uppercase text-slate-900">
                      {qualifier.team.name}
                    </p>

                    <p className="truncate text-[11px] text-slate-400">
                      {qualifier.groupName}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  TBD
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-1 border-t border-amber-200/70 pt-4 text-xs text-slate-500">
        <p>
          Playoff format:{" "}
          <span className="font-semibold text-slate-700">
            Double Elimination
          </span>
        </p>

        <p>
          Playoff teams:{" "}
          <span className="font-semibold text-slate-700">
            Top {playoffSize}
          </span>
        </p>
      </div>

      <Link
        href="/schedule?tab=playoffs"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-amber-500 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-amber-600 transition-all hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/30"
      >
        View Playoff Bracket
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}