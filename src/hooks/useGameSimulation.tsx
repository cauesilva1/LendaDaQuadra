"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { RETIRE_AGE, STARTER_WALLET, buildBalancedDraftPool, pickRerollLegend } from "@/lib/data";
import {
  createClutchState,
  resolveDefenseAction,
  resolveOffenseAction,
} from "@/lib/clutch";
import {
  applyOptionToMods,
  applyPermanentOption,
  applyWalletCost,
  canAffordOption,
  collectImpactToasts,
  collectStatFlash,
  completeStats,
  createStarterStats,
  emptySeasonMods,
  growTowardMax,
  midEventCount,
  pickMidEvent,
  pickOffseasonEvent,
} from "@/lib/progression";
import { loadSfxMute, sfxClick, sfxDraft, sfxSuccess } from "@/lib/sfx";
import {
  clearGameState,
  createInitialState,
  flushGameState,
  loadGameState,
  saveGameState,
} from "@/lib/persistence";
import { recoverHydratedState } from "@/lib/hydration";
import {
  applyFinalsResult,
  assignStarterClub,
  computeMarketValue,
  computeOfferSalary,
  computeOverall,
  emptyTrophies,
  freshCareer,
  generateTransferOffers,
  getClubStrength,
  getLeague,
  getLegacyTierId,
  isEuroEligible,
  isNbaDraftEligible,
  isNbaFaEligible,
  liveStats,
  nextViewAfterSeason,
  resolveNbaDraftPick,
  shareCareerText,
  simulateSeason,
} from "@/lib/simulation";
import { t } from "@/lib/i18n/dictionary";
import { uid } from "@/lib/utils";
import type {
  AttrKey,
  AwardAnnouncement,
  CenterView,
  DefenseAction,
  OffenseAction,
  CountryId,
  GameMode,
  GameState,
  Locale,
  PositionId,
} from "@/types/game";

function syncStats(stats: Partial<GameState["currentStats"]>) {
  return { currentStats: stats };
}

function queueAwards(
  awards: AwardAnnouncement[],
): Pick<GameState, "awardQueue" | "activeAward" | "centerView"> {
  if (awards.length === 0) {
    return { awardQueue: [], activeAward: null, centerView: "season" };
  }
  const [first, ...rest] = awards;
  return {
    awardQueue: rest,
    activeAward: first!,
    centerView: "award",
  };
}

function openOffseason(s: GameState, career: NonNullable<GameState["career"]>): GameState {
  return {
    ...s,
    career,
    pendingFinals: null,
    clutch: null,
    awardQueue: [],
    activeAward: null,
    pendingEvent: pickOffseasonEvent(),
    awaitingOffseason: true,
    centerView: "offseason_event",
    phase: "career",
  };
}

function applySimResult(
  s: GameState,
  sim: ReturnType<typeof simulateSeason>,
  extraOffers = false,
): GameState {
  let career = sim.career;
  const stats = liveStats(s);
  const o = computeOverall(stats, s.player!.posId);
  let offers = career.offers;
  const contractExpired = (career.contractYearsRemaining ?? 0) <= 0;
  if (extraOffers || contractExpired) {
    offers = generateTransferOffers(
      { ...s, career, ...syncStats(stats) },
      o,
    );
    if (offers.some((x) => x.isNba) && s.player) {
      career = {
        ...career,
        offers,
        press: [
          {
            id: uid("press"),
            season: career.season,
            age: career.age,
            headline: t(s.locale, "press.nbaOffer", {
              name: s.player.name,
              ovr: o,
              age: career.age,
            }),
            body: t(s.locale, "press.nbaOfferBody", {
              name: s.player.name,
              ovr: o,
              age: career.age,
            }),
          },
          ...career.press,
        ],
      };
    } else {
      career = { ...career, offers };
    }
  }

  const hasNba = career.offers.some((x) => x.isNba);
  const view = nextViewAfterSeason(sim.pendingFinals, sim.awards, hasNba);

  if (view === "finals_prompt") {
    return {
      ...s,
      career,
      pendingFinals: sim.pendingFinals,
      clutch: null,
      awardQueue: sim.awards,
      activeAward: null,
      pendingEvent: null,
      awaitingOffseason: true,
      phase: "career",
      centerView: "finals_prompt",
    };
  }

  if (view === "award") {
    const q = queueAwards(sim.awards);
    return {
      ...s,
      career,
      pendingFinals: null,
      clutch: null,
      ...q,
      pendingEvent: null,
      awaitingOffseason: true,
      phase: "career",
    };
  }

  if (view === "transfers" || view === "season") {
    return openOffseason(s, career);
  }

  return openOffseason(s, career);
}

interface GameStateValue {
  state: GameState;
  hydrated: boolean;
  ovr: number;
  potentialOvr: number;
  marketValue: number;
  draftEligible: boolean;
  faEligible: boolean;
  euroEligible: boolean;
  legacyTierId: string;
}

interface GameActionsValue {
  setLocale: (locale: Locale) => void;
  startDraft: (input: {
    name: string;
    countryId: CountryId;
    posId: PositionId;
    mode: GameMode;
  }) => void;
  takeAttr: (attr: AttrKey) => void;
  rerollLegend: () => void;
  clearJustFilled: () => void;
  clearStatFlash: () => void;
  clearEffectToasts: () => void;
  beginCareer: () => void;
  /** First season (or resume) — simulate without mid-events before kickoff. */
  launchSeason: () => void;
  advanceSeason: () => void;
  setCenterView: (view: CenterView) => void;
  declareNbaDraft: () => void;
  finishNbaDraft: () => void;
  enterNbaFromDraft: () => void;
  acceptOffer: (offerId: string) => void;
  stayClub: () => void;
  retire: () => void;
  restart: () => void;
  copySummary: () => Promise<boolean>;
  getShareText: () => string;
  watchFinals: () => void;
  skipFinals: () => void;
  resolveCrunchOffense: (action: OffenseAction) => void;
  resolveCrunchDefense: (action: DefenseAction) => void;
  finishClutch: () => void;
  dismissAward: () => void;
  resolveSeasonEvent: (optionId: string) => void;
  tr: (key: string, vars?: Record<string, string | number>) => string;
}

/** @deprecated Prefer useGameState + useGameActions to avoid cascade re-renders */
type GameApi = GameStateValue & GameActionsValue;

const GameStateContext = createContext<GameStateValue | null>(null);
const GameActionsContext = createContext<GameActionsValue | null>(null);

export function GameSimulationProvider({
  children,
  initialLocale = "pt",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [state, setState] = useState<GameState>(() =>
    createInitialState(initialLocale),
  );
  const [hydrated, setHydrated] = useState(false);
  const skipSave = useRef(true);
  const stateRef = useRef(state);
  stateRef.current = state;
  const pendingSimRef = useRef<{
    base: GameState;
    sim: ReturnType<typeof simulateSeason>;
    extraOffers: boolean;
    flash: GameState["statFlash"];
    toasts: GameState["effectToasts"];
  } | null>(null);

  useEffect(() => {
    if (state.centerView !== "simulating" || !pendingSimRef.current) return;
    const timer = setTimeout(() => {
      const payload = pendingSimRef.current;
      pendingSimRef.current = null;
      if (!payload) return;
      setState(() => ({
        ...applySimResult(payload.base, payload.sim, payload.extraOffers),
        statFlash: payload.flash,
        effectToasts: payload.toasts,
      }));
    }, 1200);
    return () => clearTimeout(timer);
  }, [state.centerView]);

  useEffect(() => {
    loadSfxMute();
    const saved = loadGameState();
    if (saved) {
      let career = saved.career
        ? {
            ...saved.career,
            nbaSeasons: saved.career.nbaSeasons ?? 0,
            trophies: {
              ...emptyTrophies(),
              ...saved.career.trophies,
            },
            seasonMods: saved.career.seasonMods ?? emptySeasonMods(),
            midEventsDone: saved.career.midEventsDone ?? 0,
            fatigue: saved.career.fatigue ?? 0,
            pendingAthPenalty: saved.career.pendingAthPenalty ?? 0,
            pendingCluPenalty: saved.career.pendingCluPenalty ?? 0,
            pendingGamesMissed: saved.career.pendingGamesMissed ?? 0,
            injuryShield: saved.career.injuryShield ?? false,
            marketBoost: saved.career.marketBoost ?? 0,
            wallet: saved.career.wallet ?? STARTER_WALLET,
            annualSalary: saved.career.annualSalary ?? 0,
            contractYearsRemaining: saved.career.contractYearsRemaining ?? 0,
            contractCurrency:
              saved.career.contractCurrency ??
              (saved.career.leagueId
                ? getLeague(saved.career.leagueId).currency
                : "USD"),
            rivalClubId: saved.career.rivalClubId ?? null,
            rivalClubName: saved.career.rivalClubName ?? null,
          }
        : null;
      const legacySlots =
        (saved as GameState & { slots?: Partial<GameState["currentStats"]> })
          .slots ?? {};
      const maxStats =
        saved.maxStats && Object.keys(saved.maxStats).length > 0
          ? saved.maxStats
          : legacySlots;
      const currentStats =
        saved.currentStats && Object.keys(saved.currentStats).length > 0
          ? saved.currentStats
          : legacySlots;

      // v6: backfill missing contract salary from club strength
      if (
        career &&
        (career.annualSalary ?? 0) <= 0 &&
        career.clubId &&
        Object.keys(currentStats).length > 0
      ) {
        const o = computeOverall(currentStats, saved.player?.posId ?? null);
        const strength = getClubStrength(career.leagueId, career.clubId);
        career = {
          ...career,
          annualSalary: computeOfferSalary(
            o,
            career.age,
            career,
            currentStats,
            strength,
          ),
          contractYearsRemaining: Math.max(
            1,
            career.contractYearsRemaining ?? 0,
          ),
          contractCurrency:
            career.contractCurrency ?? getLeague(career.leagueId).currency,
        };
      }

      // Backfill rival if missing
      if (career && !career.rivalClubId) {
        const clubId = career.clubId;
        const league = getLeague(career.leagueId);
        const rival = [...league.clubs]
          .filter((c) => c.id !== clubId)
          .sort((a, b) => b.strength - a.strength)[0];
        if (rival) {
          career = {
            ...career,
            rivalClubId: rival.id,
            rivalClubName: rival.name,
          };
        }
      }

      setState(
        recoverHydratedState({
          ...createInitialState(initialLocale),
          ...saved,
          career,
          locale: initialLocale,
          ...syncStats(currentStats),
          maxStats,
          pendingFinals: saved.pendingFinals ?? null,
          clutch:
            saved.clutch &&
            "possession" in saved.clutch &&
            "clock" in saved.clutch
              ? { ...saved.clutch, overtime: saved.clutch.overtime ?? false }
              : null,
          awardQueue: saved.awardQueue ?? [],
          activeAward: saved.activeAward ?? null,
          pendingEvent: saved.pendingEvent ?? null,
          awaitingOffseason: saved.awaitingOffseason ?? false,
          draftAnimating: false,
          justFilledAttr: null,
          statFlash: null,
          effectToasts: [],
        }),
      );
    } else {
      setState((s) => ({ ...s, locale: initialLocale }));
    }
    setHydrated(true);
    skipSave.current = false;
  }, [initialLocale]);

  useEffect(() => {
    if (!hydrated || skipSave.current) return;
    if (state.centerView === "simulating") return;
    saveGameState(state);
  }, [state, hydrated]);

  const ovr = useMemo(
    () => computeOverall(liveStats(state), state.player?.posId ?? null),
    [state.currentStats, state.player?.posId],
  );

  const marketValue = useMemo(() => {
    if (!state.career || !state.player) return 0;
    return computeMarketValue(
      ovr,
      state.career.age,
      state.career,
      liveStats(state),
    );
  }, [state.career, state.player, state.currentStats, ovr]);

  const potentialOvr = useMemo(
    () =>
      computeOverall(
        state.maxStats && Object.keys(state.maxStats).length > 0
          ? state.maxStats
          : liveStats(state),
        state.player?.posId ?? null,
      ),
    [state.maxStats, state.currentStats, state.player?.posId],
  );

  const draftEligible = useMemo(() => {
    if (!state.career) return false;
    return isNbaDraftEligible(
      ovr,
      state.career.age,
      state.career.inNba,
      state.career.seasonsPlayed,
    );
  }, [state.career, ovr]);

  const faEligible = useMemo(() => {
    if (!state.career) return false;
    return isNbaFaEligible(
      ovr,
      state.career.age,
      state.career.inNba,
      state.career.seasonsPlayed,
    );
  }, [state.career, ovr]);

  const euroEligible = useMemo(() => {
    if (!state.career) return false;
    return isEuroEligible(
      ovr,
      state.career.inNba,
      state.career.leagueId,
      state.career.seasonsPlayed,
    );
  }, [state.career, ovr]);

  const legacyTierId = useMemo(
    () => (state.career ? getLegacyTierId(state.career) : "bench"),
    [state.career],
  );

  const tr = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      t(stateRef.current.locale, key, vars),
    [],
  );

  const setLocale = useCallback((locale: Locale) => {
    setState((s) => ({ ...s, locale }));
  }, []);

  const startDraft = useCallback(
    (input: {
      name: string;
      countryId: CountryId;
      posId: PositionId;
      mode: GameMode;
    }) => {
      setState((s) => ({
        ...s,
        phase: "draft",
        player: {
          name: input.name.trim() || "Prospect",
          countryId: input.countryId,
          posId: input.posId,
          mode: input.mode,
        },
        draftPool: buildBalancedDraftPool(),
        draftIndex: 0,
        rerollUsed: false,
        ...syncStats({}),
        maxStats: {},
        justFilledAttr: null,
        career: null,
        pendingFinals: null,
        clutch: null,
        awardQueue: [],
        activeAward: null,
        pendingEvent: null,
        awaitingOffseason: false,
        centerView: "idle",
      }));
    },
    [],
  );

  const takeAttr = useCallback((attr: AttrKey) => {
    setState((s) => {
      const ceiling = s.maxStats ?? {};
      if (ceiling[attr] !== undefined) return s;
      const legend = s.draftPool[s.draftIndex];
      if (!legend) return s;
      const maxStats = { ...ceiling, [attr]: legend.stats[attr] };
      const draftIndex = s.draftIndex + 1;
      sfxDraft();
      return {
        ...s,
        maxStats,
        // Preview ceiling on currentStats during draft for reveal UI
        ...syncStats(maxStats),
        justFilledAttr: attr,
        draftIndex,
        phase: draftIndex >= 8 ? "reveal" : "draft",
      };
    });
  }, []);

  const rerollLegend = useCallback(() => {
    setState((s) => {
      if (s.rerollUsed || s.player?.mode !== "classic") return s;
      const current = s.draftPool[s.draftIndex];
      if (!current) return s;
      const next = pickRerollLegend(current, s.draftPool);
      if (!next) return s;
      const draftPool = [...s.draftPool];
      draftPool[s.draftIndex] = next;
      return { ...s, rerollUsed: true, draftPool };
    });
  }, []);

  const clearJustFilled = useCallback(() => {
    setState((s) => (s.justFilledAttr ? { ...s, justFilledAttr: null } : s));
  }, []);

  const clearStatFlash = useCallback(() => {
    setState((s) => (s.statFlash ? { ...s, statFlash: null } : s));
  }, []);

  const clearEffectToasts = useCallback(() => {
    setState((s) =>
      s.effectToasts.length ? { ...s, effectToasts: [] } : s,
    );
  }, []);

  const beginCareer = useCallback(() => {
    setState((s) => {
      if (!s.player) return s;
      const maxStats = completeStats(s.maxStats);
      const currentStats = createStarterStats(s.player.posId, maxStats);
      const o = computeOverall(currentStats, s.player.posId);
      const { leagueId, club } = assignStarterClub(s.player.countryId, o);
      const league = getLeague(leagueId);
      const years = club.strength >= 88 ? 2 : 3;
      const draftCareer = {
        ...freshCareer(),
        leagueId,
        clubId: club.id,
        clubName: club.name,
        contractCurrency: league.currency,
      };
      const annualSalary = computeOfferSalary(
        o,
        18,
        draftCareer,
        currentStats,
        club.strength,
      );
      const rival = [...league.clubs]
        .filter((c) => c.id !== club.id)
        .sort((a, b) => b.strength - a.strength)[0];
      const career = {
        ...draftCareer,
        annualSalary,
        contractYearsRemaining: years,
        contractCurrency: league.currency,
        rivalClubId: rival?.id ?? null,
        rivalClubName: rival?.name ?? null,
      };
      sfxSuccess();
      return {
        ...s,
        maxStats,
        ...syncStats(currentStats),
        career,
        phase: "career",
        pendingEvent: null,
        awaitingOffseason: false,
        centerView: "journey",
        pendingFinals: null,
        clutch: null,
        awardQueue: [],
        activeAward: null,
        statFlash: null,
        effectToasts: [],
      };
    });
  }, []);

  /** Journey CTA: run season 1 (no mid-events yet — player just arrived). */
  const launchSeason = useCallback(() => {
    setState((s) => {
      if (!s.career || !s.player) return s;
      if (s.career.lastSeason) {
        // Already played — fall through to normal advance
        return s;
      }
      const career = {
        ...s.career,
        seasonMods: emptySeasonMods(),
        midEventsDone: 0,
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
      const base = {
        ...s,
        career,
        pendingEvent: null,
        awaitingOffseason: true,
      };
      pendingSimRef.current = {
        base,
        sim,
        extraOffers: false,
        flash: null,
        toasts: salaryToasts,
      };
      return {
        ...base,
        centerView: "simulating",
        phase: "career",
        pendingFinals: null,
        clutch: null,
        awardQueue: [],
        activeAward: null,
        statFlash: null,
        effectToasts: [],
      };
    });
  }, []);

  const advanceSeason = useCallback(() => {
    setState((s) => {
      if (!s.career || !s.player) return s;

      // Finish offseason before starting a new year
      if (s.awaitingOffseason && s.centerView === "season") {
        return openOffseason(s, s.career);
      }

      let career = {
        ...s.career,
        age: s.career.age + 1,
        season: s.career.season + 1,
        seasonMods: emptySeasonMods(),
        midEventsDone: 0,
      };

      if (career.age >= RETIRE_AGE) {
        return {
          ...s,
          career: { ...career, retired: true },
          phase: "legacy",
          centerView: "idle",
          pendingFinals: null,
          clutch: null,
          pendingEvent: null,
          awaitingOffseason: false,
        };
      }

      return {
        ...s,
        career,
        pendingEvent: pickMidEvent([], career.leagueId === "euro"),
        awaitingOffseason: false,
        centerView: "mid_event",
        pendingFinals: null,
        clutch: null,
      };
    });
  }, []);

  const resolveSeasonEvent = useCallback((optionId: string) => {
    setState((s) => {
      if (!s.pendingEvent || !s.career || !s.player) return s;
      const option = s.pendingEvent.options.find((o) => o.id === optionId);
      if (!option) return s;

      const walletBefore = s.career.wallet ?? STARTER_WALLET;
      if (
        s.pendingEvent.kind === "offseason" &&
        !canAffordOption(walletBefore, option)
      ) {
        return s;
      }

      if (s.pendingEvent.kind === "mid") {
        let optionForMods = option;
        let shielded = false;
        if (
          s.career.injuryShield &&
          option.effects.some((e) => e.type === "games_missed")
        ) {
          shielded = true;
          optionForMods = {
            ...option,
            effects: option.effects.filter((e) => e.type !== "games_missed"),
          };
        }

        const seasonMods = applyOptionToMods(
          s.career.seasonMods ?? emptySeasonMods(),
          optionForMods,
        );
        const needsPerm = option.effects.some(
          (e) =>
            e.type === "perm_attr" ||
            e.type === "perm_attr_flex" ||
            e.type === "market_boost" ||
            e.type === "injury_shield" ||
            e.type === "random_injury_miss",
        );
        let nextStats = liveStats(s);
        let flexAttr: import("@/types/game").AttrKey | undefined;
        let injuryHit = false;
        let marketBoost = s.career.marketBoost ?? 0;
        if (needsPerm) {
          const applied = applyPermanentOption(nextStats, s.maxStats, option);
          if (
            option.effects.some(
              (e) => e.type === "perm_attr" || e.type === "perm_attr_flex",
            )
          ) {
            nextStats = applied.stats;
          }
          flexAttr = applied.flexAttr;
          injuryHit = applied.injuryHit;
          marketBoost += applied.marketBoost;
        }
        const wallet = applyWalletCost(walletBefore, option);
        const flash = collectStatFlash(option, { flexAttr, injuryHit });
        const toasts = collectImpactToasts(option, {
          walletDelta: wallet - walletBefore,
          flexAttr,
          injuryHit,
          injuryShielded: shielded,
        });
        const midEventsDone = (s.career.midEventsDone ?? 0) + 1;
        const needed = midEventCount(s.career.inNba);
        const career = {
          ...s.career,
          seasonMods,
          midEventsDone,
          wallet,
          marketBoost,
        };
        const synced = syncStats(nextStats);

        if (midEventsDone < needed) {
          return {
            ...s,
            ...synced,
            career,
            pendingEvent: pickMidEvent(
              [s.pendingEvent.titleKey],
              career.leagueId === "euro",
            ),
            centerView: "mid_event",
            statFlash: flash,
            effectToasts: toasts,
          };
        }

        const sim = simulateSeason({
          ...s,
          ...synced,
          career,
        });
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
        const base = { ...s, ...synced, career, pendingEvent: null };
        pendingSimRef.current = {
          base,
          sim,
          extraOffers: career.season > 1,
          flash,
          toasts: [...toasts, ...salaryToasts],
        };
        return {
          ...base,
          centerView: "simulating",
          awaitingOffseason: true,
          phase: "career",
          statFlash: flash,
          effectToasts: toasts,
        };
      }

      // Off-season
      const applied = applyPermanentOption(
        liveStats(s),
        s.maxStats,
        option,
      );
      const stats = growTowardMax(applied.stats, s.maxStats, s.career.age);
      const wallet = applyWalletCost(walletBefore, option);
      const flash = collectStatFlash(option, {
        flexAttr: applied.flexAttr,
        injuryHit: applied.injuryHit,
      });
      const toasts = collectImpactToasts(option, {
        walletDelta: wallet - walletBefore,
        flexAttr: applied.flexAttr,
        injuryHit: applied.injuryHit,
      });
      const career = {
        ...s.career,
        fatigue: applied.fatigueReset ? 0 : s.career.fatigue,
        pendingAthPenalty:
          (s.career.pendingAthPenalty ?? 0) + applied.nextAthPenalty,
        pendingCluPenalty:
          (s.career.pendingCluPenalty ?? 0) + applied.nextCluPenalty,
        pendingGamesMissed:
          (s.career.pendingGamesMissed ?? 0) + applied.pendingGamesMissed,
        injuryShield: applied.injuryShield || (s.career.injuryShield ?? false),
        marketBoost: (s.career.marketBoost ?? 0) + applied.marketBoost,
        wallet,
      };
      const hasOffers = career.offers.length > 0;
      return {
        ...s,
        ...syncStats(stats),
        career,
        pendingEvent: null,
        awaitingOffseason: false,
        centerView: hasOffers ? "transfers" : "season",
        statFlash: flash,
        effectToasts: toasts,
      };
    });
  }, []);

  const setCenterView = useCallback((view: CenterView) => {
    setState((s) => ({ ...s, centerView: view }));
  }, []);

  const finishFinalsFlow = useCallback(
    (s: GameState, won: boolean, viaClutch: boolean): GameState => {
      const applied = applyFinalsResult(s, won, viaClutch);
      const career = applied.career;

      if (applied.nextFinals) {
        return {
          ...s,
          career,
          pendingFinals: applied.nextFinals,
          clutch: null,
          centerView: "finals_prompt",
          phase: "career",
        };
      }

      const awards = [...(s.awardQueue ?? []), ...applied.awards];
      const q = queueAwards(awards);
      if (q.activeAward) {
        return {
          ...s,
          career,
          pendingFinals: null,
          clutch: null,
          ...q,
          awaitingOffseason: true,
          phase: "career",
        };
      }
      return openOffseason(s, career);
    },
    [],
  );

  const watchFinals = useCallback(() => {
    setState((s) => {
      if (!s.pendingFinals) return s;
      return {
        ...s,
        clutch: createClutchState(s.pendingFinals),
        centerView: "clutch",
      };
    });
  }, []);

  const skipFinals = useCallback(() => {
    setState((s) => {
      const finals = s.pendingFinals;
      if (!finals) return s;
      const won = Math.random() < finals.winChanceOnSkip;
      return finishFinalsFlow(s, won, false);
    });
  }, [finishFinalsFlow]);

  const resolveCrunchOffense = useCallback((action: OffenseAction) => {
    setState((s) => {
      if (!s.clutch || s.clutch.resolved) return s;
      return {
        ...s,
        clutch: resolveOffenseAction(s.clutch, action, liveStats(s)),
      };
    });
  }, []);

  const resolveCrunchDefense = useCallback((action: DefenseAction) => {
    setState((s) => {
      if (!s.clutch || s.clutch.resolved) return s;
      return {
        ...s,
        clutch: resolveDefenseAction(s.clutch, action, liveStats(s)),
      };
    });
  }, []);

  const finishClutch = useCallback(() => {
    setState((s) => {
      if (!s.clutch?.resolved || s.clutch.winsGame === null) return s;
      if (s.clutch.winsGame) sfxSuccess();
      return finishFinalsFlow(s, s.clutch.winsGame, true);
    });
  }, [finishFinalsFlow]);

  const dismissAward = useCallback(() => {
    setState((s) => {
      if (s.awardQueue.length > 0) {
        const [next, ...rest] = s.awardQueue;
        return {
          ...s,
          activeAward: next!,
          awardQueue: rest,
          centerView: "award",
        };
      }
      if (s.awaitingOffseason) {
        return openOffseason(s, s.career!);
      }
      return {
        ...s,
        activeAward: null,
        awardQueue: [],
        centerView: "season",
      };
    });
  }, []);

  const declareNbaDraft = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: "nba_draft",
      centerView: "nba_draft",
      draftAnimating: true,
    }));
  }, []);

  const finishNbaDraft = useCallback(() => {
    setState((s) => {
      if (!s.player || !s.career) return s;
      const o = computeOverall(liveStats(s), s.player.posId);
      const result = resolveNbaDraftPick(o, s.career.age);
      const press = [
        {
          id: uid("press"),
          season: s.career.season,
          age: s.career.age,
          headline: t(s.locale, "press.draft", {
            name: s.player.name,
            pick: result.pick,
            team: result.teamName,
          }),
          body: t(s.locale, "press.draftBody", {
            name: s.player.name,
            pick: result.pick,
            team: result.teamName,
          }),
        },
        ...s.career.press,
      ];
      return {
        ...s,
        draftAnimating: false,
        career: { ...s.career, nbaDraftResult: result, press },
      };
    });
  }, []);

  const enterNbaFromDraft = useCallback(() => {
    setState((s) => {
      const r = s.career?.nbaDraftResult;
      if (!s.career || !r || !s.player) return s;
      const strength = getClubStrength("nba", r.teamId);
      const years = r.pick <= 14 ? 3 : 2;
      const annualSalary = computeOfferSalary(
        computeOverall(liveStats(s), s.player.posId),
        s.career.age + 1,
        { ...s.career, leagueId: "nba", inNba: true },
        liveStats(s),
        strength,
      );
      const career = {
        ...s.career,
        inNba: true,
        leagueId: "nba" as const,
        clubId: r.teamId,
        clubName: r.teamName,
        age: s.career.age + 1,
        season: s.career.season + 1,
        offers: [],
        nbaSeasons: 0,
        seasonMods: emptySeasonMods(),
        midEventsDone: 0,
        pendingAthPenalty: 0,
        pendingCluPenalty: s.career.pendingCluPenalty ?? 0,
        pendingGamesMissed: s.career.pendingGamesMissed ?? 0,
        annualSalary,
        contractYearsRemaining: years,
        contractCurrency: "USD" as const,
      };
      return {
        ...s,
        career,
        phase: "career",
        pendingEvent: pickMidEvent([], false),
        awaitingOffseason: false,
        centerView: "mid_event",
        pendingFinals: null,
        clutch: null,
        awardQueue: [],
        activeAward: null,
        draftAnimating: false,
        statFlash: null,
        effectToasts: [],
      };
    });
  }, []);

  const stayClub = useCallback(() => {
    setState((s) => {
      if (!s.career || !s.player) return s;
      let career = { ...s.career, offers: [] };
      if ((career.contractYearsRemaining ?? 0) <= 0) {
        const strength = getClubStrength(career.leagueId, career.clubId);
        const league = getLeague(career.leagueId);
        const o = computeOverall(liveStats(s), s.player.posId);
        career = {
          ...career,
          annualSalary: computeOfferSalary(
            o,
            career.age,
            career,
            liveStats(s),
            strength,
          ),
          contractYearsRemaining: 2,
          contractCurrency: league.currency,
        };
      }
      if (s.awaitingOffseason) return openOffseason(s, career);
      return { ...s, career, centerView: "season" };
    });
  }, []);

  const acceptOffer = useCallback((offerId: string) => {
    setState((s) => {
      if (!s.career || !s.player) return s;
      const offer = s.career.offers.find((o) => o.id === offerId);
      if (!offer) return s;
      const pressItem = {
        id: uid("press"),
        season: s.career.season,
        age: s.career.age,
        headline: t(s.locale, "press.transfer", {
          name: s.player.name,
          club: offer.clubName,
        }),
        body: t(s.locale, "press.transferBody", {
          name: s.player.name,
          club: offer.clubName,
          years: offer.years,
          league: t(s.locale, `league.${offer.leagueId}`),
        }),
      };
      const press =
        offer.path === "euro"
          ? [
              {
                id: uid("press"),
                season: s.career.season,
                age: s.career.age,
                headline: t(s.locale, "press.euroFinalFour", {
                  name: s.player.name,
                  club: offer.clubName,
                }),
                body: t(s.locale, "press.euroFinalFourBody", {
                  name: s.player.name,
                  club: offer.clubName,
                }),
              },
              pressItem,
              ...s.career.press,
            ]
          : [pressItem, ...s.career.press];
      const league = getLeague(offer.leagueId);
      const rival = [...league.clubs]
        .filter((c) => c.id !== offer.clubId)
        .sort((a, b) => b.strength - a.strength)[0];
      const career = {
        ...s.career,
        clubId: offer.clubId,
        clubName: offer.clubName,
        leagueId: offer.leagueId,
        inNba: offer.isNba || s.career.inNba,
        offers: [],
        press,
        nbaSeasons: offer.isNba ? 0 : s.career.nbaSeasons,
        annualSalary: offer.annualSalary,
        contractYearsRemaining: offer.years,
        contractCurrency: offer.currency,
        rivalClubId: rival?.id ?? null,
        rivalClubName: rival?.name ?? null,
      };
      sfxSuccess();
      const next = s.awaitingOffseason
        ? openOffseason(s, career)
        : {
            ...s,
            career,
            phase: "career" as const,
            centerView: "season" as const,
          };
      queueMicrotask(() => flushGameState(next));
      return next;
    });
  }, []);

  const retire = useCallback(() => {
    setState((s) => {
      if (!s.career) return s;
      const next = {
        ...s,
        career: { ...s.career, retired: true },
        phase: "legacy" as const,
        centerView: "idle" as const,
      };
      queueMicrotask(() => flushGameState(next));
      return next;
    });
  }, []);

  const restart = useCallback(() => {
    clearGameState();
    setState(createInitialState(stateRef.current.locale));
  }, []);

  const getShareText = useCallback(
    () => shareCareerText(stateRef.current),
    [],
  );

  const copySummary = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareCareerText(stateRef.current));
      return true;
    } catch {
      return false;
    }
  }, []);

  const stateValue = useMemo<GameStateValue>(
    () => ({
      state,
      hydrated,
      ovr,
      potentialOvr,
      marketValue,
      draftEligible,
      faEligible,
      euroEligible,
      legacyTierId,
    }),
    [
      state,
      hydrated,
      ovr,
      potentialOvr,
      marketValue,
      draftEligible,
      faEligible,
      euroEligible,
      legacyTierId,
    ],
  );

  const actionsValue = useMemo<GameActionsValue>(
    () => ({
      setLocale,
      startDraft,
      takeAttr,
      rerollLegend,
      clearJustFilled,
      clearStatFlash,
      clearEffectToasts,
      beginCareer,
      launchSeason,
      advanceSeason,
      setCenterView,
      declareNbaDraft,
      finishNbaDraft,
      enterNbaFromDraft,
      acceptOffer,
      stayClub,
      retire,
      restart,
      copySummary,
      getShareText,
      watchFinals,
      skipFinals,
      resolveCrunchOffense,
      resolveCrunchDefense,
      finishClutch,
      dismissAward,
      resolveSeasonEvent,
      tr,
    }),
    [
      setLocale,
      startDraft,
      takeAttr,
      rerollLegend,
      clearJustFilled,
      clearStatFlash,
      clearEffectToasts,
      beginCareer,
      launchSeason,
      advanceSeason,
      setCenterView,
      declareNbaDraft,
      finishNbaDraft,
      enterNbaFromDraft,
      acceptOffer,
      stayClub,
      retire,
      restart,
      copySummary,
      getShareText,
      watchFinals,
      skipFinals,
      resolveCrunchOffense,
      resolveCrunchDefense,
      finishClutch,
      dismissAward,
      resolveSeasonEvent,
      tr,
    ],
  );

  return (
    <GameStateContext.Provider value={stateValue}>
      <GameActionsContext.Provider value={actionsValue}>
        {children}
      </GameActionsContext.Provider>
    </GameStateContext.Provider>
  );
}

/** Reactive game data — re-renders when state/derived values change. */
export function useGameState(): GameStateValue {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGameState outside GameSimulationProvider");
  return ctx;
}

/** Stable action handlers — does not re-render on wallet/clutch/stats ticks. */
export function useGameActions(): GameActionsValue {
  const ctx = useContext(GameActionsContext);
  if (!ctx) throw new Error("useGameActions outside GameSimulationProvider");
  return ctx;
}

/** Combined API — prefer useGameState / useGameActions for performance. */
export function useGameSimulation(): GameApi {
  return { ...useGameState(), ...useGameActions() };
}
