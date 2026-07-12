import { clamp, rand, uid } from "@/lib/utils";
import type {
  AttrStats,
  ClutchState,
  CrunchLogEntry,
  DefenseAction,
  FinalsContext,
  OffenseAction,
} from "@/types/game";

function attr(slots: Partial<AttrStats>, key: keyof AttrStats, fallback = 70) {
  return slots[key] ?? fallback;
}

function chanceFrom(rating: number, floor = 0.22, ceil = 0.82): number {
  return clamp(rating / 99, floor, ceil);
}

function pushLog(log: CrunchLogEntry[], message: string): CrunchLogEntry[] {
  return [{ id: uid("crunch"), message }, ...log].slice(0, 12);
}

function tickClock(clock: number, spent: number): number {
  return Math.max(0, Math.round((clock - spent) * 10) / 10);
}

function finalizeIfNeeded(state: ClutchState): ClutchState {
  if (state.resolved) return state;

  // Only end when the clock expires — no walk-off with time left
  if (state.clock > 0) return state;

  if (state.playerScore === state.opponentScore) {
    // Overtime — reset scoreboard, 12s, ~2 possessions
    return {
      ...state,
      phase: "playing",
      resolved: false,
      winsGame: null,
      overtime: true,
      clock: 12,
      playerScore: 0,
      opponentScore: 0,
      possession: "offense",
      lastNote: "overtime",
      log: pushLog(state.log, "overtime"),
      finals: {
        ...state.finals,
        playerScore: 0,
        opponentScore: 0,
        deficit: 0,
      },
    };
  }

  return {
    ...state,
    phase: "result",
    resolved: true,
    winsGame: state.playerScore > state.opponentScore,
    clock: 0,
    lastNote: "buzzer",
  };
}

/**
 * Use scores seeded from the Finals prompt so the tracker matches the UI.
 * Clock remains a random crunch window (24–40s).
 */
export function createClutchState(finals: FinalsContext): ClutchState {
  const clock = 24 + Math.floor(rand(0, 17));
  const hasSeed =
    Number.isFinite(finals.playerScore) &&
    Number.isFinite(finals.opponentScore) &&
    finals.opponentScore >= finals.playerScore;

  let playerScore: number;
  let opponentScore: number;
  let deficit: number;

  if (hasSeed) {
    playerScore = finals.playerScore;
    opponentScore = finals.opponentScore;
    deficit = Math.max(0, opponentScore - playerScore);
  } else {
    deficit = 3 + Math.floor(rand(0, 4));
    const base = 88 + Math.floor(rand(0, 18));
    playerScore = base;
    opponentScore = base + deficit;
  }

  return {
    finals: {
      ...finals,
      deficit,
      playerScore,
      opponentScore,
    },
    phase: "playing",
    clock,
    playerScore,
    opponentScore,
    possession: "offense",
    log: [],
    lastNote: null,
    resolved: false,
    winsGame: null,
    overtime: false,
  };
}

export function seedFinalsScore(winChance: number): {
  playerScore: number;
  opponentScore: number;
  deficit: number;
} {
  const roll = Math.random();
  const deficit = roll < 0.35 ? 0 : roll < 0.75 ? 1 : 2;
  const base = 88 + Math.floor(rand(0, 18));
  const playerScore = base + Math.floor(winChance * 6);
  return {
    playerScore,
    opponentScore: playerScore + deficit,
    deficit,
  };
}

/** Offense: burn 5–8s of game clock. */
export function resolveOffenseAction(
  state: ClutchState,
  action: OffenseAction,
  slots: Partial<AttrStats>,
): ClutchState {
  if (state.resolved || state.phase !== "playing" || state.possession !== "offense") {
    return state;
  }

  const spent = 5 + Math.floor(rand(0, 4)); // 5–8
  let clock = tickClock(state.clock, spent);
  let { playerScore, opponentScore } = state;
  let message = "";
  let possession: ClutchState["possession"] = "defense";

  if (action === "three") {
    const p = chanceFrom(
      attr(slots, "shot") * 0.7 + attr(slots, "clu") * 0.3,
      0.28,
      0.78,
    );
    const made = Math.random() < p;
    if (made) {
      playerScore += 3;
      message = `made3:${Math.round(p * 100)}`;
    } else {
      message = `miss3:${Math.round(p * 100)}`;
    }
  } else if (action === "drive") {
    const p = chanceFrom(
      attr(slots, "fin") * 0.6 + attr(slots, "ath") * 0.4,
      0.32,
      0.84,
    );
    const made = Math.random() < p;
    if (made) {
      playerScore += 2;
      message = `made2:${Math.round(p * 100)}`;
    } else {
      message = `miss2:${Math.round(p * 100)}`;
    }
  } else {
    // Drive & kick — pass skill; 2 or 3 on make
    const p = chanceFrom(attr(slots, "pass") * 0.8, 0.3, 0.8);
    const made = Math.random() < p;
    if (made) {
      const pts = Math.random() < 0.45 ? 3 : 2;
      playerScore += pts;
      message = `kick${pts}:${Math.round(p * 100)}`;
    } else {
      message = `kickMiss:${Math.round(p * 100)}`;
    }
  }

  // If clock died mid-possession after the shot attempt, still count the basket
  if (clock <= 0) clock = 0;

  return finalizeIfNeeded({
    ...state,
    clock,
    playerScore,
    opponentScore,
    possession,
    lastNote: message,
    log: pushLog(state.log, message),
  });
}

/** Defense: opponent possession. */
export function resolveDefenseAction(
  state: ClutchState,
  action: DefenseAction,
  slots: Partial<AttrStats>,
): ClutchState {
  if (state.resolved || state.phase !== "playing" || state.possession !== "defense") {
    return state;
  }

  let clock = state.clock;
  let { playerScore, opponentScore } = state;
  let message = "";
  let possession: ClutchState["possession"] = "offense";

  if (action === "steal") {
    const p = chanceFrom(
      attr(slots, "def") * 0.6 + attr(slots, "clu") * 0.4,
      0.12,
      0.48,
    );
    const stole = Math.random() < p;
    if (stole) {
      clock = tickClock(clock, 1);
      message = `steal:${Math.round(p * 100)}`;
      possession = "offense";
    } else {
      // Fail → opponent scores free (usually 2, sometimes 3)
      const pts = Math.random() < 0.35 ? 3 : 2;
      opponentScore += pts;
      clock = tickClock(clock, 4 + Math.floor(rand(0, 3)));
      message = `stealFail${pts}:${Math.round(p * 100)}`;
      possession = "offense";
    }
  } else if (action === "contest") {
    // Opponent base make ~58%, crushed by DEF*0.8
    const defFactor = clamp((attr(slots, "def") * 0.8) / 99, 0.35, 0.9);
    const oppMake = clamp(0.58 * (1 - defFactor * 0.55), 0.18, 0.55);
    const spent = 5 + Math.floor(rand(0, 4));
    clock = tickClock(clock, spent);
    const made = Math.random() < oppMake;
    if (made) {
      const pts = Math.random() < 0.4 ? 3 : 2;
      opponentScore += pts;
      message = `oppMade${pts}:${Math.round(oppMake * 100)}`;
    } else {
      message = `contest:${Math.round(oppMake * 100)}`;
    }
    possession = "offense";
  } else {
    // Intentional foul — 1s, two FTs at 75%
    clock = tickClock(clock, 1);
    let made = 0;
    if (Math.random() < 0.75) made++;
    if (Math.random() < 0.75) made++;
    opponentScore += made;
    message = `foul:${made}`;
    possession = "offense";
  }

  return finalizeIfNeeded({
    ...state,
    clock,
    playerScore,
    opponentScore,
    possession,
    lastNote: message,
    log: pushLog(state.log, message),
  });
}

export function newAwardId(): string {
  return uid("award");
}
