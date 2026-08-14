"use client";

import { CalendarDays, Trophy } from "lucide-react";

export type ScheduleTab =
  | "group-stage"
  | "playoffs";

interface ScheduleTabsProps {
  activeTab: ScheduleTab;
  onTabChange: (
    tab: ScheduleTab,
  ) => void;
}

export default function ScheduleTabs({
  activeTab,
  onTabChange,
}: Readonly<ScheduleTabsProps>) {
  return (
    <section className="bg-white">
      <div className="container mx-auto max-w-7xl px-6">

        <div className="mx-auto flex max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Group Stage */}
          <button
            type="button"
            onClick={() =>
              onTabChange("group-stage")
            }
            className={`flex flex-1 items-center justify-center gap-3 py-6 text-lg font-bold transition-all ${
              activeTab === "group-stage"
                ? "bg-amber-500 text-white"
                : "bg-white text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CalendarDays className="h-5 w-5" />

            <div className="text-left">
              <p>GROUP STAGE</p>

              <p className="text-xs font-medium opacity-80">
                Round Robin
              </p>
            </div>
          </button>

          {/* Playoffs */}
          <button
            type="button"
            onClick={() =>
              onTabChange("playoffs")
            }
            className={`flex flex-1 items-center justify-center gap-3 py-6 text-lg font-bold transition-all ${
              activeTab === "playoffs"
                ? "bg-amber-500 text-white"
                : "bg-white text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Trophy className="h-5 w-5" />

            <div className="text-left">
              <p>PLAYOFFS</p>

              <p className="text-xs font-medium opacity-80">
                Double Elimination
              </p>
            </div>
          </button>

        </div>

      </div>
    </section>
  );
}