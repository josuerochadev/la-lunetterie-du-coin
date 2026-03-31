import type { ReactNode } from 'react';
import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface ScrollScaleProps {
  children: ReactNode;
  /** Scale range, e.g. [0.92, 1] */
  scaleRange?: [number, number];
  /** Opacity range, e.g. [0.6, 1] */
  opacityRange?: [number, number];
  /** Scroll offset */
  offset?: [string, string];
  className?: string;
}

/**
 * Wrapper that applies scale + opacity to children based on scroll position.
 * Uses useScroll({ target }) internally.
 *
 * Reduced motion: renders children without animation.
 */
export default function ScrollScale({
  children,
  scaleRange = [0.92, 1],
  opacityRange = [1, 1],
  offset = ['start end', 'end start'],
  className,
}: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : ref,
    offset: offset as unknown as [string, string],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], scaleRange);
  const opacity = useTransform(scrollYProgress, [0, 0.5], opacityRange);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <m.div ref={ref} className={className} style={{ scale, opacity }}>
      {children}
    </m.div>
  );
}
