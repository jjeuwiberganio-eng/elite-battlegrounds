import type { Metadata } from "next";

import { getRecentActivities, getAuditLog } from "@/actions/admin";

import ActivityFeed from "@/components/admin/activity/ActivityFeed";
import SecurityAuditLog from "@/components/admin/activity/SecurityAuditLog";

export const metadata: Metadata = {
  title: "Activity",
};

export const revalidate = 0;

export default async function AuditLogsPage() {
  const [activities, auditEntries] = await Promise.all([
    getRecentActivities(30),
    getAuditLog(30),
  ]);

  return (
    <main className="space-y-10 p-6 lg:p-10">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Activity
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Two views: real logged security events below (login attempts, new-device alerts), and a derived feed of business activity (registrations, matches, tournament updates) further down.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-slate-500">
          Security &amp; Login Activity
        </h2>

        <SecurityAuditLog
          entries={auditEntries}
        />
      </section>

      <section>
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-slate-500">
          Recent Business Activity
        </h2>

        <ActivityFeed
          activities={activities}
        />
      </section>
    </main>
  );
}
