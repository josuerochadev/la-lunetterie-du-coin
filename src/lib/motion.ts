/** Shared spring configuration used across scroll-driven animations. */
export const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };

/** Slower spring for dramatic zoom/scale transitions (e.g. GRAND zoom, contact VOIR). */
export const SPRING_CONFIG_SLOW = { stiffness: 60, damping: 30, mass: 0.5 };

/** Snappier spring for cursor-following — higher stiffness for responsiveness. */
export const SPRING_CONFIG_CURSOR = { stiffness: 150, damping: 25, mass: 0.5 };

/** Spring transition variant — includes `type: 'spring'` for Framer Motion `transition` props. */
export const SPRING_TRANSITION = { type: 'spring' as const, ...SPRING_CONFIG };
