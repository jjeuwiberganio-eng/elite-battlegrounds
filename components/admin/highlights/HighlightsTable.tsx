"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowUp,
  ArrowDown,
  Star,
  Trash2,
} from "lucide-react";

import type { AdminHighlight } from "@/actions/highlights";
import {
  updateHighlight,
  deleteHighlight,
  moveHighlight,
} from "@/actions/highlights";

interface HighlightsTableProps {
  highlights: AdminHighlight[];
}

export default function HighlightsTable({
  highlights,
}: Readonly<HighlightsTableProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType =
    searchParams.get("type") || "all";

  const [busyId, setBusyId] = useState<
    string | null
  >(null);

  const filtered = useMemo(() => {
    if (activeType === "all") {
      return highlights;
    }

    return highlights.filter(
      (highlight) =>
        highlight.type === activeType,
    );
  }, [highlights, activeType]);

  async function handleToggleFeatured(
    highlight: AdminHighlight,
  ) {
    try {
      setBusyId(highlight.id);

      await updateHighlight({
        highlightId: highlight.id,
        title: highlight.title,
        featured: !highlight.featured,
      });

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(
    highlight: AdminHighlight,
    direction: "up" | "down",
  ) {
    try {
      setBusyId(highlight.id);

      await moveHighlight(
        highlight.id,
        direction,
      );

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to reorder.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(
    highlight: AdminHighlight,
  ) {
    const confirmed = window.confirm(
      `Delete "${highlight.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyId(highlight.id);

      await deleteHighlight(highlight.id);

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (filtered.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
        <p className="text-slate-400">
          No highlights yet.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      {filtered.map((highlight, index) => (
        <div
          key={highlight.id}
          className="flex items-center gap-4 px-4 py-3"
        >
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-950">
            <Image
              src={highlight.thumbnailUrl}
              alt={highlight.title}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">
              {highlight.title}
            </p>

            <p className="text-xs uppercase tracking-wide text-slate-500">
              {highlight.type ===
              "VIDEO"
                ? "Video"
                : "Poster"}
            </p>
          </div>

          <button
            type="button"
            disabled={
              busyId === highlight.id
            }
            onClick={() =>
              handleToggleFeatured(
                highlight,
              )
            }
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition disabled:opacity-50 ${
              highlight.featured
                ? "border-amber-500 bg-amber-500/15 text-amber-400"
                : "border-white/10 text-slate-500 hover:text-white"
            }`}
            title={
              highlight.featured
                ? "Featured"
                : "Mark as featured"
            }
          >
            <Star className="h-4 w-4" />
          </button>

          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              disabled={
                busyId === highlight.id ||
                index === 0
              }
              onClick={() =>
                handleMove(
                  highlight,
                  "up",
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:text-white disabled:opacity-30"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              disabled={
                busyId === highlight.id ||
                index === filtered.length - 1
              }
              onClick={() =>
                handleMove(
                  highlight,
                  "down",
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:text-white disabled:opacity-30"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            disabled={
              busyId === highlight.id
            }
            onClick={() =>
              handleDelete(highlight)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-500/30 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
