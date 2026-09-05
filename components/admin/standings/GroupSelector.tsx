"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface GroupSelectorProps {
  groups: {
    id: string;
    name: string;
    slug: string;
  }[];
  selectedGroup: string;
}

export default function GroupSelector({
  groups,
  selectedGroup,
}: Readonly<GroupSelectorProps>) {
  const searchParams = useSearchParams();
  const activeGroup =
    searchParams.get("group") ||
    selectedGroup;

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900 p-2">
      {groups.map((group) => {
        const isActive =
          group.slug === activeGroup;

        return (
          <Link
            key={group.id}
            href={`?group=${group.slug}`}
            scroll={false}
            className={`rounded-xl px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${
              isActive
                ? "bg-amber-500 text-slate-950"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {group.name}
          </Link>
        );
      })}
    </div>
  );
}
