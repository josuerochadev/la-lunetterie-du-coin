import { type MotionValue, useTransform } from 'framer-motion';

/**
 * Derives a `pointerEvents` style value from an opacity MotionValue.
 * Returns `'auto'` when opacity > 0.1, `'none'` otherwise.
 */
export function usePointerEvents(opacity: MotionValue<number>) {
  return useTransform(opacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));
}
