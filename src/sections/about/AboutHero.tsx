import { m, useScroll, useTransform } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import TextReveal from '@/components/motion/TextReveal';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SPRING_TRANSITION } from '@/lib/motion';

const HERO_TITLE = "L'EXPERT DES EX PAIRES";
const HERO_SUBTITLE = 'Depuis 2016, du style, du conseil et une seconde vie pour vos montures.';

// ---------------------------------------------------------------------------
// Desktop — sticky with scroll-driven exit (same as PageHero)
// ---------------------------------------------------------------------------

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
          <TextReveal as="h1" className="text-heading text-fluid-hero text-center text-accent">
            {HERO_TITLE}
          </TextReveal>

          <m.p
            className="mt-8 max-w-3xl text-center text-body-xl text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.4 }}
          >
            {HERO_SUBTITLE}
          </m.p>
        </m.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile — bold outro-sized title, left-aligned
// ---------------------------------------------------------------------------

function HeroMobile({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative flex min-h-svh items-center py-section">
        <EyePattern variant="blanc" opacity={0.03} />

        <div className="relative z-10 px-container-x">
          <TextReveal as="h1" className="text-heading text-fluid-outro text-accent">
            {HERO_TITLE}
          </TextReveal>

          <SimpleAnimation type="slide-up" delay={150}>
            <p className="mt-6 max-w-sm text-body-lg text-white">{HERO_SUBTITLE}</p>
          </SimpleAnimation>
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
    <section
      id="hero"
      aria-label="À propos — L'expert des ex paires"
      className="relative w-full bg-black"
      data-navbar-theme="light"
    >
      {!prefersReducedMotion && <HeroDesktop />}

      {/* Mobile: lg:hidden when desktop animated is active, full-width for reduced-motion */}
      <HeroMobile className={prefersReducedMotion ? '' : 'lg:hidden'} />
    </section>
  );
}
