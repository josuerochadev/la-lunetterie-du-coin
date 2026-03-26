import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';

export default function ServicesCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });
  // Motif fades in as the section scrolls into view (0 → 0.2 matching AboutCTA)
  const motifOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 0.2]);
  const motifScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

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
          <SimpleAnimation type="slide-up" delay={0}>
            <h2
              className="text-heading text-black"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', lineHeight: '0.95' }}
            >
              VOYEZ LA DIFFÉRENCE
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="mt-8 text-body-lg text-black/50">Passez nous voir, le reste suivra.</p>
          </SimpleAnimation>

          <SimpleAnimation type="fade" delay={200}>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
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
    </section>
  );
}
