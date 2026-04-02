import { m, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';

// ---------------------------------------------------------------------------
// Desktop — centered, scroll-driven word reveal
// ---------------------------------------------------------------------------

function CTADesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-end');

  const motifScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const motifOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 0.2]);

  const title = useScrollEntrance(scrollYProgress, 0.25, 0.4);
  const sub = useScrollEntrance(scrollYProgress, 0.3, 0.45, 25);
  const cta = useScrollEntrance(scrollYProgress, 0.38, 0.5, 20);

  return (
    <div ref={ref} className="hidden lg:block" style={{ minHeight: '200vh' }}>
      <div className="sticky top-0 flex min-h-screen w-full items-center overflow-hidden bg-accent">
        <m.img
          src="/images/motif-cercle.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-multiply"
          style={{ scale: motifScale, opacity: motifOpacity }}
        />

        <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
          <div className="mx-auto max-w-4xl text-center">
            <m.div style={{ opacity: title.opacity, y: title.y }}>
              <ScrollWordReveal
                as="h2"
                scrollYProgress={scrollYProgress}
                revealStart={0.25}
                revealEnd={0.4}
                className="text-heading text-fluid-cta text-black"
              >
                VOYEZ LA DIFFÉRENCE
              </ScrollWordReveal>
            </m.div>

            <m.p
              className="mt-8 text-body-lg text-black"
              style={{ opacity: sub.opacity, y: sub.y }}
            >
              Passez nous voir, le reste suivra.
            </m.p>

            <m.div
              className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row"
              style={{ opacity: cta.opacity, y: cta.y }}
            >
              <LinkCTA to="/offres" theme="accent">
                Voir nos offres
              </LinkCTA>
              <LinkCTA to="/contact" theme="accent">
                Nous contacter
              </LinkCTA>
            </m.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile — left-aligned outro, motif zoom, staggered entrances
// ---------------------------------------------------------------------------

function CTAMobile() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  const motifScaleRaw = useTransform(scrollYProgress, [0.0, 0.5], [1, 2.4]);
  const motifScale = useSpring(motifScaleRaw, { stiffness: 60, damping: 30 });
  const motifOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0, 0.15]);

  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.12], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.0, 0.12], [30, 0]);

  const subtitleOpacity = useTransform(scrollYProgress, [0.14, 0.22], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.14, 0.22], [20, 0]);

  const ctaOpacity = useTransform(scrollYProgress, [0.24, 0.32], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.24, 0.32], [24, 0]);

  return (
    <div ref={ref} className="h-[250vh] lg:hidden">
      <div className="sticky top-0 h-svh overflow-hidden bg-accent">
        <m.img
          src="/images/motif-eye-pattern.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover mix-blend-multiply will-change-transform"
          style={{ scale: motifScale, opacity: motifOpacity }}
        />

        <div className="relative z-10 flex h-full flex-col items-start justify-center px-container-x">
          <m.h2
            className="text-heading text-fluid-outro-sm text-black"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            VOYEZ LA DIFFÉRENCE
          </m.h2>

          <m.p
            className="mt-6 text-body-lg text-black"
            style={{ opacity: subtitleOpacity, y: subtitleY }}
          >
            Passez nous voir, le reste suivra.
          </m.p>

          <m.div className="mt-8 flex flex-col gap-4" style={{ opacity: ctaOpacity, y: ctaY }}>
            <LinkCTA to="/offres" theme="accent">
              Voir nos offres
            </LinkCTA>
            <LinkCTA to="/contact" theme="accent">
              Nous contacter
            </LinkCTA>
          </m.div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ServicesCTA() {
  const variant = useResponsiveMotion();

  return (
    <div className="relative bg-accent">
      <section
        aria-label="Voir la différence"
        className="relative w-full bg-accent"
        data-navbar-theme="dark"
      >
        {variant === 'desktop-animated' && <CTADesktop />}
        {variant === 'mobile-animated' && <CTAMobile />}
        {variant === 'static' && (
          <div className="relative min-h-svh overflow-hidden lg:min-h-0">
            <img
              src="/images/motif-cercle.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
            />
            <div className="relative z-10 flex min-h-svh flex-col items-start justify-center px-container-x lg:min-h-0 lg:items-center lg:py-section lg:text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="text-heading text-fluid-outro-sm lg:text-fluid-cta text-black">
                  VOYEZ LA
                  <br />
                  DIFFÉRENCE
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mt-8 text-body-lg text-black">Passez nous voir, le reste suivra.</p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={200}>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
                  <LinkCTA to="/offres" theme="accent">
                    Voir nos offres
                  </LinkCTA>
                  <LinkCTA to="/contact" theme="accent">
                    Nous contacter
                  </LinkCTA>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
