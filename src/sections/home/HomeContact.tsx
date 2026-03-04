import { forwardRef, useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollScale from '@/components/motion/ScrollScale';
import TextReveal from '@/components/motion/TextReveal';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Section HomeContact — Yellow Punchline
 *
 * Massive title with TextReveal scroll mode (desktop) / viewport mode (mobile).
 * EyePattern with subtle zoom on scroll. ScrollScale on CTA.
 * Static pattern on mobile.
 *
 * @component
 */
const HomeContact = forwardRef<HTMLElement>(() => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const patternRef = useRef<HTMLDivElement>(null);

  // EyePattern zoom on scroll
  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : patternRef,
    offset: ['start end', 'end start'],
  });
  const patternScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.15]);

  return (
    <section
      ref={patternRef}
      id="contact"
      className="relative w-full overflow-hidden bg-accent py-section"
      aria-labelledby="contact-title"
    >
      {/* EyePattern with subtle zoom on scroll (desktop) / static (mobile/reduced) */}
      {prefersReducedMotion ? (
        <EyePattern variant="noir" opacity={0.08} />
      ) : (
        <m.div
          className="pointer-events-none absolute inset-0"
          style={{ scale: patternScale }}
          aria-hidden="true"
        >
          <EyePattern variant="noir" opacity={0.08} />
        </m.div>
      )}

      <div className="relative z-10 mx-auto max-w-container px-container-x">
        <div className="mx-auto max-w-5xl text-center">
          {/* Massive title */}
          {/* Mobile: SimpleAnimation + smaller size */}
          <div className="lg:hidden">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2
                id="contact-title"
                className="text-heading mb-6 text-black"
                style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', lineHeight: '0.95' }}
              >
                Passez
                <br />
                nous voir
              </h2>
            </SimpleAnimation>
          </div>

          {/* Desktop: TextReveal scroll mode + massive size */}
          <div className="hidden lg:block">
            <TextReveal
              as="h2"
              mode="scroll"
              splitBy="lines"
              className="text-heading mb-6 text-black"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 14rem)', lineHeight: '0.95' }}
            >
              {`Passez\nnous voir`}
            </TextReveal>
          </div>

          <SimpleAnimation type="slide-up" delay={100}>
            <p
              className="mx-auto mb-10 max-w-xl text-black/60"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
            >
              Une question ? Besoin d'un conseil ? Nous sommes là pour vous accompagner.
            </p>
          </SimpleAnimation>

          {/* CTA with ScrollScale grow on scroll (desktop) */}
          {prefersReducedMotion ? (
            <SimpleAnimation type="fade" delay={200}>
              <a
                href="/contact"
                className="group inline-flex items-center gap-3 border-2 border-black bg-black px-8 py-4 text-body font-medium text-white transition-colors hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black"
              >
                Nous contacter
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </SimpleAnimation>
          ) : (
            <ScrollScale scaleRange={[0.9, 1]}>
              <a
                href="/contact"
                className="group inline-flex items-center gap-3 border-2 border-black bg-black px-8 py-4 text-body font-medium text-white transition-colors hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black"
              >
                Nous contacter
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </ScrollScale>
          )}
        </div>
      </div>
    </section>
  );
});

HomeContact.displayName = 'HomeContact';

export default HomeContact;
