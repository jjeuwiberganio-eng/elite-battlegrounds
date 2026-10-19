import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";

import TeamLogo from "@/components/common/TeamLogo";

interface QualifierSlot {
  rank: number;
  team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
}

interface QualifierGroup {
  id: string;
  name: string;
  slots: QualifierSlot[];
}

interface PlayoffQualifiersSectionProps {
  groups: QualifierGroup[];
  playoffSize: number;
}

function rankBadgeClassName(rank: number, filled: boolean) {
  if (!filled) {
    return "bg-slate-200 text-slate-400";
  }

  switch (rank) {
    case 1:
      return "bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-md shadow-amber-500/40 ring-2 ring-amber-200";
    case 2:
      return "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm ring-2 ring-slate-200";
    case 3:
      return "bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-sm ring-2 ring-orange-200";
    default:
      return "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm ring-2 ring-amber-200/70";
  }
}

export default function PlayoffQualifiersSection({
  groups,
  playoffSize,
}: Readonly<PlayoffQualifiersSectionProps>) {
  const perGroup = groups[0]?.slots.length ?? 0;

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
        {perGroup > 0
          ? `Top ${perGroup} of each group advance to the Playoffs.`
          : `Top ${playoffSize} teams advance to the Playoffs.`}
      </p>

      {groups.length === 0 ? (
        <p className="rounded-xl border border-slate-100 bg-white/60 px-4 py-6 text-center text-sm font-semibold uppercase tracking-wide text-slate-400">
          TBD
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {groups.map((group) => (
            <section key={group.id}>
              <h3 className="mb-2 flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] text-amber-700">
                {group.name}

                <span className="h-px flex-1 bg-amber-200/70" />
              </h3>

              <div className="space-y-2">
                {group.slots.map((slot) => (
                  <div
                    key={slot.rank}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                      slot.team
                        ? "border-amber-300 bg-white hover:border-amber-400 hover:bg-amber-50/40"
                        : "border-slate-100 bg-white/60"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${rankBadgeClassName(
                        slot.rank,
                        slot.team !== null,
                      )}`}
                    >
                      {slot.rank}
                    </span>

                    {slot.team ? (
                      <>
                        <TeamLogo
                          src={slot.team.logo}
                          alt={slot.team.name}
                          size="sm"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold uppercase text-slate-900">
                            {slot.team.name}
                          </p>

                          <p className="truncate text-[11px] text-slate-400">
                            Top {slot.rank} · {group.name}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                          TBD
                        </p>

                        <p className="truncate text-[11px] text-slate-300">
                          Top {slot.rank} · {group.name}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

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
