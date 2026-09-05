import type { Metadata } from "next";

import {
  getScheduleDays,
} from "@/actions/schedule-days";

import PageHeader from "@/components/admin/shared/PageHeader";
import ScheduleDayCard from "@/components/admin/schedule/ScheduleDayCard";
import AddScheduleDayButton from "@/components/schedule/AddScheduleDayButton";

export const metadata: Metadata = {
  title: "Schedule Days",
};

export const revalidate = 30;

export default async function ScheduleDaysPage() {
  const days = await getScheduleDays();

  return (
    <div className="space-y-8">

      <PageHeader
        title="Schedule Days"
        description="Manage tournament days and control which schedule is visible to the public."
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
            label: "Days",
          },
        ]}
      />

      <div className="flex justify-end">
        <AddScheduleDayButton />
      </div>

      <div className="grid gap-6">

        {days.map((day) => (
          <ScheduleDayCard
            key={day.id}
            day={day}
          />
        ))}

      </div>

    </div>
  );
}