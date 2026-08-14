import type { Metadata } from "next";

import {
  getPlayoffBracket,
  getPlayoffTeams,
  getTournamentControl,
  rebuildCurrentPlayoffBracketStructure,
} from "@/actions/playoffs";

import RebuildBracketButton from "@/components/admin/playoffs/RebuildBracketButton";
import BracketBoard from "@/components/admin/playoffs/BracketBoard";
import PageHeader from "@/components/admin/shared/PageHeader";
import CreateBracketButton from "@/components/admin/playoffs/CreateBracketButton";

export const metadata: Metadata = {
  title: "Bracket Management",
  description:
    "Manually manage the Elite Battlegrounds playoff bracket.",
};

export const revalidate = 30;

export default async function PlayoffBracketPage() {
const [tournament, bracket, playoffTeams] =
    await Promise.all([
      getTournamentControl(),
      getPlayoffBracket(),
      getPlayoffTeams(),
    ]);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bracket Management"
        description="Manually manage the playoff bracket, team assignments, scores, and winners."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Playoffs",
            href: "/admin/playoffs",
          },
          {
            label: "Bracket",
          },
        ]}
      />

      <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
          Super Admin
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          {tournament.name}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          This bracket is completely manual. Teams, scores,
          winners, and bracket movement are controlled by the
          Super Admin.
        </p>
      </div>

      {!bracket ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <h3 className="text-xl font-bold text-white">
            No Playoff Bracket
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Create the initial blank playoff bracket. Teams
            will not be assigned automatically.
          </p>

          <div className="mt-5">
            <CreateBracketButton />
          </div>
        </div>
  ) : (
    <>
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Current Bracket
            </p>

            <h3 className="mt-1 text-xl font-bold text-white">
              {bracket.name}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {bracket.slots.length} bracket slots configured.
            </p>
          </div>

    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-400">
        Bracket Created
      </div>

      <RebuildBracketButton />
    </div>
        </div>
      </div>

      <BracketBoard
      slots={bracket.slots}
      teams={playoffTeams}
    />
    </>
  )}
</div>
);
}