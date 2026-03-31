import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type TransitionVariant = 'fade' | 'pattern' | 'diagonal';

interface SectionTransitionProps {
  variant?: TransitionVariant;
  fromColor?: string;
  toColor?: string;
  /** Height of the transition, e.g. "120px", "8rem" */
  height?: string;
}

/**
 * Visual separator between sections.
 *
 * Variants:
 * - `fade`: CSS gradient from fromColor to toColor
 * - `pattern`: EyePattern band with horizontal drift on scroll
 * - `diagonal`: Clip-path animated diagonal wipe
 *
 * Reduced motion: renders static transition without scroll animation.
 */
export default function SectionTransition({
  variant = 'fade',
  fromColor = 'white',
  toColor = 'black',
  height = '120px',
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : ref,
    offset: ['start end', 'end start'],
  });

  const patternX = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const clipProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 100]);
  const clipPath = useTransform(
    clipProgress,
    (v) => `polygon(0 0, ${v}% 0, ${Math.max(0, v - 20)}% 100%, 0 100%)`,
  );

  if (variant === 'fade') {
    // Eased multi-stop gradient: starts very gradually, accelerates mid, eases into target
    // This avoids the hard visible line that a simple 2-color linear-gradient creates
    return (
      <div
        ref={ref}
        className="pointer-events-none relative w-full"
        style={{
          height,
          background: `linear-gradient(to bottom, ${fromColor} 0%, color-mix(in srgb, ${fromColor} 95%, ${toColor}) 8%, color-mix(in srgb, ${fromColor} 80%, ${toColor}) 20%, color-mix(in srgb, ${fromColor} 55%, ${toColor}) 40%, color-mix(in srgb, ${fromColor} 30%, ${toColor}) 60%, color-mix(in srgb, ${fromColor} 10%, ${toColor}) 80%, ${toColor} 100%)`,
        }}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'pattern') {
    return (
      <div
        ref={ref}
        className="pointer-events-none relative w-full overflow-hidden"
        style={{ height }}
        aria-hidden="true"
      >
        {prefersReducedMotion ? (
          <EyePattern variant="jaune" opacity={0.15} />
        ) : (
          <m.div className="absolute inset-0" style={{ x: patternX }}>
            <EyePattern variant="jaune" opacity={0.15} className="!w-[200%]" />
          </m.div>
        )}
      </div>
    );
  }

  // diagonal variant
  if (prefersReducedMotion) {
    return (
      <div
        ref={ref}
        className="pointer-events-none relative w-full"
        style={{
          height,
          background: toColor,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={ref}
      className="pointer-events-none relative w-full"
      style={{ height, background: fromColor }}
      aria-hidden="true"
    >
      <m.div
        className="absolute inset-0"
        style={{
          background: toColor,
          clipPath,
        }}
      />
    </div>
  );
}
