/** Motion tokens tuned for a webgame — avoid stacked spring cascades. */

/** Parent shell: fast opacity only (modal / phase swap). */
export const fadeFast = {
  duration: 0.18,
  ease: "easeOut" as const,
};

/** Child content after parent settles. */
export const springPremium = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

/** Delay before inner juice so parent fade finishes first (~180ms). */
export const contentDelay = 0.16;

export const parentFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: fadeFast,
};

export const childReveal = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { ...springPremium, delay: contentDelay },
};
