"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { recalculateStandings } from "@/actions/standings";

export default function RecalculateStandingsButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleRecalculate() {
    try {
      setLoading(true);

      const result =
        await recalculateStandings();

      if (!result.success) {
        alert(result.message);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to recalculate standings.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleRecalculate}
      disabled={loading}
      className="
        flex
        items-center
        gap-2
        rounded-2xl
        bg-amber-500
        px-5
        py-3
        font-bold
        text-slate-950
        transition
        hover:bg-amber-400
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      <RefreshCw
        className={`h-4 w-4 ${
          loading ? "animate-spin" : ""
        }`}
      />

      {loading
        ? "Recalculating..."
        : "Recalculate Standings"}
    </button>
  );
}
