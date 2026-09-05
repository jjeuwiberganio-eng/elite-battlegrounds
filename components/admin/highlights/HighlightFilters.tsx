"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "POSTER", label: "Posters" },
  { value: "VIDEO", label: "Videos" },
];

export default function HighlightFilters() {
  const searchParams = useSearchParams();
  const activeType =
    searchParams.get("type") || "all";

  return (
    <div className="flex gap-2">
      {FILTERS.map((filter) => {
        const isActive =
          filter.value === activeType;

        return (
          <Link
            key={filter.value}
            href={
              filter.value === "all"
                ? "/admin/highlights"
                : `/admin/highlights?type=${filter.value}`
            }
            scroll={false}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              isActive
                ? "bg-amber-500 text-slate-950"
                : "border border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
