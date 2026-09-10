import Link from "next/link";
import { ArrowRight } from "lucide-react";

import HighlightCard from "./HighlightCard";

interface HighlightItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  url: string;
  featured: boolean;
  publishedAt: string;
}

interface HighlightsSectionProps {
  posters: HighlightItem[];
  videos: HighlightItem[];
}

export default function HighlightsSection({
  posters,
  videos,
}: Readonly<HighlightsSectionProps>) {
  const posterItems = posters.slice(0, 3);
  const videoItems = videos.slice(0, 3);

  if (
    posterItems.length === 0 &&
    videoItems.length === 0
  ) {
    return null;
  }

  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="w-full px-6 sm:px-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-amber-200" />

          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 sm:text-3xl">
            Highlights
          </h2>

          <div className="h-px flex-1 bg-amber-200" />
        </div>

        {/* Stacked on mobile, side-by-side from lg up */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
          {posterItems.length > 0 && (
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">
                  Posters
                </h3>

                <Link
                  href="/highlights"
                  className="flex items-center gap-1 text-xs font-bold uppercase text-amber-600 hover:text-amber-700"
                >
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {posterItems.map((item) => (
                  <HighlightCard
                    key={item.id}
                    highlight={item}
                  />
                ))}
              </div>
            </div>
          )}

          {videoItems.length > 0 && (
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">
                  Short Videos
                </h3>

                <Link
                  href="/highlights"
                  className="flex items-center gap-1 text-xs font-bold uppercase text-amber-600 hover:text-amber-700"
                >
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {videoItems.map((item) => (
                  <HighlightCard
                    key={item.id}
                    highlight={item}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}