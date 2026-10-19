interface TiebreakerTagsProps {
  tiebreaker: {
    wins: number;
    losses: number;
  };
}

/*
 * "Tiebreaker Win" / "Tiebreaker Loss" next to a team on the standings.
 * Tiebreaker matches don't count toward the numbers - this tag is the
 * only trace of them, and the winner is ranked above the team they beat.
 */
export default function TiebreakerTags({
  tiebreaker,
}: Readonly<TiebreakerTagsProps>) {
  if (tiebreaker.wins === 0 && tiebreaker.losses === 0) {
    return null;
  }

  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {tiebreaker.wins > 0 && (
        <span
          title="Won a tiebreaker match - ranked above the team it beat"
          className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 ring-1 ring-violet-200"
        >
          Tiebreaker Win
          {tiebreaker.wins > 1 ? ` ×${tiebreaker.wins}` : ""}
        </span>
      )}

      {tiebreaker.losses > 0 && (
        <span
          title="Lost a tiebreaker match"
          className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200"
        >
          Tiebreaker Loss
          {tiebreaker.losses > 1 ? ` ×${tiebreaker.losses}` : ""}
        </span>
      )}
    </span>
  );
}
