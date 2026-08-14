"use client";

import { useMemo, useState } from "react";
import { saveQualifiedTeams } from "@/actions/playoffs";

interface PlayoffTeam {
  registrationId: string;
  teamId: string;
  name: string;
  abbreviation: string | null;
  logo: string | null;
  playerCount: number;
  qualified: boolean;
  seed: number | null;
}

interface QualifiedTeam {
  id: string;
  seed: number;
  registrationId: string;
  team: {
    id: string;
    name: string;
    abbreviation: string | null;
    logo: string | null;
  };
}

interface QualifiedTeamsCardProps {
  teams: PlayoffTeam[];
  qualifiedTeams: QualifiedTeam[];
  playoffSize: number;
}

export default function QualifiedTeamsCard({
  teams,
  qualifiedTeams,
  playoffSize,
}: Readonly<QualifiedTeamsCardProps>) {
  const initialSelection = useMemo(() => {
    return qualifiedTeams.reduce<
      Record<string, number>
    >((result, qualification) => {
      result[qualification.registrationId] =
        qualification.seed;

      return result;
    }, {});
  }, [qualifiedTeams]);

  const [selected, setSelected] =
    useState<Record<string, number>>(
      initialSelection,
    );

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function toggleTeam(
    registrationId: string,
  ) {
    setMessage("");
    setError("");

    setSelected((current) => {
      const next = {
        ...current,
      };

      if (
        registrationId in next
      ) {
        delete next[registrationId];
        return next;
      }

      const usedSeeds = new Set(
        Object.values(next),
      );

      let nextSeed = 1;

      while (
        usedSeeds.has(nextSeed) &&
        nextSeed <= playoffSize
      ) {
        nextSeed += 1;
      }

      if (nextSeed > playoffSize) {
        setError(
          `You can only select ${playoffSize} teams.`,
        );

        return current;
      }

      next[registrationId] =
        nextSeed;

      return next;
    });
  }

  function changeSeed(
    registrationId: string,
    value: string,
  ) {
    setMessage("");
    setError("");

    const seed = Number(value);

    if (
      !Number.isInteger(seed) ||
      seed < 1 ||
      seed > playoffSize
    ) {
      return;
    }

    setSelected((current) => {
      const existingEntry =
        Object.entries(current).find(
          ([id, currentSeed]) =>
            id !== registrationId &&
            currentSeed === seed,
        );

      if (existingEntry) {
        return current;
      }

      return {
        ...current,
        [registrationId]: seed,
      };
    });
  }

  async function handleSave() {
    setMessage("");
    setError("");

    const selections = Object.entries(
      selected,
    ).map(
      ([
        registrationId,
        seed,
      ]) => ({
        registrationId,
        seed,
      }),
    );

    if (
      selections.length !== playoffSize
    ) {
      setError(
        `Please select exactly ${playoffSize} teams.`,
      );

      return;
    }

    const seeds = selections.map(
      (selection) =>
        selection.seed,
    );

    if (
      new Set(seeds).size !==
      playoffSize
    ) {
      setError(
        "Each team must have a unique seed.",
      );

      return;
    }

    setSaving(true);

    try {
      await saveQualifiedTeams(
        selections,
      );

      setMessage(
        "Playoff teams saved successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save playoff teams.",
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedCount =
    Object.keys(selected).length;

  const selectedTeams =
    teams.filter(
      (team) =>
        team.registrationId in
        selected,
    );

  const availableTeams =
    teams.filter(
      (team) =>
        !(
          team.registrationId in
          selected
        ),
    );

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
      <div className="border-b border-white/10 bg-white/[0.03] px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              Playoff Qualification
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Select Qualified Teams
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Manually choose the teams that
              will participate in the playoffs
              and assign their seeds.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Selected
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              <span className="text-amber-400">
                {selectedCount}
              </span>
              {" / "}
              {playoffSize}
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mx-6 mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300 md:mx-8">
          {message}
        </div>
      )}

      {error && (
        <div className="mx-6 mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300 md:mx-8">
          {error}
        </div>
      )}

      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h3 className="text-lg font-black text-white">
            Qualified Teams
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            These teams will appear in the
            playoff bracket according to their
            assigned seed.
          </p>
        </div>

        {selectedTeams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="font-semibold text-slate-400">
              No playoff teams selected yet.
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Select teams from the list below.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {selectedTeams
              .sort(
                (a, b) =>
                  (selected[a.registrationId] ??
                    999) -
                  (selected[b.registrationId] ??
                    999),
              )
              .map((team) => (
                <div
                  key={
                    team.registrationId
                  }
                  className="flex flex-col gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={`${team.name} logo`}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-sm font-black text-slate-400">
                        {team.name
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-black text-white">
                        {team.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {team.abbreviation ||
                          "No abbreviation"}
                        {" • "}
                        {team.playerCount} players
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label
                      htmlFor={`seed-${team.registrationId}`}
                      className="text-sm font-semibold text-slate-400"
                    >
                      Seed
                    </label>

                    <select
                      id={`seed-${team.registrationId}`}
                      value={
                        selected[
                          team.registrationId
                        ] ?? ""
                      }
                      onChange={(event) =>
                        changeSeed(
                          team.registrationId,
                          event.target.value,
                        )
                      }
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 font-bold text-white outline-none focus:border-amber-500"
                    >
                      {Array.from(
                        {
                          length:
                            playoffSize,
                        },
                        (_, index) =>
                          index + 1,
                      ).map((seed) => (
                        <option
                          key={seed}
                          value={seed}
                        >
                          {seed}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        toggleTeam(
                          team.registrationId,
                        )
                      }
                      className="rounded-xl border border-red-500/20 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="my-8 border-t border-white/10" />

        <div className="mb-4">
          <h3 className="text-lg font-black text-white">
            Approved Teams
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Only approved tournament teams can
            be selected for the playoffs.
          </p>
        </div>

        {availableTeams.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-8 text-center">
            <p className="text-sm font-semibold text-slate-500">
              All approved teams are currently
              selected.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {availableTeams.map(
              (team) => (
                <button
                  key={
                    team.registrationId
                  }
                  type="button"
                  onClick={() =>
                    toggleTeam(
                      team.registrationId,
                    )
                  }
                  disabled={
                    selectedCount >=
                    playoffSize
                  }
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-amber-500/30 hover:bg-amber-500/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {team.logo ? (
                    <img
                      src={team.logo}
                      alt={`${team.name} logo`}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xs font-black text-slate-400">
                      {team.name
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">
                      {team.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {team.abbreviation ||
                        "No abbreviation"}
                    </p>
                  </div>

                  <span className="ml-auto text-xl font-black text-amber-400">
                    +
                  </span>
                </button>
              ),
            )}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              selectedCount !==
                playoffSize
            }
            className="rounded-2xl bg-amber-500 px-7 py-3 font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving
              ? "Saving..."
              : "Save Qualified Teams"}
          </button>
        </div>
      </div>
    </section>
  );
}