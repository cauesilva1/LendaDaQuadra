import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "chip" | "chipActive";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const styles: Record<Variant, string> = {
  primary:
    "rounded-full bg-arena-accent px-6 py-3 font-display text-base uppercase tracking-wide text-arena-bg hover:bg-arena-buzzer hover:text-white",
  ghost:
    "rounded-full border border-white/15 px-5 py-2.5 font-display text-sm uppercase tracking-wide text-white/80 hover:border-white/30 hover:text-white",
  outline:
    "rounded-lg border border-arena-accent/40 px-4 py-2 font-display text-xs uppercase tracking-wide text-arena-accent hover:bg-arena-accent/10",
  chip:
    "rounded-md border border-white/15 bg-transparent px-3 py-2 font-display text-xs uppercase tracking-wide text-white/70 hover:border-white/30",
  chipActive:
    "rounded-md border border-arena-accent bg-arena-accent px-3 py-2 font-display text-xs uppercase tracking-wide text-arena-bg",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center gap-2 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
