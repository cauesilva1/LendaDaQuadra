import { RETIRE_AGE } from "@/lib/calendar";
import {
  growTowardMax,
  seasonDevelopmentBump,
  emptySeasonMods,
  completeStats,
} from "@/lib/progression";
import {
  computeOverall,
  simulateSeason,
  generateTransferOffers,
  isNbaDraftEligible,
  resolveNbaDraftPick,
  getClubStrength,
  computeOfferSalary,
  liveStats,
  applyFinalsResult,
} from "@/lib/simulation";
import { clamp, uid } from "@/lib/utils";
import type { DocumentaryLine, GameState, PressItem } from "@/types/game";

export type CareerDocLine = DocumentaryLine;

/**
 * Fast-forward the entire career to retirement — for skippers / spectator mode.
 * Applies growth + sim each year; auto-accepts NBA draft when eligible once.
 */
export function simulateFullCareer(state: GameState): {
  state: GameState;
  doc: CareerDocLine[];
} {
  if (!state.career || !state.player) {
    return { state, doc: [] };
  }

  let s: GameState = {
    ...state,
    career: { ...state.career },
    currentStats: { ...state.currentStats },
  };
  const doc: CareerDocLine[] = [];
  let drafted = state.career.inNba;
  let guard = 0;

  while (
    s.career &&
    s.player &&
    !s.career.retired &&
    s.career.age < RETIRE_AGE &&
    guard++ < 30
  ) {
    const career = {
      ...s.career,
      seasonMods: emptySeasonMods(),
      midEventsDone: 0,
    };
    const player = s.player;
    const sim = simulateSeason({ ...s, career });
    let nextCareer = sim.career;
    let pending = sim.pendingFinals;
    // Resolve playoff/finals in the fast-forward path (was discarding titles)
    let finalsGuard = 0;
    while (pending && finalsGuard++ < 4) {
      const won = Math.random() < pending.winChanceOnSkip;
      const applied = applyFinalsResult(
        {
          ...s,
          career: nextCareer,
          currentStats: completeStats(
            liveStats({ ...s, career: nextCareer }),
          ),
          pendingFinals: pending,
        },
        won,
        false,
      );
      nextCareer = applied.career;
      pending = applied.nextFinals;
      if (won) {
        doc.push({
          season: nextCareer.season,
          age: nextCareer.age,
          year: nextCareer.calendarYear,
          ovr: computeOverall(
            completeStats(liveStats({ ...s, career: nextCareer })),
            player.posId,
          ),
          club: nextCareer.clubName,
          lineKey: "doc.title",
          vars: { club: nextCareer.clubName },
        });
      }
    }

    let stats = seasonDevelopmentBump(
      liveStats({ ...s, career: nextCareer }),
      s.maxStats,
      nextCareer.age,
    );
    stats = growTowardMax(stats, s.maxStats, nextCareer.age);
    const o = computeOverall(stats, player.posId);

    doc.push({
      season: nextCareer.season,
      age: nextCareer.age,
      year: nextCareer.calendarYear,
      ovr: o,
      club: nextCareer.clubName,
      lineKey: nextCareer.inNba
        ? "doc.nbaSeason"
        : "doc.season",
      vars: {
        club: nextCareer.clubName,
        ppg: sim.summary.ppg,
        ovr: o,
        year: nextCareer.calendarYear,
      },
    });

    // Auto NBA when eligible (once)
    if (
      !drafted &&
      isNbaDraftEligible(o, nextCareer.age, nextCareer.inNba, nextCareer.seasonsPlayed)
    ) {
      const pick = resolveNbaDraftPick(o, nextCareer.age);
      nextCareer = {
        ...nextCareer,
        nbaDraftResult: pick,
        inNba: true,
        leagueId: "nba",
        clubId: pick.teamId,
        clubName: pick.teamName,
        annualSalary: computeOfferSalary(
          o,
          nextCareer.age,
          { ...nextCareer, leagueId: "nba", inNba: true },
          stats,
          getClubStrength("nba", pick.teamId),
        ),
        contractYearsRemaining: pick.pick <= 14 ? 3 : 2,
        contractCurrency: "USD",
      };
      drafted = true;
      doc.push({
        season: nextCareer.season,
        age: nextCareer.age,
        year: nextCareer.calendarYear,
        ovr: o,
        club: pick.teamName,
        lineKey: "doc.drafted",
        vars: { team: pick.teamName, pick: pick.pick },
      });
    } else {
  const offers = generateTransferOffers(
        { ...s, career: nextCareer, currentStats: stats },
        o,
      );
      const best = [...offers].sort((a, b) => b.annualSalary - a.annualSalary)[0];
      if (
        best &&
        (nextCareer.contractYearsRemaining ?? 0) <= 0 &&
        best.annualSalary > (nextCareer.annualSalary ?? 0) * 1.05
      ) {
        nextCareer = {
          ...nextCareer,
          leagueId: best.leagueId,
          clubId: best.clubId,
          clubName: best.clubName,
          annualSalary: best.annualSalary,
          contractYearsRemaining: best.years,
          contractCurrency: best.currency,
          inNba: !!best.isNba || nextCareer.inNba,
          offers: [],
        };
        doc.push({
          season: nextCareer.season,
          age: nextCareer.age,
          year: nextCareer.calendarYear,
          ovr: o,
          club: best.clubName,
          lineKey: "doc.transfer",
          vars: { club: best.clubName },
        });
      }
    }

    const press: PressItem = {
      id: uid("press"),
      season: nextCareer.season,
      age: nextCareer.age,
      headline: `${nextCareer.clubName} · ${nextCareer.calendarYear}`,
      body: `OVR ${o} · ${sim.summary.ppg} PPG`,
    };

    nextCareer = {
      ...nextCareer,
      age: nextCareer.age + 1,
      season: nextCareer.season + 1,
      calendarYear: nextCareer.calendarYear + 1,
      press: [press, ...nextCareer.press].slice(0, 40),
      fatigue: clamp((nextCareer.fatigue ?? 0) * 0.5, 0, 100),
      offers: [],
    };

    if (nextCareer.age >= RETIRE_AGE) {
      nextCareer = { ...nextCareer, retired: true };
    }

    s = {
      ...s,
      career: nextCareer,
      currentStats: completeStats(stats),
      phase: nextCareer.retired ? "legacy" : "career",
      centerView: nextCareer.retired ? "idle" : "season",
      pendingEvent: null,
      pendingFinals: null,
      clutch: null,
      fullGame: null,
      awaitingOffseason: false,
      seasonQueue: [],
      keyGamesQueue: [],
      nationalGamesQueue: [],
      awardQueue: [],
      activeAward: null,
    };
  }

  return { state: s, doc };
}
