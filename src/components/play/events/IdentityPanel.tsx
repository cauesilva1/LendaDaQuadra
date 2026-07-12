"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  DRIP_OPTIONS,
  SIGNATURES,
  suggestNickname,
} from "@/lib/careerFlavor";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";
import type { DripStyle, SignatureMove } from "@/types/game";

/** Post-draft identity: nickname, signature, drip, path. Club scheme is fixed by the team. */
export function IdentityPanel() {
  const { state } = useGameState();
  const { confirmIdentity, tr } = useGameActions();
  const player = state.player;
  const career = state.career;
  const [nickname, setNickname] = useState(() =>
    player
      ? suggestNickname(player.name, player.countryId)
      : "Prospect",
  );
  const [signature, setSignature] = useState<SignatureMove>("stepback");
  const [drip, setDrip] = useState<DripStyle>("classic");
  const [preferNcaa, setPreferNcaa] = useState(
    player?.countryId === "us",
  );

  if (!player) return null;

  const clubStyle = career?.coachStyle ?? "halfcourt";

  return (
    <div className="w-full max-w-md text-center">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-arena-accent">
        {tr("identity.eyebrow")}
      </p>
      <h3 className="mt-2 font-display text-2xl uppercase text-white">
        {tr("identity.title")}
      </h3>
      <p className="mt-1 font-sans text-sm text-white/50">
        {tr("identity.lead")}
      </p>

      <label className="mt-4 block text-left">
        <span className="font-sans text-[10px] uppercase text-white/40">
          {tr("identity.nickname")}
        </span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/15 bg-arena-bg px-3 py-2 text-center text-white outline-none focus:border-arena-accent"
        />
      </label>

      <p className="mt-4 font-sans text-[10px] uppercase text-white/40">
        {tr("identity.signature")}
      </p>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        {SIGNATURES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSignature(s.id)}
            className={`rounded-lg border px-2 py-2 font-display text-xs uppercase ${
              signature === s.id
                ? "border-arena-accent bg-arena-accent/15 text-arena-accent"
                : "border-white/15 text-white/70"
            }`}
          >
            {tr(s.labelKey)}
          </button>
        ))}
      </div>

      <p className="mt-4 font-sans text-[10px] uppercase text-white/40">
        {tr("identity.drip")}
      </p>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        {DRIP_OPTIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDrip(d.id)}
            className={`rounded-lg border px-2 py-2 font-display text-xs uppercase ${
              drip === d.id
                ? "border-arena-accent bg-arena-accent/15 text-arena-accent"
                : "border-white/15 text-white/70"
            }`}
          >
            {tr(d.labelKey)}
          </button>
        ))}
      </div>

      {career?.clubName && (
        <div className="mt-4 rounded-lg border border-white/10 bg-arena-bg/50 px-3 py-2 text-left">
          <p className="font-sans text-[10px] uppercase text-white/40">
            {tr("identity.clubStyle")}
          </p>
          <p className="mt-0.5 font-display text-sm uppercase text-arena-accent">
            {tr(`coach.${clubStyle}`)}
          </p>
          <p className="mt-0.5 font-sans text-[11px] text-white/45">
            {tr("identity.clubStyleHint", { club: career.clubName })}
          </p>
        </div>
      )}

      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-left font-sans text-xs text-white/60">
        <input
          type="checkbox"
          checked={preferNcaa}
          onChange={(e) => setPreferNcaa(e.target.checked)}
        />
        {tr("identity.ncaa")}
      </label>

      <Button
        className="mt-5 w-full justify-center"
        onClick={() =>
          confirmIdentity({
            nickname: nickname.trim() || suggestNickname(player.name, player.countryId),
            signature,
            drip,
            preferNcaa,
          })
        }
      >
        {tr("identity.cta")}
      </Button>
    </div>
  );
}
