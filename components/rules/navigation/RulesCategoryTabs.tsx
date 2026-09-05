"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Layers } from "lucide-react";

interface RulesCategoryTabsProps {
  categories: {
    id: string;
    label: string;
  }[];
  defaultCategory: string;
}

export default function RulesCategoryTabs({
  categories,
  defaultCategory,
}: Readonly<RulesCategoryTabsProps>) {
  const searchParams = useSearchParams();
  const activeCategory =
    searchParams.get("category") || defaultCategory;

  return (
    <section className="bg-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap justify-center gap-3 border-b border-slate-200 pb-6">
          {categories.map((category) => {
            const isActive =
              category.id === activeCategory;

            return (
              <Link
                key={category.id}
                href={`?category=${category.id}`}
                scroll={false}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-all ${
                  isActive
                    ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-slate-900"
                }`}
              >
                <Layers className="h-4 w-4" />
                {category.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
