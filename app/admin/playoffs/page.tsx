import type { Metadata } from "next";

import {
  getTournamentControl,
  getPlayoffTeams,
  getPlayoffQualifierEditor,
} from "@/actions/playoffs";

import ClearAllQualifiersButton from "@/components/admin/playoffs/ClearAllQualifiersButton";
import PageHeader from "@/components/admin/shared/PageHeader";
import QualifiedTeamsCard from "@/components/admin/playoffs/QualifiedTeamsCard";
import PlayoffSizeEditor from "@/components/admin/playoffs/PlayoffSizeEditor";

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
    qualifierEditor,
  ] = await Promise.all([
    getTournamentControl(),
    getPlayoffTeams(),
    getPlayoffQualifierEditor(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Playoff Management"
        description="Choose the top teams from each group that qualify for the playoffs."
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
          {tournament.playoffSize} teams qualify:{" "}
          {qualifierEditor.perGroup} from each of the{" "}
          {qualifierEditor.groups.length} groups. Pick who holds
          each place below.
        </p>

        <PlayoffSizeEditor
          currentSize={
            tournament.playoffSize
          }
        />
      </div>

      <ClearAllQualifiersButton />

      <QualifiedTeamsCard
        /*
         * Remount when the saved qualifiers change (saved here, or
         * cleared elsewhere) so the editor never shows stale picks.
         */
        key={JSON.stringify(qualifierEditor.assignments)}
        teams={playoffTeams}
        groups={qualifierEditor.groups}
        perGroup={qualifierEditor.perGroup}
        playoffSize={tournament.playoffSize}
        evenSplit={qualifierEditor.evenSplit}
        assignments={qualifierEditor.assignments}
      />
    </div>
  );
}