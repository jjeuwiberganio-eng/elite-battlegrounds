interface StatusBadgeProps {
  status:
    | "live"
    | "upcoming"
    | "completed"
    | "active"
    | "inactive"
    | "draft"
    | "disabled"
    | "eliminated";
}

const statusStyles = {
  live: {
    label: "LIVE",
    className:
      "bg-red-500/15 border-red-500/30 text-red-400",
  },

  upcoming: {
    label: "Upcoming",
    className:
      "bg-amber-500/15 border-amber-500/30 text-amber-400",
  },

  completed: {
    label: "Completed",
    className:
      "bg-blue-500/15 border-blue-500/30 text-blue-400",
  },

  active: {
    label: "Active",
    className:
      "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  },

  inactive: {
    label: "Inactive",
    className:
      "bg-slate-500/15 border-slate-500/30 text-slate-400",
  },

  draft: {
    label: "Draft",
    className:
      "bg-violet-500/15 border-violet-500/30 text-violet-400",
  },

  disabled: {
    label: "Disabled",
    className:
      "bg-slate-700/30 border-slate-600 text-slate-300",
  },

  eliminated: {
    label: "Eliminated",
    className:
      "bg-rose-500/15 border-rose-500/30 text-rose-400",
  },
} as const;

export default function StatusBadge({
  status,
}: Readonly<StatusBadgeProps>) {
  const badge = statusStyles[status];

  return (
    <span
      className={[
        "inline-flex",
        "items-center",
        "rounded-full",
        "border",
        "px-3",
        "py-1",
        "text-xs",
        "font-bold",
        "uppercase",
        "tracking-wider",
        badge.className,
      ].join(" ")}
    >
      {status === "live" && (
        <span className="mr-2 flex h-2 w-2">

          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />

          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />

        </span>
      )}

      {badge.label}
    </span>
  );
}