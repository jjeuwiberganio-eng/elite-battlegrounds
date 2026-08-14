import type { Metadata } from "next";

import {
  getTournamentControl,
  getPlayoffTeams,
  getQualifiedTeams,
} from "@/actions/playoffs";

import PageHeader from "@/components/admin/shared/PageHeader";
import QualifiedTeamsCard from "@/components/admin/playoffs/QualifiedTeamsCard";

export const metadata: Metadata = {
  title: "Playoffs",
  description:
    "Select and manage the teams that qualify for the playoffs.",
};

export const revalidate = 30;

export default async function PlayoffsPage() {
  const [
    tournament,
    playoffTeams,
    qualifiedTeams,
  ] = await Promise.all([
    getTournamentControl(),
    getPlayoffTeams(),
    getQualifiedTeams(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Playoff Management"
        description="Manually select the teams that will participate in the playoff bracket."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Playoffs",
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
          Select exactly {tournament.playoffSize} approved
          teams and assign each team a playoff seed.
        </p>

        <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
          Playoff Size:
          <span className="ml-1 text-amber-400">
            {tournament.playoffSize} Teams
          </span>
        </div>
      </div>

      <QualifiedTeamsCard
        teams={playoffTeams}
        qualifiedTeams={qualifiedTeams}
        playoffSize={tournament.playoffSize}
      />
    </div>
  );
}