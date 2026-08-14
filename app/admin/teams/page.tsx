import type { Metadata } from "next";

import {
  getTeams,
  getTournamentControl,
} from "@/actions/teams";

import TeamsManagement from "@/components/admin/teams/TeamsManagement";

export const metadata: Metadata = {
  title: "Team Management",
  description:
    "Create and manage tournament teams.",
};

export const revalidate = 30;

export default async function TeamsPage() {
  const [
    teams,
    tournament,
  ] = await Promise.all([
    getTeams(),
    getTournamentControl(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Team Management
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Create and manage the teams that
          participate in your tournament.
        </p>

        {tournament && (
          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
            Tournament:
            <span className="ml-1 text-amber-400">
              {tournament.name}
            </span>
          </div>
        )}
      </div>

      {/* No Tournament */}

      {!tournament ? (
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
          <h2 className="text-xl font-black text-white">
            No tournament found
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Create a tournament first before
            adding teams.
          </p>
        </div>
      ) : (
      <TeamsManagement
        initialTeams={teams}
        groups={[
          "Group A",
          "Group B",
          "Group C",
          "Group D",
        ]}
      />
      )}
    </div>
  );
}