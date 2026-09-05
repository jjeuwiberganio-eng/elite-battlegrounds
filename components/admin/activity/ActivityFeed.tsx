import {
  Users,
  Swords,
  ClipboardCheck,
  Trophy,
  LogIn,
  Settings2,
  type LucideIcon,
} from "lucide-react";

import type { AdminActivity } from "@/actions/admin";

const ICONS: Record<string, LucideIcon> = {
  team_registered: Users,
  match_completed: Swords,
  match_created: ClipboardCheck,
  rule_updated: Settings2,
  user_login: LogIn,
  tournament_updated: Trophy,
};

interface ActivityFeedProps {
  activities: AdminActivity[];
}

export default function ActivityFeed({
  activities,
}: Readonly<ActivityFeedProps>) {
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
        <p className="text-slate-400">
          No recent activity yet.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      {activities.map((activity) => {
        const Icon =
          ICONS[activity.type] ??
          ClipboardCheck;

        return (
          <div
            key={activity.id}
            className="flex items-start gap-4 px-5 py-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                {activity.title}
              </p>

              {activity.description && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {activity.description}
                </p>
              )}
            </div>

            <p className="shrink-0 text-xs text-slate-500">
              {new Date(
                activity.createdAt,
              ).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
