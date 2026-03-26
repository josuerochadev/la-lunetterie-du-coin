import { m, useScroll, useTransform } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import TextReveal from '@/components/motion/TextReveal';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SPRING_TRANSITION = { type: 'spring', stiffness: 80, damping: 30, mass: 0.5 };

function HeroDesktop() {
  const { scrollY } = useScroll();
  const exitOpacity = useTransform(scrollY, [100, 400], [1, 0]);
  const exitY = useTransform(scrollY, [100, 400], [0, -60]);

  return (
    <div className="hidden lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <EyePattern variant="blanc" opacity={0.03} />

        <m.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-container-x"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          <TextReveal
            as="h1"
            className="text-heading text-center text-accent"
            style={{ fontSize: 'clamp(3rem, 12vw, 14rem)', lineHeight: '0.95' }}
          >
            L'EXPERT DES EX PAIRES
          </TextReveal>

          <m.p
            className="mt-8 max-w-3xl text-center text-body-xl text-white/80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.4 }}
          >
            Depuis 2016, du style, du conseil et une seconde vie pour vos montures.
          </m.p>
        </m.div>
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
    <section
      id="hero"
      aria-label="À propos — L'expert des ex paires"
      className="relative w-full bg-black"
      data-navbar-theme="light"
    >
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
