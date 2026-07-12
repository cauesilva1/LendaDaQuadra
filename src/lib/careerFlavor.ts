import { pick, uid } from "@/lib/utils";
import type {
  AttrKey,
  AttrStats,
  CoachStyle,
  DripStyle,
  MuseumItem,
  PathTrack,
  SignatureMove,
  Teammate,
} from "@/types/game";

const NICK_POOL: Record<string, string[]> = {
  br: ["Raio", "Cria", "Nebulosa", "Furacão", "Dom"],
  us: ["Flash", "Ice", "Chef", "Glide", "Ace"],
  es: ["Rayo", "Mago", "Tormenta", "Fénix"],
  au: ["Boomer", "Ripper", "Dash"],
  fr: ["Éclair", "Phantom", "Roi"],
  cn: ["Dragon", "Storm", "Blade"],
};

export function suggestNickname(
  name: string,
  countryId: string,
  cityHint?: string,
): string {
  const pool = NICK_POOL[countryId] ?? NICK_POOL.br!;
  const tag = pick(pool);
  const place = cityHint || pick(["BH", "SP", "RJ", "Lyon", "Madrid", "LA"]);
  return Math.random() < 0.5 ? `${tag} de ${place}` : `o ${tag}`;
}

export const SIGNATURES: { id: SignatureMove; attr: AttrKey; labelKey: string }[] =
  [
    { id: "stepback", attr: "shot", labelKey: "sig.stepback" },
    { id: "euro", attr: "fin", labelKey: "sig.euro" },
    { id: "poster", attr: "ath", labelKey: "sig.poster" },
    { id: "floater", attr: "fin", labelKey: "sig.floater" },
    { id: "catchshoot", attr: "shot", labelKey: "sig.catchshoot" },
  ];

export const DRIP_OPTIONS: { id: DripStyle; labelKey: string }[] = [
  { id: "classic", labelKey: "drip.classic" },
  { id: "flashy", labelKey: "drip.flashy" },
  { id: "street", labelKey: "drip.street" },
  { id: "minimal", labelKey: "drip.minimal" },
];

export const COACH_STYLES: { id: CoachStyle; labelKey: string }[] = [
  { id: "run_gun", labelKey: "coach.run_gun" },
  { id: "halfcourt", labelKey: "coach.halfcourt" },
  { id: "defense_first", labelKey: "coach.defense_first" },
];

const MENTOR_NAMES = [
  "Carlos",
  "Marcus",
  "Djibril",
  "Pau",
  "Andre",
  "Serge",
  "Rudy",
  "Joe",
];

const MATE_NAMES = [
  "Tyler",
  "Kenji",
  "Omar",
  "Luca",
  "Noah",
  "Mateo",
  "Jaylen",
  "Enzo",
];

export function rollTeammates(mentor = true): Teammate[] {
  const mates: Teammate[] = [];
  if (mentor) {
    mates.push({
      id: uid("mate"),
      name: pick(MENTOR_NAMES),
      role: "mentor",
      chem: 2,
    });
  }
  mates.push({
    id: uid("mate"),
    name: pick(MATE_NAMES),
    role: "rival_teammate",
    chem: 0,
  });
  mates.push({
    id: uid("mate"),
    name: pick(MATE_NAMES.filter((n) => !mates.some((m) => m.name === n))),
    role: "rookie",
    chem: 1,
  });
  return mates;
}

export function museumUnlock(
  kind: MuseumItem["kind"],
  labelKey: string,
  season: number,
): MuseumItem {
  return { id: uid("mus"), kind, labelKey, season };
}

export function pathFromCountry(
  countryId: string,
  preferNcaa: boolean,
): PathTrack {
  if (countryId === "us" || preferNcaa) return "ncaa";
  if (["es", "fr"].includes(countryId)) return "europe_youth";
  return "pro_direct";
}

/** Signature bump — small edge when using matching full-game / crunch call. */
export function signatureEdge(
  signature: SignatureMove | null | undefined,
  callHint: string,
): number {
  if (!signature) return 0;
  const map: Record<SignatureMove, string[]> = {
    stepback: ["three", "iso"],
    euro: ["drive", "fin"],
    poster: ["drive", "ath", "poster"],
    floater: ["drive", "floater", "fin"],
    catchshoot: ["three", "kick", "spot"],
  };
  return map[signature].some((k) => callHint.includes(k)) ? 0.08 : 0;
}

export function dripPressFlavor(drip: DripStyle | undefined): string {
  if (drip === "flashy") return "drip.press.flashy";
  if (drip === "street") return "drip.press.street";
  if (drip === "minimal") return "drip.press.minimal";
  return "drip.press.classic";
}

export function compareRadar(
  current: Partial<AttrStats>,
  ceiling: Partial<AttrStats>,
  keys: AttrKey[],
): { key: AttrKey; cur: number; max: number; pct: number }[] {
  return keys.map((key) => {
    const cur = current[key] ?? 50;
    const max = ceiling[key] ?? 80;
    return { key, cur, max, pct: Math.round((cur / Math.max(1, max)) * 100) };
  });
}

export const CHAOS_YEARS = [2020, 2025] as const;

export function isChaosYear(year: number): boolean {
  return (CHAOS_YEARS as readonly number[]).includes(year);
}
