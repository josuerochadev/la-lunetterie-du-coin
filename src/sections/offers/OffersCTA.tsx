import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SPRING_CONFIG } from '@/lib/motion';

export default function OffersCTA() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end end'],
  });

  // Motif — scale grows throughout the full scroll range
  const motifScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  // Title
  const titleYRaw = useTransform(scrollYProgress, [0.25, 0.4], [60, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Subtitle
  const subtitleOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const subtitleYRaw = useTransform(scrollYProgress, [0.3, 0.45], [30, 0]);
  const subtitleY = useSpring(subtitleYRaw, SPRING_CONFIG);

  // Buttons
  const buttonsOpacity = useTransform(scrollYProgress, [0.38, 0.5], [0, 1]);

  return (
    <div ref={wrapperRef} className="relative bg-accent" style={{ minHeight: '200vh' }}>
      <section
        aria-label="Nous contacter"
        className="sticky top-0 flex min-h-screen w-full items-center overflow-hidden bg-accent"
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
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
            style={{ scale: motifScale }}
          />
        )}

        <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
          <div className="mx-auto max-w-4xl text-center">
            {prefersReducedMotion ? (
              <>
                <SimpleAnimation type="slide-up" delay={0}>
                  <h2 className="heading-section text-black">C&apos;EST TOUT VU</h2>
                </SimpleAnimation>

                <SimpleAnimation type="slide-up" delay={100}>
                  <p className="mt-6 text-body-lg text-black/60">
                    Passez nous voir, le reste suivra.
                  </p>
                </SimpleAnimation>

                <SimpleAnimation type="fade" delay={200}>
                  <div className="mt-10">
                    <LinkCTA to="/contact" theme="accent">
                      Nous contacter
                    </LinkCTA>
                  </div>
                </SimpleAnimation>
              </>
            ) : (
              <>
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
                  className="mt-6 text-body-lg text-black/60"
                  style={{ opacity: subtitleOpacity, y: subtitleY }}
                >
                  Passez nous voir, le reste suivra.
                </m.p>

                <m.div className="mt-10" style={{ opacity: buttonsOpacity }}>
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
