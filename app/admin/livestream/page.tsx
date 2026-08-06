import type { Metadata } from "next";

import {
  getLivestreamSettings,
  getLivestreamHistory,
} from "@/actions/livestream";

import PageHeader from "@/components/admin/shared/PageHeader";
import LivestreamControlCard from "@/components/admin/livestream/LivestreamControlCard";
import LivestreamPreviewCard from "@/components/admin/livestream/LivestreamPreviewCard";
import LivestreamHistoryTable from "@/components/admin/livestream/LivestreamHistoryTable";

export const metadata: Metadata = {
  title: "Livestream",
};

export const revalidate = 15;

export default async function LivestreamPage() {
  const [
    livestream,
    history,
  ] = await Promise.all([
    getLivestreamSettings(),
    getLivestreamHistory(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Livestream"
        description="Control the LIVE button and tournament livestream shown on the public website."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Livestream",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-2">

        <LivestreamControlCard
          livestream={livestream}
        />

        <LivestreamPreviewCard
          livestream={livestream}
        />

      </div>

      <LivestreamHistoryTable
        history={history}
      />

    </div>
  );
}