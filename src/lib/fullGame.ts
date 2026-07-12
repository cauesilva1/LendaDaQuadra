import { clamp, rand, uid } from "@/lib/utils";
import { signatureEdge } from "@/lib/careerFlavor";
import type {
  AttrStats,
  FinalsContext,
  FullDefCall,
  FullGameState,
  FullOffCall,
  FullPlayLog,
  NationalRole,
  SignatureMove,
} from "@/types/game";

function a(slots: Partial<AttrStats>, key: keyof AttrStats, fb = 68) {
  return slots[key] ?? fb;
}

function chance(rating: number, lo = 0.2, hi = 0.88) {
  return clamp(rating / 99, lo, hi);
}

function pushLog(log: FullPlayLog[], message: string): FullPlayLog[] {
  return [{ id: uid("fg"), message }, ...log].slice(0, 10);
}

/** Controlled possessions per quarter by national / star role. */
export function possessionsPerQuarter(role: NationalRole | undefined): number {
  if (role === "star") return 5;
  if (role === "rotation") return 4;
  return 3;
}

/** Short webgame quarters — seconds on the clock. */
const Q_CLOCK = 72;

export function createFullGame(
  finals: FinalsContext,
  role?: NationalRole,
): FullGameState {
  const r = role ?? finals.nationalRole ?? "rotation";
  // Pace: auto-sim first half, player commands Q3–Q4 (and OT)
  const halfEdge = clamp((finals.winChanceOnSkip - 0.5) * 16, -8, 8);
  const base = 42 + Math.floor(rand(0, 10));
  const playerHalf = Math.round(base + halfEdge + rand(-3, 3));
  const oppHalf = Math.round(base + rand(-2, 4));
  return {
    finals,
    role: r,
    quarter: 3,
    clock: Q_CLOCK,
    playerScore: playerHalf,
    opponentScore: oppHalf,
    possession: "offense",
    possessionsLeft: possessionsPerQuarter(r),
    phase: "playing",
    log: [{ id: uid("fg"), message: "full.log.halftime" }],
    lastNote: "halftime",
    resolved: false,
    winsGame: null,
    expectedMinutes:
      finals.expectedMinutes ??
      (r === "star" ? 28 : r === "rotation" ? 18 : 8),
  };
}

function spendPossession(state: FullGameState): FullGameState {
  const left = state.possessionsLeft - 1;
  const clock = Math.max(0, state.clock - (8 + Math.floor(rand(0, 10))));
  if (left <= 0 || clock <= 0) {
    if (state.quarter >= 4) {
      if (state.playerScore === state.opponentScore) {
        // OT — one more mini-quarter
        return {
          ...state,
          quarter: 4,
          clock: 36,
          possessionsLeft: 2,
          possession: "offense",
          phase: "playing",
          lastNote: "ot",
          log: pushLog(state.log, "full.log.ot"),
        };
      }
      return {
        ...state,
        clock: 0,
        possessionsLeft: 0,
        phase: "result",
        resolved: true,
        winsGame: state.playerScore > state.opponentScore,
        lastNote: "final",
      };
    }
    return {
      ...state,
      clock: 0,
      possessionsLeft: 0,
      phase: "quarter_break",
      lastNote: `q${state.quarter}`,
      log: pushLog(state.log, "full.log.quarter"),
    };
  }
  return { ...state, possessionsLeft: left, clock };
}

export function resolveFullOffense(
  state: FullGameState,
  call: FullOffCall,
  slots: Partial<AttrStats>,
  signature?: SignatureMove | null,
): FullGameState {
  if (state.resolved || state.phase !== "playing" || state.possession !== "offense") {
    return state;
  }

  const shot = a(slots, "shot");
  const fin = a(slots, "fin");
  const drb = a(slots, "drb");
  const pas = a(slots, "pass");
  const clu = a(slots, "clu");
  const ath = a(slots, "ath");
  const opp = state.finals.opponentStrength;
  const sig = signatureEdge(signature, call);

  let hit = false;
  let pts = 0;
  let note = "miss";
  let logKey = "full.log.miss";

  switch (call) {
    case "three": {
      const p = chance(shot * 0.55 + clu * 0.25 + ath * 0.1 - opp * 0.15, 0.18, 0.55) + sig;
      hit = Math.random() < p;
      pts = hit ? 3 : 0;
      note = hit ? "three" : "miss_three";
      logKey = hit
        ? sig > 0
          ? "full.log.sigThree"
          : "full.log.three"
        : "full.log.missThree";
      break;
    }
    case "drive": {
      const p = chance(fin * 0.5 + ath * 0.3 + drb * 0.15 - opp * 0.12, 0.28, 0.72) + sig;
      hit = Math.random() < p;
      pts = hit ? 2 : 0;
      note = hit ? "drive" : "miss_drive";
      logKey = hit
        ? sig > 0
          ? "full.log.sigDrive"
          : "full.log.drive"
        : "full.log.missDrive";
      break;
    }
    case "pnr": {
      const p = chance(pas * 0.35 + fin * 0.3 + shot * 0.2 + drb * 0.1 - opp * 0.1, 0.3, 0.75) + sig;
      hit = Math.random() < p;
      pts = hit ? (Math.random() < 0.35 ? 3 : 2) : 0;
      note = hit ? "pnr" : "miss_pnr";
      logKey = hit ? "full.log.pnr" : "full.log.missPnr";
      break;
    }
    case "iso": {
      const p = chance(drb * 0.4 + shot * 0.3 + clu * 0.2 - opp * 0.14, 0.25, 0.7) + sig;
      hit = Math.random() < p;
      pts = hit ? (Math.random() < 0.25 ? 3 : 2) : 0;
      note = hit ? "iso" : "miss_iso";
      logKey = hit
        ? sig > 0
          ? "full.log.sigIso"
          : "full.log.iso"
        : "full.log.missIso";
      break;
    }
    case "post": {
      const p = chance(fin * 0.45 + a(slots, "reb") * 0.25 + ath * 0.15 - opp * 0.1, 0.3, 0.74) + sig;
      hit = Math.random() < p;
      pts = hit ? 2 : 0;
      note = hit ? "post" : "miss_post";
      logKey = hit ? "full.log.post" : "full.log.missPost";
      break;
    }
    case "kick": {
      const p = chance(pas * 0.45 + shot * 0.35 + clu * 0.15 - opp * 0.1, 0.28, 0.7) + sig;
      hit = Math.random() < p;
      pts = hit ? (Math.random() < 0.55 ? 3 : 2) : 0;
      note = hit ? "kick" : "miss_kick";
      logKey = hit
        ? sig > 0
          ? "full.log.sigKick"
          : "full.log.kick"
        : "full.log.missKick";
      break;
    }
  }

  let next: FullGameState = {
    ...state,
    playerScore: state.playerScore + pts,
    possession: "defense",
    lastNote: note,
    log: pushLog(state.log, logKey),
    clock: Math.max(0, state.clock - (6 + Math.floor(rand(0, 6)))),
  };
  return next;
}

export function resolveFullDefense(
  state: FullGameState,
  call: FullDefCall,
  slots: Partial<AttrStats>,
): FullGameState {
  if (state.resolved || state.phase !== "playing" || state.possession !== "defense") {
    return state;
  }

  const def = a(slots, "def");
  const ath = a(slots, "ath");
  const clu = a(slots, "clu");
  const opp = state.finals.opponentStrength;

  let pts = 0;
  let note = "stop";
  let logKey = "full.log.stop";
  let steal = false;

  switch (call) {
    case "press": {
      steal = Math.random() < chance(ath * 0.4 + def * 0.35 - opp * 0.2, 0.12, 0.42);
      if (!steal && Math.random() < chance(opp - def * 0.3, 0.3, 0.7)) {
        pts = Math.random() < 0.3 ? 3 : 2;
        note = "beaten";
        logKey = "full.log.beaten";
      } else if (steal) {
        note = "steal";
        logKey = "full.log.steal";
      }
      break;
    }
    case "pack": {
      if (Math.random() < chance(opp - def * 0.45 - clu * 0.1, 0.22, 0.58)) {
        pts = 2;
        note = "pack_beat";
        logKey = "full.log.packBeat";
      } else {
        note = "pack_hold";
        logKey = "full.log.packHold";
      }
      break;
    }
    case "switch": {
      if (Math.random() < chance(opp - def * 0.35 - ath * 0.15, 0.25, 0.62)) {
        pts = Math.random() < 0.4 ? 3 : 2;
        note = "switch_beat";
        logKey = "full.log.switchBeat";
      } else {
        note = "switch_hold";
        logKey = "full.log.switchHold";
      }
      break;
    }
    case "help": {
      if (Math.random() < chance(def * 0.5 + a(slots, "reb") * 0.2 - opp * 0.2, 0.35, 0.75)) {
        note = "help_stop";
        logKey = "full.log.helpStop";
      } else {
        pts = 2;
        note = "help_foul";
        logKey = "full.log.helpFail";
      }
      break;
    }
    case "foul": {
      pts = Math.random() < 0.75 ? 2 : 1;
      note = "foul";
      logKey = "full.log.foul";
      break;
    }
  }

  let next: FullGameState = {
    ...state,
    opponentScore: state.opponentScore + pts,
    possession: "offense",
    lastNote: note,
    log: pushLog(state.log, logKey),
  };
  next = spendPossession(next);
  return next;
}

export function advanceFullQuarter(state: FullGameState): FullGameState {
  if (state.phase !== "quarter_break") return state;
  const q = (state.quarter + 1) as 1 | 2 | 3 | 4;
  return {
    ...state,
    quarter: q,
    clock: Q_CLOCK,
    possessionsLeft: possessionsPerQuarter(state.role),
    possession: "offense",
    phase: "playing",
    lastNote: `start_q${q}`,
    log: pushLog(state.log, "full.log.nextQ"),
  };
}
