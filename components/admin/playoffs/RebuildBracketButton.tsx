"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { rebuildCurrentPlayoffBracketStructure } from "@/actions/playoffs";

export default function RebuildBracketButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleRebuild() {
    const confirmed = window.confirm(
      "Rebuild the current playoff bracket structure?\n\n" +
        "This will delete the existing empty bracket slots and " +
        "replace them with the full 22-slot structure.\n\n" +
        "This is only safe while no teams, scores, or results " +
        "have been assigned.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await rebuildCurrentPlayoffBracketStructure();

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to rebuild the playoff bracket.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleRebuild}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-black text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RefreshCw
        className={`h-4 w-4 ${
          loading ? "animate-spin" : ""
        }`}
      />

      {loading
        ? "Rebuilding..."
        : "Rebuild Bracket Structure"}
    </button>
  );
}