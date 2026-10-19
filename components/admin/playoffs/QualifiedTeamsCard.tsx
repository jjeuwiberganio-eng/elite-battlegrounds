"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Undo2 } from "lucide-react";

import {
  savePlayoffQualifiersByGroup,
  suggestQualifiersFromStandings,
} from "@/actions/playoffs";

interface PlayoffTeam {
  registrationId: string;
  teamId: string;
  name: string;
  abbreviation: string | null;
  logo: string | null;
  groupId: string | null;
  groupName: string | null;
}

interface QualifierGroup {
  id: string;
  name: string;
}

interface Assignment {
  groupId: string;
  rank: number;
  registrationId: string;
}

interface QualifiedTeamsCardProps {
  teams: PlayoffTeam[];
  groups: QualifierGroup[];
  perGroup: number;
  playoffSize: number;
  evenSplit: boolean;
  assignments: Assignment[];
}

/* One slot = one group + one rank, e.g. "Group A / Top 2". */
function slotKey(groupId: string, rank: number) {
  return `${groupId}:${rank}`;
}

function toSelection(assignments: Assignment[]) {
  const selection: Record<string, string> = {};

  for (const assignment of assignments) {
    selection[slotKey(assignment.groupId, assignment.rank)] =
      assignment.registrationId;
  }

  return selection;
}

function rankBadgeClassName(rank: number) {
  switch (rank) {
    case 1:
      return "bg-amber-400 text-slate-950";
    case 2:
      return "bg-slate-300 text-slate-950";
    case 3:
      return "bg-orange-400 text-slate-950";
    default:
      return "bg-white/15 text-white";
  }
}

export default function QualifiedTeamsCard({
  teams,
  groups,
  perGroup,
  playoffSize,
  evenSplit,
  assignments,
}: Readonly<QualifiedTeamsCardProps>) {
  const router = useRouter();

  const savedSelection = toSelection(assignments);

  const [selected, setSelected] = useState<
    Record<string, string>
  >(savedSelection);

  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState("");

  const teamByRegistration = new Map(
    teams.map((team) => [team.registrationId, team]),
  );

  const totalSlots = groups.length * perGroup;

  const filledCount = Object.keys(selected).length;

  const isDirty =
    JSON.stringify(
      Object.entries(selected).sort(([a], [b]) =>
        a.localeCompare(b),
      ),
    ) !==
    JSON.stringify(
      Object.entries(savedSelection).sort(([a], [b]) =>
        a.localeCompare(b),
      ),
    );

  const teamsWithoutGroup = teams.filter(
    (team) => team.groupId === null,
  );

  function setSlot(
    groupId: string,
    rank: number,
    registrationId: string,
  ) {
    setError("");

    setSelected((current) => {
      const next = { ...current };
      const key = slotKey(groupId, rank);

      if (registrationId) {
        next[key] = registrationId;
      } else {
        delete next[key];
      }

      return next;
    });
  }

  function clearGroup(groupId: string) {
    setError("");

    setSelected((current) => {
      const next = { ...current };

      for (let rank = 1; rank <= perGroup; rank += 1) {
        delete next[slotKey(groupId, rank)];
      }

      return next;
    });
  }

  async function handleSuggest() {
    setError("");
    setSuggesting(true);

    try {
      const result =
        await suggestQualifiersFromStandings();

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setSelected(toSelection(result.slots));

      toast.success(
        "Loaded each group's current top teams. Review them, then save.",
      );
    } catch {
      toast.error(
        "Failed to load suggestions. Please try again.",
      );
    } finally {
      setSuggesting(false);
    }
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      const slots = Object.entries(selected).map(
        ([key, registrationId]) => {
          const [groupId, rank] = key.split(":");

          return {
            groupId,
            rank: Number(rank),
            registrationId,
          };
        },
      );

      const result =
        await savePlayoffQualifiersByGroup(slots);

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Playoff qualifiers saved.");
      router.refresh();
    } catch {
      const message =
        "Failed to save the qualifiers. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
      {/* HEADER */}
      <div className="border-b border-white/10 bg-white/[0.03] px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              Playoff Qualification
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Qualified Teams by Group
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Choose who holds each qualifying place in every
              group (Top 1
              {perGroup > 1 ? ` to Top ${perGroup}` : ""}).
              Each place can only be filled by a team from that
              group. Leave a place empty and it shows as TBD on
              the standings page.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Filled
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              <span className="text-amber-400">
                {filledCount}
              </span>
              {" / "}
              {totalSlots}
            </p>
          </div>
        </div>
      </div>

      {/* NOTICES */}
      {!evenSplit && groups.length > 0 && (
        <div className="mx-6 mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm font-semibold text-amber-200 md:mx-8">
          The playoff size ({playoffSize}) doesn&apos;t split
          evenly across {groups.length} groups, so each group
          gets {perGroup} places ({totalSlots} in total). Change
          the playoff size above if you want a different split.
        </div>
      )}

      {teamsWithoutGroup.length > 0 && (
        <div className="mx-6 mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300 md:mx-8">
          <span className="font-bold text-white">
            {teamsWithoutGroup.length}{" "}
            {teamsWithoutGroup.length === 1
              ? "approved team has"
              : "approved teams have"}{" "}
            no group
          </span>{" "}
          and can&apos;t be picked yet:{" "}
          {teamsWithoutGroup
            .map((team) => team.name)
            .join(", ")}
          . Assign a group from the Teams page first.
        </div>
      )}

      {error && (
        <div className="mx-6 mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300 md:mx-8">
          {error}
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* TOOLBAR */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSuggest}
            disabled={saving || suggesting}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 px-4 py-2.5 text-sm font-bold text-amber-400 transition hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />

            {suggesting
              ? "Loading..."
              : "Fill from current standings"}
          </button>

          <button
            type="button"
            onClick={() => {
              setSelected(savedSelection);
              setError("");
            }}
            disabled={saving || !isDirty}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Undo2 className="h-4 w-4" />
            Undo changes
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="font-semibold text-slate-400">
              There are no groups yet.
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Create the group stage groups in Tournament Stages
              first.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {groups.map((group) => {
              const groupTeams = teams.filter(
                (team) => team.groupId === group.id,
              );

              const filledInGroup = Array.from(
                { length: perGroup },
                (_, index) =>
                  slotKey(group.id, index + 1),
              ).filter((key) => key in selected).length;

              return (
                <div
                  key={group.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-white">
                        {group.name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {filledInGroup} of {perGroup} places
                        filled · {groupTeams.length}{" "}
                        {groupTeams.length === 1
                          ? "team"
                          : "teams"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => clearGroup(group.id)}
                      disabled={saving || filledInGroup === 0}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-400 transition hover:border-red-500/30 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Clear group
                    </button>
                  </div>

                  <div className="space-y-3">
                    {Array.from(
                      { length: perGroup },
                      (_, index) => index + 1,
                    ).map((rank) => {
                      const key = slotKey(group.id, rank);
                      const registrationId = selected[key] ?? "";

                      const team = registrationId
                        ? teamByRegistration.get(registrationId)
                        : undefined;

                      return (
                        <div
                          key={rank}
                          className="flex items-center gap-3"
                        >
                          <span
                            className={`flex h-9 w-14 shrink-0 items-center justify-center rounded-lg text-xs font-black ${rankBadgeClassName(
                              rank,
                            )}`}
                          >
                            Top {rank}
                          </span>

                          {team?.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={team.logo}
                              alt=""
                              className="h-9 w-9 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[10px] font-black text-slate-400">
                              {team
                                ? team.name
                                    .slice(0, 2)
                                    .toUpperCase()
                                : "—"}
                            </div>
                          )}

                          <select
                            aria-label={`${group.name} Top ${rank}`}
                            value={registrationId}
                            disabled={saving}
                            onChange={(event) =>
                              setSlot(
                                group.id,
                                rank,
                                event.target.value,
                              )
                            }
                            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-amber-500 disabled:opacity-50"
                          >
                            <option value="">
                              — Empty (TBD) —
                            </option>

                            {groupTeams.map((groupTeam) => {
                              /* A team can only hold one place. */
                              const takenElsewhere =
                                Object.entries(selected).some(
                                  ([otherKey, otherId]) =>
                                    otherKey !== key &&
                                    otherId ===
                                      groupTeam.registrationId,
                                );

                              return (
                                <option
                                  key={groupTeam.registrationId}
                                  value={groupTeam.registrationId}
                                  disabled={takenElsewhere}
                                >
                                  {groupTeam.name}
                                  {takenElsewhere
                                    ? " (already placed)"
                                    : ""}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-col items-end gap-2">
          {isDirty && (
            <p className="text-xs font-semibold text-amber-400">
              You have unsaved changes.
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="rounded-2xl bg-amber-500 px-7 py-3 font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save Qualified Teams"}
          </button>
        </div>
      </div>
    </section>
  );
}
