"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";

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
    <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-6">
      {groups.map((group) => {
        const isActive =
          group.slug === activeGroup;

        return (
          <Link
            key={group.id}
            href={`?group=${group.slug}`}
            scroll={false}
            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-all ${
              isActive
                ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-slate-900"
            }`}
          >
            <Shield className="h-4 w-4" />
            {group.name}
          </Link>
        );
      })}
    </div>
  );
}
