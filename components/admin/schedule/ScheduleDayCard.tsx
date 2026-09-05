"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X, Calendar } from "lucide-react";

import {
  updateScheduleDay,
  deleteScheduleDay,
  type AdminScheduleDay,
} from "@/actions/schedule-days";

interface ScheduleDayCardProps {
  day: AdminScheduleDay;
}

export default function ScheduleDayCard({
  day,
}: Readonly<ScheduleDayCardProps>) {
  const router = useRouter();

  const [editing, setEditing] =
    useState(false);

  const [name, setName] = useState(
    day.name,
  );

  const [date, setDate] = useState(
    day.scheduledDate
      ? day.scheduledDate.slice(0, 10)
      : "",
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<
    string | null
  >(null);

  async function handleSave() {
    try {
      setBusy(true);
      setError(null);

      await updateScheduleDay({
        dayId: day.id,
        name,
        scheduledDate: date || undefined,
      });

      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${day.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusy(true);

      await deleteScheduleDay(day.id);

      router.refresh();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Calendar className="h-5 w-5" />
          </div>

          {editing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                className="w-32 rounded-lg border border-amber-500/40 bg-slate-950 px-3 py-1.5 text-sm font-bold text-white outline-none"
              />

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(
                    event.target.value,
                  )
                }
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-sm text-white outline-none"
              />
            </div>
          ) : (
            <div>
              <p className="font-bold text-white">
                {day.name}
              </p>

              <p className="text-xs text-slate-500">
                {day.scheduledDate
                  ? new Date(
                      day.scheduledDate,
                    ).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : "No date set"}{" "}
                · {day.matchCount} match
                {day.matchCount === 1
                  ? ""
                  : "es"}
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          {editing ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={handleSave}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setEditing(false);
                  setName(day.name);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 hover:text-white disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  setEditing(true)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:text-white disabled:opacity-50"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={handleDelete}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
