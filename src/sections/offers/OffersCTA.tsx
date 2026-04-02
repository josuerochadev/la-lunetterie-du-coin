import { m, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';

// ---------------------------------------------------------------------------
// Desktop — centered, scroll-driven word reveal
// ---------------------------------------------------------------------------

function CTADesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-end');

  const motifScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  const titleYRaw = useTransform(scrollYProgress, [0.25, 0.4], [60, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  const subtitle = useScrollEntrance(scrollYProgress, 0.3, 0.45, 30);
  const buttonsOpacity = useTransform(scrollYProgress, [0.38, 0.5], [0, 1]);

  return (
    <div ref={ref} className="hidden lg:block" style={{ minHeight: '200vh' }}>
      <div className="sticky top-0 flex min-h-screen w-full items-center overflow-hidden bg-accent">
        <m.img
          src="/images/motif-cercle.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
          style={{ scale: motifScale }}
        />

        <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
          <div className="mx-auto max-w-4xl text-center">
            <m.div style={{ y: titleY }}>
              <ScrollWordReveal
                as="h2"
                scrollYProgress={scrollYProgress}
                revealStart={0.25}
                revealEnd={0.4}
                className="heading-section text-black"
              >
                C&apos;EST TOUT VU
              </ScrollWordReveal>
            </m.div>

            <m.p
              className="mt-6 text-body-lg text-black"
              style={{ opacity: subtitle.opacity, y: subtitle.y }}
            >
              Passez nous voir, le reste suivra.
            </m.p>

            <m.div className="mt-10" style={{ opacity: buttonsOpacity }}>
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

  const line1Opacity = useTransform(scrollYProgress, [0.0, 0.1], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.0, 0.1], [20, 0]);

  const line2Opacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.1, 0.2], [20, 0]);

  const subtitleOpacity = useTransform(scrollYProgress, [0.2, 0.28], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.2, 0.28], [20, 0]);

  const ctaOpacity = useTransform(scrollYProgress, [0.28, 0.36], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.28, 0.36], [24, 0]);

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
          <h2 className="text-heading text-fluid-outro text-black">
            <m.span className="block" style={{ opacity: line1Opacity, y: line1Y }}>
              C&apos;EST
            </m.span>
            <m.span className="block" style={{ opacity: line2Opacity, y: line2Y }}>
              TOUT VU
            </m.span>
          </h2>

          <m.p
            className="mt-6 text-body-lg text-black"
            style={{ opacity: subtitleOpacity, y: subtitleY }}
          >
            Passez nous voir, le reste suivra.
          </m.p>

          <m.div className="mt-8" style={{ opacity: ctaOpacity, y: ctaY }}>
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

export default function OffersCTA() {
  const variant = useResponsiveMotion();

  return (
    <div className="relative bg-accent">
      <section
        aria-label="Nous contacter"
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
                <h2 className="text-heading text-fluid-outro lg:heading-section text-black">
                  C&apos;EST
                  <br />
                  TOUT VU
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mt-6 text-body-lg text-black">Passez nous voir, le reste suivra.</p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={200}>
                <div className="mt-10">
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
