import type { Metadata } from "next";

import {
  getTeams,
  getTournamentControl,
} from "@/actions/teams";

import TeamsManagement from "@/components/admin/teams/TeamsManagement";

export const metadata: Metadata = {
  title: "Team Management",
  description:
    "Create and manage Elite Battlegrounds Series tournament teams.",
};

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const [
    teams,
    tournament,
  ] = await Promise.all([
    getTeams(),
    getTournamentControl(),
  ]);

  /*
   * The Team Management UI uses the four
   * tournament groups we established for
   * the Group Stage.
   *
   * The backend still verifies that these
   * groups actually exist before saving.
   */
  const groups = [
    "Group A",
    "Group B",
    "Group C",
    "Group D",
  ];

  return (
    <main className="space-y-8">
      {/* Page Header */}

      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Team Management
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Create and manage tournament teams,
          assign their group, and manage their
          six-player roster.
        </p>

        {tournament && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
            <span>
              Tournament:
            </span>

            <span className="text-amber-400">
              {tournament.name}
            </span>
          </div>
        )}
      </div>

      {/* Tournament unavailable */}

      {!tournament ? (
        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
            Tournament Setup
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            No tournament found
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            A tournament must exist before
            teams can be registered and assigned
            to a group.
          </p>
        </section>
      ) : !tournament.groupStage ? (
        /*
         * This is important.
         *
         * We don't allow the admin to create
         * fake Group A/B/C/D records from the
         * Team page. The Group Stage and its
         * actual groups must exist first.
         */
        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
            Group Stage Required
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            Group Stage has not been configured
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Create the Group Stage and its four
            groups before assigning teams to
            Group A, Group B, Group C, or Group D.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <div
                key={group}
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-center"
              >
                <p className="text-sm font-black text-white">
                  {group}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Not configured
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <TeamsManagement
          initialTeams={teams}
          groups={groups}
        />
      )}
    </main>
  );
}