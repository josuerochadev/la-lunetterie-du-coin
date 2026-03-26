import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const ZOOM_SPRING = { stiffness: 60, damping: 30, mass: 0.5 };

function CTADesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // "FONCEZ" zooms: scale 12 → 1
  const foncezScaleRaw = useTransform(scrollYProgress, [0.0, 0.2], [12, 1]);
  const foncezScale = useSpring(foncezScaleRaw, ZOOM_SPRING);

  // "N'ATTENDEZ" slides up
  const w1Opacity = useTransform(scrollYProgress, [0.14, 0.22], [0, 1]);
  const w1YRaw = useTransform(scrollYProgress, [0.14, 0.22], [40, 0]);
  const w1Y = useSpring(w1YRaw, SPRING_CONFIG);

  // "PLUS" slides up
  const w2Opacity = useTransform(scrollYProgress, [0.19, 0.27], [0, 1]);
  const w2YRaw = useTransform(scrollYProgress, [0.19, 0.27], [40, 0]);
  const w2Y = useSpring(w2YRaw, SPRING_CONFIG);

  // CTA
  const ctaOpacity = useTransform(scrollYProgress, [0.26, 0.34], [0, 1]);
  const ctaYRaw = useTransform(scrollYProgress, [0.26, 0.34], [30, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);

  return (
    <div ref={sectionRef} className="hidden h-[300vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-accent">
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-10 px-8">
          <h2
            className="text-heading text-center text-black"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 14rem)', lineHeight: '0.95' }}
          >
            <m.span className="block" style={{ opacity: w1Opacity, y: w1Y }}>
              N&apos;ATTENDEZ
            </m.span>
            <m.span className="block" style={{ opacity: w2Opacity, y: w2Y }}>
              PLUS
            </m.span>
            <m.span className="block origin-center" style={{ scale: foncezScale }}>
              FONCEZ
            </m.span>
          </h2>

          <m.div style={{ opacity: ctaOpacity, y: ctaY }}>
            <LinkCTA to="/contact" theme="accent">
              Nous contacter
            </LinkCTA>
          </m.div>
        </div>
      </div>
    </div>
  );
}

export default function OffersCTA() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

  return (
    <section className="relative w-full bg-accent" data-navbar-theme="dark">
      {/* Convex curve transition from black offers section */}
      <div
        className="pointer-events-none absolute -top-[11vw] left-1/2 z-20 h-[45vw] w-[140vw] -translate-x-1/2 rounded-[50%] bg-accent"
        data-navbar-theme="dark"
        aria-hidden="true"
      />

      {/* Desktop */}
      {!prefersReducedMotion && isLg && <CTADesktop />}

      {/* Mobile / reduced-motion */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="mx-auto max-w-container px-container-x py-section">
          <div className="mx-auto max-w-5xl text-center">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2
                className="text-heading mb-10 text-black"
                style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', lineHeight: '0.95' }}
              >
                N&apos;attendez plus
                <br />
                foncez
              </h2>
            </SimpleAnimation>

            <SimpleAnimation type="fade" delay={100}>
              <LinkCTA to="/contact" theme="accent">
                Nous contacter
              </LinkCTA>
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
