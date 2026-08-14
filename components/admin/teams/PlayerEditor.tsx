"use client";

import { Plus, Trash2 } from "lucide-react";
import type { PlayerRole } from "@prisma/client";

export interface TeamPlayerFormValue {
  id?: string;
  inGameName: string;
  role: PlayerRole | "";
  isCaptain: boolean;
  isSubstitute: boolean;
}

interface PlayerEditorProps {
  players: TeamPlayerFormValue[];
  onChange: (players: TeamPlayerFormValue[]) => void;
  disabled?: boolean;
}

const MAX_PLAYERS = 6;

const PLAYER_ROLES = [
  {
    value: "EXP",
    label: "EXP Laner",
  },
  {
    value: "JUNGLE",
    label: "Jungler",
  },
  {
    value: "MID",
    label: "Mid Laner",
  },
  {
    value: "GOLD",
    label: "Gold Laner",
  },
  {
    value: "ROAM",
    label: "Roamer",
  },
  {
    value: "SUBSTITUTE",
    label: "Substitute",
  },
];

function createEmptyPlayer(): TeamPlayerFormValue {
  return {
    inGameName: "",
    role: "",
    isCaptain: false,
    isSubstitute: false,
  };
}

export default function PlayerEditor({
  players,
  onChange,
  disabled = false,
}: Readonly<PlayerEditorProps>) {
  function addPlayer() {
    if (players.length >= MAX_PLAYERS) {
      return;
    }

    onChange([
      ...players,
      createEmptyPlayer(),
    ]);
  }

  function removePlayer(index: number) {
    onChange(
      players.filter(
        (_, playerIndex) => playerIndex !== index,
      ),
    );
  }

  function updatePlayer(
    index: number,
    updates: Partial<TeamPlayerFormValue>,
  ) {
    onChange(
      players.map((player, playerIndex) =>
        playerIndex === index
          ? {
              ...player,
              ...updates,
            }
          : player,
      ),
    );
  }

  function setCaptain(
    index: number,
    checked: boolean,
  ) {
    onChange(
      players.map((player, playerIndex) => ({
        ...player,
        isCaptain:
          playerIndex === index ? checked : false,
      })),
    );
  }

  function setSubstitute(
    index: number,
    checked: boolean,
  ) {
    onChange(
      players.map((player, playerIndex) => ({
        ...player,
        isSubstitute:
          playerIndex === index ? checked : false,
      })),
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            Team Roster
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Players
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add the team's players using their IGN and
            tournament role.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
          {players.length} / {MAX_PLAYERS}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {players.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-white/[0.02] p-8 text-center">
            <p className="font-semibold text-slate-300">
              No players added yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add the team's players below.
            </p>
          </div>
        )}

        {players.map((player, index) => (
          <div
            key={
              player.id ??
              `new-player-${index}`
            }
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex flex-col gap-5">
              {/* Player heading */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-sm font-black text-amber-400">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-bold text-white">
                      Player {index + 1}
                    </p>

                    <p className="text-xs text-slate-500">
                      IGN & role
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removePlayer(index)
                  }
                  disabled={disabled}
                  className="rounded-xl border border-slate-700 p-2 text-slate-400 transition hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove Player ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* IGN + Role */}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={`player-ign-${index}`}
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    IGN *
                  </label>

                  <input
                    id={`player-ign-${index}`}
                    type="text"
                    value={player.inGameName}
                    onChange={(event) =>
                      updatePlayer(index, {
                        inGameName:
                          event.target.value,
                      })
                    }
                    disabled={disabled}
                    maxLength={50}
                    placeholder="Enter player IGN"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`player-role-${index}`}
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Role *
                  </label>

                  <select
                    id={`player-role-${index}`}
                    value={player.role}
                    onChange={(event) =>
                      updatePlayer(index, {
                        role: event.target.value as TeamPlayerFormValue["role"],
                      })
                    }
                    disabled={disabled}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      Select Role
                    </option>

                    {PLAYER_ROLES.map(
                      (role) => (
                        <option
                          key={role.value}
                          value={role.value}
                        >
                          {role.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* Captain / Substitute */}

              <div className="flex flex-wrap gap-6 border-t border-slate-800 pt-4">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={player.isCaptain}
                    onChange={(event) =>
                      setCaptain(
                        index,
                        event.target.checked,
                      )
                    }
                    disabled={disabled}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                  />

                  Captain
                </label>

                <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={player.isSubstitute}
                    onChange={(event) =>
                      setSubstitute(
                        index,
                        event.target.checked,
                      )
                    }
                    disabled={disabled}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                  />

                  Substitute
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add player */}

      <div className="mt-6">
        <button
          type="button"
          onClick={addPlayer}
          disabled={
            disabled ||
            players.length >= MAX_PLAYERS
          }
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 px-5 py-4 font-bold text-amber-400 transition hover:border-amber-500 hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-transparent disabled:text-slate-600"
        >
          <Plus className="h-5 w-5" />

          {players.length >= MAX_PLAYERS
            ? "Maximum 6 Players"
            : "Add Player"}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-white/[0.02] p-4">
        <p className="text-xs leading-5 text-slate-500">
          Maximum 6 players per team. Only one
          player can be designated as Captain and
          only one player can be designated as
          Substitute.
        </p>
      </div>
    </section>
  );
}