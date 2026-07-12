"use client";

import { Crown, ArrowRightLeft, Star, Trophy, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { ScoutBar } from "@/components/play/ScoutBar";
import {
  EURO_OVR,
  NBA_DRAFT_MAX_AGE,
  NBA_DRAFT_MIN_SEASONS,
  NBA_DRAFT_OVR,
} from "@/lib/data";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

/** Press feed — page scrolls; no nested overflow trap. */
function InlinePress() {
  const { state } = useGameState();
  const { tr } = useGameActions();
  const items = state.career?.press ?? [];
  if (items.length === 0) return null;

  return (
    <div className="mt-2 w-full rounded-xl border border-white/10 bg-arena-panel/90 px-3 py-2 text-left">
      <p className="font-display text-[10px] uppercase tracking-widest text-arena-accent">
        {tr("dash.press")}
      </p>
      <ul className="mt-1.5 space-y-1.5">
        {items.slice(0, 6).map((item, i) => (
          <li key={item.id || `press-${item.season}-${i}`}>
            <p className="font-display text-sm uppercase leading-tight text-white">
              {item.headline}
            </p>
            <p className="text-[11px] leading-snug text-white/45">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SeasonResult() {
  const { state, ovr, draftEligible, euroEligible } = useGameState();
  const {
    advanceSeason,
    setCenterView,
    declareNbaDraft,
    retire,
    simulateEntireCareer,
    openDailyChallenge,
    dismissHubTour,
    tr,
  } = useGameActions();
  const career = state.career;
  const s = career?.lastSeason;
  if (!career || !s) return null;

  const showTour = !state.hubTourDone;
  const hist = career.ovrHistory;
  const prevOvr =
    hist.length >= 2 ? hist[hist.length - 2]!.ovr : hist[0]?.ovr;
  const lastOvr = hist.length >= 1 ? hist[hist.length - 1]!.ovr : ovr;
  const ovrDelta =
    prevOvr !== undefined ? lastOvr - prevOvr : undefined;

  const openHub = (view: Parameters<typeof setCenterView>[0]) => {
    if (showTour) dismissHubTour();
    setCenterView(view);
  };

  const draftNear =
    !career.inNba &&
    !draftEligible &&
    career.age <= NBA_DRAFT_MAX_AGE &&
    career.seasonsPlayed >= NBA_DRAFT_MIN_SEASONS - 1 &&
    ovr >= NBA_DRAFT_OVR - 8;

  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <div className="w-full rounded-xl border border-arena-accent/30 bg-arena-panel p-3">
        <p className="font-display text-[10px] uppercase tracking-widest text-arena-accent">
          {tr("dash.season")} {career.season} · {career.clubName}
        </p>
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {[
            [tr("dash.gp"), s.gp, 0],
            [tr("dash.ppg"), s.ppg, 1],
            [tr("dash.rpg"), s.rpg, 1],
            [tr("dash.apg"), s.apg, 1],
            [tr("dash.rating"), s.rating, 1],
          ].map(([label, val, dec]) => (
            <div
              key={String(label)}
              className="rounded-lg border border-white/10 px-1 py-1.5 text-center"
            >
              <div className="font-display text-lg text-white sm:text-xl">
                <CountUp target={Number(val)} decimals={Number(dec)} />
              </div>
              <div className="text-[9px] uppercase text-white/40">{label}</div>
            </div>
          ))}
        </div>
        {s.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {s.tags.map((tag) => (
              <span
                key={tag.key ?? `${tag.id}-${career.season}`}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-display text-[9px] uppercase ${
                  tag.rim
                    ? "border-arena-accent text-arena-accent"
                    : "border-white/20 text-white/70"
                }`}
              >
                {tag.id === "champion" && <Trophy className="h-2.5 w-2.5" />}
                {tag.id === "mvp" && <Crown className="h-2.5 w-2.5" />}
                {tag.id === "allstar" && <Star className="h-2.5 w-2.5" />}
                {tag.id === "dpoy" && <Shield className="h-2.5 w-2.5" />}
                {tr(`tag.${tag.id}`)}
              </span>
            ))}
          </div>
        )}
        {ovrDelta !== undefined && (
          <p className="mt-2 font-sans text-[11px] text-white/50">
            {tr("compare.title")}:{" "}
            <span
              className={
                ovrDelta >= 0 ? "text-emerald-400" : "text-red-400"
              }
            >
              {prevOvr} → {lastOvr} ({ovrDelta >= 0 ? `+${ovrDelta}` : ovrDelta})
            </span>
          </p>
        )}
      </div>

      {(draftEligible || euroEligible) && (
        <div className="w-full rounded-xl border border-arena-accent/50 bg-arena-accent/10 p-2.5 text-center">
          <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-arena-accent">
            {tr("dash.pathHint")}
          </p>
          <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
            {draftEligible && (
              <Button className="justify-center" onClick={declareNbaDraft}>
                {tr("cta.declareDraft")}
              </Button>
            )}
            <Button
              variant="outline"
              className="justify-center"
              onClick={() => setCenterView("transfers")}
            >
              {tr("cta.viewPaths")}
            </Button>
          </div>
        </div>
      )}

      {draftNear && (
        <div className="w-full rounded-xl border border-white/10 bg-arena-panel px-3 py-2.5 text-left">
          <p className="font-sans text-[10px] font-medium uppercase tracking-wider text-white/40">
            {tr("dash.draftProgress")}
          </p>
          <p className="mt-1 font-sans text-xs text-white/60">
            {tr("dash.draftNeed", {
              ovr: NBA_DRAFT_OVR,
              current: ovr,
              age: NBA_DRAFT_MAX_AGE,
              seasons: NBA_DRAFT_MIN_SEASONS,
            })}
          </p>
          <ScoutBar
            ovr={ovr}
            age={career.age}
            seasonsPlayed={career.seasonsPlayed}
          />
          {ovr < EURO_OVR && (
            <p className="mt-1.5 font-sans text-[10px] text-white/40">
              {tr("dash.euroNeed", { ovr: EURO_OVR })}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-1.5">
        <Button onClick={advanceSeason}>{tr("cta.advance")}</Button>
        <Button variant="outline" onClick={() => setCenterView("transfers")}>
          <ArrowRightLeft className="h-3.5 w-3.5" />
          {tr("cta.viewTransfers")}
        </Button>
        {career.age >= 28 && (
          <Button variant="ghost" onClick={retire}>
            {tr("cta.retire")}
          </Button>
        )}
      </div>

      {showTour && (
        <div className="w-full rounded-xl border border-arena-accent/40 bg-arena-accent/10 px-3 py-2.5 text-left">
          <p className="font-display text-sm uppercase text-arena-accent">
            {tr("hub.tour.title")}
          </p>
          <p className="mt-1 font-sans text-[11px] text-white/60">
            {tr("hub.tour.body")}
          </p>
          <Button
            variant="outline"
            className="mt-2 w-full justify-center"
            onClick={dismissHubTour}
          >
            {tr("hub.tour.cta")}
          </Button>
        </div>
      )}

      <p className="font-sans text-[10px] text-white/40">{tr("season.hubHint")}</p>
      <div
        className={`flex flex-wrap justify-center gap-1.5 ${
          showTour ? "rounded-xl ring-2 ring-arena-accent/50 p-2" : ""
        }`}
      >
        <Button variant="outline" onClick={() => openHub("timeline")}>
          {tr("hub.timeline")}
        </Button>
        <Button variant="outline" onClick={() => openHub("museum")}>
          {tr("hub.museum")}
        </Button>
        <Button variant="outline" onClick={() => openHub("street3x3")}>
          {tr("hub.street")}
        </Button>
        {ovr >= 72 && (
          <Button variant="outline" onClick={() => openHub("allstar")}>
            {tr("hub.allstar")}
          </Button>
        )}
        <Button variant="outline" onClick={() => openHub("contract_talk")}>
          {tr("hub.contract")}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (showTour) dismissHubTour();
            openDailyChallenge();
          }}
        >
          {tr("hub.daily")}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (showTour) dismissHubTour();
            simulateEntireCareer();
          }}
        >
          {tr("simCareer.cta")}
        </Button>
      </div>

      <InlinePress />
    </div>
  );
}
