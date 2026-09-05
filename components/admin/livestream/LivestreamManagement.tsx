"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Radio, StopCircle } from "lucide-react";

import {
  setMatchLive,
  endLivestream,
  type LivestreamCandidate,
} from "@/actions/livestream";

interface LivestreamManagementProps {
  candidates: LivestreamCandidate[];
}

export default function LivestreamManagement({
  candidates,
}: Readonly<LivestreamManagementProps>) {
  const router = useRouter();

  const liveMatch = candidates.find(
    (candidate) =>
      candidate.status === "LIVE",
  );

  const [selectedId, setSelectedId] =
    useState(
      liveMatch?.id ??
        candidates[0]?.id ??
        "",
    );

  const [streamUrl, setStreamUrl] =
    useState(
      liveMatch?.streamUrl ?? "",
    );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<
    string | null
  >(null);

  async function handleGoLive() {
    if (!selectedId) {
      setError(
        "Pick a match first.",
      );
      return;
    }

    try {
      setBusy(true);
      setError(null);

      await setMatchLive({
        matchId: selectedId,
        streamUrl,
      });

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to go live.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleEnd() {
    if (!liveMatch) {
      return;
    }

    try {
      setBusy(true);
      setError(null);

      await endLivestream(
        liveMatch.id,
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to end livestream.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (candidates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
        <Radio className="mx-auto mb-3 h-8 w-8 text-slate-600" />
        <p className="text-slate-400">
          No matches are ready to stream
          yet. Create and ready a match
          first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {liveMatch && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>

            <div>
              <p className="font-black text-white">
                {liveMatch.label}
              </p>
              <p className="text-xs text-red-300">
                Currently live
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={handleEnd}
            className="flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            <StopCircle className="h-4 w-4" />
            End Livestream
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-amber-400">
          {liveMatch
            ? "Switch Live Match"
            : "Go Live"}
        </p>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
              Match
            </label>

            <select
              value={selectedId}
              onChange={(event) =>
                setSelectedId(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-amber-500/40"
            >
              {candidates.map(
                (candidate) => (
                  <option
                    key={candidate.id}
                    value={candidate.id}
                  >
                    {candidate.label}{" "}
                    (
                    {candidate.status}
                    )
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
              Stream URL
            </label>

            <input
              type="text"
              value={streamUrl}
              onChange={(event) =>
                setStreamUrl(
                  event.target.value,
                )
              }
              placeholder="https://facebook.com/... or https://youtube.com/..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-amber-500/40"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={handleGoLive}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-black uppercase text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Radio className="h-4 w-4" />
            {liveMatch
              ? "Switch Live Match"
              : "Go Live"}
          </button>
        </div>
      </div>
    </div>
  );
}
