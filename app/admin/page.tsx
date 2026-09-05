import type { Metadata } from "next";
import {
  Layers,
  Users,
  CalendarDays,
  Trophy,
  Sparkles,
  ClipboardList,
  ChevronDown,
} from "lucide-react";

import AdminNavRow from "@/components/admin/dashboard/AdminNavRow";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Elite Battlegrounds Series administration dashboard.",
};

interface NavItem {
  href: string;
  label: string;
  description: string;
  ready: boolean;
}

interface NavGroup {
  title: string;
  icon: typeof Layers;
  defaultOpen: boolean;
  items: NavItem[];
}

/*
 * `ready` reflects whether the page actually compiles today - not
 * a permanent label. Flip to true here as broken routes get built.
 *
 * One icon per GROUP (not per item) and a native <details> element
 * per group - this keeps module/DOM weight down on constrained dev
 * machines. Rows use prefetch={false} to avoid triggering a
 * simultaneous background compile of every linked page at once.
 */
const navGroups: NavGroup[] = [
  {
    title: "Tournament Setup",
    icon: Layers,
    defaultOpen: true,
    items: [
      {
        href: "/admin/tournament/stages",
        label: "Tournament Stages",
        description:
          "Create Group Stage / Playoffs and set max teams per stage.",
        ready: true,
      },
      {
        href: "/admin/settings",
        label: "Website Settings",
        description:
          "Site-wide settings, socials, and footer content.",
        ready: true,
      },
    ],
  },
  {
    title: "Teams & Standings",
    icon: Users,
    defaultOpen: true,
    items: [
      {
        href: "/admin/teams",
        label: "Team Management",
        description:
          "Create teams, assign groups, manage rosters.",
        ready: true,
      },
      {
        href: "/admin/standings",
        label: "Standings",
        description:
          "Review group standings and recalculate rankings.",
        ready: true,
      },
    ],
  },
  {
    title: "Schedule & Matches",
    icon: CalendarDays,
    defaultOpen: false,
    items: [
      {
        href: "/admin/schedule/days",
        label: "Schedule Days",
        description:
          "Add and manage Group Stage schedule days.",
        ready: true,
      },
      {
        href: "/admin/matches",
        label: "Matches",
        description:
          "Create matches and record final results.",
        ready: true,
      },
    ],
  },
  {
    title: "Playoffs",
    icon: Trophy,
    defaultOpen: false,
    items: [
      {
        href: "/admin/playoffs",
        label: "Playoff Qualifiers",
        description:
          "Pick qualifying teams and set playoff size.",
        ready: true,
      },
      {
        href: "/admin/playoffs/bracket",
        label: "Playoff Bracket",
        description:
          "Manually control the bracket - slots, winners, scores.",
        ready: true,
      },
    ],
  },
  {
    title: "Content",
    icon: Sparkles,
    defaultOpen: false,
    items: [
      {
        href: "/admin/announcements",
        label: "Announcements",
        description:
          "Manage the site-wide announcement bar.",
        ready: true,
      },
      {
        href: "/admin/highlights",
        label: "Highlights",
        description:
          "Manage homepage poster/video highlights.",
        ready: true,
      },
      {
        href: "/admin/livestream",
        label: "Livestream",
        description:
          "Control which match is live across the site.",
        ready: true,
      },
      {
        href: "/admin/media",
        label: "Media Library",
        description:
          "Upload and manage logos, posters, and images.",
        ready: true,
      },
    ],
  },
  {
    title: "System",
    icon: ClipboardList,
    defaultOpen: false,
    items: [
      {
        href: "/admin/audit-logs",
        label: "Recent Activity",
        description:
          "A live feed derived from real records - not a formal audit trail yet.",
        ready: true,
      },
    ],
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6 lg:p-10">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Everything you can manage for Elite
          Battlegrounds Series. Sections
          marked{" "}
          <span className="text-slate-500">
            Not Ready
          </span>{" "}
          aren't wired up yet.
        </p>
      </div>

      <div className="space-y-3">
        {navGroups.map((group) => {
          const Icon = group.icon;

          return (
            <details
              key={group.title}
              open={group.defaultOpen}
              className="group/details overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 select-none">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-black uppercase tracking-wide text-white">
                    {group.title}
                  </span>

                  <span className="text-xs text-slate-500">
                    ({group.items.length})
                  </span>
                </div>

                <ChevronDown className="h-4 w-4 text-slate-500 transition group-open/details:rotate-180" />
              </summary>

              <div className="divide-y divide-white/5 border-t border-white/5">
                {group.items.map((item) => (
                  <AdminNavRow
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    description={
                      item.description
                    }
                    ready={item.ready}
                  />
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </main>
  );
}
