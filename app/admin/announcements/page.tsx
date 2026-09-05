import type { Metadata } from "next";

import { getAnnouncements } from "@/actions/announcements";

import AnnouncementManagement from "@/components/admin/announcements/AnnouncementManagement";

export const metadata: Metadata = {
  title: "Announcements",
};

export const revalidate = 0;

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="space-y-6 p-6 lg:p-10">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Announcements
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Manage the site-wide announcement bar. Only one PUBLISHED announcement shows at a time - the most recently published one.
        </p>
      </div>

      <AnnouncementManagement
        announcements={announcements}
      />
    </main>
  );
}
