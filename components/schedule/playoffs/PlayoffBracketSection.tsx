import { Crown, Trophy } from "lucide-react";

import MobileBracketScaler from "./MobileBracketScaler";

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

interface BracketMatch {
  id: string;
  round: string;
  roundOrder?: number;
  slotOrder?: number;
  teamA: Team | null;
  teamB: Team | null;
  scoreA?: number;
  scoreB?: number;
  isCompleted?: boolean;
  winner?: string | null;
}

interface UpcomingMatch {
  id: string;
  matchNumber: number;
  roundName: string;
  startTime: string;
  bestOf: string;
  status: string;
  streamUrl?: string;
  teamA: Team | null;
  teamB: Team | null;
}

interface PlayoffBracketSectionProps {
  bracket: {
    upperBracket: BracketMatch[];
    lowerBracket: BracketMatch[];
    grandFinals: BracketMatch[];
  };
  upcomingMatches: UpcomingMatch[];
}

type Side = "upper" | "lower";

// Must match MatchCard's rendered width/height below — connectors and
// headers are derived from these, so if the card size changes, update
// it here and every connector/header follows automatically.
const MATCH_WIDTH = 225;
const MATCH_HEIGHT = 101;

interface Position {
  left: number;
  top: number;
}

const UPPER_POSITIONS: Record<
  number,
  Position[]
> = {
  1: [
    { left: 30, top: 80 },
    { left: 30, top: 180 },
    { left: 30, top: 280 },
    { left: 30, top: 380 },
  ],

  2: [
    { left: 330, top: 120 },
    { left: 330, top: 220 },
    { left: 330, top: 320 },
    { left: 330, top: 420 },
  ],

  3: [
    { left: 650, top: 175 },
    { left: 650, top: 340 },
  ],

  4: [
    { left: 910, top: 255 },
  ],
};

const LOWER_POSITIONS: Record<number, Position[]> = {
  1: [
    { left: 20, top: 90 },
    { left: 20, top: 190 },
    { left: 20, top: 290 },
    { left: 20, top: 390 },
  ],

  2: [
    { left: 285, top: 145 },
    { left: 285, top: 345 },
  ],

  3: [
    { left: 550, top: 195 },
    { left: 550, top: 395 },
  ],

  4: [
    { left: 815, top: 295 },
  ],

  5: [
    { left: 1080, top: 295 },
  ],
};

// Shared layout constants for routing lines from the two bracket finals
// into the Grand Final panel. BRACKET_HEIGHT/STACK_GAP must mirror the
// min-h and spacing classes used below (min-h-[640px], mt-6 + border +
// pt-6 between Upper and Lower brackets).
const BRACKET_COLUMN_WIDTH = 1320;
const BRACKET_HEIGHT = 640;
const BRACKET_STACK_GAP = 49;
const FINALS_LANE_WIDTH = 90;

const UPPER_FINAL_Y =
  UPPER_POSITIONS[4][0].top + MATCH_HEIGHT / 2;

const LOWER_FINAL_Y =
  BRACKET_HEIGHT +
  BRACKET_STACK_GAP +
  LOWER_POSITIONS[5][0].top +
  MATCH_HEIGHT / 2;

function getRoundOrder(
  match: BracketMatch,
) {
  return (
    match.roundOrder ??
    Number.MAX_SAFE_INTEGER
  );
}

function getSlotOrder(
  match: BracketMatch,
) {
  return (
    match.slotOrder ??
    Number.MAX_SAFE_INTEGER
  );
}

function getMatchCode(
  match: BracketMatch,
  side: Side,
) {
  const round =
    getRoundOrder(match);

  const slot =
    getSlotOrder(match);

  if (side === "upper") {
    if (round === 1) return `M${slot}`;
    if (round === 2) return `QF${slot}`;
    if (round === 3) return `SF${slot}`;
    return "UBF";
  }

  if (round === 1) {
    return `L${slot}`;
  }

  if (round === 2) {
    return `L${4 + slot}`;
  }

  if (round === 3) {
    return `L${6 + slot}`;
  }

  if (round === 4) {
    return "L9";
  }

  return "LBF";
}

function getRoundHeader(
  round: number,
  side: Side,
) {
  if (side === "upper") {
    if (round === 1) {
      return {
        title: "ROUND 1",
        subtitle: "OPENING MATCHES",
      };
    }

    if (round === 2) {
      return {
        title: "QUARTERFINALS",
        subtitle: "(UB QF)",
      };
    }

    if (round === 3) {
      return {
        title: "SEMIFINALS",
        subtitle: "(UB SF)",
      };
    }

    return {
      title: "UPPER BRACKET FINAL",
      subtitle: "(UB FINAL)",
    };
  }

  if (round === 1) {
    return {
      title: "LOWER ROUND 1",
      subtitle: "(LB R1)",
    };
  }

  if (round === 2) {
    return {
      title: "LOWER ROUND 2",
      subtitle: "(LB R2)",
    };
  }

  if (round === 3) {
    return {
      title: "LOWER ROUND 3",
      subtitle: "(LB R3)",
    };
  }

  if (round === 4) {
    return {
      title: "LOWER ROUND 4",
      subtitle: "(LB R4)",
    };
  }

  return {
    title: "LOWER BRACKET FINAL",
    subtitle: "(LB FINAL)",
  };
}

function groupRounds(
  matches: BracketMatch[],
) {
  const grouped = new Map<
    number,
    BracketMatch[]
  >();

  for (const match of matches) {
    const round =
      getRoundOrder(match);

    const current =
      grouped.get(round) ?? [];

    current.push(match);

    grouped.set(round, current);
  }

  return Array.from(
    grouped.entries(),
  )
    .sort(
      ([a], [b]) => a - b,
    )
    .map(
      ([round, roundMatches]) => ({
        round,
        matches: [...roundMatches].sort(
          (a, b) =>
            getSlotOrder(a) -
            getSlotOrder(b),
        ),
      }),
    );
}

function TeamRow({
  team,
  score,
  winner,
  completed,
}: {
  team: Team | null;
  score?: number;
  winner: boolean;
  completed: boolean;
}) {
  return (
    <div
      className={`flex h-[38px] items-center justify-between border-t border-white/10 px-3 ${
        winner
          ? "bg-amber-400/10"
          : "bg-white/[0.02]"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {winner && (
          <Crown className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
        )}

        {team?.logo ? (
          <img
            src={team.logo}
            alt={team.name}
            className="h-6 w-6 shrink-0 rounded-full border border-white/10 object-cover"
          />
        ) : (
          <div className="h-6 w-6 shrink-0 rounded-full border border-white/10 bg-slate-800" />
        )}

        <span
          className={`truncate text-xs font-black ${
            winner
              ? "text-amber-300"
              : "text-white"
          }`}
        >
          {team?.name ?? "TBD"}
        </span>
      </div>

      <span
        className={`ml-2 shrink-0 text-xs font-black tabular-nums ${
          winner
            ? "text-amber-300"
            : "text-white/55"
        }`}
      >
        {team && completed
          ? score ?? 0
          : "-"}
      </span>
    </div>
  );
}

/**
 * Merges the Upper Bracket Final and Lower Bracket Final into a single
 * line feeding the Grand Final panel. `upperY`/`lowerY` are global
 * (page-relative) center-Y coordinates of the two finals; `width` is
 * the lane this connector has to work with, from the end of the
 * bracket column to the start of the Grand Final panel.
 */
function FinalsConnector({
  upperY,
  lowerY,
  width,
}: {
  upperY: number;
  lowerY: number;
  width: number;
}) {
  const midX = width / 2;
  const midY = (upperY + lowerY) / 2;

  return (
    <>
      <div
        className="pointer-events-none absolute h-px bg-amber-400/75"
        style={{ left: 0, top: upperY, width: midX }}
      />

      <div
        className="pointer-events-none absolute h-px bg-amber-400/75"
        style={{ left: 0, top: lowerY, width: midX }}
      />

      <div
        className="pointer-events-none absolute w-px bg-amber-400/75"
        style={{
          left: midX,
          top: Math.min(upperY, lowerY),
          height: Math.abs(lowerY - upperY),
        }}
      />

      <div
        className="pointer-events-none absolute h-px bg-amber-400/75"
        style={{ left: midX, top: midY, width: width - midX }}
      >
        <span className="absolute -right-1 -top-[6px] text-xs font-black text-amber-400">
          ›
        </span>
      </div>
    </>
  );
}

function MatchCard({
  match,
  side,
  width = MATCH_WIDTH,
  left,
  top,
}: {
  match: BracketMatch;
  side: Side;
  width?: number;
  left: number;
  top: number;
}) {
  const winnerA =
    !!match.teamA &&
    match.winner === match.teamA.id;

  const winnerB =
    !!match.teamB &&
    match.winner === match.teamB.id;

  const completed = !!match.isCompleted;

  const code = getMatchCode(match, side);

  return (
    <article
      className="absolute overflow-hidden rounded-[4px] border border-amber-500/55 bg-[#090b10] shadow-[0_0_20px_rgba(245,158,11,0.08)]"
      style={{
        left,
        top,
        width,
      }}
    >
      <div className="flex items-center justify-between border-b border-amber-500/20 bg-[#111318] px-2 py-1">
        <span className="truncate text-[9px] font-black uppercase tracking-[0.12em] text-white/45">
          {code}
        </span>

        {completed && (
          <span className="shrink-0 text-[8px] font-black uppercase tracking-wider text-amber-400">
            DONE
          </span>
        )}
      </div>

      <div className="border-b border-white/10">
        <TeamRow
          team={match.teamA}
          score={match.scoreA}
          winner={winnerA}
          completed={completed}
        />
      </div>

      <TeamRow
        team={match.teamB}
        score={match.scoreB}
        winner={winnerB}
        completed={completed}
      />
    </article>
  );
}

function HorizontalConnector({
  left,
  top,
  width,
}: {
  left: number;
  top: number;
  width: number;
}) {
  return (
    <div
      className="pointer-events-none absolute h-px bg-amber-400/75"
      style={{
        left,
        top,
        width,
      }}
    >
      <span className="absolute -right-1 -top-[6px] text-xs font-black text-amber-400">
        ›
      </span>
    </div>
  );
}

function VerticalConnector({
  left,
  top,
  height,
}: {
  left: number;
  top: number;
  height: number;
}) {
  return (
    <div
      className="pointer-events-none absolute w-px bg-amber-400/75"
      style={{
        left,
        top,
        height,
      }}
    />
  );
}

/**
 * Connects two source match slots (e.g. both winners of a round) into a
 * single target slot. All coordinates are derived from the Position
 * objects — pass the actual entries from UPPER_POSITIONS/LOWER_POSITIONS
 * so the lines always follow the cards, even if those tables change.
 */
function PairConnector({
  source,
  target,
}: {
  source: [Position, Position];
  target: Position;
}) {
  const sourceY1 = source[0].top + MATCH_HEIGHT / 2;
  const sourceY2 = source[1].top + MATCH_HEIGHT / 2;
  const targetY = target.top + MATCH_HEIGHT / 2;

  const sourceX = source[0].left + MATCH_WIDTH;
  const targetLeft = target.left;
  const middleX =
    sourceX + (targetLeft - sourceX) / 2;

  return (
    <>
      <div
        className="pointer-events-none absolute h-px bg-amber-400/75"
        style={{
          left: sourceX,
          top: sourceY1,
          width: middleX - sourceX,
        }}
      />

      <div
        className="pointer-events-none absolute h-px bg-amber-400/75"
        style={{
          left: sourceX,
          top: sourceY2,
          width: middleX - sourceX,
        }}
      />

      <div
        className="pointer-events-none absolute w-px bg-amber-400/75"
        style={{
          left: middleX,
          top: Math.min(sourceY1, sourceY2),
          height: Math.abs(sourceY2 - sourceY1),
        }}
      />

      <div
        className="pointer-events-none absolute h-px bg-amber-400/75"
        style={{
          left: middleX,
          top: targetY,
          width: targetLeft - middleX,
        }}
      >
        <span className="absolute -right-1 -top-[6px] text-xs font-black text-amber-400">
          ›
        </span>
      </div>
    </>
  );
}

/**
 * Connects a single source match slot to a single target slot (e.g.
 * Lower Round 2 → Lower Round 3, one-to-one). Handles same-row links
 * (straight horizontal line) and links that jog up/down between rows.
 */
function MatchConnector({
  source,
  target,
}: {
  source: Position;
  target: Position;
}) {
  const sourceY = source.top + MATCH_HEIGHT / 2;
  const targetY = target.top + MATCH_HEIGHT / 2;

  const sourceX = source.left + MATCH_WIDTH;
  const targetLeft = target.left;

  if (sourceY === targetY) {
    return (
      <HorizontalConnector
        left={sourceX}
        top={sourceY - 0.5}
        width={targetLeft - sourceX}
      />
    );
  }

  const middleX =
    sourceX + (targetLeft - sourceX) / 2;

  return (
    <>
      <HorizontalConnector
        left={sourceX}
        top={sourceY - 0.5}
        width={middleX - sourceX}
      />

      <VerticalConnector
        left={middleX}
        top={Math.min(sourceY, targetY)}
        height={Math.abs(targetY - sourceY)}
      />

      <HorizontalConnector
        left={middleX}
        top={targetY - 0.5}
        width={targetLeft - middleX}
      />
    </>
  );
}

function UpperBracket({
  matches,
}: {
  matches: BracketMatch[];
}) {
  const rounds = groupRounds(matches);

  // Header X positions mirror UPPER_POSITIONS' `left` values so labels
  // sit directly above their column of cards.
  const roundX: Record<number, number> = {
    1: UPPER_POSITIONS[1][0].left,
    2: UPPER_POSITIONS[2][0].left,
    3: UPPER_POSITIONS[3][0].left,
    4: UPPER_POSITIONS[4][0].left,
  };

  return (
    <div className="relative min-h-[640px] w-[1320px]">
      <div className="absolute left-0 top-0">
        <div className="inline-flex items-center bg-amber-400 px-5 py-1">
          <span className="text-sm font-black uppercase tracking-[0.08em] text-[#08090c]">
            Upper Bracket
          </span>
        </div>

        <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-white/35">
          Manual bracket control
        </p>
      </div>

      {rounds.map(({ round }) => {
        const header = getRoundHeader(round, "upper");
        const x = roundX[round] ?? 20;

        return (
          <div
            key={`upper-header-${round}`}
            className="absolute top-[58px] text-center"
            style={{
              left: x,
              width: MATCH_WIDTH,
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/70">
              {header.title}
            </p>

            <p className="text-[8px] font-black uppercase tracking-widest text-white/35">
              {header.subtitle}
            </p>
          </div>
        );
      })}

      {rounds.map(({ round, matches: roundMatches }) =>
        roundMatches.map((match, index) => {
          const position = UPPER_POSITIONS[round]?.[index];

          if (!position) {
            return null;
          }

          return (
            <MatchCard
              key={match.id}
              match={match}
              side="upper"
              left={position.left}
              top={position.top}
            />
          );
        }),
      )}

{/* Round 1 → Quarterfinals */}

<PairConnector
  source={[UPPER_POSITIONS[1][0], UPPER_POSITIONS[1][1]]}
  target={UPPER_POSITIONS[2][0]}
/>

<PairConnector
  source={[UPPER_POSITIONS[1][2], UPPER_POSITIONS[1][3]]}
  target={UPPER_POSITIONS[2][1]}
/>

{/* Quarterfinals → Semifinals */}

<PairConnector
  source={[UPPER_POSITIONS[2][0], UPPER_POSITIONS[2][1]]}
  target={UPPER_POSITIONS[3][0]}
/>

<PairConnector
  source={[UPPER_POSITIONS[2][2], UPPER_POSITIONS[2][3]]}
  target={UPPER_POSITIONS[3][1]}
/>

{/* Semifinals → Upper Final */}

<PairConnector
  source={[UPPER_POSITIONS[3][0], UPPER_POSITIONS[3][1]]}
  target={UPPER_POSITIONS[4][0]}
/>

{/* Upper Final → Grand Final (hands off to FinalsConnector) */}

<HorizontalConnector
  left={UPPER_POSITIONS[4][0].left + MATCH_WIDTH}
  top={UPPER_FINAL_Y - 0.5}
  width={
    BRACKET_COLUMN_WIDTH -
    (UPPER_POSITIONS[4][0].left + MATCH_WIDTH)
  }
/>
    </div>
  );
}

function LowerBracket({
  matches,
}: {
  matches: BracketMatch[];
}) {
  const rounds = groupRounds(matches);

  const roundX: Record<number, number> = {
    1: 20,
    2: 285,
    3: 550,
    4: 815,
    5: 1080,
  };

  return (
    <div className="relative min-h-[640px] w-[1320px]">
      <div className="absolute left-0 top-0">
        <div className="inline-flex items-center bg-amber-400 px-5 py-1">
          <span className="text-sm font-black uppercase tracking-[0.08em] text-[#08090c]">
            Lower Bracket
          </span>
        </div>

        <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-white/35">
          Losers are placed manually — nothing advances automatically.
        </p>
      </div>

      {rounds.map(({ round }) => {
        const header = getRoundHeader(round, "lower");
        const x = roundX[round] ?? 20;

        return (
          <div
            key={`lower-header-${round}`}
            className="absolute top-[58px] text-center"
            style={{
              left: x,
              width: MATCH_WIDTH,
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/70">
              {header.title}
            </p>

            <p className="text-[8px] font-black uppercase tracking-widest text-white/35">
              {header.subtitle}
            </p>
          </div>
        );
      })}

      {rounds.map(({ round, matches: roundMatches }) =>
        roundMatches.map((match, index) => {
          const position = LOWER_POSITIONS[round]?.[index];

          if (!position) {
            return null;
          }

          return (
            <MatchCard
              key={match.id}
              match={match}
              side="lower"
              left={position.left}
              top={position.top}
            />
          );
        }),
      )}

      {/* Lower Round 1 → Lower Round 2 */}

<PairConnector
  source={[LOWER_POSITIONS[1][0], LOWER_POSITIONS[1][1]]}
  target={LOWER_POSITIONS[2][0]}
/>

<PairConnector
  source={[LOWER_POSITIONS[1][2], LOWER_POSITIONS[1][3]]}
  target={LOWER_POSITIONS[2][1]}
/>

{/* Lower Round 2 → Lower Round 3 (one-to-one: each LR2 winner drops into the matching LR3 slot) */}

<MatchConnector
  source={LOWER_POSITIONS[2][0]}
  target={LOWER_POSITIONS[3][0]}
/>

<MatchConnector
  source={LOWER_POSITIONS[2][1]}
  target={LOWER_POSITIONS[3][1]}
/>

{/* Lower Round 3 → Lower Round 4 */}

<PairConnector
  source={[LOWER_POSITIONS[3][0], LOWER_POSITIONS[3][1]]}
  target={LOWER_POSITIONS[4][0]}
/>

{/* Lower Round 4 → Lower Final */}

<MatchConnector
  source={LOWER_POSITIONS[4][0]}
  target={LOWER_POSITIONS[5][0]}
/>

{/* Lower Final → Grand Final (hands off to FinalsConnector) */}

<HorizontalConnector
  left={LOWER_POSITIONS[5][0].left + MATCH_WIDTH}
  top={LOWER_POSITIONS[5][0].top + MATCH_HEIGHT / 2 - 0.5}
  width={
    BRACKET_COLUMN_WIDTH -
    (LOWER_POSITIONS[5][0].left + MATCH_WIDTH)
  }
/>
    </div>
  );
}

function GrandFinalPanel({
  matches,
}: {
  matches: BracketMatch[];
}) {
  const sorted =
    [...matches].sort(
      (a, b) =>
        getRoundOrder(a) -
        getRoundOrder(b),
    );

  return (
    <div className="relative w-[320px] shrink-0 rounded-[20px] border border-amber-500/35 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.13),transparent_62%)]">
      <div className="px-5 pt-8 text-center">
        <Trophy className="mx-auto h-10 w-10 fill-amber-400 text-amber-400" />

        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
          Championship Match
        </p>

        <h3 className="mt-2 whitespace-nowrap text-4xl font-black uppercase tracking-tight text-white">
          Grand Final
        </h3>

        <p className="mt-1 text-[10px] uppercase tracking-widest text-white/35">
          One series. One champion.
        </p>
      </div>

      <div className="mt-8 space-y-6 px-4 pb-8">
        {sorted.map(
          (match, index) => {
            const winnerA =
              !!match.teamA &&
              match.winner ===
                match.teamA.id;

            const winnerB =
              !!match.teamB &&
              match.winner ===
                match.teamB.id;

            return (
              <div
                key={match.id}
                className="overflow-hidden rounded-xl border border-amber-500/50 bg-[#090b10]"
              >
                <div className="border-b border-amber-500/15 px-3 py-2 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-400">
                    {index === 0
                      ? "GRAND FINAL"
                      : "IF NECESSARY — RESET"}
                  </p>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-4">
                  <div className="flex min-w-0 items-center justify-end gap-2 text-right">
                    {winnerA && (
                      <Crown className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                    )}

                    {match.teamA?.logo ? (
                      <img
                        src={
                          match.teamA.logo
                        }
                        alt={
                          match.teamA.name
                        }
                        className="h-8 w-8 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full border border-white/10 bg-slate-800" />
                    )}

                    <span className="truncate text-[11px] font-black text-white">
                      {match.teamA?.name ??
                        "TBD"}
                    </span>
                  </div>

                  <span className="text-[10px] font-black text-amber-400">
                    VS
                  </span>

                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-[11px] font-black text-white">
                      {match.teamB?.name ??
                        "TBD"}
                    </span>

                    {match.teamB?.logo ? (
                      <img
                        src={
                          match.teamB.logo
                        }
                        alt={
                          match.teamB.name
                        }
                        className="h-8 w-8 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full border border-white/10 bg-slate-800" />
                    )}

                    {winnerB && (
                      <Crown className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-white/10">
                  <div className="border-r border-white/10 p-2 text-center">
                    <p className="text-[8px] uppercase tracking-wider text-white/30">
                      Team A
                    </p>
                    <p className="mt-1 text-lg font-black text-amber-300">
                      {match.teamA &&
                      match.isCompleted
                        ? match.scoreA ??
                          0
                        : "-"}
                    </p>
                  </div>

                  <div className="p-2 text-center">
                    <p className="text-[8px] uppercase tracking-wider text-white/30">
                      Team B
                    </p>
                    <p className="mt-1 text-lg font-black text-amber-300">
                      {match.teamB &&
                      match.isCompleted
                        ? match.scoreB ??
                          0
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

export default function PlayoffBracketSection({
  bracket,
  upcomingMatches,
}: Readonly<PlayoffBracketSectionProps>) {
  return (
    <section className="relative overflow-hidden bg-[#030507] py-14 text-white sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.08),transparent_30%)]" />

      <div className="relative w-full px-4 sm:px-6">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400 sm:text-xs">
            Elite Battlegrounds Series · Season 1
          </p>

          <h2 className="mt-2 text-5xl font-black uppercase tracking-tight sm:text-7xl">
            <span className="text-white">
              Playoffs{" "}
            </span>

            <span className="text-amber-400">
              Bracket
            </span>
          </h2>

          <div className="mx-auto mt-3 h-px max-w-5xl bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/45 sm:text-sm">
            Double Elimination · Manual Bracket Control
          </p>
        </div>

        {/* Desktop - unchanged, full-size with horizontal scroll if needed */}
        <div className="mt-10 hidden w-full overflow-x-auto pb-5 lg:block">
          <div className="mx-auto flex w-max items-center gap-0">
            <div className="w-[1320px] shrink-0">
              <UpperBracket
                matches={
                  bracket.upperBracket
                }
              />

              <div className="mt-6 border-t border-amber-500/20 pt-6">
                <LowerBracket
                  matches={
                    bracket.lowerBracket
                  }
                />
              </div>
            </div>

            <div
              className="relative shrink-0 self-stretch"
              style={{
                width: FINALS_LANE_WIDTH,
              }}
            >
              <FinalsConnector
                upperY={UPPER_FINAL_Y}
                lowerY={LOWER_FINAL_Y}
                width={FINALS_LANE_WIDTH}
              />
            </div>

            <GrandFinalPanel
              matches={
                bracket.grandFinals
              }
            />
          </div>
        </div>

        {/* Mobile - scaled down to fit the whole bracket without horizontal scrolling */}
        <div className="mt-10 lg:hidden">
          <MobileBracketScaler
            contentWidth={1730}
            contentHeight={1329}
          >
            <div className="flex w-max items-center gap-0">
              <div className="w-[1320px] shrink-0">
                <UpperBracket
                  matches={
                    bracket.upperBracket
                  }
                />

                <div className="mt-6 border-t border-amber-500/20 pt-6">
                  <LowerBracket
                    matches={
                      bracket.lowerBracket
                    }
                  />
                </div>
              </div>

              <div
                className="relative shrink-0 self-stretch"
                style={{
                  width: FINALS_LANE_WIDTH,
                }}
              >
                <FinalsConnector
                  upperY={UPPER_FINAL_Y}
                  lowerY={LOWER_FINAL_Y}
                  width={FINALS_LANE_WIDTH}
                />
              </div>

              <GrandFinalPanel
                matches={
                  bracket.grandFinals
                }
              />
            </div>
          </MobileBracketScaler>
        </div>

        <div className="mt-12 border-t border-amber-500/10 pt-10">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
              Upcoming
            </p>

            <h3 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Upcoming Playoff Matches
            </h3>

            <p className="mt-2 text-sm text-white/45">
              Scheduled playoff matches and their individual livestreams.
            </p>
          </div>

          {upcomingMatches.length ===
          0 ? (
            <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
              <p className="font-semibold text-white/40">
                No upcoming playoff matches yet.
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-2">
              {upcomingMatches.map(
                (match) => (
                  <article
                    key={match.id}
                    className="rounded-2xl border border-amber-500/20 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                          {match.roundName}
                        </p>

                        <p className="mt-1 text-sm text-white/50">
                          {match.startTime
                            ? new Date(
                                match.startTime,
                              ).toLocaleString(
                                "en-PH",
                                {
                                  dateStyle:
                                    "medium",
                                  timeStyle:
                                    "short",
                                },
                              )
                            : "Date TBD"}
                        </p>
                      </div>

                      <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-300">
                        {match.bestOf}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="flex min-w-0 items-center justify-end gap-2 text-right">
                        <span className="truncate font-bold text-white">
                          {match.teamA?.name ??
                            "TBD"}
                        </span>

                        {match.teamA?.logo && (
                          <img
                            src={
                              match.teamA.logo
                            }
                            alt={
                              match.teamA.name
                            }
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        )}
                      </div>

                      <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                        VS
                      </span>

                      <div className="flex min-w-0 items-center gap-2">
                        {match.teamB?.logo && (
                          <img
                            src={
                              match.teamB.logo
                            }
                            alt={
                              match.teamB.name
                            }
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        )}

                        <span className="truncate font-bold text-white">
                          {match.teamB?.name ??
                            "TBD"}
                        </span>
                      </div>
                    </div>

                    {match.streamUrl && (
                      <a
                        href={match.streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 block rounded-xl bg-amber-500 px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-amber-400"
                      >
                        WATCH STREAM
                      </a>
                    )}
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}