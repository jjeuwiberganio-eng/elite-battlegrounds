import type { Metadata } from "next";

import {
  getScheduleDays,
  getMatchesByDay,
  getTournamentTeams,
} from "@/actions/schedule";

import PageHeader from "@/components/admin/shared/PageHeader";
import ScheduleDaySelector from "@/components/admin/schedule/ScheduleDaySelector";
import MatchesTable from "@/components/admin/schedule/MatchesTable";
import AddMatchButton from "@/components/admin/schedule/AddMatchButton";

export const metadata: Metadata = {
  title: "Schedule Matches",
};

export const revalidate = 30;

export default async function ScheduleMatchesPage() {
  const days = await getScheduleDays();

  const selectedDay =
    days.find((day) => day.isSelected) ?? days[0] ?? null;

  const [matches, teams] = await Promise.all([
    selectedDay
      ? getMatchesByDay(selectedDay.id)
      : Promise.resolve([]),

    getTournamentTeams(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Schedule Matches"
        description="Manage every match of the selected tournament day."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Schedule",
            href: "/admin/schedule",
          },
          {
            label: "Matches",
          },
        ]}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <ScheduleDaySelector
          days={days}
          selectedDay={selectedDay}
        />

        <AddMatchButton
          day={selectedDay}
        />

      </div>

      <MatchesTable
        day={selectedDay}
        matches={matches}
        teams={teams}
      />

    </div>
  );
}