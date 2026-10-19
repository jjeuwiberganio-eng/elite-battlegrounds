import type { Metadata } from "next";

import {
  getTournamentControl,
  getGroupStageSchedule,
  getPlayoffBracket,
  getUpcomingPlayoffMatches,
} from "@/actions/schedule";

import ScheduleHeroSection from "@/components/schedule/hero/ScheduleHeroSection";
import ScheduleContent from "@/components/schedule/ScheduleContent";

export const metadata: Metadata = {
  title: "Schedule",
  description:
    "View the official Elite Battlegrounds Series tournament schedule including Group Stage matches and the Double Elimination Playoff Bracket.",
};

export const revalidate = 60;

export default async function SchedulePage() {
  const [
    tournament,
    groupStage,
    playoffBracket,
    playoffMatches,
  ] = await Promise.all([
    getTournamentControl(),
    getGroupStageSchedule(),
    getPlayoffBracket(),
    getUpcomingPlayoffMatches(),
  ]);

return (
 <div>

    <ScheduleHeroSection
      tournament={tournament}
    />

    <ScheduleContent
      groupStage={groupStage}
      playoffBracket={playoffBracket}
      playoffMatches={playoffMatches}
    />
  </div>
);
}