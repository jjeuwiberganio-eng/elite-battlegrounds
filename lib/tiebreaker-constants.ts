/*
 * A tiebreaker is a normal Match in the Group Stage whose roundName is
 * "Tiebreaker". It is played and recorded like any other match, but:
 *
 *   - it is NOT counted in the standings (wins, losses, points, maps),
 *   - it is NOT counted in the tournament statistics,
 *   - the team that wins it is ranked above the team it beat when they
 *     are otherwise level, and the standings show a "Tiebreaker Win /
 *     Loss" tag next to each team.
 *
 * No database column is needed - the roundName is the marker. This file
 * is dependency-free so client components can import it too.
 */
export const TIEBREAKER_ROUND_NAME = "Tiebreaker";

export function isTiebreakerRound(roundName: string | null | undefined) {
  return roundName === TIEBREAKER_ROUND_NAME;
}
