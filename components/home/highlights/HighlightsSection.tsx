import Link from "next/link";
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

  return (
    <section className="bg-white py-10">
      <div className="w-full px-8">

        {/* Heading */}
        <div className="mb-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-amber-500" />

          <h2 className="whitespace-nowrap text-3xl font-black uppercase text-slate-950">
            Highlights
          </h2>

          <div className="h-px flex-1 bg-amber-500" />
        </div>

        <div className="grid grid-cols-6 gap-4">

          {/* Posters */}
          <div className="col-span-3 min-w-0">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-slate-950">
                Posters
              </h3>

              <Link
                href="/highlights"
                className="
                  text-xs
                  font-bold
                  uppercase
                  text-slate-900
                  transition-colors
                  hover:text-amber-600
                "
              >
                View All Posters →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {posterItems.map((item) => (
                <HighlightCard
                  key={item.id}
                  highlight={item}
                />
              ))}
            </div>
          </div>

          {/* Short Videos */}
          <div className="col-span-3 min-w-0">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-slate-950">
                Short Videos
              </h3>

              <Link
                href="/highlights"
                className="
                  text-xs
                  font-bold
                  uppercase
                  text-slate-900
                  transition-colors
                  hover:text-amber-600
                "
              >
                View All Short Videos →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {videoItems.map((item) => (
                <HighlightCard
                  key={item.id}
                  highlight={item}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}