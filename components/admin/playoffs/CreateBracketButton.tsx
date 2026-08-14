"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createPlayoffBracket } from "@/actions/playoffs";

export default function CreateBracketButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setLoading(true);
    setError("");

    try {
      await createPlayoffBracket();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create playoff bracket.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCreate}
        disabled={loading}
        className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating Bracket..." : "Create Blank Bracket"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}