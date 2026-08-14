"use client";

import { useState } from "react";

import ScheduleTabs, {
  type ScheduleTab,
} from "@/components/schedule/navigation/ScheduleTabs";

import GroupStageSection from "@/components/schedule/group-stage/GroupStageSection";

import PlayoffBracketSection from "@/components/schedule/playoffs/PlayoffBracketSection";

interface ScheduleContentProps {
  groupStage: {
    days: {
      id: string;
      title: string;
      date: string;
      matches: {
        id: string;
        matchNumber: number;
        startTime: string;
        bestOf: string;
        streamUrl?: string;

        teamA: {
          id: string;
          name: string;
          logo: string | null;
        };

        teamB: {
          id: string;
          name: string;
          logo: string | null;
        };
      }[];
    }[];
  };

  playoffBracket: {
    upperBracket: {
      id: string;
      round: string;
      teamA: {
        id: string;
        name: string;
        logo: string | null;
      } | null;
      teamB: {
        id: string;
        name: string;
        logo: string | null;
      } | null;
      winner?: string | null;
    }[];

    lowerBracket: {
      id: string;
      round: string;
      teamA: {
        id: string;
        name: string;
        logo: string | null;
      } | null;
      teamB: {
        id: string;
        name: string;
        logo: string | null;
      } | null;
      winner?: string | null;
    }[];

    grandFinals: {
      id: string;
      round: string;
      teamA: {
        id: string;
        name: string;
        logo: string | null;
      } | null;
      teamB: {
        id: string;
        name: string;
        logo: string | null;
      } | null;
      winner?: string | null;
    }[];
  };

  playoffMatches: {
    id: string;
    matchNumber: number;
    roundName: string;
    startTime: string;
    bestOf: string;
    status: string;
    streamUrl?: string;

    teamA: {
      id: string;
      name: string;
      logo: string | null;
    } | null;

    teamB: {
      id: string;
      name: string;
      logo: string | null;
    } | null;
  }[];
}

export default function ScheduleContent({
  groupStage,
  playoffBracket,
  playoffMatches,
}: Readonly<ScheduleContentProps>) {
  const [activeTab, setActiveTab] =
    useState<ScheduleTab>("group-stage");

  return (
    <>
      <ScheduleTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "group-stage" && (
        <GroupStageSection
          days={groupStage.days}
        />
      )}

      {activeTab === "playoffs" && (
        <PlayoffBracketSection
          bracket={playoffBracket}
          upcomingMatches={playoffMatches}
        />
      )}
    </>
  );
}