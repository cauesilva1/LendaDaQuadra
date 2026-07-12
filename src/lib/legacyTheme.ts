/** Visual themes for end-of-career share cards. */

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
  /** Card border / accent */
  accent: string;
  /** Soft glow */
  glow: string;
  /** Panel fill */
  panel: string;
  /** Title text color */
  title: string;
  /** Canvas fill for PNG export */
  canvasBg: string;
  canvasAccent: string;
  canvasTitle: string;
};

const THEMES: Record<LegacyThemeId, LegacyTheme> = {
  bench: {
    id: "bench",
    accent: "rgba(148,163,184,0.55)",
    glow: "rgba(148,163,184,0.12)",
    panel: "from-slate-900 to-slate-950",
    title: "text-slate-300",
    canvasBg: "#0f172a",
    canvasAccent: "#94a3b8",
    canvasTitle: "#cbd5e1",
  },
  solid: {
    id: "solid",
    accent: "rgba(56,189,248,0.65)",
    glow: "rgba(56,189,248,0.18)",
    panel: "from-sky-950 to-[#071018]",
    title: "text-sky-300",
    canvasBg: "#0c1a24",
    canvasAccent: "#38bdf8",
    canvasTitle: "#7dd3fc",
  },
  star: {
    id: "star",
    accent: "rgba(52,211,153,0.6)",
    glow: "rgba(52,211,153,0.16)",
    panel: "from-emerald-950 to-[#06140f]",
    title: "text-emerald-300",
    canvasBg: "#0a1a14",
    canvasAccent: "#34d399",
    canvasTitle: "#6ee7b7",
  },
  allstar: {
    id: "allstar",
    accent: "rgba(251,191,36,0.75)",
    glow: "rgba(251,191,36,0.22)",
    panel: "from-amber-950 to-[#1a1006]",
    title: "text-amber-300",
    canvasBg: "#1a1206",
    canvasAccent: "#fbbf24",
    canvasTitle: "#fcd34d",
  },
  legend: {
    id: "legend",
    accent: "rgba(251,146,60,0.7)",
    glow: "rgba(251,146,60,0.2)",
    panel: "from-orange-950 to-[#1a0c06]",
    title: "text-orange-300",
    canvasBg: "#1a0e08",
    canvasAccent: "#fb923c",
    canvasTitle: "#fdba74",
  },
  immortal: {
    id: "immortal",
    accent: "rgba(248,113,113,0.7)",
    glow: "rgba(248,113,113,0.2)",
    panel: "from-red-950 to-[#1a0608]",
    title: "text-red-300",
    canvasBg: "#1a080a",
    canvasAccent: "#f87171",
    canvasTitle: "#fca5a5",
  },
  goat_debate: {
    id: "goat_debate",
    accent: "rgba(192,132,252,0.8)",
    glow: "rgba(192,132,252,0.28)",
    panel: "from-violet-950 to-[#12081a]",
    title: "text-violet-300",
    canvasBg: "#14081c",
    canvasAccent: "#c084fc",
    canvasTitle: "#e9d5ff",
  },
  goat: {
    id: "goat",
    accent: "rgba(250,204,21,0.95)",
    glow: "rgba(250,204,21,0.4)",
    panel: "from-black via-[#1a1400] to-black",
    title: "text-yellow-200",
    canvasBg: "#050505",
    canvasAccent: "#facc15",
    canvasTitle: "#fef08a",
  },
};

export function legacyTheme(tierId: string): LegacyTheme {
  return THEMES[(tierId as LegacyThemeId) in THEMES ? (tierId as LegacyThemeId) : "solid"];
}
