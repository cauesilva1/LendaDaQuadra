/** Tiny WebAudio beeps — no asset downloads. */

let ctx: AudioContext | null = null;
let muted = false;
let muteHydrated = false;

const MUTE_KEY = "lenda-sfx-mute";

/** Sync read — must run before any beep on the client. */
export function loadSfxMute(): boolean {
  if (typeof window === "undefined") return muted;
  try {
    muted = localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    muted = false;
  }
  muteHydrated = true;
  return muted;
}

/** Eager hydrate so first interaction never races the mute preference. */
if (typeof window !== "undefined") {
  loadSfxMute();
}

export function setSfxMute(next: boolean): void {
  muted = next;
  muteHydrated = true;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  } catch {
    // ignore
  }
}

export function isSfxMuted(): boolean {
  if (!muteHydrated && typeof window !== "undefined") loadSfxMute();
  return muted;
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!muteHydrated) loadSfxMute();
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function beep(
  freq: number,
  durMs: number,
  gain = 0.04,
  type: OscillatorType = "sine",
) {
  if (!muteHydrated) loadSfxMute();
  if (muted) return;
  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(ac.destination);
  const t = ac.currentTime;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + durMs / 1000);
  osc.start(t);
  osc.stop(t + durMs / 1000 + 0.02);
}

export function sfxClick() {
  beep(520, 40, 0.03, "triangle");
}

export function sfxDraft() {
  beep(660, 80, 0.045, "square");
  setTimeout(() => beep(880, 100, 0.04, "square"), 70);
}

export function sfxSuccess() {
  beep(523, 70, 0.04);
  setTimeout(() => beep(659, 90, 0.045), 80);
  setTimeout(() => beep(784, 120, 0.05), 160);
}

export function sfxBuzzer() {
  beep(180, 220, 0.055, "sawtooth");
}

/** Soft net swish on made basket. */
export function sfxSwish() {
  beep(880, 35, 0.028, "sine");
  setTimeout(() => beep(1320, 55, 0.022, "triangle"), 28);
}
