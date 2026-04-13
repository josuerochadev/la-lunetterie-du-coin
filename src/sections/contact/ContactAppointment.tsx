import { m, useTransform, useSpring } from 'framer-motion';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { BOOKING_URL } from '@/config/endpoints';

// ---------------------------------------------------------------------------
// Desktop — centered, scroll-driven word reveal
// ---------------------------------------------------------------------------

function CTADesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  const motifScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const motifOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0, 0.2]);

  const title = useScrollEntrance(scrollYProgress, 0.0, 0.12);
  const sub = useScrollEntrance(scrollYProgress, 0.06, 0.18, 25);
  const cta = useScrollEntrance(scrollYProgress, 0.12, 0.24, 20);

  return (
    <div ref={ref} className="hidden xl:block" style={{ minHeight: '200vh' }}>
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
                revealStart={0.0}
                revealEnd={0.12}
                className="text-heading text-black"
                style={{ fontSize: 'clamp(3.5rem, 12vw, 14rem)', lineHeight: '0.95' }}
              >
                ON VOUS ATTEND
              </ScrollWordReveal>
            </m.div>

            <m.p
              className="mt-8 text-body-lg text-black"
              style={{ opacity: sub.opacity, y: sub.y }}
            >
              Examen de vue, essayage ou juste un conseil.
            </m.p>

            <m.div className="mt-10 flex justify-center" style={{ opacity: cta.opacity, y: cta.y }}>
              <LinkCTA
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                theme="accent"
                icon={ExternalLink}
              >
                Prendre rendez-vous
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
    <div ref={ref} className="h-[250vh] xl:hidden">
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
              ON VOUS
            </m.span>
            <m.span className="block" style={{ opacity: line2Opacity, y: line2Y }}>
              ATTEND
            </m.span>
          </h2>

          <m.p
            className="mt-6 text-body-lg text-black"
            style={{ opacity: subtitleOpacity, y: subtitleY }}
          >
            Examen de vue, essayage ou juste un conseil.
          </m.p>

          <m.div className="mt-8" style={{ opacity: ctaOpacity, y: ctaY }}>
            <LinkCTA
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              theme="accent"
              icon={ExternalLink}
            >
              Prendre rendez-vous
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

export default function ContactAppointment() {
  const variant = useResponsiveMotion();

  return (
    <div className="relative bg-accent">
      <section
        id="rendez-vous"
        aria-label="Prendre rendez-vous"
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
                <h2 className="text-heading text-fluid-outro lg:text-fluid-cta text-black">
                  ON VOUS
                  <br />
                  ATTEND
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mt-6 text-body-lg text-black">
                  Examen de vue, essayage ou juste un conseil.
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={200}>
                <div className="mt-10">
                  <LinkCTA
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    theme="accent"
                    icon={ExternalLink}
                  >
                    Prendre rendez-vous
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
