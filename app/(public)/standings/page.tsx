import type { Metadata } from "next";

import {
  getTournamentControl,
  getStandings,
  getPlayoffQualifiers,
  getTournamentStatistics,
  getRecentMatchResults,
} from "@/actions/standings";

import StandingsHeroSection from "@/components/standings/hero/StandingsHeroSection";
import GroupTabs from "@/components/standings/navigation/GroupTabs";
import StandingsTable from "@/components/standings/table/StandingsTable";
import TournamentStatisticsSection from "@/components/standings/statistics/TournamentStatisticsSection";
import RecentResultsSection from "@/components/standings/results/RecentResultsSection";
import PlayoffQualifiersSection from "@/components/standings/qualifiers/PlayoffQualifiersSection";

export const metadata: Metadata = {
  title: "Standings",
  description:
    "View the official Elite Battlegrounds Series group standings, tournament statistics, recent results, and playoff qualifiers.",
};

export const revalidate = 60;

export default async function StandingsPage() {
  const [
    tournament,
    standings,
    statistics,
    recentResults,
    qualifiers,
  ] = await Promise.all([
    getTournamentControl(),
    getStandings(),
    getTournamentStatistics(),
    getRecentMatchResults(),
    getPlayoffQualifiers(),
  ]);

  return (
    <>
      <StandingsHeroSection
        tournament={tournament}
      />

      <GroupTabs
        groups={standings.groups}
        defaultGroup={standings.defaultGroup}
      />

      <StandingsTable
        standings={standings}
      />

      <TournamentStatisticsSection
        statistics={statistics}
      />

      <RecentResultsSection
        matches={recentResults}
      />

      <PlayoffQualifiersSection
        qualifiers={qualifiers}
        playoffSize={tournament.playoffSize}
      />
    </>
  );
}