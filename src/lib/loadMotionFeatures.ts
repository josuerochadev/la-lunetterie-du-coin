/**
 * Load motion features for LazyMotion.
 * Reduced-motion preferences are handled at the component level
 * via usePrefersReducedMotion, not here.
 */
export const loadFeatures = () =>
  import('@/components/motion/motionFeatures').then((res) => res.default);
