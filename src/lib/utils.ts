export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatMoney(
  amount: number,
  currency: "BRL" | "EUR" | "AUD" | "USD" | "CNY",
): string {
  const locale =
    currency === "BRL"
      ? "pt-BR"
      : currency === "EUR"
        ? "es-ES"
        : currency === "AUD"
          ? "en-AU"
          : currency === "CNY"
            ? "zh-CN"
            : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
