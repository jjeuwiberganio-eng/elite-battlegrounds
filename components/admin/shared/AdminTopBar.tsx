"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowLeft,
  ExternalLink,
  LogOut,
  User,
} from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
  "tournament": "Tournament Stages",
  "teams": "Team Management",
  "standings": "Standings",
  "schedule": "Schedule Days",
  "matches": "Matches",
  "playoffs": "Playoffs",
  "announcements": "Announcements",
  "highlights": "Highlights",
  "livestream": "Livestream",
  "media": "Media Library",
  "audit-logs": "Activity",
  "settings": "Website Settings",
};

export default function AdminTopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isDashboard = pathname === "/admin";
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return null;
  }

  const segments = pathname
    .replace("/admin", "")
    .split("/")
    .filter(Boolean);

  const currentLabel =
    SECTION_LABELS[segments[0]] ??
    (segments[0]
      ? segments[0]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
          )
      : "Dashboard");

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-6 py-3 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          {!isDashboard && (
            <Link
              href="/admin"
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          )}

          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase tracking-wide text-amber-400">
              {currentLabel}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {session?.user && (
            <div className="hidden items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-400 sm:flex">
              <User className="h-3.5 w-3.5" />
              {session.user.displayName ??
                session.user.email}
            </div>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            View Site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() =>
              signOut({
                callbackUrl: "/admin/login",
              })
            }
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
