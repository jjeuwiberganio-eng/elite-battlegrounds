import type { Metadata } from "next";
import Link from "next/link";

import TeamForm from "@/components/admin/teams/TeamForm";
import PageHeader from "@/components/admin/shared/PageHeader";

export const metadata: Metadata = {
  title: "Add Team",
};

export default function CreateTeamPage() {
  return (
    <div className="space-y-8">

      <PageHeader
        title="Add Team"
        description="Create a new tournament team."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Teams",
            href: "/admin/teams",
          },
          {
            label: "Add Team",
          },
        ]}
      />

    <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-sm">

        <TeamForm mode="create" />

      </div>

      <div className="flex justify-end">

        <Link
          href="/admin/teams"
          className="rounded-xl border border-slate-300 px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </Link>

      </div>

    </div>
  );
}