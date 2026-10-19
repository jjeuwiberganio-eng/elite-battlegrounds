"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createTiebreakerMatch } from "@/actions/matches";

interface TeamOption {
  id: string;
  name: string;
  groupId: string | null;
  groupName: string | null;
}

interface ScheduleDayOption {
  id: string;
  name: string;
}

interface TiebreakerMatchFormProps {
  teams: TeamOption[];
  scheduleDays: ScheduleDayOption[];
  onCreated: () => void;
}

type BestOf = "BO1" | "BO3" | "BO5" | "BO7";

const inputClassName =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:dark]";

const labelClassName =
  "mb-1.5 block text-xs font-semibold text-slate-400";

/*
 * Creates a tiebreaker match between two teams of the same group. It
 * never counts toward the standings - see lib/tiebreaker-constants.ts.
 */
export default function TiebreakerMatchForm({
  teams,
  scheduleDays,
  onCreated,
}: Readonly<TiebreakerMatchFormProps>) {
  const groups = [
    ...new Map(
      teams
        .filter((team) => team.groupId && team.groupName)
        .map((team) => [
          team.groupId as string,
          team.groupName as string,
        ]),
    ).entries(),
  ].sort(([, a], [, b]) => a.localeCompare(b));

  const [groupId, setGroupId] = useState("");
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");
  const [scheduleDayId, setScheduleDayId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [bestOf, setBestOf] = useState<BestOf>("BO1");
  const [streamUrl, setStreamUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupTeams = teams.filter(
    (team) => team.groupId === groupId,
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);

    if (!groupId) {
      setError("Choose the group the tied teams are in.");
      return;
    }

    if (!teamAId || !teamBId) {
      setError("Pick both tied teams.");
      return;
    }

    if (teamAId === teamBId) {
      setError("The two teams must be different.");
      return;
    }

    if (!scheduleDayId) {
      setError("Choose a schedule day.");
      return;
    }

    const startDate = new Date(startsAt);

    if (!startsAt || Number.isNaN(startDate.getTime())) {
      setError("Choose the start time.");
      return;
    }

    setSaving(true);

    try {
      const result = await createTiebreakerMatch({
        teamAId,
        teamBId,
        scheduleDayId,

        /* Browser-local datetime -> UTC ISO, same as the other forms. */
        scheduledAt: startDate.toISOString(),
        bestOf,
        streamUrl: streamUrl.trim() || undefined,
      });

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success(
        `Tiebreaker created as match #${result.matchNumber}. Record its result once it's played.`,
      );

      setTeamAId("");
      setTeamBId("");
      setStreamUrl("");

      onCreated();
    } catch {
      const message =
        "Failed to create the tiebreaker. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 px-5 py-4 text-sm leading-6 text-violet-200">
        A tiebreaker is played between two teams that are level in
        the same group. It <strong>does not count</strong> toward
        the standings (no wins, losses, maps or points). After you
        record its result, the standings tag the winner with
        &quot;Tiebreaker Win&quot; and rank them above the team
        they beat.
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className={labelClassName}>Group</label>

          <select
            value={groupId}
            onChange={(event) => {
              setGroupId(event.target.value);
              setTeamAId("");
              setTeamBId("");
            }}
            disabled={saving}
            className={inputClassName}
          >
            <option value="">Select group</option>

            {groups.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName}>Team A</label>

          <select
            value={teamAId}
            onChange={(event) => setTeamAId(event.target.value)}
            disabled={saving || !groupId}
            className={inputClassName}
          >
            <option value="">Select team</option>

            {groupTeams.map((team) => (
              <option
                key={team.id}
                value={team.id}
                disabled={team.id === teamBId}
              >
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName}>Team B</label>

          <select
            value={teamBId}
            onChange={(event) => setTeamBId(event.target.value)}
            disabled={saving || !groupId}
            className={inputClassName}
          >
            <option value="">Select team</option>

            {groupTeams.map((team) => (
              <option
                key={team.id}
                value={team.id}
                disabled={team.id === teamAId}
              >
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            Stream URL (optional)
          </label>

          <input
            type="url"
            value={streamUrl}
            onChange={(event) => setStreamUrl(event.target.value)}
            placeholder="https://..."
            disabled={saving}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-violet-500 px-6 py-3 font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create Tiebreaker"}
        </button>
      </div>
    </form>
  );
}
