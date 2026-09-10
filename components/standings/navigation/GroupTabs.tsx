"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface GroupTabsProps {
  groups: {
    id: string;
    name: string;
    slug: string;
  }[];
  defaultGroup: string;
}

export default function GroupTabs({
  groups,
  defaultGroup,
}: Readonly<GroupTabsProps>) {
  const searchParams = useSearchParams();
  const activeGroup =
    searchParams.get("group") ||
    defaultGroup;

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-6 sm:gap-3">
      {groups.map((group) => {
        const isActive =
          group.slug === activeGroup;

        return (
          <Link
            key={group.id}
            href={`?group=${group.slug}`}
            scroll={false}
            className={`flex-1 rounded-full border px-3 py-2 text-center text-xs font-bold uppercase tracking-wide transition-all sm:flex-none sm:px-5 sm:py-2.5 sm:text-sm ${
              isActive
                ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-slate-900"
            }`}
          >
            {group.name}
          </Link>
        );
      })}
    </div>
  );
}