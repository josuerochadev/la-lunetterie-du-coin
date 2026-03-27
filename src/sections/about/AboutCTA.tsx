import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SPRING_CONFIG } from '@/lib/motion';

// ---------------------------------------------------------------------------
// Desktop animated — scroll-driven entrance as section scrolls into view
//
//  0.40 – 1.00  Motif scale grows
//  0.55 – 0.80  Title ScrollWordReveal + Y slide
//  0.70 – 0.88  Subtitle fades in + Y slide
//  0.80 – 0.95  Buttons fade in
// ---------------------------------------------------------------------------

function CTADesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });

  // Motif — scale on scroll
  const motifScale = useTransform(scrollYProgress, [0.4, 1], [1, 1.4]);

  // Title — ScrollWordReveal container Y slide
  const titleYRaw = useTransform(scrollYProgress, [0.55, 0.8], [60, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Subtitle
  const subtitleOpacity = useTransform(scrollYProgress, [0.7, 0.88], [0, 1]);
  const subtitleYRaw = useTransform(scrollYProgress, [0.7, 0.88], [30, 0]);
  const subtitleY = useSpring(subtitleYRaw, SPRING_CONFIG);

  // Buttons
  const buttonsOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);

  return (
    <div
      ref={sectionRef}
      className="relative hidden min-h-screen w-full items-center overflow-hidden lg:flex"
    >
      {/* Eye motif — circle frame around content, zoom on scroll */}
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
              revealStart={0.55}
              revealEnd={0.75}
              className="heading-section text-black"
            >
              YEUX T&apos;AIMENT
            </ScrollWordReveal>
          </m.div>

          <m.p
            className="mt-6 text-body-lg text-black/60"
            style={{ opacity: subtitleOpacity, y: subtitleY }}
          >
            Venez voir par vous-même.
          </m.p>

          <m.div
            className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row"
            style={{ opacity: buttonsOpacity }}
          >
            <LinkCTA to="/services" theme="accent">
              Voir nos services
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

/**
 * Section CTA finale — scroll-driven sur desktop, SimpleAnimation sur mobile.
 */
export default function AboutCTA() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-label="Nous rendre visite"
      className="relative w-full bg-accent"
      data-navbar-theme="dark"
    >
      {/* Desktop — scroll-driven */}
      {!prefersReducedMotion && <CTADesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="relative flex min-h-screen w-full items-center overflow-hidden">
          <img
            src="/images/motif-cercle.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
          />

          <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
            <div className="mx-auto max-w-4xl text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="heading-section text-black">YEUX T&apos;AIMENT</h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mt-6 text-body-lg text-black/60">Venez voir par vous-même.</p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={200}>
                <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
                  <LinkCTA to="/services" theme="accent">
                    Voir nos services
                  </LinkCTA>
                  <LinkCTA to="/contact" theme="accent">
                    Nous contacter
                  </LinkCTA>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
