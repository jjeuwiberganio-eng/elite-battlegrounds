import { History } from "lucide-react";

import TeamLogo from "@/components/common/TeamLogo";

interface RecentMatchResult {
  id: string;
  teamA: {
    id: string;
    name: string;
    logo: string | null;
    score: number;
  };
  teamB: {
    id: string;
    name: string;
    logo: string | null;
    score: number;
  };
  completedAt: string;
}

interface RecentResultsSectionProps {
  matches: RecentMatchResult[];
}

export default function RecentResultsSection({
  matches,
}: Readonly<RecentResultsSectionProps>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 ring-1 ring-amber-200">
            <History className="h-4 w-4" />
          </div>

          <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">
            Recent Match Results
          </h2>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-400">
          No completed matches yet.
        </div>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => {
            const teamAWon =
              match.teamA.score >
              match.teamB.score;

            const teamBWon =
              match.teamB.score >
              match.teamA.score;

            const playedAt = match.completedAt
              ? new Date(
                  match.completedAt,
                ).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                )
              : "";

            return (
              <div
                key={match.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm transition-colors hover:border-amber-200 hover:bg-amber-50/40"
              >
                <div
                  className={`flex min-w-0 flex-1 items-center gap-2 ${
                    teamAWon
                      ? "font-bold text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  <TeamLogo
                    src={match.teamA.logo}
                    alt={match.teamA.name}
                    size="sm"
                  />

                  <span className="truncate uppercase">
                    {match.teamA.name}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 font-black text-slate-900 shadow-sm ring-1 ring-slate-200/70">
                  <span
                    className={
                      teamAWon
                        ? "text-amber-500"
                        : ""
                    }
                  >
                    {match.teamA.score}
                  </span>

                  <span className="text-slate-300">
                    -
                  </span>

                  <span
                    className={
                      teamBWon
                        ? "text-amber-500"
                        : ""
                    }
                  >
                    {match.teamB.score}
                  </span>
                </div>

                <div
                  className={`flex min-w-0 flex-1 items-center justify-end gap-2 text-right ${
                    teamBWon
                      ? "font-bold text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  <span className="truncate uppercase">
                    {match.teamB.name}
                  </span>

                  <TeamLogo
                    src={match.teamB.logo}
                    alt={match.teamB.name}
                    size="sm"
                  />
                </div>

                <span className="hidden shrink-0 text-[11px] text-slate-400 sm:block">
                  {playedAt}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}