import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsXl } from '@/hooks/useIsXl';

export type MotionVariant = 'desktop-animated' | 'mobile-animated' | 'static';

/**
 * Determines which rendering variant a section should use based on
 * the user's motion preference and viewport size.
 *
 * - `'desktop-animated'` — xl viewport (>= 1280px) + motion allowed
 * - `'mobile-animated'` — below xl (< 1280px, includes iPad Pro) + motion allowed
 * - `'static'` — user prefers reduced motion (any viewport)
 */
export function useResponsiveMotion(): MotionVariant {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isXl = useIsXl();

  if (prefersReducedMotion) return 'static';
  return isXl ? 'desktop-animated' : 'mobile-animated';
}
