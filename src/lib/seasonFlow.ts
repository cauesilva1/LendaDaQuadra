import { createClutchState } from "@/lib/clutch";
import { createFullGame } from "@/lib/fullGame";
import { pickMidEvent } from "@/lib/progression";
import { simulateSeason } from "@/lib/simulation";
import { uid } from "@/lib/utils";
import type { FinalsContext, GameState, SeasonBeat } from "@/types/game";

export function buildSeasonQueue(inNba: boolean): SeasonBeat[] {
  if (inNba) {
    return ["key_game", "mid", "key_game", "mid", "key_game", "sim"];
  }
  return ["key_game", "mid", "key_game", "key_game", "sim"];
}

type SimPayload = {
  base: GameState;
  sim: ReturnType<typeof simulateSeason>;
  extraOffers: boolean;
  flash: GameState["statFlash"];
  toasts: GameState["effectToasts"];
};

function launchPlayableGame(
  s: GameState,
  game: FinalsContext,
  queue: SeasonBeat[],
  keyGames: FinalsContext[],
  kind: "key_game" | "national",
): GameState {
  const mode = game.playMode ?? (kind === "key_game" && keyGames.length === 2 ? "full" : "clutch");
  if (mode === "full") {
    return {
      ...s,
      seasonQueue: queue,
      keyGamesQueue: keyGames,
      pendingEvent: null,
      clutch: null,
      clutchKind: null,
      fullGame: createFullGame(game, game.nationalRole),
      centerView: "full_game",
      pendingFinals: null,
    };
  }
  return {
    ...s,
    seasonQueue: queue,
    keyGamesQueue: keyGames,
    pendingEvent: null,
    clutch: createClutchState(game),
    clutchKind: kind,
    fullGame: null,
    centerView: "clutch",
    pendingFinals: null,
  };
}

/** Advance the in-season beat queue (key games → mid → simulate). */
export function continueSeasonQueue(
  s: GameState,
  pendingSimRef: { current: SimPayload | null },
): GameState {
  if (!s.career || !s.player) return s;
  const queue = [...(s.seasonQueue ?? [])];
  let keyGames = [...(s.keyGamesQueue ?? [])];

  while (queue.length > 0) {
    const beat = queue.shift()!;

    if (beat === "key_game") {
      const game = keyGames[0];
      keyGames = keyGames.slice(1);
      if (!game) continue;
      return launchPlayableGame(s, game, queue, keyGames, "key_game");
    }

    if (beat === "mid") {
      return {
        ...s,
        seasonQueue: queue,
        keyGamesQueue: keyGames,
        pendingEvent: pickMidEvent([], s.career.leagueId === "euro"),
        centerView: "mid_event",
        clutch: null,
        clutchKind: null,
        fullGame: null,
      };
    }

    if (beat === "sim") {
      return enqueueSimulation(
        {
          ...s,
          seasonQueue: queue,
          keyGamesQueue: keyGames,
          clutch: null,
          clutchKind: null,
          fullGame: null,
          pendingEvent: null,
        },
        pendingSimRef,
      );
    }
  }

  return enqueueSimulation(
    {
      ...s,
      seasonQueue: [],
      keyGamesQueue: [],
      clutch: null,
      clutchKind: null,
      fullGame: null,
      pendingEvent: null,
    },
    pendingSimRef,
  );
}

/** Continue national-team slate after a game; then offseason via caller. */
export function continueNationalQueue(s: GameState): GameState | null {
  const queue = [...(s.nationalGamesQueue ?? [])];
  if (queue.length === 0) return null;
  const game = queue.shift()!;
  if ((game.playMode ?? "clutch") === "full") {
    return {
      ...s,
      nationalGamesQueue: queue,
      pendingNational: null,
      pendingEvent: null,
      clutch: null,
      clutchKind: null,
      fullGame: createFullGame(game, game.nationalRole),
      centerView: "full_game",
    };
  }
  return {
    ...s,
    nationalGamesQueue: queue,
    pendingNational: null,
    pendingEvent: null,
    clutch: createClutchState(game),
    clutchKind: "national",
    fullGame: null,
    centerView: "clutch",
  };
}

export function enqueueSimulation(
  s: GameState,
  pendingSimRef: { current: SimPayload | null },
): GameState {
  if (!s.career || !s.player) return s;
  const career = {
    ...s.career,
    midEventsDone: s.career.midEventsDone ?? 0,
  };
  const sim = simulateSeason({ ...s, career });
  const salaryPaid = career.annualSalary ?? 0;
  const salaryToasts =
    salaryPaid > 0
      ? [
          {
            id: uid("toast"),
            tone: "good" as const,
            labelKey: "impact.salary",
            vars: { n: salaryPaid },
          },
        ]
      : [];
  const base: GameState = {
    ...s,
    career,
    pendingEvent: null,
    awaitingOffseason: true,
    clutch: null,
    clutchKind: null,
    fullGame: null,
  };
  pendingSimRef.current = {
    base,
    sim,
    extraOffers: career.season > 1 || (career.seasonsPlayed ?? 0) >= 1,
    flash: s.statFlash,
    toasts: [...(s.effectToasts ?? []), ...salaryToasts],
  };
  return {
    ...base,
    centerView: "simulating",
    phase: "career",
    effectToasts: [],
  };
}
