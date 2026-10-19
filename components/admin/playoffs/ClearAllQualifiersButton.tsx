"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eraser } from "lucide-react";

import { clearAllPlayoffQualifications } from "@/actions/playoff-qualifiers-bulk";
import { useConfirm } from "@/components/admin/shared/ConfirmProvider";
import { toast } from "sonner";

export default function ClearAllQualifiersButton() {
  const confirm = useConfirm();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClear() {
    const confirmed = await confirm({
      title: "Remove all playoff qualifiers?",
      description:
        "This empties every group's qualifying places. You'll need to assign them again once the group stage finishes. This can't be undone.",
      confirmLabel: "Clear qualifiers",
    });

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await clearAllPlayoffQualifications();

      toast.success(result.message);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to clear qualifiers.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={handleClear}
        className="flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Eraser className="h-4 w-4" />
        {loading ? "Clearing..." : "Clear All Qualifiers"}
      </button>

      {error && (
        <p className="text-xs font-semibold text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}