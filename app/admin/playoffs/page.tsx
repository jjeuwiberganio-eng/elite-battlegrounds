import type { Metadata } from "next";

import {
  getTournamentControl,
  getPlayoffBracket,
  getQualifiedTeams,
} from "@/actions/playoffs";

import PageHeader from "@/components/admin/shared/PageHeader";
import PlayoffSettingsCard from "@/components/admin/playoffs/PlayoffSettingsCard";
import QualifiedTeamsCard from "@/components/admin/playoffs/QualifiedTeamsCard";
import BracketEditor from "@/components/admin/playoffs/BracketEditor";
import GenerateBracketButton from "@/components/admin/playoffs/GenerateBracketButton";

export const metadata: Metadata = {
  title: "Playoffs",
};

export const revalidate = 30;

export default async function PlayoffsPage() {
  const [
    tournament,
    bracket,
    qualifiedTeams,
  ] = await Promise.all([
    getTournamentControl(),
    getPlayoffBracket(),
    getQualifiedTeams(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Playoff Bracket"
        description="Manage the Double Elimination Playoffs."
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

      <div className="grid gap-6 xl:grid-cols-2">

        <PlayoffSettingsCard
          tournament={tournament}
        />

        <QualifiedTeamsCard
          teams={qualifiedTeams}
        />

      </div>

      <GenerateBracketButton
        playoffSize={tournament.playoffSize}
      />

      <BracketEditor
        bracket={bracket}
      />

    </div>
  );
}