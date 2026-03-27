import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { BOOKING_URL } from '@/config/endpoints';

export default function ContactAppointment() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end end'],
  });

  // Motif — scale grows throughout the full scroll range (matching AboutCTA intensity)
  const motifScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const motifOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 0.2]);

  // Title — entrance in first half
  const title = useScrollEntrance(scrollYProgress, 0.25, 0.4);

  // Subtitle
  const sub = useScrollEntrance(scrollYProgress, 0.3, 0.45, 25);

  // CTA
  const cta = useScrollEntrance(scrollYProgress, 0.35, 0.5, 20);

  return (
    <div ref={wrapperRef} className="relative bg-accent" style={{ minHeight: '200vh' }}>
      <section
        id="rendez-vous"
        className="sticky top-0 flex min-h-screen w-full items-center bg-accent"
        data-navbar-theme="dark"
      >
        {/* Circle motif — scale grows through full scroll */}
        {prefersReducedMotion ? (
          <img
            src="/images/motif-cercle.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
          />
        ) : (
          <m.img
            src="/images/motif-cercle.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-multiply"
            style={{ scale: motifScale, opacity: motifOpacity }}
          />
        )}

        <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
          <div className="mx-auto max-w-4xl text-center">
            {prefersReducedMotion ? (
              <>
                <SimpleAnimation type="slide-up" delay={0}>
                  <h2
                    className="text-heading mb-6 text-black"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: '0.95' }}
                  >
                    ON VOUS
                    <br />
                    ATTEND
                  </h2>
                </SimpleAnimation>

                <SimpleAnimation type="slide-up" delay={100}>
                  <p className="mb-10 text-body-lg text-black/60">
                    Examen de vue, essayage ou juste un conseil.
                  </p>
                </SimpleAnimation>

                <SimpleAnimation type="fade" delay={200}>
                  <LinkCTA
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    theme="accent"
                  >
                    Prendre rendez-vous
                  </LinkCTA>
                </SimpleAnimation>
              </>
            ) : (
              <>
                {/* Title — ScrollWordReveal word-by-word */}
                <m.div style={{ opacity: title.opacity, y: title.y }}>
                  <ScrollWordReveal
                    as="h2"
                    scrollYProgress={scrollYProgress}
                    revealStart={0.25}
                    revealEnd={0.4}
                    className="text-heading text-black"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: '0.95' }}
                  >
                    ON VOUS ATTEND
                  </ScrollWordReveal>
                </m.div>

                {/* Subtitle — staggered entrance */}
                <m.p
                  className="mt-8 text-body-lg text-black/60"
                  style={{ opacity: sub.opacity, y: sub.y }}
                >
                  Examen de vue, essayage ou juste un conseil.
                </m.p>

                {/* CTA — staggered entrance */}
                <m.div
                  className="mt-10 flex justify-center"
                  style={{ opacity: cta.opacity, y: cta.y }}
                >
                  <LinkCTA
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    theme="accent"
                  >
                    Prendre rendez-vous
                  </LinkCTA>
                </m.div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
