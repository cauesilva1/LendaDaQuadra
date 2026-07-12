/** Career calendar & national-team cycles */

export const START_AGE = 16;
export const START_YEAR = 2016;
export const RETIRE_AGE = 38;

/** FIBA Basketball World Cup years */
export const WORLD_CUP_YEARS = [2019, 2023, 2027] as const;

/** Summer Olympics basketball years (Tokyo slid to 2021) */
export const OLYMPICS_YEARS = [2016, 2021, 2024, 2028] as const;

export type NationalEventKind = "world_cup" | "olympics";

export function nationalEventForYear(
  year: number,
): NationalEventKind | null {
  if ((WORLD_CUP_YEARS as readonly number[]).includes(year)) return "world_cup";
  if ((OLYMPICS_YEARS as readonly number[]).includes(year)) return "olympics";
  return null;
}

/**
 * Soft call-up gate — fringe minutes for young players with decent stock.
 * Season 1 (2016) can still get an Olympic camp invite.
 */
export function isNationalCallupEligible(
  ovr: number,
  age: number,
  seasonsPlayed: number,
  kind: NationalEventKind,
): boolean {
  if (seasonsPlayed < 1 && kind !== "olympics") return false;
  if (kind === "olympics") {
    if (age <= 17) return ovr >= 54;
    if (seasonsPlayed >= 3) return ovr >= 60;
    return ovr >= 62;
  }
  if (seasonsPlayed >= 3) return ovr >= 58;
  return ovr >= 60;
}

/** Career stage label key — not forever "prospect". */
export function careerStageKey(
  seasonsPlayed: number,
  ovr: number,
  inNba: boolean,
): string {
  if (inNba) return ovr >= 82 ? "stage.star" : "stage.nba";
  if (ovr >= 78 || seasonsPlayed >= 6) return "stage.star";
  if (seasonsPlayed >= 2 || ovr >= 68) return "stage.pro";
  return "stage.prospect";
}
