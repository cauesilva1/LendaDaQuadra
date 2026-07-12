export function ProgressBar({
  value,
  max = 99,
  className = "",
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full bg-arena-accent transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
