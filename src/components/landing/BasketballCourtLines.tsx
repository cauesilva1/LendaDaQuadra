/** Subtle basketball court lines for card watermarks. */

export function BasketballCourtLines({
  color,
  className = "pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]",
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 160 220"
      preserveAspectRatio="none"
    >
      {/* Outer boundary */}
      <rect
        x="12"
        y="12"
        width="136"
        height="196"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
      />

      {/* Half-court line */}
      <line
        x1="12"
        y1="110"
        x2="148"
        y2="110"
        stroke={color}
        strokeWidth="1.1"
      />

      {/* Center circle + jump-ball spot */}
      <circle
        cx="80"
        cy="110"
        r="16"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      <circle cx="80" cy="110" r="2.2" fill={color} opacity="0.7" />

      {/* Top paint (key) */}
      <rect
        x="52"
        y="12"
        width="56"
        height="42"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      {/* Top free-throw circle (into court) */}
      <path
        d="M52 54 A28 28 0 0 0 108 54"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      {/* Top free-throw dashed half (optional solid is fine) */}
      <path
        d="M52 54 A28 28 0 0 1 108 54"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.7"
      />
      {/* Top hoop mark */}
      <circle
        cx="80"
        cy="22"
        r="5"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      <line
        x1="68"
        y1="12"
        x2="92"
        y2="12"
        stroke={color}
        strokeWidth="2"
      />

      {/* Top three-point arc */}
      <path
        d="M28 12 L28 38 A52 52 0 0 0 132 38 L132 12"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />

      {/* Bottom paint */}
      <rect
        x="52"
        y="166"
        width="56"
        height="42"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      <path
        d="M52 166 A28 28 0 0 1 108 166"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      <path
        d="M52 166 A28 28 0 0 0 108 166"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.7"
      />
      <circle
        cx="80"
        cy="198"
        r="5"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      <line
        x1="68"
        y1="208"
        x2="92"
        y2="208"
        stroke={color}
        strokeWidth="2"
      />

      {/* Bottom three-point arc */}
      <path
        d="M28 208 L28 182 A52 52 0 0 1 132 182 L132 208"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
    </svg>
  );
}

/** Compact half-court mark for legacy card corner watermark. */
export function BasketballHalfCourtMark({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 200 200"
      fill="none"
    >
      {/* Key */}
      <rect
        x="60"
        y="20"
        width="80"
        height="70"
        stroke={color}
        strokeWidth="3"
      />
      {/* Free-throw circle */}
      <path
        d="M60 90 A40 40 0 0 0 140 90"
        stroke={color}
        strokeWidth="3"
      />
      <path
        d="M60 90 A40 40 0 0 1 140 90"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="6 6"
        opacity="0.75"
      />
      {/* Rim + backboard */}
      <circle cx="100" cy="38" r="10" stroke={color} strokeWidth="3" />
      <line x1="78" y1="20" x2="122" y2="20" stroke={color} strokeWidth="5" />
      {/* Three-point arc */}
      <path
        d="M30 20 L30 55 A70 70 0 0 0 170 55 L170 20"
        stroke={color}
        strokeWidth="3"
      />
      {/* Sidelines snippet */}
      <line x1="20" y1="20" x2="20" y2="160" stroke={color} strokeWidth="3" />
      <line x1="180" y1="20" x2="180" y2="160" stroke={color} strokeWidth="3" />
      <line x1="20" y1="20" x2="180" y2="20" stroke={color} strokeWidth="3" />
    </svg>
  );
}
