import { m } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SPRING_TRANSITION = { type: 'spring' as const, stiffness: 80, damping: 30, mass: 0.5 };

function HeroDesktop() {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <EyePattern variant="blanc" opacity={0.03} />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-container-x">
          <m.h1
            className="text-heading text-center text-accent"
            style={{ fontSize: 'clamp(3rem, 12vw, 14rem)', lineHeight: '0.95' }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
          >
            NOS OFFRES
          </m.h1>

          <m.p
            className="mt-8 max-w-3xl text-center text-body-xl text-white/80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.4 }}
          >
            Des solutions pensées pour votre budget et pour la planète
          </m.p>

          <m.p
            className="mt-6 text-body-sm font-medium uppercase tracking-widest text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Recyclage — Deuxième paire
          </m.p>
        </div>
      </div>
    </div>
  );
}

export default function OffersHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="hero" className="relative w-full bg-black" data-navbar-theme="light">
      {!prefersReducedMotion && <HeroDesktop />}

      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="relative flex min-h-[70vh] items-center py-section">
          <EyePattern variant="blanc" opacity={0.03} />
          <div className="relative z-10 mx-auto max-w-container px-container-x">
            <div className="flex flex-col items-center justify-center text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h1
                  className="text-heading text-accent"
                  style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', lineHeight: '0.95' }}
                >
                  NOS OFFRES
                </h1>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={150}>
                <p className="mt-6 max-w-2xl text-body-lg text-white/80">
                  Des solutions pensées pour votre budget et pour la planète
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={300}>
                <p className="mt-4 text-body-sm font-medium uppercase tracking-widest text-white/30">
                  Recyclage — Deuxième paire
                </p>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
