import { type RefObject, useRef } from 'react';
import { useScroll, useTransform, useSpring, type MotionValue, motionValue } from 'framer-motion';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SPRING_CONFIG } from '@/lib/motion';

type ScrollOffset = [string, string];

interface UseScrollAnimationOptions {
  /** IntersectionObserver-style offset for scroll tracking */
  offset?: ScrollOffset;
  /** Maps scrollYProgress [0,1] to this output range */
  outputRange?: [number, number];
  /** Apply spring smoothing to the output value */
  spring?: boolean | { stiffness?: number; damping?: number; mass?: number };
}

interface UseScrollAnimationReturn {
  ref: RefObject<HTMLDivElement | null>;
  value: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

// Static MotionValue that never changes — shared singleton for reduced motion
const STATIC_ZERO = motionValue(0);
const STATIC_ONE = motionValue(1);

/**
 * Foundation hook for scroll-linked animations.
 *
 * Wraps `useScroll({ target })` + `useTransform` + optional `useSpring`.
 * Returns a ref to attach to the tracked element, a transformed value,
 * and the raw scrollYProgress.
 *
 * When `prefersReducedMotion` is active, returns static MotionValues
 * so that no scroll listeners are attached and no animation runs.
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = {},
): UseScrollAnimationReturn {
  const { offset = ['start end', 'end start'], outputRange = [0, 1], spring } = options;

  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : ref,
    offset: offset as unknown as [string, string],
  });

  const transformed = useTransform(scrollYProgress, [0, 1], outputRange);

  const springConfig =
    spring === true
      ? SPRING_CONFIG
      : typeof spring === 'object'
        ? { ...SPRING_CONFIG, ...spring }
        : undefined;

  const sprung = useSpring(transformed, springConfig ?? SPRING_CONFIG);

  if (prefersReducedMotion) {
    return {
      ref,
      value: STATIC_ZERO,
      scrollYProgress: STATIC_ONE,
    };
  }

  return {
    ref,
    value: spring ? sprung : transformed,
    scrollYProgress,
  };
}
