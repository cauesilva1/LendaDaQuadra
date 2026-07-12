import { clamp, pick, rand } from "@/lib/utils";
import { seedFinalsScore } from "@/lib/clutch";
import type {
  FinalsContext,
  NationalCallup,
  NationalRole,
} from "@/types/game";

export function nationalRoleFrom(
  ovr: number,
  seasonsPlayed: number,
  recentPerf = 70,
): NationalRole {
  const stock =
    ovr +
    Math.min(8, seasonsPlayed * 1.5) +
    (recentPerf >= 78 ? 4 : recentPerf >= 70 ? 2 : 0);
  if (stock >= 78) return "star";
  if (stock >= 66) return "rotation";
  return "fringe";
}

/** Expected MPG at the national team — driven by OVR + career stock. */
export function nationalMinutes(role: NationalRole): number {
  if (role === "star") return 26 + Math.floor(rand(0, 6));
  if (role === "rotation") return 14 + Math.floor(rand(0, 8));
  return 6 + Math.floor(rand(0, 5));
}

export function enrichNationalCallup(
  call: NationalCallup,
  ovr: number,
  seasonsPlayed: number,
  recentPerf: number,
): NationalCallup {
  const role = nationalRoleFrom(ovr, seasonsPlayed, recentPerf);
  return {
    ...call,
    role,
    expectedMinutes: nationalMinutes(role),
    minutesLikely: role === "fringe",
  };
}

/** Build playable national-team slate after accepting a call-up. */
export function buildNationalGames(
  call: NationalCallup,
  ovr: number,
): FinalsContext[] {
  const role = call.role ?? "fringe";
  const competition = call.kind;
  const titleBase =
    call.kind === "olympics" ? "national.game.oly" : "national.game.wc";

  const opps =
    call.kind === "olympics"
      ? ["USA", "ESP", "FRA", "SRB", "AUS", "CAN"]
      : ["USA", "ESP", "SRB", "FRA", "GER", "AUS"];

  const count = role === "star" ? 3 : role === "rotation" ? 2 : 1;
  const games: FinalsContext[] = [];

  for (let i = 0; i < count; i++) {
    const isMedal = i === count - 1 && count > 1;
    const oppStrength =
      role === "star"
        ? clamp(84 + rand(0, 10), 82, 96)
        : role === "rotation"
          ? clamp(78 + rand(0, 10), 74, 92)
          : clamp(72 + rand(0, 8), 70, 86);

    const edge = clamp((ovr + (role === "star" ? 6 : 2) - oppStrength) / 42, -0.25, 0.3);
    const winChance = clamp(0.38 + edge, 0.22, 0.68);
    const scores = seedFinalsScore(winChance);
    const opp = pick(opps);

    games.push({
      competition,
      leagueId: "nbb",
      titleKey: isMedal ? `${titleBase}.final` : `${titleBase}.group`,
      opponentName: opp,
      opponentStrength: Math.round(oppStrength),
      playerScore: scores.playerScore,
      opponentScore: scores.opponentScore,
      deficit: scores.deficit,
      winChanceOnSkip: winChance,
      franchiseStrength: 80,
      playMode: isMedal || (count === 1 && role !== "fringe") ? "full" : "clutch",
      nationalRole: role,
      expectedMinutes: call.expectedMinutes ?? nationalMinutes(role),
    });
  }

  return games;
}
