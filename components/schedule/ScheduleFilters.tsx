"use client";

import SearchInput from "@/components/common/SearchInput";

interface ScheduleFiltersProps {
  search: string;
  stage: string;
  status: string;

  stages: string[];

  onSearch: (value: string) => void;
  onStageChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const statuses = [
  {
    value: "all",
    label: "All Status",
  },
  {
    value: "upcoming",
    label: "Upcoming",
  },
  {
    value: "live",
    label: "Live",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

export default function ScheduleFilters({
  search,
  stage,
  status,
  stages,
  onSearch,
  onStageChange,
  onStatusChange,
}: Readonly<ScheduleFiltersProps>) {
  return (
    <div
      className="
        mb-10
        rounded-3xl
        border
        border-white/10
        bg-slate-900
        p-6
      "
    >
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Search */}

        <SearchInput
          value={search}
          placeholder="Search teams..."
          onSearch={onSearch}
        />

        {/* Stage */}

        <select
          value={stage}
          onChange={(e) =>
            onStageChange(e.target.value)
          }
          className="
            h-12
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            px-4
            text-white
            outline-none
            transition
            focus:border-amber-500
            focus:ring-2
            focus:ring-amber-500/30
          "
        >
          <option value="all">
            All Stages
          </option>

          {stages.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value)
          }
          className="
            h-12
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            px-4
            text-white
            outline-none
            transition
            focus:border-amber-500
            focus:ring-2
            focus:ring-amber-500/30
          "
        >
          {statuses.map((item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>

      </div>
    </div>
  );
}