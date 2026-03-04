import { useEffect, useRef } from 'react';
import { useSpring, useInView, useMotionValue, m } from 'framer-motion';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface AnimatedCounterProps {
  /** Starting value */
  from?: number;
  /** Target value to animate to */
  to: number;
  /** Suffix to display after the number (e.g. "€", "%") */
  suffix?: string;
  /** Prefix to display before the number */
  prefix?: string;
  /** Animation duration in seconds */
  duration?: number;
  className?: string;
}

/**
 * Animated number counter that counts from `from` to `to`
 * when the element enters the viewport.
 *
 * Uses useSpring for smooth animation and useInView for trigger.
 * Reduced motion: displays final value immediately.
 */
export default function AnimatedCounter({
  from = 0,
  to,
  suffix = '',
  prefix = '',
  duration = 1.5,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const motionVal = useMotionValue(from);
  const springVal = useSpring(motionVal, {
    stiffness: 50,
    damping: 20,
    duration,
  });

  // Trigger animation when in view
  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      motionVal.set(to);
    }
  }, [isInView, prefersReducedMotion, motionVal, to]);

  // Update DOM text from spring value
  useEffect(() => {
    if (prefersReducedMotion) return;

    const unsubscribe = springVal.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
      }
    });

    return unsubscribe;
  }, [springVal, prefix, suffix, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {to}
        {suffix}
      </span>
    );
  }

  return (
    <m.span ref={ref} className={className}>
      {prefix}
      {from}
      {suffix}
    </m.span>
  );
}
