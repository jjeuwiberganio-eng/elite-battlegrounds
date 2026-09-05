"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, RotateCcw } from "lucide-react";

import {
  recordMatchResult,
  resetMatchResult,
} from "@/actions/matches";

interface RecordResultFormProps {
  matchId: string;
  teamAName: string;
  teamBName: string;
  initialScoreA: number;
  initialScoreB: number;
  isCompleted: boolean;
  winnerSide: "TEAM_A" | "TEAM_B" | null;
}

export default function RecordResultForm({
  matchId,
  teamAName,
  teamBName,
  initialScoreA,
  initialScoreB,
  isCompleted,
  winnerSide,
}: Readonly<RecordResultFormProps>) {
  const router = useRouter();

  const [expanded, setExpanded] =
    useState(false);

  const [scoreA, setScoreA] = useState(
    String(initialScoreA || 0),
  );

  const [scoreB, setScoreB] = useState(
    String(initialScoreB || 0),
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  async function handleSubmit() {
    setError(null);

    const parsedA = Number(scoreA);
    const parsedB = Number(scoreB);

    if (
      !Number.isInteger(parsedA) ||
      !Number.isInteger(parsedB) ||
      parsedA < 0 ||
      parsedB < 0
    ) {
      setError(
        "Scores must be whole numbers of 0 or more.",
      );
      return;
    }

    if (parsedA === parsedB) {
      setError(
        "Scores can't be tied - pick a winner.",
      );
      return;
    }

    try {
      setLoading(true);

      await recordMatchResult({
        matchId,
        scoreA: parsedA,
        scoreB: parsedB,
      });

      setExpanded(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to record result.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      "Reset this match's result? Scores will be cleared and the match returns to Ready status.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await resetMatchResult(matchId);

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset result.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (isCompleted && !expanded) {
    return (
      <div className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm lg:w-auto">
        <div className="flex items-center gap-2 font-bold text-emerald-300">
          <Trophy className="h-4 w-4" />
          {winnerSide === "TEAM_A"
            ? teamAName
            : teamBName}{" "}
          won {initialScoreA}-
          {initialScoreB}
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleReset}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-red-400 disabled:opacity-50"
        >
          <RotateCcw className="h-3 w-3" />
          Reset Result
        </button>

        {error && (
          <p className="mt-2 text-xs font-semibold text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full rounded-xl border border-amber-500/30 px-5 py-3 text-sm font-bold text-amber-400 transition hover:bg-amber-500/10 lg:w-auto"
      >
        Record Result
      </button>
    );
  }

  return (
    <div className="w-full rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 lg:w-72">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-400">
        Record Result
      </p>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="mb-1 block truncate text-[11px] font-semibold text-slate-400">
            {teamAName}
          </label>

          <input
            type="number"
            min={0}
            value={scoreA}
            onChange={(event) =>
              setScoreA(event.target.value)
            }
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-center font-black text-white outline-none focus:border-amber-500"
          />
        </div>

        <span className="mt-4 font-black text-slate-500">
          -
        </span>

        <div className="flex-1">
          <label className="mb-1 block truncate text-[11px] font-semibold text-slate-400">
            {teamBName}
          </label>

          <input
            type="number"
            min={0}
            value={scoreB}
            onChange={(event) =>
              setScoreB(event.target.value)
            }
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-center font-black text-white outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs font-semibold text-red-400">
          {error}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-black uppercase text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : "Confirm Result"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => setExpanded(false)}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-400 transition hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
