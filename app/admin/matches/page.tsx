import type { Metadata } from "next";

import {
  getAdminMatches,
  getMatchFormData,
} from "@/actions/matches";

import MatchManagement from "@/components/admin/matches/MatchManagement";

export const metadata: Metadata = {
  title: "Matches",
};

export const revalidate = 30;

export default async function MatchesPage() {
  const [matches, formData] =
    await Promise.all([
      getAdminMatches(),
      getMatchFormData(),
    ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Match Management
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Create and manage tournament matches,
          schedules, teams, statuses, and individual
          livestream links.
        </p>
      </div>

      {/* Match Management */}
    <MatchManagement
      initialMatches={matches}
      teams={formData.teams}
      stages={formData.stages}
      scheduleDays={formData.scheduleDays}
    />
    </div>
  );
}