/** Shared spring configuration used across scroll-driven animations. */
export const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };

/** Spring transition variant — includes `type: 'spring'` for Framer Motion `transition` props. */
export const SPRING_TRANSITION = { type: 'spring' as const, ...SPRING_CONFIG };
