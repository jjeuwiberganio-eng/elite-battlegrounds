import type { Metadata } from "next";

import { getLivestreamCandidates } from "@/actions/livestream";

import LivestreamManagement from "@/components/admin/livestream/LivestreamManagement";

export const metadata: Metadata = {
  title: "Livestream",
};

export const revalidate = 0;

export default async function LivestreamPage() {
  const candidates = await getLivestreamCandidates();

  return (
    <main className="space-y-6 p-6 lg:p-10">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Livestream
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Control which match shows as live across the site - the navbar's LIVE NOW button reads directly from this.
        </p>
      </div>

      <LivestreamManagement
        candidates={candidates}
      />
    </main>
  );
}
