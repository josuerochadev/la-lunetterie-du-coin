import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { BOOKING_URL } from '@/config/endpoints';
import { SPRING_CONFIG } from '@/lib/motion';

export default function ContactAppointment() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });

  // Motif — fades in + scale on scroll (matching ServicesCTA)
  const motifOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 0.2]);
  const motifScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Title
  const titleOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.5, 0.7], [40, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Subtitle
  const subOpacity = useTransform(scrollYProgress, [0.6, 0.78], [0, 1]);
  const subYRaw = useTransform(scrollYProgress, [0.6, 0.78], [25, 0]);
  const subY = useSpring(subYRaw, SPRING_CONFIG);

  // CTA
  const ctaOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
  const ctaYRaw = useTransform(scrollYProgress, [0.7, 0.85], [20, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);

  return (
    <section
      ref={sectionRef}
      id="rendez-vous"
      className="relative flex min-h-screen w-full items-center bg-accent"
      data-navbar-theme="dark"
    >
      {/* Circle motif — fades in + scale on scroll */}
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
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', lineHeight: '0.95' }}
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
              <m.div style={{ opacity: titleOpacity, y: titleY }}>
                <ScrollWordReveal
                  as="h2"
                  scrollYProgress={scrollYProgress}
                  revealStart={0.5}
                  revealEnd={0.7}
                  className="text-heading text-black"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', lineHeight: '0.95' }}
                >
                  ON VOUS ATTEND
                </ScrollWordReveal>
              </m.div>

              {/* Subtitle — staggered entrance */}
              <m.p
                className="mt-8 text-body-lg text-black/60"
                style={{ opacity: subOpacity, y: subY }}
              >
                Examen de vue, essayage ou juste un conseil.
              </m.p>

              {/* CTA — staggered entrance */}
              <m.div className="mt-10 flex justify-center" style={{ opacity: ctaOpacity, y: ctaY }}>
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
  );
}
