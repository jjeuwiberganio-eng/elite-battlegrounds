import type { Metadata } from "next";

import {
  getMediaLibrary,
  getMediaStatistics,
} from "@/actions/media";

import PageHeader from "@/components/admin/shared/PageHeader";
import MediaOverviewCard from "@/components/admin/media/MediaOverviewCard";
import MediaGrid from "@/components/admin/media/MediaGrid";
import MediaFilters from "@/components/admin/media/MediaFilters";
import UploadMediaButton from "@/components/admin/media/UploadMediaButton";

export const metadata: Metadata = {
  title: "Media Library",
};

export const revalidate = 30;

export default async function MediaLibraryPage() {
  const [
    media,
    statistics,
  ] = await Promise.all([
    getMediaLibrary(),
    getMediaStatistics(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Media Library"
        description="Upload and manage every image, poster, logo, banner and media asset used throughout the website."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Media Library",
          },
        ]}
      />

      <MediaOverviewCard
        statistics={statistics}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <MediaFilters />

        <UploadMediaButton />

      </div>

      <MediaGrid
        media={media}
      />

    </div>
  );
}