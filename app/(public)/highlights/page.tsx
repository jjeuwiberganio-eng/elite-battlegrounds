import type { Metadata } from "next";

import { getHomepageHighlights } from "@/actions/home";
import HighlightCard from "@/components/home/highlights/HighlightCard";

export const metadata: Metadata = {
  title: "Highlights",
  description:
    "View tournament posters, announcements, match moments, and short videos from the Elite Battlegrounds Series.",
};

export const revalidate = 30;

export default async function HighlightsPage() {
  const highlights = await getHomepageHighlights();

  const posters = highlights.filter(
    (item) => item.type === "poster",
  );

  const videos = highlights.filter(
    (item) => item.type === "video",
  );

  const posterItems = posters.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.title,
    mediaUrl: item.image,
    mediaType: "image" as const,
    featured: false,
    publishedAt: new Date().toISOString(),
  }));

  const videoItems = videos.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.title,
    mediaUrl: item.image,
    mediaType: "video" as const,
    featured: false,
    publishedAt: new Date().toISOString(),
  }));

  return (
    <main className="bg-white py-16">
      <div className="w-full px-8">

        {/* Page Header */}
        <div className="mb-14 text-center">
          <div className="mx-auto mb-4 flex max-w-4xl items-center gap-4">
            <div className="h-px flex-1 bg-amber-500" />

            <span className="text-sm font-bold uppercase tracking-[0.25em] text-amber-600">
              Elite Battlegrounds Series
            </span>

            <div className="h-px flex-1 bg-amber-500" />
          </div>

          <h1 className="text-5xl font-black uppercase text-slate-950 md:text-6xl">
            Highlights
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-slate-500">
            Explore tournament posters, announcements, match moments,
            and short videos from the Elite Battlegrounds Series.
          </p>
        </div>

        {/* Posters */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Tournament Gallery
              </p>

              <h2 className="mt-1 text-3xl font-black uppercase text-slate-950">
                All Posters
              </h2>
            </div>

            <span className="text-sm font-semibold text-slate-400">
              {posterItems.length} Posters
            </span>
          </div>

          {posterItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {posterItems.map((item) => (
                <HighlightCard
                  key={item.id}
                  highlight={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No Posters Yet
              </h3>

              <p className="mt-2 text-slate-500">
                Tournament posters will appear here.
              </p>
            </div>
          )}
        </section>

        {/* Short Videos */}
        <section className="mt-20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Match Moments
              </p>

              <h2 className="mt-1 text-3xl font-black uppercase text-slate-950">
                All Short Videos
              </h2>
            </div>

            <span className="text-sm font-semibold text-slate-400">
              {videoItems.length} Videos
            </span>
          </div>

          {videoItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {videoItems.map((item) => (
                <HighlightCard
                  key={item.id}
                  highlight={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No Short Videos Yet
              </h3>

              <p className="mt-2 text-slate-500">
                Tournament short videos will appear here.
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}