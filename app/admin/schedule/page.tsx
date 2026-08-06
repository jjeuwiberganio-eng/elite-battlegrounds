import type { Metadata } from "next";

import {
  getScheduleOverview,
  getScheduleDays,
} from "@/actions/schedule";

import ScheduleOverviewCard from "@/components/admin/schedule/ScheduleOverviewCard";
import ScheduleDaysTable from "@/components/admin/schedule/ScheduleDaysTable";
import AddScheduleDayButton from "@/components/admin/schedule/AddScheduleDayButton";
import ScheduleFilters from "@/components/admin/schedule/ScheduleFilters";

export const metadata: Metadata = {
  title: "Schedule Management",
};

export const revalidate = 30;

export default async function ScheduleManagementPage() {
  const [
    overview,
    days,
  ] = await Promise.all([
    getScheduleOverview(),
    getScheduleDays(),
  ]);

  return (
    <div className="space-y-8">

      <ScheduleOverviewCard
        overview={overview}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <ScheduleFilters />

        <AddScheduleDayButton />

      </div>

      <ScheduleDaysTable
        days={days}
      />

    </div>
  );
}