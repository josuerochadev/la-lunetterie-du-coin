import { useEffect, useState } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import EyePattern from '@/components/common/EyePattern';
import LogoNoir from '@/assets/logo/Logo_LLDC_Noir.svg?react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * HomeSplash — Iris-open intro overlay
 *
 * Fixed overlay that reveals the logo + eye pattern via an expanding
 * circular clip-path (iris-open effect). Slides up on scroll to reveal
 * the hero section underneath.
 *
 * Reduced motion: skipped entirely (returns null).
 */
export default function HomeSplash() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [dismissed, setDismissed] = useState(false);

  const { scrollY } = useScroll();

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Slide splash up over first 50vh of scroll
  const splashY = useTransform(scrollY, [0, vh * 0.5], [0, -vh]);

  // Dismiss splash once fully scrolled past (reclaim DOM)
  useEffect(() => {
    // Skip if page loaded with scroll (e.g. back navigation)
    if (window.scrollY > vh * 0.3) {
      setDismissed(true);
      return;
    }

    const unsubscribe = scrollY.on('change', (v) => {
      if (v > vh * 0.55) setDismissed(true);
    });
    return unsubscribe;
  }, [scrollY, vh]);

  if (prefersReducedMotion || dismissed) return null;

  return (
    <m.div
      className="pointer-events-none fixed inset-0 z-[100] will-change-transform"
      style={{ y: splashY }}
      aria-hidden="true"
    >
      <m.div
        className="relative h-screen w-full overflow-hidden bg-white"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(80% at 50% 50%)' }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Yellow eye pattern on edges */}
        <EyePattern variant="jaune" opacity={0.2} />

        {/* Radial vignette — white center fading to reveal pattern on edges */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse at center, white 20%, rgba(255,255,255,0.85) 35%, transparent 65%)',
          }}
        />

        {/* Logo centered with breathing scale */}
        <div className="relative z-[2] flex h-full items-center justify-center">
          <m.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          >
            <LogoNoir className="h-auto w-[250px] sm:w-[300px] md:w-[400px]" aria-hidden="true" />
          </m.div>
        </div>
      </m.div>
    </m.div>
  );
}
