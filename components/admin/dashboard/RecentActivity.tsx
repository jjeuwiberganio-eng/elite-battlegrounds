import {
  UserPlus,
  Trophy,
  Swords,
  FileText,
  Shield,
  LogIn,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface ActivityItem {
  id: string;
  type:
    | "team_registered"
    | "match_completed"
    | "match_created"
    | "rule_updated"
    | "user_login"
    | "tournament_updated";

  title: string;
  description?: string;

  actor?: string;

  createdAt: Date;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const activityConfig = {
  team_registered: {
    icon: UserPlus,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },

  match_completed: {
    icon: Trophy,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },

  match_created: {
    icon: Swords,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },

  rule_updated: {
    icon: FileText,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },

  user_login: {
    icon: LogIn,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },

  tournament_updated: {
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
} as const;

export default function RecentActivity({
  activities,
}: Readonly<RecentActivityProps>) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-xl
      "
    >
      <div className="border-b border-white/10 p-6">

        <h2 className="text-2xl font-black text-white">
          Recent Activity
        </h2>

        <p className="mt-2 text-slate-400">
          Latest actions across the Elite Battlegrounds platform.
        </p>

      </div>

      <div className="divide-y divide-white/10">

        {activities.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No recent activity.
          </div>
        )}

        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <article
              key={activity.id}
              className="
                flex
                items-start
                gap-4
                p-6
                transition-colors
                hover:bg-white/[0.03]
              "
            >
              <div
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                  config.bg,
                  config.color,
                ].join(" ")}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">

                <h3 className="font-semibold text-white">
                  {activity.title}
                </h3>

                {activity.description && (
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {activity.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">

                  {activity.actor && (
                    <span>
                      By <strong className="text-slate-300">
                        {activity.actor}
                      </strong>
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />

                    {formatDistanceToNow(
                      activity.createdAt,
                      {
                        addSuffix: true,
                      },
                    )}
                  </span>

                </div>

              </div>

            </article>
          );
        })}

      </div>

    </section>
  );
}