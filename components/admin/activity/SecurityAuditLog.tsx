import {
  LogIn,
  ShieldAlert,
  Shield,
  type LucideIcon,
} from "lucide-react";

import type { AuditLogEntry } from "@/actions/admin";

function iconFor(entry: AuditLogEntry): LucideIcon {
  if (entry.action === "LOGIN") {
    return entry.description.startsWith(
      "Failed",
    )
      ? ShieldAlert
      : LogIn;
  }

  return Shield;
}

interface SecurityAuditLogProps {
  entries: AuditLogEntry[];
}

export default function SecurityAuditLog({
  entries,
}: Readonly<SecurityAuditLogProps>) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-12 text-center">
        <p className="text-slate-400">
          No security events logged yet.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      {entries.map((entry) => {
        const Icon = iconFor(entry);

        const isFailure =
          entry.description.startsWith(
            "Failed",
          );

        return (
          <div
            key={entry.id}
            className="flex items-start gap-4 px-5 py-4"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isFailure
                  ? "bg-red-500/10 text-red-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                {entry.description}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {entry.ipAddress ?? "unknown IP"}
                {entry.userAgent
                  ? ` · ${entry.userAgent}`
                  : ""}
              </p>
            </div>

            <p className="shrink-0 text-xs text-slate-500">
              {new Date(
                entry.createdAt,
              ).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
