import {
  Layers,
  Image as ImageIcon,
  Video,
  Star,
} from "lucide-react";

import type { HighlightStatistics } from "@/actions/highlights";

interface HighlightOverviewCardProps {
  statistics: HighlightStatistics;
}

export default function HighlightOverviewCard({
  statistics,
}: Readonly<HighlightOverviewCardProps>) {
  const stats = [
    {
      label: "Total Highlights",
      value: statistics.total,
      icon: Layers,
    },
    {
      label: "Posters",
      value: statistics.posters,
      icon: ImageIcon,
    },
    {
      label: "Videos",
      value: statistics.videos,
      icon: Video,
    },
    {
      label: "Featured",
      value: statistics.featured,
      icon: Star,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-slate-900 p-5"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Icon className="h-5 w-5" />
            </div>

            <p className="text-xl font-black text-white">
              {stat.value}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
