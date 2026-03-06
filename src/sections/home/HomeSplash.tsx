import { m } from 'framer-motion';

import motifCercleJaune from '@/assets/patterns/motif-cercle-jaune.svg';
import LogoNO from '@/assets/logo/Logo_LLDC_NO_Noir.svg?react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * HomeSplash — Iris-open intro overlay
 *
 * Fixed overlay with two visual layers:
 *   1. Yellow circle pattern fades in as full background
 *   2. Logo centered with breathing scale
 *
 * Stays fixed and immobile. The hero section scrolls OVER it (parallax cover).
 * When scrolling back up past the spacer, the splash is visible again.
 *
 * z-[9] places it below the main content wrapper (z-base = 10) so content
 * naturally covers it as user scrolls. The spacer area is transparent,
 * letting the splash show through.
 *
 * Reduced motion: skipped entirely (returns null).
 */
export default function HomeSplash() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9]" aria-hidden="true">
      <div className="relative h-screen w-full overflow-hidden bg-white">
        {/* Layer 1: Yellow circle pattern — single instance, covers viewport */}
        <m.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            maskImage:
              'radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.8) 50%, black 70%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.8) 50%, black 70%)',
          }}
        >
          <img src={motifCercleJaune} alt="" className="h-full w-full object-cover" />
        </m.div>

        {/* Layer 2: Logo centered with breathing scale */}
        <div className="relative z-[1] flex h-full items-center justify-center">
          <m.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          >
            <LogoNO className="h-auto w-[250px] sm:w-[300px] md:w-[400px]" aria-hidden="true" />
          </m.div>
        </div>
      </div>
    </div>
  );
}
