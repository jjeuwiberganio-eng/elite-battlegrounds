import type { Metadata } from "next";

import {
  getAdminDashboardOverview,
  getTournamentControlSummary,
  getRecentAuditLogs,
  getLivestreamStatus,
} from "@/actions/admin";

import DashboardOverview from "@/components/admin/dashboard/DashboardOverview";
import TournamentStatusCard from "@/components/admin/dashboard/TournamentStatusCard";
import QuickActionsCard from "@/components/admin/dashboard/QuickActionsCard";
import LivestreamStatusCard from "@/components/admin/dashboard/LivestreamStatusCard";
import RecentAuditLogsCard from "@/components/admin/dashboard/RecentAuditLogsCard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const revalidate = 30;

export default async function AdminDashboardPage() {
  const [
    overview,
    tournament,
    livestream,
    auditLogs,
  ] = await Promise.all([
    getAdminDashboardOverview(),
    getTournamentControlSummary(),
    getLivestreamStatus(),
    getRecentAuditLogs(),
  ]);

  return (
    <div className="space-y-8">

      <DashboardOverview
        overview={overview}
      />

      <div className="grid gap-6 xl:grid-cols-3">

        <TournamentStatusCard
          tournament={tournament}
        />

        <LivestreamStatusCard
          livestream={livestream}
        />

        <QuickActionsCard />

      </div>

      <RecentAuditLogsCard
        logs={auditLogs}
      />

    </div>
  );
}