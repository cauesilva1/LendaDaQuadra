import {
  museumUnlock,
  pathFromCountry,
  rollTeammates,
  isChaosYear,
} from "@/lib/careerFlavor";
import { createClutchState, seedFinalsScore } from "@/lib/clutch";
import { emptySeasonMods } from "@/lib/progression";
import { makeCareerSeed, normalizeSeed } from "@/lib/rng";
import { simulateFullCareer } from "@/lib/simulateFullCareer";
import { clamp, uid } from "@/lib/utils";
import type {
  CoachStyle,
  DripStyle,
  GameState,
  PressChoice,
  SignatureMove,
} from "@/types/game";

export function applyIdentity(
  s: GameState,
  input: {
    nickname: string;
    signature: SignatureMove;
    drip: DripStyle;
    coachStyle: CoachStyle;
    preferNcaa: boolean;
  },
): GameState {
  if (!s.career || !s.player) return s;
  const mates = rollTeammates(true);
  const mentor = mates.find((m) => m.role === "mentor");
  const pathTrack = pathFromCountry(s.player.countryId, input.preferNcaa);
  const seed = s.careerSeed || s.career.careerSeed || makeCareerSeed();
  return {
    ...s,
    careerSeed: seed,
    identityDone: true,
    centerView: "journey",
    career: {
      ...s.career,
      careerSeed: seed,
      nickname: input.nickname,
      signature: input.signature,
      drip: input.drip,
      coachStyle: input.coachStyle,
      preferNcaa: input.preferNcaa,
      pathTrack,
      mentorName: mentor?.name ?? null,
      teammates: mates,
      museum: [
        museumUnlock("jersey", "museum.rookieJersey", 1),
        museumUnlock("shoe", "museum.firstShoes", 1),
      ],
      clubBudget: 70 + Math.floor(Math.random() * 20),
    },
  };
}

export function buildRivalPress(_s: GameState): PressChoice {
  return {
    id: uid("pressc"),
    headlineKey: "press.rival.headline",
    bodyKey: "press.rival.body",
    optionA: { id: "fire", labelKey: "press.rival.fire", tone: "good" },
    optionB: { id: "quiet", labelKey: "press.rival.quiet", tone: "warn" },
  };
}

export function applyPressChoice(s: GameState, optionId: string): GameState {
  if (!s.career || !s.pendingPressChoice) return s;
  const fire = optionId === "fire";
  const mods = { ...(s.career.seasonMods ?? emptySeasonMods()) };
  if (fire) {
    mods.clu = (mods.clu ?? 0) + 2;
    mods.chemistry = (mods.chemistry ?? 0) - 1;
  } else {
    mods.chemistry = (mods.chemistry ?? 0) + 1;
  }
  return {
    ...s,
    pendingPressChoice: null,
    centerView: s.career.lastSeason ? "season" : "journey",
    career: {
      ...s.career,
      seasonMods: mods,
      marketBoost: (s.career.marketBoost ?? 0) + (fire ? 1 : 0),
      press: [
        {
          id: uid("press"),
          season: s.career.season,
          age: s.career.age,
          headline: fire ? "HOT TAKE" : "NO COMMENT",
          body: fire ? "press.resolved.fire" : "press.resolved.quiet",
        },
        ...s.career.press,
      ],
    },
    effectToasts: [
      {
        id: uid("toast"),
        tone: fire ? "good" : "warn",
        labelKey: fire ? "impact.pressFire" : "impact.pressQuiet",
      },
    ],
  };
}

export function maybeInjectDrama(s: GameState): GameState {
  if (!s.career) return s;
  const year = s.career.calendarYear;
  if (isChaosYear(year) && Math.random() < 0.55) {
    return {
      ...s,
      career: {
        ...s.career,
        fatigue: clamp((s.career.fatigue ?? 0) + 6, 0, 100),
        press: [
          {
            id: uid("press"),
            season: s.career.season,
            age: s.career.age,
            headline: "CHAOS YEAR",
            body: "chaos.body",
          },
          ...s.career.press,
        ],
      },
      effectToasts: [
        {
          id: uid("toast"),
          tone: "warn",
          labelKey: "impact.chaos",
        },
        ...(s.effectToasts ?? []),
      ],
    };
  }
  if (s.career.rivalClubName && Math.random() < 0.35) {
    return {
      ...s,
      pendingPressChoice: buildRivalPress(s),
      centerView: "press_choice",
    };
  }
  if (Math.random() < 0.2) {
    const up = Math.random() < 0.6;
    return {
      ...s,
      career: {
        ...s.career,
        familyMorale: clamp(
          (s.career.familyMorale ?? 50) + (up ? 8 : -6),
          0,
          100,
        ),
      },
      effectToasts: [
        {
          id: uid("toast"),
          tone: up ? "good" : "warn",
          labelKey: up ? "impact.familyUp" : "impact.familyDown",
        },
        ...(s.effectToasts ?? []),
      ],
    };
  }
  return s;
}

export function runSimulateCareer(s: GameState): GameState {
  const { state, doc } = simulateFullCareer(s);
  return {
    ...state,
    spectatorDoc: doc,
    centerView: "spectator",
  };
}

export function startQuickCrunchState(s: GameState): GameState {
  const scores = seedFinalsScore(0.5);
  const finals = {
    competition: "key_game" as const,
    leagueId: s.career?.leagueId ?? ("nbb" as const),
    titleKey: "quick.title",
    opponentName: s.career?.rivalClubName ?? "Stream FC",
    opponentStrength: 80,
    playerScore: scores.playerScore,
    opponentScore: scores.opponentScore,
    deficit: scores.deficit,
    winChanceOnSkip: 0.5,
    franchiseStrength: 78,
    playMode: "clutch" as const,
  };
  return {
    ...s,
    clutch: createClutchState({
      ...finals,
      playerScore: scores.playerScore - 2,
      opponentScore: scores.opponentScore,
    }),
    clutchKind: "key_game",
    centerView: "quick_crunch",
  };
}

export function todayChallengeSeed(): string {
  const d = new Date();
  const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
  return normalizeSeed(`DAILY${key}`);
}
