/** Visual themes for career share / landing tier cards. */

export type LegacyThemeId =
  | "bench"
  | "solid"
  | "star"
  | "allstar"
  | "legend"
  | "immortal"
  | "goat_debate"
  | "goat";

export type LegacyTheme = {
  id: LegacyThemeId;
  /** Hex accent for UI + canvas */
  accent: string;
  accentSoft: string;
  /** Deep background */
  bg0: string;
  bg1: string;
  /** Tailwind-ish helpers for className composition */
  titleClass: string;
  ovrClass: string;
  ribbonClass: string;
  /** Canvas */
  canvasBg: string;
  canvasAccent: string;
  canvasTitle: string;
  /** Soft glow rgba */
  glow: string;
};

const THEMES: Record<LegacyThemeId, LegacyTheme> = {
  bench: {
    id: "bench",
    accent: "#94a3b8",
    accentSoft: "rgba(148,163,184,0.18)",
    bg0: "#0f141c",
    bg1: "#1a222e",
    titleClass: "text-slate-200",
    ovrClass: "text-slate-300",
    ribbonClass: "bg-slate-500/20 text-slate-200",
    canvasBg: "#0f141c",
    canvasAccent: "#94a3b8",
    canvasTitle: "#e2e8f0",
    glow: "rgba(148,163,184,0.22)",
  },
  solid: {
    id: "solid",
    accent: "#5b9fd4",
    accentSoft: "rgba(91,159,212,0.2)",
    bg0: "#0a121c",
    bg1: "#122033",
    titleClass: "text-[#b8d9f0]",
    ovrClass: "text-[#7eb8e0]",
    ribbonClass: "bg-[#5b9fd4]/18 text-[#c5e0f5]",
    canvasBg: "#0a121c",
    canvasAccent: "#5b9fd4",
    canvasTitle: "#c5e0f5",
    glow: "rgba(91,159,212,0.28)",
  },
  star: {
    id: "star",
    accent: "#3ecf8e",
    accentSoft: "rgba(62,207,142,0.18)",
    bg0: "#081410",
    bg1: "#0f2a1e",
    titleClass: "text-emerald-200",
    ovrClass: "text-emerald-300",
    ribbonClass: "bg-emerald-500/15 text-emerald-100",
    canvasBg: "#081410",
    canvasAccent: "#3ecf8e",
    canvasTitle: "#a7f3d0",
    glow: "rgba(62,207,142,0.25)",
  },
  allstar: {
    id: "allstar",
    accent: "#ff9a3c",
    accentSoft: "rgba(255,154,60,0.2)",
    bg0: "#140e08",
    bg1: "#2a1a0c",
    titleClass: "text-[#ffd4a8]",
    ovrClass: "text-[#ffb06a]",
    ribbonClass: "bg-[#ff9a3c]/18 text-[#ffe0c0]",
    canvasBg: "#140e08",
    canvasAccent: "#ff9a3c",
    canvasTitle: "#ffe0c0",
    glow: "rgba(255,154,60,0.32)",
  },
  legend: {
    id: "legend",
    accent: "#ff7a00",
    accentSoft: "rgba(255,122,0,0.2)",
    bg0: "#160c06",
    bg1: "#2c1408",
    titleClass: "text-orange-200",
    ovrClass: "text-arena-accent",
    ribbonClass: "bg-arena-accent/20 text-orange-100",
    canvasBg: "#160c06",
    canvasAccent: "#ff7a00",
    canvasTitle: "#fdba74",
    glow: "rgba(255,122,0,0.35)",
  },
  immortal: {
    id: "immortal",
    accent: "#ff4d42",
    accentSoft: "rgba(255,77,66,0.2)",
    bg0: "#160808",
    bg1: "#2a1010",
    titleClass: "text-red-200",
    ovrClass: "text-[#ff7a72]",
    ribbonClass: "bg-red-500/15 text-red-100",
    canvasBg: "#160808",
    canvasAccent: "#ff4d42",
    canvasTitle: "#fecaca",
    glow: "rgba(255,77,66,0.3)",
  },
  goat_debate: {
    id: "goat_debate",
    accent: "#e8c9a0",
    accentSoft: "rgba(232,201,160,0.16)",
    bg0: "#12100e",
    bg1: "#241c16",
    titleClass: "text-[#f0e0c8]",
    ovrClass: "text-[#e8c9a0]",
    ribbonClass: "bg-[#e8c9a0]/12 text-[#f5ead8]",
    canvasBg: "#12100e",
    canvasAccent: "#e8c9a0",
    canvasTitle: "#f5ead8",
    glow: "rgba(232,201,160,0.22)",
  },
  goat: {
    id: "goat",
    accent: "#f5d76e",
    accentSoft: "rgba(245,215,110,0.18)",
    bg0: "#050505",
    bg1: "#161208",
    titleClass: "text-[#fff1c2]",
    ovrClass: "text-[#f5d76e]",
    ribbonClass: "bg-[#f5d76e]/15 text-[#fff6d6]",
    canvasBg: "#050505",
    canvasAccent: "#f5d76e",
    canvasTitle: "#fff1c2",
    glow: "rgba(245,215,110,0.38)",
  },
};

export function legacyTheme(tierId: string): LegacyTheme {
  return THEMES[
    (tierId as LegacyThemeId) in THEMES ? (tierId as LegacyThemeId) : "solid"
  ];
}

/** Four landing showcase tiers. */
export const LANDING_TIERS = [
  { ovr: 72, tier: "solid" as const },
  { ovr: 86, tier: "allstar" as const },
  { ovr: 94, tier: "goat_debate" as const },
  { ovr: 99, tier: "goat" as const },
];
