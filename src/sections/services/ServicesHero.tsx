import { m } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SPRING_TRANSITION = { type: 'spring' as const, stiffness: 80, damping: 30, mass: 0.5 };

function HeroDesktop() {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <EyePattern variant="jaune" opacity={0.03} />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-container-x">
          <m.h1
            className="text-heading text-center text-black"
            style={{ fontSize: 'clamp(3rem, 12vw, 14rem)', lineHeight: '0.95' }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
          >
            NOS SERVICES
          </m.h1>

          <m.p
            className="mt-8 max-w-3xl text-center text-body-xl text-black/50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.4 }}
          >
            Vos yeux méritent le meilleur. On s&apos;en occupe.
          </m.p>
        </div>
      </div>
    </div>
  );
}

export default function ServicesHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="hero" className="relative w-full bg-accent" data-navbar-theme="dark">
      {!prefersReducedMotion && <HeroDesktop />}

      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="relative flex min-h-[70vh] items-center py-section">
          <EyePattern variant="jaune" opacity={0.03} />
          <div className="relative z-10 mx-auto max-w-container px-container-x">
            <div className="flex flex-col items-center justify-center text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h1
                  className="text-heading text-black"
                  style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', lineHeight: '0.95' }}
                >
                  NOS SERVICES
                </h1>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={150}>
                <p className="mt-6 max-w-2xl text-body-lg text-black/50">
                  Vos yeux méritent le meilleur. On s&apos;en occupe.
                </p>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
