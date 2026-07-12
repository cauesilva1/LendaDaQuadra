"use client";

import { Button } from "@/components/ui/Button";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";
import { ATTRS } from "@/lib/data";
import { compareRadar } from "@/lib/careerFlavor";
import { completeStats } from "@/lib/progression";

/** Shared hub panels: timeline, museum, spectator, press choice, dream, etc. */
export function FeaturePanels() {
  const { state, ovr } = useGameState();
  const {
    tr,
    setCenterView,
    resolvePressChoice,
    resolveDream,
    finishStreet3x3,
    finishAllStar,
    resolveContractTalk,
  } = useGameActions();
  const view = state.centerView;
  const career = state.career;

  if (view === "timeline" && career) {
    return (
      <div className="w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arena-accent">
          {tr("timeline.eyebrow")}
        </p>
        <h3 className="mt-2 font-display text-2xl uppercase text-white">
          {tr("timeline.title")}
        </h3>
        <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto text-left">
          {career.ovrHistory.map((p) => (
            <li
              key={`${p.season}-${p.age}`}
              className="rounded-lg border border-white/10 px-3 py-2"
            >
              <p className="font-display text-sm text-white">
                {2015 + p.season} · {tr("dash.season")} {p.season}
              </p>
              <p className="font-sans text-[11px] text-white/50">
                {tr("timeline.ageOvr", { age: p.age, ovr: p.ovr })}
              </p>
            </li>
          ))}
          {career.ovrHistory.length === 0 && (
            <p className="text-sm text-white/40">{tr("timeline.empty")}</p>
          )}
        </ul>
        <CompareMeBlock />
        <Button
          variant="outline"
          className="mt-4 w-full justify-center"
          onClick={() => setCenterView("season")}
        >
          {tr("cta.back")}
        </Button>
      </div>
    );
  }

  if (view === "museum" && career) {
    return (
      <div className="w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arena-accent">
          {tr("museum.eyebrow")}
        </p>
        <h3 className="mt-2 font-display text-2xl uppercase text-white">
          {tr("museum.title")}
        </h3>
        <ul className="mt-4 space-y-2 text-left">
          {(career.museum ?? []).map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-white/10 px-3 py-2"
            >
              <p className="font-display text-sm uppercase text-white">
                {tr(item.labelKey)}
              </p>
              <p className="text-[10px] text-white/40">
                {tr("museum.season", { n: item.season })} · {item.kind}
              </p>
            </li>
          ))}
          {(career.museum ?? []).length === 0 && (
            <p className="text-sm text-white/40">{tr("museum.empty")}</p>
          )}
        </ul>
        <Button
          variant="outline"
          className="mt-4 w-full justify-center"
          onClick={() => setCenterView("season")}
        >
          {tr("cta.back")}
        </Button>
      </div>
    );
  }

  if (view === "spectator") {
    return (
      <div className="w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arena-accent">
          {tr("spectator.eyebrow")}
        </p>
        <h3 className="mt-2 font-display text-2xl uppercase text-white">
          {tr("spectator.title")}
        </h3>
        <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto text-left">
          {state.spectatorDoc.map((line, i) => (
            <li key={`${line.season}-${i}`} className="border-b border-white/5 pb-2">
              <p className="font-display text-sm text-white">
                {tr(line.lineKey, line.vars)}
              </p>
              <p className="text-[10px] text-white/40">
                {line.year} · OVR {line.ovr} · {line.club}
              </p>
            </li>
          ))}
        </ul>
        <Button className="mt-4 w-full justify-center" onClick={() => setCenterView("season")}>
          {tr("cta.back")}
        </Button>
      </div>
    );
  }

  if (view === "press_choice" && state.pendingPressChoice) {
    const p = state.pendingPressChoice;
    return (
      <div className="w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arena-buzzer">
          {tr("press.choice.eyebrow")}
        </p>
        <h3 className="mt-2 font-display text-xl uppercase text-white">
          {tr(p.headlineKey)}
        </h3>
        <p className="mt-2 text-sm text-white/55">{tr(p.bodyKey)}</p>
        <div className="mt-4 grid gap-2">
          <Button onClick={() => resolvePressChoice(p.optionA.id)}>
            {tr(p.optionA.labelKey)}
          </Button>
          <Button variant="outline" onClick={() => resolvePressChoice(p.optionB.id)}>
            {tr(p.optionB.labelKey)}
          </Button>
        </div>
      </div>
    );
  }

  if (view === "dream" && state.pendingDream) {
    const d = state.pendingDream;
    return (
      <div className="w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arena-accent">
          {tr(d.kind === "dream" ? "dream.eyebrow" : "nightmare.eyebrow")}
        </p>
        <h3 className="mt-2 font-display text-2xl uppercase text-white">
          {tr(d.titleKey)}
        </h3>
        <p className="mt-2 text-sm text-white/55">{tr(d.bodyKey)}</p>
        <Button className="mt-4 w-full justify-center" onClick={resolveDream}>
          {tr("dream.cta")}
        </Button>
      </div>
    );
  }

  if (view === "street3x3") {
    return (
      <div className="w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arena-accent">
          {tr("street3.eyebrow")}
        </p>
        <h3 className="mt-2 font-display text-2xl uppercase text-white">
          {tr("street3.title")}
        </h3>
        <p className="mt-2 text-sm text-white/55">{tr("street3.body")}</p>
        <div className="mt-4 grid gap-2">
          <Button onClick={() => finishStreet3x3(true)}>{tr("street3.play")}</Button>
          <Button variant="outline" onClick={() => finishStreet3x3(false)}>
            {tr("street3.skip")}
          </Button>
        </div>
      </div>
    );
  }

  if (view === "allstar") {
    return (
      <div className="w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arena-accent">
          {tr("allstar.eyebrow")}
        </p>
        <h3 className="mt-2 font-display text-2xl uppercase text-white">
          {tr("allstar.title")}
        </h3>
        <p className="mt-2 text-sm text-white/55">
          {tr("allstar.body", { ovr })}
        </p>
        <Button className="mt-4 w-full justify-center" onClick={finishAllStar}>
          {tr("allstar.cta")}
        </Button>
      </div>
    );
  }

  if (view === "contract_talk") {
    return (
      <div className="w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arena-accent">
          {tr("contract.eyebrow")}
        </p>
        <h3 className="mt-2 font-display text-2xl uppercase text-white">
          {tr("contract.title")}
        </h3>
        <p className="mt-2 text-sm text-white/55">{tr("contract.body")}</p>
        <div className="mt-4 grid gap-2">
          <Button onClick={() => resolveContractTalk("stay")}>
            {tr("contract.stay")}
          </Button>
          <Button variant="outline" onClick={() => resolveContractTalk("trade")}>
            {tr("contract.trade")}
          </Button>
          <Button variant="ghost" onClick={() => resolveContractTalk("renegotiate")}>
            {tr("contract.renegotiate")}
          </Button>
        </div>
      </div>
    );
  }

  if (view === "daily_posse") {
    return (
      <div className="w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-arena-accent">
          {tr("daily.eyebrow")}
        </p>
        <h3 className="mt-2 font-display text-2xl uppercase text-white">
          {tr("daily.title")}
        </h3>
        <p className="mt-2 text-sm text-white/55">{tr("daily.body")}</p>
        <p className="mt-2 font-display text-lg text-arena-accent">
          {tr("daily.seed", { seed: state.dailyChallenge?.seed ?? "—" })}
        </p>
        <Button
          className="mt-4 w-full justify-center"
          onClick={() => setCenterView("quick_crunch")}
        >
          {tr("daily.play")}
        </Button>
      </div>
    );
  }

  return null;
}

function CompareMeBlock() {
  const { state } = useGameState();
  const { tr } = useGameActions();
  const career = state.career;
  if (!career || career.ovrHistory.length < 2) return null;
  const prev = career.ovrHistory[career.ovrHistory.length - 2]!;
  const last = career.ovrHistory[career.ovrHistory.length - 1]!;
  const delta = last.ovr - prev.ovr;
  return (
    <div className="mt-4 rounded-xl border border-white/10 px-3 py-2 text-left">
      <p className="font-sans text-[10px] uppercase text-white/40">
        {tr("compare.title")}
      </p>
      <p className="font-display text-lg text-white">
        {prev.ovr} → {last.ovr}{" "}
        <span className={delta >= 0 ? "text-emerald-400" : "text-red-400"}>
          ({delta >= 0 ? `+${delta}` : delta})
        </span>
      </p>
    </div>
  );
}

export function RadarCompare() {
  const { state } = useGameState();
  const { tr } = useGameActions();
  const cur = completeStats(state.currentStats);
  const max = completeStats(state.maxStats);
  const rows = compareRadar(
    cur,
    max,
    ATTRS.map((a) => a.k),
  );
  return (
    <div className="mt-3 grid grid-cols-2 gap-1.5 text-left">
      {rows.map((r) => (
        <div key={r.key} className="rounded border border-white/10 px-2 py-1">
          <div className="flex justify-between text-[10px] uppercase text-white/40">
            <span>{r.key}</span>
            <span>
              {r.cur}/{r.max}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded bg-white/10">
            <div
              className="h-full bg-arena-accent"
              style={{ width: `${r.pct}%` }}
            />
          </div>
        </div>
      ))}
      <p className="col-span-2 text-center text-[10px] text-white/35">
        {tr("radar.hint")}
      </p>
    </div>
  );
}

export function ClipButton() {
  const { copyClipMoment, tr } = useGameActions();
  return (
    <Button variant="ghost" className="text-[10px]" onClick={copyClipMoment}>
      {tr("clip.copy")}
    </Button>
  );
}
