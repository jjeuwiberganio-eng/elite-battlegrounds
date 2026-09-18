"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, LockOpen, Lock } from "lucide-react";

import {
  updateRegistrationSettings,
  openRegistration,
  closeRegistration,
} from "@/actions/registration";

interface RegistrationSettings {
  tournamentName: string;
  status: "OPEN" | "CLOSED" | "NOT_STARTED";
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  registrationUrl: string;
}

interface RegistrationSettingsFormProps {
  initialSettings: RegistrationSettings;
}

// datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time, with no
// timezone suffix - not the ISO strings the server returns/expects.
function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";

  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIsoOrUndefined(localValue: string): string | undefined {
  if (!localValue) return undefined;
  const date = new Date(localValue);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

const STATUS_STYLES: Record<
  RegistrationSettings["status"],
  { label: string; className: string }
> = {
  OPEN: {
    label: "Open Now",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  CLOSED: {
    label: "Closed",
    className: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  NOT_STARTED: {
    label: "Not Started Yet",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
};

export default function RegistrationSettingsForm({
  initialSettings,
}: Readonly<RegistrationSettingsFormProps>) {
  const router = useRouter();

  const [status, setStatus] = useState(initialSettings.status);
  const [registrationUrl, setRegistrationUrl] = useState(
    initialSettings.registrationUrl,
  );
  const [opensAt, setOpensAt] = useState(
    toLocalInputValue(initialSettings.registrationOpensAt),
  );
  const [closesAt, setClosesAt] = useState(
    toLocalInputValue(initialSettings.registrationClosesAt),
  );

  const [saving, setSaving] = useState(false);
  const [quickActionLoading, setQuickActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);

      await updateRegistrationSettings({
        registrationUrl,
        registrationOpensAt: toIsoOrUndefined(opensAt),
        registrationClosesAt: toIsoOrUndefined(closesAt),
      });

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save registration settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleOpenNow() {
    try {
      setQuickActionLoading(true);
      setError(null);

      await openRegistration();

      setOpensAt("");
      setClosesAt("");
      setStatus("OPEN");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to open registration.",
      );
    } finally {
      setQuickActionLoading(false);
    }
  }

  async function handleCloseNow() {
    try {
      setQuickActionLoading(true);
      setError(null);

      await closeRegistration();

      setClosesAt(toLocalInputValue(new Date().toISOString()));
      setStatus("CLOSED");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to close registration.",
      );
    } finally {
      setQuickActionLoading(false);
    }
  }

  const statusStyle = STATUS_STYLES[status];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
            Registration
          </p>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${statusStyle.className}`}
          >
            {statusStyle.label}
          </span>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
            Registration Link
          </label>

          <input
            type="text"
            value={registrationUrl}
            onChange={(event) => setRegistrationUrl(event.target.value)}
            placeholder="https://forms.gle/..."
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-amber-500/40"
          />

          <p className="mt-1.5 text-xs text-slate-500">
            Paste your Google Form (or any registration page) link here.
            This is where the &quot;Register Now&quot; button on the
            homepage will send players.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
              Opens At (optional)
            </label>

            <input
              type="datetime-local"
              value={opensAt}
              onChange={(event) => setOpensAt(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-amber-500/40 [color-scheme:dark]"
            />

            <p className="mt-1.5 text-xs text-slate-500">
              Leave empty to allow registration immediately.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
              Closes At (optional)
            </label>

            <input
              type="datetime-local"
              value={closesAt}
              onChange={(event) => setClosesAt(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-amber-500/40 [color-scheme:dark]"
            />

            <p className="mt-1.5 text-xs text-slate-500">
              Leave empty to keep registration open indefinitely.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
          <button
            type="button"
            disabled={quickActionLoading}
            onClick={handleOpenNow}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LockOpen className="h-3.5 w-3.5" />
            Open Now
          </button>

          <button
            type="button"
            disabled={quickActionLoading}
            onClick={handleCloseNow}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Lock className="h-3.5 w-3.5" />
            Close Now
          </button>

          <p className="flex items-center text-xs text-slate-500">
            Quick actions apply immediately and override the dates above.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm font-semibold text-red-400">{error}</p>
      )}

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-black uppercase text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saving ? "Saving..." : "Save Registration Settings"}
      </button>
    </div>
  );
}