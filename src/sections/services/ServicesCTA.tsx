import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };

export default function ServicesCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });

  // Motif fades in as the section scrolls into view (0 → 0.2 matching AboutCTA)
  const motifOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 0.2]);
  const motifScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Title — scroll-driven entrance
  const titleOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.5, 0.7], [40, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Subtitle — staggered after title
  const subOpacity = useTransform(scrollYProgress, [0.6, 0.78], [0, 1]);
  const subYRaw = useTransform(scrollYProgress, [0.6, 0.78], [25, 0]);
  const subY = useSpring(subYRaw, SPRING_CONFIG);

  // CTAs — staggered after subtitle
  const ctaOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
  const ctaYRaw = useTransform(scrollYProgress, [0.7, 0.85], [20, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center bg-accent"
      data-navbar-theme="dark"
    >
      {/* Eye motif — fades in via scroll, matches AboutCTA intensity (opacity 0.2) */}
      <m.img
        src="/images/motif-cercle.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-multiply"
        style={{ scale: motifScale, opacity: motifOpacity }}
      />

      <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-4xl text-center">
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
              VOYEZ LA DIFFÉRENCE
            </ScrollWordReveal>
          </m.div>

          {/* Subtitle — staggered entrance */}
          <m.p className="mt-8 text-body-lg text-black/50" style={{ opacity: subOpacity, y: subY }}>
            Passez nous voir, le reste suivra.
          </m.p>

          {/* CTAs — staggered entrance */}
          <m.div
            className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row"
            style={{ opacity: ctaOpacity, y: ctaY }}
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
    </section>
  );
}
