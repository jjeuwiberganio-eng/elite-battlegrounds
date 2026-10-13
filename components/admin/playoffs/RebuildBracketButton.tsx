"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { rebuildCurrentPlayoffBracketStructure } from "@/actions/playoffs";
import { useConfirm } from "@/components/admin/shared/ConfirmProvider";
import { toast } from "sonner";

export default function RebuildBracketButton() {
  const confirm = useConfirm();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleRebuild() {
    const confirmed = await confirm({
      title: "Rebuild the playoff bracket?",
      description:
        "This deletes the existing empty bracket slots and replaces them with the full 22-slot structure. It is only safe while no teams, scores or results have been assigned.",
      confirmLabel: "Rebuild bracket",
    });

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await rebuildCurrentPlayoffBracketStructure();

      router.refresh();
    } catch (error) {
      toast.error(
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