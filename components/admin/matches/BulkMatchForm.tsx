"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { createMatchesBulk } from "@/actions/matches";

type BestOf = "BO1" | "BO3" | "BO5" | "BO7";
type CreateStatus = "upcoming" | "live" | "completed";

interface TeamOption {
  id: string;
  name: string;
}

interface StageOption {
  id: string;
  name: string;
  slug: string;
}

interface ScheduleDayOption {
  id: string;
  name: string;
}

interface BulkMatchFormProps {
  teams: TeamOption[];
  stages: StageOption[];
  scheduleDays: ScheduleDayOption[];

  /*
   * Every existing match number, per stage, so the form can suggest
   * the next free number.
   */
  existingNumbers: { stageId: string; matchNumber: number }[];

  onCreated: () => void;
}

interface Row {
  key: number;
  teamAId: string;
  teamBId: string;
  streamUrl: string;
}

const MAX_ROWS = 12;
const DEFAULT_ROWS = 4;

const inputClassName =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:dark]";

const labelClassName =
  "mb-1.5 block text-xs font-semibold text-slate-400";

function emptyRow(key: number): Row {
  return { key, teamAId: "", teamBId: "", streamUrl: "" };
}

/*
 * Creates a whole time slot at once. The tournament plays several
 * matches simultaneously, so this is one form for "4 matches at 7:00 PM"
 * instead of four trips through the single-match form.
 */
export default function BulkMatchForm({
  teams,
  stages,
  scheduleDays,
  existingNumbers,
  onCreated,
}: Readonly<BulkMatchFormProps>) {
  const defaultStage =
    stages.find(
      (stage) =>
        stage.slug.trim().toLowerCase() === "group-stage",
    ) ?? stages[0];

  const [stageId, setStageId] = useState(defaultStage?.id ?? "");
  const [scheduleDayId, setScheduleDayId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [bestOf, setBestOf] = useState<BestOf>("BO3");
  const [status, setStatus] = useState<CreateStatus>("upcoming");

  const [nextKey, setNextKey] = useState(DEFAULT_ROWS);
  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: DEFAULT_ROWS }, (_, index) =>
      emptyRow(index),
    ),
  );

  /* null = follow the suggestion; a string = the admin typed their own. */
  const [startNumberInput, setStartNumberInput] = useState<
    string | null
  >(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStage = stages.find((stage) => stage.id === stageId);

  const needsScheduleDay =
    selectedStage?.slug.trim().toLowerCase() === "group-stage";

  const suggestedStart =
    existingNumbers
      .filter((entry) => entry.stageId === stageId)
      .reduce(
        (highest, entry) => Math.max(highest, entry.matchNumber),
        0,
      ) + 1;

  const startNumber =
    startNumberInput === null
      ? suggestedStart
      : Number(startNumberInput);

  const usedTeamIds = new Set(
    rows.flatMap((row) => [row.teamAId, row.teamBId]).filter(Boolean),
  );

  function updateRow(key: number, patch: Partial<Row>) {
    setRows((current) =>
      current.map((row) =>
        row.key === key ? { ...row, ...patch } : row,
      ),
    );
  }

  function addRow() {
    if (rows.length >= MAX_ROWS) {
      return;
    }

    setRows((current) => [...current, emptyRow(nextKey)]);
    setNextKey((current) => current + 1);
  }

  function removeRow(key: number) {
    setRows((current) =>
      current.length > 1
        ? current.filter((row) => row.key !== key)
        : current,
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);

    if (!stageId) {
      setError("Choose a stage.");
      return;
    }

    if (needsScheduleDay && !scheduleDayId) {
      setError("Schedule day is required for Group Stage matches.");
      return;
    }

    if (!startsAt) {
      setError("Choose the start time for this slot.");
      return;
    }

    if (!Number.isInteger(startNumber) || startNumber < 1) {
      setError("The first match number must be 1 or more.");
      return;
    }

    for (const [index, row] of rows.entries()) {
      if (!row.teamAId || !row.teamBId) {
        setError(`Match ${index + 1}: pick both teams.`);
        return;
      }

      if (row.teamAId === row.teamBId) {
        setError(`Match ${index + 1}: the teams must be different.`);
        return;
      }
    }

    const startDate = new Date(startsAt);

    if (Number.isNaN(startDate.getTime())) {
      setError("Invalid start time.");
      return;
    }

    setSaving(true);

    try {
      const result = await createMatchesBulk({
        tournamentStageId: stageId,
        scheduleDayId: needsScheduleDay ? scheduleDayId : undefined,

        /* Browser-local datetime -> UTC ISO, same as the single form. */
        scheduledAt: startDate.toISOString(),
        bestOf,
        status,
        matches: rows.map((row, index) => ({
          matchNumber: startNumber + index,
          teamAId: row.teamAId,
          teamBId: row.teamBId,
          streamUrl: row.streamUrl.trim() || undefined,
        })),
      });

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success(
        `${result.created} ${
          result.created === 1 ? "match" : "matches"
        } created.`,
      );

      setRows(
        Array.from({ length: DEFAULT_ROWS }, (_, index) =>
          emptyRow(nextKey + index),
        ),
      );
      setNextKey((current) => current + DEFAULT_ROWS);
      setStartNumberInput(null);

      onCreated();
    } catch {
      const message =
        "Failed to create the matches. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  function renderTeamOptions(currentValue: string) {
    return teams.map((team) => (
      <option
        key={team.id}
        value={team.id}
        disabled={
          usedTeamIds.has(team.id) && team.id !== currentValue
        }
      >
        {team.name}
      </option>
    ));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm leading-6 text-slate-400">
        Create every match of one time slot at once. Teams you
        already picked in another row are greyed out, so a team can
        never be booked twice in the same slot.
      </p>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300">
          {error}
        </div>
      )}

      {/* Shared slot settings */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className={labelClassName}>Stage</label>

          <select
            value={stageId}
            onChange={(event) => {
              setStageId(event.target.value);
              setScheduleDayId("");
              setStartNumberInput(null);
            }}
            disabled={saving}
            className={inputClassName}
          >
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>

        {needsScheduleDay && (
          <div>
            <label className={labelClassName}>Schedule day</label>

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
                  ? "Select day"
                  : "No days available"}
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
          <label className={labelClassName}>Start time</label>

          <input
            type="datetime-local"
            lang="en-GB"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            disabled={saving}
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>Format</label>

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

        <div>
          <label className={labelClassName}>
            First match number
          </label>

          <input
            type="number"
            min={1}
            value={
              startNumberInput === null
                ? String(suggestedStart)
                : startNumberInput
            }
            onChange={(event) =>
              setStartNumberInput(event.target.value)
            }
            disabled={saving}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="max-w-xs">
        <label className={labelClassName}>Status</label>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as CreateStatus)
          }
          disabled={saving}
          className={inputClassName}
        >
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
        </select>
      </div>

      {/* One row per simultaneous match */}
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className="rounded-2xl border border-white/10 bg-slate-900 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-slate-950">
                Match #
                {Number.isFinite(startNumber)
                  ? startNumber + index
                  : index + 1}
              </span>

              <button
                type="button"
                onClick={() => removeRow(row.key)}
                disabled={saving || rows.length === 1}
                aria-label={`Remove match ${index + 1}`}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <select
                value={row.teamAId}
                onChange={(event) =>
                  updateRow(row.key, {
                    teamAId: event.target.value,
                  })
                }
                disabled={saving}
                className={inputClassName}
              >
                <option value="">Team A</option>
                {renderTeamOptions(row.teamAId)}
              </select>

              <span className="text-center text-sm font-black text-amber-400">
                VS
              </span>

              <select
                value={row.teamBId}
                onChange={(event) =>
                  updateRow(row.key, {
                    teamBId: event.target.value,
                  })
                }
                disabled={saving}
                className={inputClassName}
              >
                <option value="">Team B</option>
                {renderTeamOptions(row.teamBId)}
              </select>
            </div>

            <input
              type="url"
              value={row.streamUrl}
              onChange={(event) =>
                updateRow(row.key, {
                  streamUrl: event.target.value,
                })
              }
              placeholder="Stream URL for this match (optional)"
              disabled={saving}
              className={`${inputClassName} mt-3`}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={addRow}
          disabled={saving || rows.length >= MAX_ROWS}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Add another match
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Creating..."
            : `Create ${rows.length} ${
                rows.length === 1 ? "match" : "matches"
              }`}
        </button>
      </div>
    </form>
  );
}
