// src/lib/loadMotionFeatures.ts

/**
 * Load motion features only if user hasn't requested reduced motion
 * This prevents loading heavy animation libraries for users who prefer static content
 */
export const loadFeatures = () => {
  // Check if user prefers reduced motion
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Return minimal features for accessibility
      return Promise.resolve(null);
    }
  }

  // Load full motion features for users who want animations
  return import('@/components/motion/motionFeatures').then((res) => res.default);
};
