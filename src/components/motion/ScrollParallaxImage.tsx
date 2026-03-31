import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import ResponsiveImage from '@/components/common/ResponsiveImage';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface ScrollParallaxImageProps {
  src: string;
  alt: string;
  /** translateY range in px, e.g. [-60, 60] */
  parallaxRange?: [number, number];
  /** scale range, e.g. [1, 1.05] */
  scaleRange?: [number, number];
  sizes?: string;
  widths?: number[];
  loading?: 'eager' | 'lazy';
  className?: string;
  /** CSS aspect-ratio value, e.g. "4/5" or "2/3" */
  aspectRatio?: string;
}

/**
 * Image with scroll-linked parallax translateY and optional scale.
 *
 * Structure:
 * - Outer div: overflow-hidden, defines visible bounds
 * - Inner m.div: 120% height, shifts via translateY from useScroll
 * - ResponsiveImage inside
 *
 * Reduced motion: renders a static image without parallax.
 */
export default function ScrollParallaxImage({
  src,
  alt,
  parallaxRange = [-40, 40],
  scaleRange,
  sizes = '100vw',
  widths,
  loading = 'lazy',
  className = '',
  aspectRatio,
}: ScrollParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], parallaxRange);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange ?? [1, 1]);

  if (prefersReducedMotion) {
    return (
      <div
        ref={ref}
        className={`overflow-hidden ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <ResponsiveImage
          src={src}
          alt={alt}
          sizes={sizes}
          widths={widths}
          loading={loading}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <m.div className="h-[120%] w-full" style={{ y, scale }}>
        <ResponsiveImage
          src={src}
          alt={alt}
          sizes={sizes}
          widths={widths}
          loading={loading}
          className="h-full w-full object-cover"
        />
      </m.div>
    </div>
  );
}
