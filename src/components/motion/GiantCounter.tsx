import { useEffect, useRef } from 'react';
import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SPRING_CONFIG } from '@/lib/motion';

interface GiantCounterProps {
  scrollYProgress: MotionValue<number>;
  /** [scrollStart, scrollEnd] — range over which the counter animates. */
  countRange: [number, number];
  /** [from, to] — numeric values to count between. */
  countValues: [number, number];
  /** How to format the displayed number. */
  formatValue?: (value: number) => string; // eslint-disable-line no-unused-vars
  /** [fadeIn, peakIn, peakOut, fadeOut] — opacity keyframes over scroll. */
  opacityRange: [number, number, number, number];
  /** Peak opacity value (default 0.18). */
  peakOpacity?: number;
  /** Font size CSS value (default "clamp(18rem, 35vw, 45rem)"). */
  fontSize?: string;
  /** Extra Tailwind classes for the text. */
  className?: string;
}

/**
 * Giant background counter — a decorative number that counts up on scroll.
 *
 * Used in HomeTestimonials (rating 0.0→4.9) and AboutEngagement (recycled pairs 0→2000).
 */
export function GiantCounter({
  scrollYProgress,
  countRange,
  countValues,
  formatValue = (v) => v.toFixed(1),
  opacityRange,
  peakOpacity = 0.18,
  fontSize = 'clamp(18rem, 35vw, 45rem)',
  className = 'text-accent',
}: GiantCounterProps) {
  const countRef = useRef<HTMLSpanElement>(null);
  const count = useTransform(scrollYProgress, countRange, countValues);

  useEffect(() => {
    const unsubscribe = count.on('change', (v) => {
      if (countRef.current) {
        countRef.current.textContent = formatValue(v);
      }
    });
    return unsubscribe;
  }, [count, formatValue]);

  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const scale = useSpring(scaleRaw, SPRING_CONFIG);
  const opacity = useTransform(scrollYProgress, opacityRange, [0, peakOpacity, peakOpacity, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);

  return (
    <m.div
      className={`text-heading pointer-events-none absolute right-[5%] top-1/2 z-0 -translate-y-1/2 select-none ${className}`}
      style={{ fontSize, lineHeight: 1, scale, opacity, y }}
      aria-hidden="true"
    >
      <span ref={countRef}>{formatValue(countValues[0])}</span>
    </m.div>
  );
}
