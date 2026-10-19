"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Trophy } from "lucide-react";

interface StandingsViewsProps {
  groupView: ReactNode;
  playoffView: ReactNode;
}

const tabs = [
  {
    view: "groups",
    label: "Group Stage",
    caption: "Round Robin",
    Icon: CalendarDays,
  },
  {
    view: "playoffs",
    label: "Playoffs",
    caption: "Double Elimination",
    Icon: Trophy,
  },
] as const;

/*
 * Switches the standings page between the Group Stage standings and the
 * Playoff standings (?view=playoffs). Both views are rendered on the
 * server and passed in, so switching is instant and the page stays cached.
 */
export default function StandingsViews({
  groupView,
  playoffView,
}: Readonly<StandingsViewsProps>) {
  const searchParams = useSearchParams();

  const activeView =
    searchParams.get("view") === "playoffs"
      ? "playoffs"
      : "groups";

  return (
    <>
      <div className="mb-8 flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:max-w-xl sm:rounded-2xl">
        {tabs.map(({ view, label, caption, Icon }) => {
          const isActive = activeView === view;

          return (
            <Link
              key={view}
              href={`?view=${view}`}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold transition-all sm:gap-3 sm:py-4 sm:text-base ${
                isActive
                  ? "bg-amber-500 text-white"
                  : "bg-white text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />

              <span className="text-left">
                <span className="block uppercase">{label}</span>

                <span className="block text-[9px] font-medium opacity-80 sm:text-xs">
                  {caption}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {activeView === "playoffs" ? playoffView : groupView}
    </>
  );
}
