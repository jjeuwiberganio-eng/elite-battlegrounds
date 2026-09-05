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

      <section className="bg-white pb-16 pt-10">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
            <div>
              <GroupTabs
                groups={standings.groups}
                defaultGroup={
                  standings.defaultGroup
                }
              />

              <StandingsTable
                standings={standings}
              />
            </div>

            <PlayoffQualifiersSection
              qualifiers={qualifiers}
              playoffSize={
                tournament.playoffSize
              }
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
            <TournamentStatisticsSection
              statistics={statistics}
            />

            <RecentResultsSection
              matches={recentResults}
            />
          </div>
        </div>
      </section>
    </>
  );
}