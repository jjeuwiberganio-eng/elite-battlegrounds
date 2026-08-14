"use client";

export default function MediaFilters() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-400"
      >
        All
      </button>

      <button
        type="button"
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-400 transition hover:bg-white/10 hover:text-white"
      >
        Images
      </button>

      <button
        type="button"
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-400 transition hover:bg-white/10 hover:text-white"
      >
        Videos
      </button>

      <button
        type="button"
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-400 transition hover:bg-white/10 hover:text-white"
      >
        Documents
      </button>
    </div>
  );
}