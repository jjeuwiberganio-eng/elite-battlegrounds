import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTeamById } from "@/actions/teams";

import TeamForm from "@/components/admin/teams/TeamForm";

export const metadata: Metadata = {
  title: "Edit Team",
};

interface EditTeamPageProps {
  params: Promise<{
    teamId: string;
  }>;
}

export default async function EditTeamPage({
  params,
}: EditTeamPageProps) {
  const { teamId } = await params;

  const team = await getTeamById(teamId);

  if (!team) {
    notFound();
  }

  return (
    <main className="space-y-6">
      {/* Page Header */}

      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <a
            href="/admin"
            className="transition hover:text-amber-400"
          >
            Dashboard
          </a>

          <span>/</span>

          <a
            href="/admin/teams"
            className="transition hover:text-amber-400"
          >
            Teams
          </a>

          <span>/</span>

          <span className="text-slate-300">
            {team.name}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
            Super Admin
          </p>

          <h1 className="mt-2 text-3xl font-black text-white">
            Edit Team
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Update the team's information, group,
            poster, logo, and roster.
          </p>
        </div>
      </div>

      {/* Team Form */}

      <div className="rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl md:p-8">
        <TeamForm
          mode="edit"
          team={team}
        />
      </div>
    </main>
  );
}