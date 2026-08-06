import HighlightCard from "./HighlightCard";

interface HighlightItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
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
  const items = [...posters, ...videos]
    .sort((a, b) =>
      new Date(b.publishedAt).getTime() -
      new Date(a.publishedAt).getTime(),
    )
    .slice(0, 6);

  return (
    <section className="bg-slate-950 py-20">

      <div className="container">

        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
              Highlights
            </span>

            <h2 className="mt-5 text-4xl font-black text-white md:text-5xl">
              Tournament
              <br />
              Highlights
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Catch up on featured posters, exciting match moments,
              tournament announcements, and community highlights from
              Elite Battlegrounds Series.
            </p>

          </div>

        </div>

        {items.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {items.map((item) => (
              <HighlightCard
                key={item.id}
                highlight={item}
              />
            ))}

          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700 py-20 text-center">

            <h3 className="text-2xl font-bold text-white">
              No Highlights Yet
            </h3>

            <p className="mt-4 text-slate-400">
              Tournament highlights will appear here after
              they're published by the administrators.
            </p>

          </div>
        )}

      </div>

    </section>
  );
}