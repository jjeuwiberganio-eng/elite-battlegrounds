"use client";

import { useState } from "react";
import { Check, Crown, Pencil, X } from "lucide-react";

import {
  assignTeamToPlayoffSlot,
  removeTeamFromPlayoffSlot,
  updatePlayoffResult,
} from "@/actions/playoffs";

interface BracketTeam {
  registrationId: string;
  id: string;
  name: string;
  logo: string | null;
}

interface BracketTeamOption {
  registrationId: string;
  teamId: string;
  name: string;
  abbreviation: string | null;
  logo: string | null;
  playerCount: number;
  qualified: boolean;
  seed: number | null;
}

interface BracketSlot {
  id: string;
  slotKey: string;
  label: string;
  bracketSide: string;
  roundOrder: number;
  slotOrder: number;
  positionX: number | null;
  positionY: number | null;

  teamA: BracketTeam | null;
  teamB: BracketTeam | null;

  scoreA: number;
  scoreB: number;

  winner: {
    registrationId: string;
    teamId: string;
  } | null;

  isCompleted: boolean;
}

interface BracketBoardProps {
  slots: BracketSlot[];
  teams: BracketTeamOption[];
}

interface MatchEditorProps {
  slot: BracketSlot;
  teams: BracketTeamOption[];
  onClose: () => void;
  onSaved: () => void;
}

function TeamRow({
  team,
  score,
  isWinner,
  isCompleted,
}: {
  team: BracketTeam | null;
  score: number;
  isWinner: boolean;
  isCompleted: boolean;
}) {
  return (
    <div
      className={`flex min-h-10 items-center justify-between gap-3 border-t border-white/10 px-3 py-2 ${
        isWinner ? "bg-amber-500/10" : "bg-slate-950/60"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {isWinner && (
          <Crown
            className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
          />
        )}

        {team?.logo ? (
          <img
            src={team.logo}
            alt=""
            className="h-6 w-6 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="h-6 w-6 shrink-0 rounded-full border border-white/10 bg-slate-800" />
        )}

        <span
          className={`truncate text-sm font-bold ${
            isWinner ? "text-amber-300" : "text-slate-200"
          }`}
        >
          {team?.name ?? "TBD"}
        </span>
      </div>

      <span
        className={`shrink-0 text-sm font-black ${
          isWinner ? "text-amber-400" : "text-slate-400"
        }`}
      >
        {team && isCompleted ? score : "-"}
      </span>
    </div>
  );
}

function MatchEditor({
  slot,
  teams,
  onClose,
  onSaved,
}: MatchEditorProps) {
  const [teamA, setTeamA] = useState(
    slot.teamA?.registrationId ?? "",
  );

  const [teamB, setTeamB] = useState(
    slot.teamB?.registrationId ?? "",
  );

  const [scoreA, setScoreA] = useState(
    String(slot.scoreA),
  );

  const [scoreB, setScoreB] = useState(
    String(slot.scoreB),
  );

  const [winner, setWinner] = useState(
    slot.winner?.registrationId ?? "",
  );

  const [isCompleted, setIsCompleted] = useState(
    slot.isCompleted,
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveMatch() {
    setError("");
    setSaving(true);

    try {
      const newTeamA = teamA || null;
      const newTeamB = teamB || null;

      const oldTeamA =
        slot.teamA?.registrationId ?? null;

      const oldTeamB =
        slot.teamB?.registrationId ?? null;

      if (newTeamA !== oldTeamA) {
        await assignTeamToPlayoffSlot({
          slotId: slot.id,
          side: "A",
          registrationId: newTeamA,
        });
      }

      if (newTeamB !== oldTeamB) {
        await assignTeamToPlayoffSlot({
          slotId: slot.id,
          side: "B",
          registrationId: newTeamB,
        });
      }

      const parsedScoreA = Number(scoreA);
      const parsedScoreB = Number(scoreB);

      if (
        !Number.isInteger(parsedScoreA) ||
        parsedScoreA < 0 ||
        !Number.isInteger(parsedScoreB) ||
        parsedScoreB < 0
      ) {
        throw new Error(
          "Scores must be whole numbers greater than or equal to 0.",
        );
      }

      const selectedWinner =
        winner || null;

      if (
        selectedWinner &&
        selectedWinner !== newTeamA &&
        selectedWinner !== newTeamB
      ) {
        throw new Error(
          "Winner must be one of the assigned teams.",
        );
      }

      await updatePlayoffResult({
        slotId: slot.id,
        scoreA: parsedScoreA,
        scoreB: parsedScoreB,
        winnerRegistrationId:
          selectedWinner,
        isCompleted,
      });

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save the match.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeTeam(
    side: "A" | "B",
  ) {
    setError("");
    setSaving(true);

    try {
      await removeTeamFromPlayoffSlot({
        slotId: slot.id,
        side,
      });

      if (side === "A") {
        setTeamA("");
      } else {
        setTeamB("");
      }

      if (
        winner ===
        (side === "A" ? teamA : teamB)
      ) {
        setWinner("");
      }

      setIsCompleted(false);

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove the team.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 rounded-2xl border border-amber-500/20 bg-slate-900 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-amber-400">
            Edit Match
          </p>

          <p className="mt-1 text-sm font-bold text-white">
            {slot.label}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Team A */}

        <div>
          <label
            htmlFor={`${slot.id}-team-a`}
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Team A
          </label>

          <div className="flex gap-2">
            <select
              id={`${slot.id}-team-a`}
              value={teamA}
              onChange={(event) =>
                setTeamA(event.target.value)
              }
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm font-semibold text-white outline-none focus:border-amber-500/50"
            >
              <option value="">
                TBD / Empty
              </option>

              {teams.map((team) => (
                <option
                  key={team.registrationId}
                  value={team.registrationId}
                >
                  {team.name}
                  {team.seed
                    ? ` — Seed ${team.seed}`
                    : ""}
                </option>
              ))}
            </select>

            {slot.teamA && (
              <button
                type="button"
                disabled={saving}
                onClick={() => removeTeam("A")}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-red-400 transition hover:bg-red-500/20"
                title="Remove Team A"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Team B */}

        <div>
          <label
            htmlFor={`${slot.id}-team-b`}
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Team B
          </label>

          <div className="flex gap-2">
            <select
              id={`${slot.id}-team-b`}
              value={teamB}
              onChange={(event) =>
                setTeamB(event.target.value)
              }
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm font-semibold text-white outline-none focus:border-amber-500/50"
            >
              <option value="">
                TBD / Empty
              </option>

              {teams.map((team) => (
                <option
                  key={team.registrationId}
                  value={team.registrationId}
                >
                  {team.name}
                  {team.seed
                    ? ` — Seed ${team.seed}`
                    : ""}
                </option>
              ))}
            </select>

            {slot.teamB && (
              <button
                type="button"
                disabled={saving}
                onClick={() => removeTeam("B")}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-red-400 transition hover:bg-red-500/20"
                title="Remove Team B"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scores */}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${slot.id}-score-a`}
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Score A
            </label>

            <input
              id={`${slot.id}-score-a`}
              type="number"
              min="0"
              step="1"
              value={scoreA}
              onChange={(event) =>
                setScoreA(event.target.value)
              }
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm font-black text-white outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label
              htmlFor={`${slot.id}-score-b`}
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Score B
            </label>

            <input
              id={`${slot.id}-score-b`}
              type="number"
              min="0"
              step="1"
              value={scoreB}
              onChange={(event) =>
                setScoreB(event.target.value)
              }
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm font-black text-white outline-none focus:border-amber-500/50"
            />
          </div>
        </div>


      {/* Winner */}

      <div>
        <p className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
          Match Result
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={saving || !teamA || !teamB}
            onClick={() => {
              setWinner(teamA);
              setIsCompleted(true);
            }}
            className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
              winner === teamA
                ? "border-amber-400 bg-amber-500/20 text-amber-300"
                : "border-white/10 bg-slate-950 text-slate-300 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {winner === teamA ? "👑 " : ""}
            {teamA
              ? teams.find(
                  (team) => team.registrationId === teamA,
                )?.name ?? "Team A"
              : "Team A"}{" "}
            Won
          </button>

          <button
            type="button"
            disabled={saving || !teamA || !teamB}
            onClick={() => {
              setWinner(teamB);
              setIsCompleted(true);
            }}
            className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
              winner === teamB
                ? "border-amber-400 bg-amber-500/20 text-amber-300"
                : "border-white/10 bg-slate-950 text-slate-300 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {winner === teamB ? "👑 " : ""}
            {teamB
              ? teams.find(
                  (team) => team.registrationId === teamB,
                )?.name ?? "Team B"
              : "Team B"}{" "}
            Won
          </button>
        </div>

        {winner && (
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setWinner("");
              setIsCompleted(false);
            }}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            Clear Result
          </button>
        )}
      </div>

        {/* Completed */}

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 py-3">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(event) =>
              setIsCompleted(event.target.checked)
            }
            disabled={saving}
            className="h-4 w-4 accent-amber-500"
          />

          <span className="text-sm font-bold text-slate-200">
            Mark match as completed
          </span>
        </label>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={saveMatch}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check className="h-4 w-4" />

            {saving
              ? "Saving..."
              : "Save Match"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchBox({
  slot,
  teams,
}: {
  slot: BracketSlot;
  teams: BracketTeamOption[];
}) {
  const [editing, setEditing] =
    useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 shadow-lg">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          {slot.label}
        </span>

        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <Pencil className="h-3 w-3" />

          {editing ? "Close" : "Edit"}
        </button>
      </div>

      <TeamRow
        team={slot.teamA}
        score={slot.scoreA}
        isWinner={
          slot.winner?.registrationId ===
          slot.teamA?.registrationId
        }
        isCompleted={slot.isCompleted}
      />

      <TeamRow
        team={slot.teamB}
        score={slot.scoreB}
        isWinner={
          slot.winner?.registrationId ===
          slot.teamB?.registrationId
        }
        isCompleted={slot.isCompleted}
      />

      <div className="border-t border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {slot.isCompleted
          ? "Completed"
          : "Not completed"}
      </div>

      {editing && (
        <MatchEditor
          slot={slot}
          teams={teams}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

function getRounds(
  slots: BracketSlot[],
  side: string,
) {
  const sideSlots = slots.filter(
    (slot) => slot.bracketSide === side,
  );

  const rounds = new Map<
    number,
    BracketSlot[]
  >();

  for (const slot of sideSlots) {
    const existing =
      rounds.get(slot.roundOrder) ?? [];

    existing.push(slot);

    rounds.set(
      slot.roundOrder,
      existing,
    );
  }

  return Array.from(rounds.entries())
    .sort(([a], [b]) => a - b)
    .map(([round, roundSlots]) => ({
      round,
      slots: roundSlots.sort(
        (a, b) =>
          a.slotOrder - b.slotOrder,
      ),
    }));
}

export default function BracketBoard({
  slots,
  teams,
}: BracketBoardProps) {
  const upperRounds = getRounds(
    slots,
    "UPPER",
  );

  const lowerRounds = getRounds(
    slots,
    "LOWER",
  );

  const grandFinalRounds = getRounds(
    slots,
    "GRAND_FINAL",
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
          Manual State Board
        </p>

        <h2 className="mt-1 text-2xl font-black text-white">
          Playoff Bracket
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Teams, scores, winners, and movement are
          currently controlled manually by the Super
          Admin.
        </p>
      </div>

      {/* Upper Bracket */}

      <section>
        <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-amber-400">
          Upper Bracket
        </h3>

        <div className="overflow-x-auto pb-6">
          <div className="flex min-w-max items-start gap-8">
            {upperRounds.map(
              ({ round, slots: roundSlots }) => (
                <div
                  key={round}
                  className="flex min-w-64 flex-col gap-6"
                >
                  <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Round {round}
                  </div>

                  <div className="flex flex-col gap-6">
                    {roundSlots.map((slot) => (
                      <MatchBox
                        key={slot.id}
                        slot={slot}
                        teams={teams}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Lower Bracket */}

      <section className="mt-8 border-t border-white/10 pt-8">
        <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-amber-400">
          Lower Bracket
        </h3>

        <div className="overflow-x-auto pb-6">
          <div className="flex min-w-max items-start gap-8">
            {lowerRounds.map(
              ({ round, slots: roundSlots }) => (
                <div
                  key={round}
                  className="flex min-w-64 flex-col gap-6"
                >
                  <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Round {round}
                  </div>

                  <div className="flex flex-col gap-6">
                    {roundSlots.map((slot) => (
                      <MatchBox
                        key={slot.id}
                        slot={slot}
                        teams={teams}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Grand Finals */}

      <section className="mt-8 border-t border-white/10 pt-8">
        <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-amber-400">
          Grand Finals
        </h3>

        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-max justify-center">
            {grandFinalRounds.map(
              ({ slots: roundSlots }) => (
                <div
                  key="grand-final"
                  className="flex flex-col gap-6"
                >
                  {roundSlots.map((slot) => (
                    <MatchBox
                      key={slot.id}
                      slot={slot}
                      teams={teams}
                    />
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}