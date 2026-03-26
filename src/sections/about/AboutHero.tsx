import { m } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import TextReveal from '@/components/motion/TextReveal';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SPRING_TRANSITION = { type: 'spring', stiffness: 80, damping: 30, mass: 0.5 };

// ---------------------------------------------------------------------------
// Desktop — content visible immediately with staggered entrance animations.
// Section stays sticky so AboutHistory scrolls over it.
// ---------------------------------------------------------------------------

function HeroDesktop() {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Eye pattern — visible from the start */}
        <EyePattern variant="blanc" opacity={0.03} />

        {/* Content — centered, entrance animations on load */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-container-x">
          {/* "DEPUIS 2016" — visible immediately, slides up */}
          <TextReveal
            as="h1"
            className="text-heading text-center text-accent"
            style={{ fontSize: 'clamp(3rem, 12vw, 14rem)', lineHeight: '0.95' }}
          >
            L'EXPERT DES EX PAIRES
          </TextReveal>

          {/* Subtitle — staggered */}
          <m.p
            className="mt-8 max-w-3xl text-center text-body-xl text-white/80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.4 }}
          >
            Depuis 2016, du style, du conseil et une seconde vie pour vos montures.
          </m.p>

          {/* Tagline — last to appear */}
          <m.p
            className="mt-6 text-body-sm font-medium uppercase tracking-widest text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Faubourg de Pierre, Strasbourg
          </m.p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AboutHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="hero" className="relative w-full bg-black" data-navbar-theme="light">
      {/* Desktop — entrance animations, stays sticky */}
      {!prefersReducedMotion && <HeroDesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="relative flex min-h-[70vh] items-center py-section">
          <EyePattern variant="blanc" opacity={0.03} />
          <div className="relative z-10 mx-auto max-w-container px-container-x">
            <div className="flex flex-col items-center justify-center text-center">
              <TextReveal
                as="h1"
                className="text-heading text-accent"
                style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', lineHeight: '0.95' }}
              >
                L'EXPERT DES EX PAIRES
              </TextReveal>

              <SimpleAnimation type="slide-up" delay={150}>
                <p className="mt-6 max-w-2xl text-body-lg text-white/80">
                  Depuis 2016, du style, du conseil et une seconde vie pour vos montures.
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={300}>
                <p className="mt-4 text-body-sm font-medium uppercase tracking-widest text-white/30">
                  Faubourg de Pierre, Strasbourg
                </p>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
