import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { CALENDLY_URL } from '@/config/endpoints';
import { SPRING_CONFIG } from '@/lib/motion';

// ---------------------------------------------------------------------------
// Desktop — scroll-driven entrance matching ServicesCTA / OffersCTA pattern
//
//  0.40 – 1.00  Motif scale grows (opacity-20 static)
//  0.50 – 0.70  Title ScrollWordReveal + Y slide
//  0.60 – 0.78  Subtitle fades in + Y slide
//  0.70 – 0.85  Calendly embed fades in
// ---------------------------------------------------------------------------

function AppointmentDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });

  // Motif — scale on scroll (opacity-20 static, matching CTA pattern)
  const motifScale = useTransform(scrollYProgress, [0.4, 1], [1, 1.4]);

  // Title — ScrollWordReveal container Y slide
  const titleYRaw = useTransform(scrollYProgress, [0.5, 0.7], [60, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Subtitle
  const subtitleOpacity = useTransform(scrollYProgress, [0.6, 0.78], [0, 1]);
  const subtitleYRaw = useTransform(scrollYProgress, [0.6, 0.78], [30, 0]);
  const subtitleY = useSpring(subtitleYRaw, SPRING_CONFIG);

  // Calendly embed
  const embedOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
  const embedYRaw = useTransform(scrollYProgress, [0.7, 0.85], [40, 0]);
  const embedY = useSpring(embedYRaw, SPRING_CONFIG);

  return (
    <div ref={sectionRef} className="relative hidden min-h-screen w-full flex-col lg:flex">
      {/* Circle motif — opacity-20 static + scale on scroll */}
      <m.img
        src="/images/motif-cercle.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
        style={{ scale: motifScale }}
      />

      <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-5xl">
          {/* Title — ScrollWordReveal word-by-word */}
          <m.div style={{ y: titleY }}>
            <ScrollWordReveal
              as="h2"
              scrollYProgress={scrollYProgress}
              revealStart={0.5}
              revealEnd={0.7}
              className="text-heading text-center text-black"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', lineHeight: '0.95' }}
            >
              PRENEZ RENDEZ-VOUS
            </ScrollWordReveal>
          </m.div>

          {/* Subtitle — staggered entrance */}
          <m.p
            className="mt-8 text-center text-body-lg text-black/60"
            style={{ opacity: subtitleOpacity, y: subtitleY }}
          >
            Examen de vue, essayage ou juste un conseil — réservez votre créneau.
          </m.p>

          {/* Calendly embed — staggered entrance */}
          <m.div className="mt-12" style={{ opacity: embedOpacity, y: embedY }}>
            <div
              className="relative w-full overflow-hidden rounded-sm"
              style={{ minHeight: 'clamp(500px, 70vh, 800px)' }}
            >
              <iframe
                src={CALENDLY_URL}
                width="100%"
                style={{ border: 'none', height: 'clamp(500px, 70vh, 800px)' }}
                title="Prendre rendez-vous avec La Lunetterie du Coin"
                className="calendly-inline-widget"
              />
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function ContactAppointment() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="rendez-vous"
      className="relative flex min-h-screen w-full flex-col bg-accent"
      data-navbar-theme="dark"
    >
      {/* Desktop — scroll-driven */}
      {!prefersReducedMotion && <AppointmentDesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="relative overflow-hidden">
          <img
            src="/images/motif-cercle.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
          />

          <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
            <div className="mx-auto max-w-5xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2
                  className="text-heading mb-6 text-center text-black"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', lineHeight: '0.95' }}
                >
                  PRENEZ
                  <br />
                  RENDEZ-VOUS
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mb-10 text-center text-body-lg text-black/60">
                  Examen de vue, essayage ou juste un conseil — réservez votre créneau.
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={200}>
                <div
                  className="relative w-full overflow-hidden rounded-sm"
                  style={{ minHeight: 'clamp(500px, 70vh, 800px)' }}
                >
                  <iframe
                    src={CALENDLY_URL}
                    width="100%"
                    style={{ border: 'none', height: 'clamp(500px, 70vh, 800px)' }}
                    title="Prendre rendez-vous avec La Lunetterie du Coin"
                    className="calendly-inline-widget"
                  />
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
