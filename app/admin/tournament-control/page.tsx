import type { Metadata } from "next";

import {
  getTournamentControl,
  getTournamentStatistics,
} from "@/actions/tournament-control";

import TournamentOverviewCard from "@/components/admin/tournament-control/TournamentOverviewCard";
import TournamentSettingsCard from "@/components/admin/tournament-control/TournamentSettingsCard";
import TournamentPhaseCard from "@/components/admin/tournament-control/TournamentPhaseCard";
import PlayoffSettingsCard from "@/components/admin/tournament-control/PlayoffSettingsCard";
import SchedulePublishingCard from "@/components/admin/tournament-control/SchedulePublishingCard";
import LivestreamControlCard from "@/components/admin/tournament-control/LivestreamControlCard";
import TournamentStatisticsCard from "@/components/admin/tournament-control/TournamentStatisticsCard";

export const metadata: Metadata = {
  title: "Tournament Control",
};

export const revalidate = 30;

export default async function TournamentControlPage() {
  const [tournament, statistics] = await Promise.all([
    getTournamentControl(),
    getTournamentStatistics(),
  ]);

  return (
    <div className="space-y-8">

      <TournamentOverviewCard
        tournament={tournament}
      />

      <div className="grid gap-6 xl:grid-cols-2">

        <TournamentSettingsCard
          tournament={tournament}
        />

        <TournamentPhaseCard
          tournament={tournament}
        />

        <PlayoffSettingsCard
          tournament={tournament}
        />

        <SchedulePublishingCard
          tournament={tournament}
        />

        <LivestreamControlCard
          tournament={tournament}
        />

        <TournamentStatisticsCard
          statistics={statistics}
        />

      </div>

    </div>
  );
}