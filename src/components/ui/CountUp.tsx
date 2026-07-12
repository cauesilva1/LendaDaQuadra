"use client";

import { useEffect, useState } from "react";

export function CountUp({
  target,
  duration = 700,
  decimals = 0,
  className,
}: {
  target: number;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const raw = target * (1 - Math.pow(1 - p, 3));
      setValue(decimals > 0 ? Math.round(raw * 10 ** decimals) / 10 ** decimals : Math.round(raw));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, decimals]);

  return (
    <span className={className}>
      {decimals > 0 ? value.toFixed(decimals) : value}
    </span>
  );
}
