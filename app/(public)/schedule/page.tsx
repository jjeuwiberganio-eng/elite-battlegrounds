import type { Metadata } from "next";

import {
  getTournamentControl,
  getGroupStageSchedule,
  getPlayoffBracket,
} from "@/actions/schedule";

import ScheduleHeroSection from "@/components/schedule/hero/ScheduleHeroSection";
import ScheduleTabs from "@/components/schedule/navigation/ScheduleTabs";
import GroupStageSection from "@/components/schedule/group-stage/GroupStageSection";
import PlayoffBracketSection from "@/components/schedule/playoffs/PlayoffBracketSection";

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
  ] = await Promise.all([
    getTournamentControl(),
    getGroupStageSchedule(),
    getPlayoffBracket(),
  ]);

  return (
    <>
      <ScheduleHeroSection
        tournament={tournament}
      />

      <ScheduleTabs
        defaultTab="group-stage"
      />

      <GroupStageSection
        days={groupStage.days}
      />

      <PlayoffBracketSection
        bracket={playoffBracket}
        playoffSize={tournament.playoffSize}
      />
    </>
  );
}