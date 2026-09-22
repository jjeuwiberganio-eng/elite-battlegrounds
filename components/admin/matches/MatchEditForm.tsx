"use client";

import { useState } from "react";

import { updateMatch } from "@/actions/matches";

type BestOf = "BO1" | "BO3" | "BO5" | "BO7";

interface ScheduleDayOption {
  id: string;
  name: string;
  dayNumber: number;
}

interface EditableMatch {
  id: string;
  matchNumber: number;
  bestOf: string;
  scheduledAt: Date | string | null;
  streamUrl: string | null;
  scheduleDay?: {
    id: string;
  } | null;
}

interface MatchEditFormProps {
  match: EditableMatch;
  scheduleDays: ScheduleDayOption[];

  /*
   * Only Group Stage matches carry a schedule day.
   */
  showScheduleDay: boolean;

  onSaved: () => void;
  onCancel: () => void;
}

/*
 * Converts a stored date into the "YYYY-MM-DDTHH:mm" string a
 * datetime-local input expects, in the BROWSER's local timezone.
 * (toISOString() would give UTC and show the wrong time.)
 */
function toDateTimeLocalValue(
  value: Date | string | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (n: number) =>
    String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

const inputClassName =
  "w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:dark]";

export default function MatchEditForm({
  match,
  scheduleDays,
  showScheduleDay,
  onSaved,
  onCancel,
}: Readonly<MatchEditFormProps>) {
  const [scheduledAt, setScheduledAt] = useState(
    toDateTimeLocalValue(match.scheduledAt),
  );

  const [bestOf, setBestOf] = useState<BestOf>(
    (["BO1", "BO3", "BO5", "BO7"].includes(match.bestOf)
      ? match.bestOf
      : "BO3") as BestOf,
  );

  const [scheduleDayId, setScheduleDayId] = useState(
    match.scheduleDay?.id ?? "",
  );

  const [streamUrl, setStreamUrl] = useState(
    match.streamUrl ?? "",
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    if (!scheduledAt) {
      setError("Schedule is required.");
      return;
    }

    if (showScheduleDay && !scheduleDayId) {
      setError(
        "Schedule day is required for Group Stage matches.",
      );
      return;
    }

    /*
     * datetime-local gives a timezone-less string. Convert it here,
     * in the browser (which knows the real local timezone), into a
     * full UTC ISO string. Vercel runs in UTC, so sending the raw
     * string would shift the time by the timezone offset.
     */
    const localDate = new Date(scheduledAt);

    if (Number.isNaN(localDate.getTime())) {
      setError("Invalid date and time.");
      return;
    }

    setSaving(true);

    try {
      await updateMatch(match.id, {
        scheduledAt: localDate.toISOString(),
        bestOf,
        streamUrl: streamUrl.trim() || null,
        ...(showScheduleDay ? { scheduleDayId } : {}),
      });

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update match.",
      );
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-amber-500/30 bg-slate-900 p-6"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
          Edit Match #{match.matchNumber}
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Update the schedule, format, and livestream. To change
          the teams, delete and recreate the match.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold text-white">
            Scheduled Date & Time
          </label>

          <input
            type="datetime-local"
            lang="en-GB"
            value={scheduledAt}
            onChange={(event) =>
              setScheduledAt(event.target.value)
            }
            disabled={saving}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-white">
            Match Format
          </label>

          <select
            value={bestOf}
            onChange={(event) =>
              setBestOf(event.target.value as BestOf)
            }
            disabled={saving}
            className={inputClassName}
          >
            <option value="BO1">BO1</option>
            <option value="BO3">BO3</option>
            <option value="BO5">BO5</option>
            <option value="BO7">BO7</option>
          </select>
        </div>
      </div>

      {showScheduleDay && (
        <div>
          <label className="mb-2 block font-semibold text-white">
            Schedule Day
          </label>

          <select
            value={scheduleDayId}
            onChange={(event) =>
              setScheduleDayId(event.target.value)
            }
            disabled={saving || scheduleDays.length === 0}
            className={inputClassName}
          >
            <option value="">
              {scheduleDays.length > 0
                ? "Select Day"
                : "No Schedule Days Available"}
            </option>

            {scheduleDays.map((day) => (
              <option key={day.id} value={day.id}>
                {day.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-2 block font-semibold text-white">
          Stream URL (Optional)
        </label>

        <input
          type="url"
          value={streamUrl}
          onChange={(event) =>
            setStreamUrl(event.target.value)
          }
          placeholder="https://facebook.com/..."
          disabled={saving}
          className={inputClassName}
        />

        <p className="mt-2 text-sm text-slate-500">
          Leave empty to remove the livestream from this match.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-2xl border border-white/10 px-6 py-3 font-bold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
