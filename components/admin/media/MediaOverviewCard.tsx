interface MediaStatistics {
  total: number;
  images: number;
  videos: number;
  documents: number;
}

interface MediaOverviewCardProps {
  statistics: MediaStatistics;
}

export default function MediaOverviewCard({
  statistics,
}: Readonly<MediaOverviewCardProps>) {
  const cards = [
    {
      label: "Total Media",
      value: statistics.total,
    },
    {
      label: "Images",
      value: statistics.images,
    },
    {
      label: "Videos",
      value: statistics.videos,
    },
    {
      label: "Documents",
      value: statistics.documents,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/10 bg-slate-900 p-5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
            {card.label}
          </p>

          <p className="mt-2 text-3xl font-black text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}