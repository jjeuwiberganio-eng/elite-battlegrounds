import type { Metadata } from "next";

import {
  getTeams,
  getTournamentControl,
} from "@/actions/teams";

import TeamsOverviewCard from "@/components/admin/teams/TeamsOverviewCard";
import TeamsFilters from "@/components/admin/teams/TeamsFilters";
import TeamsTable from "@/components/admin/teams/TeamsTable";
import AddTeamButton from "@/components/admin/teams/AddTeamButton";

export const metadata: Metadata = {
  title: "Teams",
};

export const revalidate = 30;

export default async function TeamsPage() {
  const [
    tournament,
    teams,
  ] = await Promise.all([
    getTournamentControl(),
    getTeams(),
  ]);

  return (
    <div className="space-y-8">

      <TeamsOverviewCard
        tournament={tournament}
        totalTeams={teams.length}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <TeamsFilters />

        <AddTeamButton />

      </div>

      <TeamsTable
        teams={teams}
      />

    </div>
  );
}