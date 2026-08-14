import Link from "next/link";

import {
  Users,
  UserCircle2,
  Trophy,
  Swords,
  ClipboardList,
  Activity,
  ArrowUpRight,
} from "lucide-react";

interface DashboardStatsProps {
  totalTeams: number;
  totalPlayers: number;
  activeTournaments: number;
  matchesToday: number;
  pendingRegistrations: number;
  recentActivities: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  href?: string;
}

function StatCard({
  title,
  value,
  icon,
  href,
}: Readonly<StatCardProps>) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            {value.toLocaleString()}
          </h2>
        </div>

        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-amber-500/10
            text-amber-400
          "
        >
          {icon}
        </div>
      </div>

      {href && (
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-400">
          <span>Manage {title}</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="
          group
          block
          rounded-3xl
          border
          border-white/10
          bg-white/[0.05]
          p-6
          backdrop-blur-xl
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-amber-500/50
          hover:bg-white/[0.07]
          hover:shadow-xl
          hover:shadow-amber-500/5
          focus:outline-none
          focus:ring-2
          focus:ring-amber-500
          focus:ring-offset-2
          focus:ring-offset-slate-950
        "
        aria-label={`Manage ${title}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <article
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.05]
        p-6
        backdrop-blur-xl
      "
    >
      {content}
    </article>
  );
}

export default function DashboardStats({
  totalTeams,
  totalPlayers,
  activeTournaments,
  matchesToday,
  pendingRegistrations,
  recentActivities,
}: Readonly<DashboardStatsProps>) {
  return (
    <section>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {/* Teams */}
        <StatCard
          title="Teams"
          value={totalTeams}
          icon={<Users className="h-8 w-8" />}
          href="/admin/teams"
        />

        {/* Players */}
        <StatCard
          title="Players"
          value={totalPlayers}
          icon={<UserCircle2 className="h-8 w-8" />}
        />

        {/* Active Tournaments */}
        <StatCard
          title="Active Tournaments"
          value={activeTournaments}
          icon={<Trophy className="h-8 w-8" />}
        />

        {/* Matches */}
        <StatCard
          title="Matches Today"
          value={matchesToday}
          icon={<Swords className="h-8 w-8" />}
          href="/admin/matches"
        />

        {/* Registrations */}
        <StatCard
          title="Pending Registrations"
          value={pendingRegistrations}
          icon={<ClipboardList className="h-8 w-8" />}
        />

        {/* Activity */}
        <StatCard
          title="Recent Activity"
          value={recentActivities}
          icon={<Activity className="h-8 w-8" />}
        />
      </div>
    </section>
  );
}