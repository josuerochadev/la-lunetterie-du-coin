import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';

export default function ServicesCTA() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end end'],
  });

  // Motif — scale grows throughout the full scroll range
  const motifScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const motifOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 0.2]);

  // Title
  const title = useScrollEntrance(scrollYProgress, 0.25, 0.4);

  // Subtitle
  const sub = useScrollEntrance(scrollYProgress, 0.3, 0.45, 25);

  // CTAs
  const cta = useScrollEntrance(scrollYProgress, 0.38, 0.5, 20);

  return (
    <div ref={wrapperRef} className="relative bg-accent" style={{ minHeight: '200vh' }}>
      <section
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
                    className="text-heading text-black"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: '0.95' }}
                  >
                    VOYEZ LA
                    <br />
                    DIFFÉRENCE
                  </h2>
                </SimpleAnimation>

                <SimpleAnimation type="slide-up" delay={100}>
                  <p className="mt-8 text-body-lg text-black/60">
                    Passez nous voir, le reste suivra.
                  </p>
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
              </>
            ) : (
              <>
                <m.div style={{ opacity: title.opacity, y: title.y }}>
                  <ScrollWordReveal
                    as="h2"
                    scrollYProgress={scrollYProgress}
                    revealStart={0.25}
                    revealEnd={0.4}
                    className="text-heading text-black"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: '0.95' }}
                  >
                    VOYEZ LA DIFFÉRENCE
                  </ScrollWordReveal>
                </m.div>

                <m.p
                  className="mt-8 text-body-lg text-black/60"
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
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
