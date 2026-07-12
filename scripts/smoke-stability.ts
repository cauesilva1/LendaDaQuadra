/**
 * Lightweight smoke checks for hydration + full-career sim (no browser).
 * Run: npx tsx scripts/smoke-stability.ts
 */
import { freshState, freshCareer } from "../src/lib/simulation";
import { recoverHydratedState } from "../src/lib/hydration";
import { simulateFullCareer } from "../src/lib/simulateFullCareer";
import { completeStats, createStarterStats } from "../src/lib/progression";
import type { GameState } from "../src/types/game";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

function baseCareerState(): GameState {
  const s = freshState("pt");
  const maxStats = completeStats({
    shot: 88,
    fin: 84,
    drb: 80,
    pass: 78,
    def: 82,
    reb: 75,
    ath: 86,
    clu: 80,
  });
  const currentStats = createStarterStats("SG", maxStats);
  return {
    ...s,
    phase: "career",
    player: {
      name: "Smoke",
      countryId: "br",
      posId: "SG",
      mode: "classic",
    },
    maxStats,
    currentStats,
    careerSeed: "SMOKE01",
    identityDone: true,
    career: {
      ...freshCareer(),
      clubId: "flamengo",
      clubName: "Flamengo",
      careerSeed: "SMOKE01",
      nickname: "Raio",
      signature: "stepback",
      drip: "classic",
      coachStyle: "halfcourt",
      pathTrack: "pro_direct",
    },
  };
}

// 1) identity orphan → stay identity if not done
{
  const raw = baseCareerState();
  raw.identityDone = false;
  raw.career!.nickname = null;
  raw.centerView = "season";
  const fixed = recoverHydratedState(raw);
  assert(fixed.centerView === "identity", "expected identity recovery");
}

// 2) press_choice without payload
{
  const raw = baseCareerState();
  raw.centerView = "press_choice";
  raw.pendingPressChoice = null;
  raw.career!.lastSeason = {
    gp: 20,
    ppg: 12,
    rpg: 4,
    apg: 3,
    rating: 7,
    tags: [],
    champion: false,
    mvp: false,
    allStar: false,
    finalsMvp: false,
    dpoy: false,
    roy: false,
    reiAmerica: false,
  };
  const fixed = recoverHydratedState(raw);
  assert(fixed.centerView === "season", "press_choice orphan → season");
}

// 3) simulating clears to journey on fresh career
{
  const raw = baseCareerState();
  raw.centerView = "simulating";
  raw.career!.lastSeason = null;
  const fixed = recoverHydratedState(raw);
  assert(fixed.centerView === "journey", "simulating fresh → journey");
}

// 4) full career sim reaches legacy-ish doc
{
  const raw = baseCareerState();
  const { state, doc } = simulateFullCareer(raw);
  assert(doc.length >= 5, `expected several doc lines, got ${doc.length}`);
  assert(state.career?.retired || state.career!.age >= 30, "career advanced");
  console.log("smoke ok — doc lines:", doc.length, "final age:", state.career?.age);
}

console.log("All smoke checks passed.");
