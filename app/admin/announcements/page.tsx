import type { Metadata } from "next";

import {
  getAnnouncements,
  getAnnouncementStatistics,
} from "@/actions/announcements";

import PageHeader from "@/components/admin/shared/PageHeader";
import AnnouncementOverviewCard from "@/components/admin/announcements/AnnouncementOverviewCard";
import AnnouncementTable from "@/components/admin/announcements/AnnouncementTable";
import AddAnnouncementButton from "@/components/admin/announcements/AddAnnouncementButton";
import AnnouncementFilter from "@/components/admin/announcements/AnnouncementFilter";

export const metadata: Metadata = {
  title: "Announcements",
};

export const revalidate = 30;

export default async function AnnouncementsPage() {
  const [
    announcements,
    statistics,
  ] = await Promise.all([
    getAnnouncements(),
    getAnnouncementStatistics(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Announcements"
        description="Manage every announcement displayed throughout the tournament website."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Announcements",
          },
        ]}
      />

      <AnnouncementOverviewCard
        statistics={statistics}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <AnnouncementFilter />

        <AddAnnouncementButton />

      </div>

      <AnnouncementTable
        announcements={announcements}
      />

    </div>
  );
}