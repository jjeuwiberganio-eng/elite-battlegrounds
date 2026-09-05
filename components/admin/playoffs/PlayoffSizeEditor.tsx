"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";

import { updatePlayoffSize } from "@/actions/playoffs";

interface PlayoffSizeEditorProps {
  currentSize: number;
}

export default function PlayoffSizeEditor({
  currentSize,
}: Readonly<PlayoffSizeEditorProps>) {
  const router = useRouter();

  const [editing, setEditing] =
    useState(false);

  const [value, setValue] = useState(
    String(currentSize),
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  function startEditing() {
    setValue(String(currentSize));
    setError(null);
    setEditing(true);
  }

  async function handleSave() {
    const parsed = Number(value);

    if (
      !Number.isInteger(parsed) ||
      parsed < 2
    ) {
      setError(
        "Enter a whole number of at least 2.",
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updatePlayoffSize(parsed);

      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update playoff size.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-amber-500/40 hover:bg-white/10"
      >
        Playoff Size:
        <span className="text-amber-400">
          {currentSize} Teams
        </span>
        <Pencil className="h-3.5 w-3.5 text-slate-500" />
      </button>
    );
  }

  return (
    <div className="mt-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-white/5 px-3 py-1.5">
        <span className="text-sm font-bold text-slate-300">
          Playoff Size:
        </span>

        <input
          type="number"
          min={2}
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          autoFocus
          className="w-16 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-center text-sm font-black text-amber-400 outline-none focus:border-amber-500"
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleSave}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => setEditing(false)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:text-white disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-400">
          {error}
        </p>
      )}

      <p className="mt-2 text-xs text-slate-500">
        Lowering this removes any qualified
        teams currently seeded above the new
        size.
      </p>
    </div>
  );
}
