/*
 * Playoff qualifier slots are laid out per group: Group A Top 1, Top 2,
 * Top 3, then Group B Top 1, ... and so on.
 *
 * The database only stores one unique integer "seed" per qualified team
 * (PlayoffQualification.seed, unique per tournament). Rather than adding
 * columns, a slot is encoded INTO that seed, group-major:
 *
 *   seed = groupIndex * perGroup + rank        (groupIndex from 0, rank from 1)
 *
 *   e.g. 4 groups x Top 3:  A1=1  A2=2  A3=3  B1=4  B2=5  B3=6  ...  D3=12
 *
 * Both the admin editor and the public standings page use these helpers,
 * so they always agree on which slot a seed means.
 *
 * The number of teams per group comes from the playoff size divided by the
 * number of groups, so changing either one changes the layout.
 */

export interface PlayoffLayout {
  /** Qualifying places per group (the "Top N"). */
  perGroup: number;

  /** perGroup x number of groups - how many slots are actually usable. */
  totalSlots: number;

  /** False when the playoff size doesn't split evenly across the groups. */
  evenSplit: boolean;
}

export function getPlayoffLayout(
  playoffSize: number,
  groupCount: number,
): PlayoffLayout {
  if (groupCount <= 0) {
    return { perGroup: 0, totalSlots: 0, evenSplit: false };
  }

  const perGroup = Math.max(1, Math.floor(playoffSize / groupCount));

  return {
    perGroup,
    totalSlots: perGroup * groupCount,
    evenSplit:
      playoffSize >= groupCount && playoffSize % groupCount === 0,
  };
}

export function slotSeed(
  groupIndex: number,
  rank: number,
  perGroup: number,
) {
  return groupIndex * perGroup + rank;
}

export function decodeSeed(seed: number, perGroup: number) {
  return {
    groupIndex: Math.floor((seed - 1) / perGroup),
    rank: ((seed - 1) % perGroup) + 1,
  };
}
