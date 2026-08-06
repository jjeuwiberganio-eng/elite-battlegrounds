import type { Metadata } from "next";

import {
  getStandings,
  getTournamentControl,
  getStandingsStatistics,
} from "@/actions/standings";

import PageHeader from "@/components/admin/shared/PageHeader";
import GroupSelector from "@/components/admin/standings/GroupSelector";
import AdminStandingsTable from "@/components/admin/standings/AdminStandingsTable";
import StandingsStatisticsCard from "@/components/admin/standings/StandingsStatisticsCard";
import RecalculateStandingsButton from "@/components/admin/standings/RecalculateStandingsButton";

export const metadata: Metadata = {
  title: "Standings",
};

export const revalidate = 30;

export default async function AdminStandingsPage() {
  const [
    tournament,
    standings,
    statistics,
  ] = await Promise.all([
    getTournamentControl(),
    getStandings(),
    getStandingsStatistics(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Standings"
        description="Review automatic group standings generated from completed match results."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Standings",
          },
        ]}
      />

      <StandingsStatisticsCard
        statistics={statistics}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <GroupSelector
          groups={standings.groups}
          selectedGroup={standings.defaultGroup}
        />

        <RecalculateStandingsButton />

      </div>

      <AdminStandingsTable
        standings={standings}
        playoffSize={tournament.playoffSize}
      />

    </div>
  );
}