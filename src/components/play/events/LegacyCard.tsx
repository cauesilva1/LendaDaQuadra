"use client";

import { useRef, useState } from "react";
import {
  Copy,
  Crown,
  Download,
  RotateCcw,
  Star,
  Trophy,
  Medal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ATTRS } from "@/lib/data";
import { liveStats } from "@/lib/simulation";
import { legacyTheme } from "@/lib/legacyTheme";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

function OvrChart({
  points,
  stroke,
}: {
  points: { age: number; ovr: number }[];
  stroke: string;
}) {
  if (points.length < 2) {
    return (
      <div className="flex h-14 items-center justify-center text-xs text-white/40">
        —
      </div>
    );
  }
  const minO = Math.min(...points.map((p) => p.ovr)) - 5;
  const maxO = Math.max(...points.map((p) => p.ovr)) + 5;
  const w = 280;
  const h = 56;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (w - 12) + 6;
    const y = h - 6 - ((p.ovr - minO) / (maxO - minO)) * (h - 12);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        points={coords.join(" ")}
      />
      {points.map((p, i) => {
        const [x, y] = coords[i]!.split(",").map(Number);
        return <circle key={p.age} cx={x} cy={y} r="2.5" fill={stroke} />;
      })}
    </svg>
  );
}

function downloadLegacyPng(opts: {
  name: string;
  pos: string;
  ovr: number;
  seasons: number;
  tierLabel: string;
  tierDesc: string;
  league: number;
  nba: number;
  euro: number;
  mvp: number;
  finals: number;
  allstars: number;
  theme: ReturnType<typeof legacyTheme>;
}) {
  const W = 720;
  const H = 960;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { theme } = opts;
  ctx.fillStyle = theme.canvasBg;
  ctx.fillRect(0, 0, W, H);

  // Atmosphere
  const g = ctx.createRadialGradient(W * 0.5, 80, 20, W * 0.5, 200, 420);
  g.addColorStop(0, theme.canvasAccent + "55");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Frame
  ctx.strokeStyle = theme.canvasAccent;
  ctx.lineWidth = 6;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  ctx.fillStyle = theme.canvasAccent;
  ctx.font = "600 22px system-ui, sans-serif";
  ctx.fillText("LENDA DA QUADRA", 56, 80);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 64px system-ui, sans-serif";
  ctx.fillText(opts.name.toUpperCase(), 56, 160);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "500 24px system-ui, sans-serif";
  ctx.fillText(`${opts.pos} · ${opts.seasons} seasons`, 56, 200);

  // OVR badge
  ctx.beginPath();
  ctx.arc(W - 120, 150, 64, 0, Math.PI * 2);
  ctx.fillStyle = theme.canvasBg;
  ctx.fill();
  ctx.strokeStyle = theme.canvasAccent;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = theme.canvasAccent;
  ctx.font = "800 48px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(opts.ovr), W - 120, 162);
  ctx.font = "600 14px system-ui, sans-serif";
  ctx.fillText("OVR", W - 120, 186);
  ctx.textAlign = "left";

  ctx.fillStyle = theme.canvasTitle;
  ctx.font = "800 36px system-ui, sans-serif";
  const tierLines = opts.tierLabel.toUpperCase();
  wrapText(ctx, tierLines, 56, 280, W - 112, 40);

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "400 22px system-ui, sans-serif";
  wrapText(ctx, opts.tierDesc, 56, 360, W - 112, 30);

  const stats: [string, number][] = [
    ["League", opts.league],
    ["NBA", opts.nba],
    ["Euro", opts.euro],
    ["MVP", opts.mvp],
    ["Finals MVP", opts.finals],
    ["All-Star", opts.allstars],
  ];
  stats.forEach(([label, val], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 56 + col * 210;
    const y = 480 + row * 120;
    ctx.strokeStyle = theme.canvasAccent + "66";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 190, 96);
    ctx.fillStyle = theme.canvasAccent;
    ctx.font = "800 40px system-ui, sans-serif";
    ctx.fillText(String(val), x + 16, y + 52);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 16px system-ui, sans-serif";
    ctx.fillText(label.toUpperCase(), x + 16, y + 78);
  });

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "500 16px system-ui, sans-serif";
  ctx.fillText("lendadaquadra.app", 56, H - 56);

  const a = document.createElement("a");
  a.download = `lenda-${opts.name.replace(/\s+/g, "-").toLowerCase()}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

export function LegacyCard() {
  const { state, ovr, legacyTierId } = useGameState();
  const { restart, copySummary, tr } = useGameActions();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const career = state.career;
  const player = state.player;
  if (!career || !player) return null;

  const theme = legacyTheme(legacyTierId);
  const trph = career.trophies;
  const attrs = liveStats(state);

  const handleCopy = async () => {
    const ok = await copySummary();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownload = () => {
    downloadLegacyPng({
      name: player.name,
      pos: player.posId,
      ovr,
      seasons: career.seasonsPlayed,
      tierLabel: tr(`tier.${legacyTierId}`),
      tierDesc: tr(`tier.${legacyTierId}.desc`),
      league: trph.leagueTitles,
      nba: trph.nbaTitles,
      euro: trph.euroTitles ?? 0,
      mvp: trph.mvps,
      finals: trph.finalsMvps,
      allstars: trph.allStars,
      theme,
    });
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-md flex-col items-center justify-center overflow-hidden px-1">
      <p className="shrink-0 text-center font-display text-[10px] uppercase tracking-widest text-white/50">
        {tr("legacy.eyebrow")}
      </p>

      {/* Shareable career image card */}
      <div
        ref={cardRef}
        className={`relative mt-2 w-full overflow-hidden rounded-2xl border-2 bg-gradient-to-b p-3 ${theme.panel}`}
        style={{
          borderColor: theme.accent,
          boxShadow: `0 0 32px ${theme.glow}`,
        }}
      >
        <div
          className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full blur-3xl"
          style={{ background: theme.glow }}
        />
        <div className="relative flex items-center gap-3">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2"
            style={{ borderColor: theme.accent, background: theme.glow }}
          >
            <div className="text-center">
              <div
                className={`font-display text-2xl leading-none ${theme.title}`}
              >
                {ovr}
              </div>
              <div className="text-[7px] uppercase tracking-wider text-white/50">
                {tr("legacy.ovr")}
              </div>
            </div>
          </div>
          <div className="min-w-0 text-left">
            <h2 className="truncate font-display text-xl uppercase leading-none text-white">
              {player.name}
            </h2>
            <p className="mt-0.5 text-[10px] text-white/50">
              {player.posId} · {career.seasonsPlayed}{" "}
              {tr("dash.season").toLowerCase()}s
            </p>
            <h3
              className={`mt-1 font-display text-sm uppercase leading-tight ${theme.title}`}
            >
              {tr(`tier.${legacyTierId}`)}
            </h3>
            <p className="mt-0.5 text-[10px] leading-snug text-white/45">
              {tr(`tier.${legacyTierId}.desc`)}
            </p>
          </div>
        </div>

        <div className="relative mt-3">
          <p className="mb-1 font-display text-[9px] uppercase tracking-widest text-white/45">
            {tr("legacy.attrs")}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {ATTRS.map((a) => (
              <div key={a.k}>
                <div className="mb-0.5 flex justify-between text-[9px] uppercase text-white/50">
                  <span className="truncate">{tr(a.labelKey)}</span>
                  <span className={theme.title}>{attrs[a.k]}</span>
                </div>
                <ProgressBar value={attrs[a.k] ?? 0} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-3">
          <div className="grid grid-cols-3 gap-1">
            {[
              [Trophy, tr("legacy.leagueTitles"), trph.leagueTitles],
              [Medal, tr("legacy.nbaTitles"), trph.nbaTitles],
              [Trophy, tr("legacy.euroTitles"), trph.euroTitles ?? 0],
              [Crown, tr("legacy.mvps"), trph.mvps],
              [Star, tr("legacy.finals"), trph.finalsMvps],
              [Star, tr("legacy.allstars"), trph.allStars],
            ].map(([Icon, label, val], i) => {
              const I = Icon as typeof Trophy;
              return (
                <div
                  key={i}
                  className="rounded-md border px-1 py-1 text-center"
                  style={{
                    borderColor: theme.accent,
                    background: theme.glow,
                  }}
                >
                  <I
                    className="mx-auto h-3 w-3"
                    style={{ color: theme.canvasAccent }}
                  />
                  <div className="font-display text-sm text-white">
                    {val as number}
                  </div>
                  <div className="text-[8px] uppercase leading-tight text-white/45">
                    {label as string}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mt-2">
          <p className="mb-0.5 font-display text-[9px] uppercase tracking-widest text-white/45">
            {tr("legacy.chart")}
          </p>
          <OvrChart
            points={career.ovrHistory}
            stroke={theme.canvasAccent}
          />
        </div>
      </div>

      <div className="mt-3 flex shrink-0 flex-wrap justify-center gap-2">
        <Button variant="ghost" onClick={handleDownload}>
          <Download className="h-3.5 w-3.5" />
          {tr("legacy.download")}
        </Button>
        <Button variant="ghost" onClick={handleCopy}>
          <Copy className="h-3.5 w-3.5" />
          {copied ? tr("cta.copied") : tr("cta.copy")}
        </Button>
        <Button onClick={restart}>
          <RotateCcw className="h-3.5 w-3.5" />
          {tr("cta.newCareer")}
        </Button>
      </div>
    </div>
  );
}
