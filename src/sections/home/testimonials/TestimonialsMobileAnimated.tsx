import { useEffect, useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { FEATURED, OTHERS } from './constants';

import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { RatingStars } from '@/components/common/RatingStars';
import { STORE_INFO } from '@/config/store';
import type { Testimonial } from '@/data/testimonials';

/** Individual testimonial card with scroll-driven entrance */
function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const cardOpacity = useTransform(scrollYProgress, [0.0, 0.2], [0, 1]);
  const cardY = useTransform(scrollYProgress, [0.0, 0.2], [40, 0]);
  // Alternate subtle rotation for visual variety
  const cardRotate = useTransform(scrollYProgress, [0.0, 0.2], [index % 2 === 0 ? 1.5 : -1.5, 0]);

  return (
    <m.article
      ref={ref}
      className="rounded-sm bg-white/[0.04] p-6 will-change-transform sm:p-8"
      style={{ opacity: cardOpacity, y: cardY, rotate: cardRotate }}
    >
      <RatingStars rating={testimonial.rating} className="mb-4" />

      <blockquote className="mb-5">
        <p className="text-body text-white">&ldquo;{testimonial.quote}&rdquo;</p>
      </blockquote>

      <footer>
        <cite className="not-italic">
          <div className="mb-1 text-body-sm font-medium text-white">{testimonial.name}</div>
          <div className="flex items-center gap-2 text-body-xs text-secondary-blue">
            <span>{testimonial.role}</span>
            {testimonial.date && (
              <>
                <span aria-hidden="true">&middot;</span>
                <time>{testimonial.date}</time>
              </>
            )}
          </div>
        </cite>
      </footer>
    </m.article>
  );
}

export function TestimonialsMobileAnimated() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const { scrollYProgress: featuredProgress } = useScroll({
    target: featuredRef,
    offset: ['start end', 'end start'],
  });

  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ['start end', 'end start'],
  });

  // ── Giant counter background — counts 0→4.9 on scroll ──
  const count = useTransform(scrollYProgress, [0.05, 0.4], [0, 4.9]);
  const counterOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.65, 0.8], [0, 0.1, 0.1, 0]);
  const counterScale = useTransform(scrollYProgress, [0.05, 0.4], [0.85, 1.05]);

  useEffect(() => {
    const unsubscribe = count.on('change', (v) => {
      if (countRef.current) {
        countRef.current.textContent = v.toFixed(1);
      }
    });
    return unsubscribe;
  }, [count]);

  // ── Featured quote — scale + fade entrance ──
  const featuredOpacity = useTransform(featuredProgress, [0.0, 0.2], [0, 1]);
  const featuredScale = useTransform(featuredProgress, [0.0, 0.2], [0.96, 1]);
  const featuredY = useTransform(featuredProgress, [0.0, 0.2], [30, 0]);
  const quoteMarkOpacity = useTransform(featuredProgress, [0.05, 0.25], [0, 0.2]);

  // ── CTA ──
  const ctaOpacity = useTransform(ctaProgress, [0.05, 0.25], [0, 1]);
  const ctaY = useTransform(ctaProgress, [0.05, 0.25], [25, 0]);

  return (
    <div ref={sectionRef} className="relative mx-auto max-w-container px-container-x py-section">
      {/* Giant counter background */}
      <m.div
        className="text-heading pointer-events-none absolute right-[5%] top-1/3 z-0 select-none text-accent"
        style={{
          fontSize: 'clamp(10rem, 28vw, 20rem)',
          lineHeight: 1,
          opacity: counterOpacity,
          scale: counterScale,
        }}
        aria-hidden="true"
      >
        <span ref={countRef}>0.0</span>
      </m.div>

      {/* Header with rating */}
      <div className="relative z-10 mb-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <ScrollWordReveal
          as="h2"
          scrollYProgress={scrollYProgress}
          revealStart={0.0}
          revealEnd={0.12}
          className="heading-section text-white"
        >
          On ne le dit pas, ils le disent.
        </ScrollWordReveal>

        <m.div
          className="flex items-baseline gap-2"
          style={{
            opacity: useTransform(scrollYProgress, [0.08, 0.18], [0, 1]),
          }}
        >
          <span
            className="text-heading text-accent"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            4.9
          </span>
          <span className="text-body text-white">/5</span>
        </m.div>
      </div>

      {/* Featured quote */}
      <m.article
        ref={featuredRef}
        className="relative z-10 mb-16 border-t border-white/10 pt-10 will-change-transform"
        style={{ opacity: featuredOpacity, scale: featuredScale, y: featuredY }}
      >
        <m.div
          className="pointer-events-none absolute -top-6 left-0 select-none font-serif text-accent"
          style={{
            fontSize: 'clamp(5rem, 10vw, 12rem)',
            lineHeight: '1',
            opacity: quoteMarkOpacity,
          }}
          aria-hidden="true"
        >
          &ldquo;
        </m.div>

        <div className="relative z-10 max-w-4xl">
          <RatingStars rating={FEATURED.rating} size="h-6 w-6" className="mb-6" />

          <blockquote className="mb-8">
            <p className="text-white" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
              &ldquo;{FEATURED.quote}&rdquo;
            </p>
          </blockquote>

          <footer>
            <cite className="not-italic">
              <div className="mb-1 text-body-lg font-medium text-white">{FEATURED.name}</div>
              <div className="flex items-center gap-2 text-body-sm text-secondary-blue">
                <span>{FEATURED.role}</span>
                {FEATURED.date && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <time>{FEATURED.date}</time>
                  </>
                )}
              </div>
            </cite>
          </footer>
        </div>
      </m.article>

      {/* Other testimonials — scroll-driven stagger */}
      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {OTHERS.map((testimonial, i) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={i} />
        ))}
      </div>

      {/* CTA */}
      <m.div
        ref={ctaRef}
        className="relative z-10 mt-12 text-center will-change-transform"
        style={{ opacity: ctaOpacity, y: ctaY }}
      >
        <LinkCTA
          href={STORE_INFO.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          theme="dark"
        >
          Voir nos avis Google
        </LinkCTA>
      </m.div>
    </div>
  );
}
