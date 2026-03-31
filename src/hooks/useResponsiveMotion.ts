import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';

export type MotionVariant = 'desktop-animated' | 'mobile-animated' | 'static';

/**
 * Determines which rendering variant a section should use based on
 * the user's motion preference and viewport size.
 *
 * - `'desktop-animated'` — large viewport + motion allowed
 * - `'mobile-animated'` — small viewport + motion allowed
 * - `'static'` — user prefers reduced motion (any viewport)
 */
export function useResponsiveMotion(): MotionVariant {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

  if (prefersReducedMotion) return 'static';
  return isLg ? 'desktop-animated' : 'mobile-animated';
}
