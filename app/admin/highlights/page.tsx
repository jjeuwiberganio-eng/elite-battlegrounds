import type { Metadata } from "next";

import {
  getHighlights,
  getHighlightStatistics,
} from "@/actions/highlights";

import PageHeader from "@/components/admin/shared/PageHeader";
import HighlightOverviewCard from "@/components/admin/highlights/HighlightOverviewCard";
import HighlightsTable from "@/components/admin/highlights/HighlightsTable";
import HighlightFilters from "@/components/admin/highlights/HighlightFilters";
import AddHighlightButton from "@/components/admin/highlights/AddHighlightButton";

export const metadata: Metadata = {
  title: "Highlights",
};

export const revalidate = 30;

export default async function HighlightsPage() {
  const [
    highlights,
    statistics,
  ] = await Promise.all([
    getHighlights(),
    getHighlightStatistics(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Highlights"
        description="Manage homepage posters, featured highlights, and tournament media."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Highlights",
          },
        ]}
      />

      <HighlightOverviewCard
        statistics={statistics}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <HighlightFilters />

        <AddHighlightButton />

      </div>

      <HighlightsTable
        highlights={highlights}
      />

    </div>
  );
}