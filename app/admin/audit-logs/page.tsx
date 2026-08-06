import type { Metadata } from "next";

import {
  getAuditLogs,
  getAuditStatistics,
} from "@/actions/audit-logs";

import PageHeader from "@/components/admin/shared/PageHeader";
import AuditOverviewCard from "@/components/admin/audit-logs/AuditOverviewCard";
import AuditFilters from "@/components/admin/audit-logs/AuditFilters";
import AuditLogsTable from "@/components/admin/audit-logs/AuditLogsTable";

export const metadata: Metadata = {
  title: "Audit Logs",
};

export const revalidate = 15;

export default async function AuditLogsPage() {
  const [
    logs,
    statistics,
  ] = await Promise.all([
    getAuditLogs(),
    getAuditStatistics(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Audit Logs"
        description="Track every important action performed in the Elite Battlegrounds dashboard."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Audit Logs",
          },
        ]}
      />

      <AuditOverviewCard
        statistics={statistics}
      />

      <AuditFilters />

      <AuditLogsTable
        logs={logs}
      />

    </div>
  );
}