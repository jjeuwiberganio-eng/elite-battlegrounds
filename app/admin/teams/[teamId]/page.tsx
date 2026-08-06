import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getTeamById,
} from "@/actions/teams";

import TeamForm from "@/components/admin/teams/TeamForm";
import PageHeader from "@/components/admin/shared/PageHeader";

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
    <div className="space-y-8">

      <PageHeader
        title="Edit Team"
        description="Update an existing tournament team."
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
            label: team.name,
          },
        ]}
      />

      <div className="rounded-2xl bg-white p-8 shadow-sm">

        <TeamForm
          mode="edit"
          team={team}
        />

      </div>

    </div>
  );
}