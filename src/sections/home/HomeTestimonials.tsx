import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { GiantCounter } from '@/components/motion/GiantCounter';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { RatingStars } from '@/components/common/RatingStars';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useFadeInOut } from '@/hooks/useFadeInOut';
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials';
import { STORE_INFO } from '@/config/store';
import { useIsLg } from '@/hooks/useIsLg';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG } from '@/lib/motion';
import { ACCENT_HEX } from '@/config/design';
const FEATURED = TESTIMONIALS[0];
const OTHERS = TESTIMONIALS.slice(1);
const OTHER_COUNT = OTHERS.length;
const SCROLL_HEIGHT_VH = 180;

// ── Scroll budget (normalised 0–1) ──────────────────────────────────────────
//
//  0.00 – 0.06  Title word-reveal
//  0.01 – 0.78  Giant counter visible (0.0 → 4.9 during 0.02–0.12)
//  0.08 – 0.28  Featured quote (word-by-word 0.10–0.24) + author
//  0.28 – 0.34  Featured exits upward
//  0.34 – 0.78  Testimonial parade (5 items, one at a time)
// ─────────────────────────────────────────────────────────────────────────────

// ── Desktop sub-components ──────────────────────────────────────────────────

/**
 * Section title — word-by-word reveal, rises from center to top, then fades.
 */
function SectionTitle({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const yRaw = useTransform(scrollYProgress, [0, 0.08], ['40vh', '6vh']);
  const y = useSpring(yRaw, SPRING_CONFIG);
  const opacity = useFadeInOut(scrollYProgress, 0, 0.03, 0.76, 0.8);

  return (
    <m.div
      className="pointer-events-none absolute inset-x-0 z-20 flex justify-center"
      style={{ top: y, opacity }}
    >
      <ScrollWordReveal
        as="h2"
        id="testimonials-title"
        scrollYProgress={scrollYProgress}
        revealStart={0.0}
        revealEnd={0.06}
        className="heading-section text-center text-white"
      >
        On ne le dit pas, ils le disent.
      </ScrollWordReveal>
    </m.div>
  );
}

/**
 * Featured testimonial — large quote with word-by-word scroll reveal,
 * then author info slides in.
 */
function FeaturedQuote({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const containerOpacity = useTransform(scrollYProgress, [0.06, 0.1, 0.28, 0.34], [0, 1, 1, 0]);
  const containerYRaw = useTransform(scrollYProgress, [0.06, 0.1, 0.28, 0.34], [80, 0, 0, -80]);
  const containerY = useSpring(containerYRaw, SPRING_CONFIG);

  const authorOpacity = useTransform(scrollYProgress, [0.22, 0.26], [0, 1]);
  const authorYRaw = useTransform(scrollYProgress, [0.22, 0.26], [20, 0]);
  const authorY = useSpring(authorYRaw, SPRING_CONFIG);

  return (
    <m.div
      className="absolute inset-0 z-10 flex items-center justify-center px-container-x"
      style={{ opacity: containerOpacity, y: containerY }}
    >
      <div className="max-w-4xl text-center">
        <RatingStars rating={FEATURED.rating} size="h-5 w-5" className="mb-8 justify-center" />

        <blockquote>
          <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}>
            <ScrollWordReveal
              as="p"
              scrollYProgress={scrollYProgress}
              revealStart={0.1}
              revealEnd={0.24}
              className="text-white"
            >
              {`\u201C${FEATURED.quote}\u201D`}
            </ScrollWordReveal>
          </div>
        </blockquote>

        <m.footer className="mt-8" style={{ opacity: authorOpacity, y: authorY }}>
          <cite className="not-italic">
            <div className="text-body-lg font-medium text-white">{FEATURED.name}</div>
            <div className="mt-1 flex items-center justify-center gap-2 text-body-sm text-white/50">
              <span>{FEATURED.role}</span>
              {FEATURED.date && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <time>{FEATURED.date}</time>
                </>
              )}
            </div>
          </cite>
        </m.footer>
      </div>
    </m.div>
  );
}

/**
 * Individual testimonial in the scroll parade — enters from below, holds, exits up.
 * First item is in-flow (sets container height), others are absolute overlays.
 */
function TestimonialSlide({
  testimonial,
  index,
  scrollYProgress,
}: {
  testimonial: Testimonial;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const PARADE_START = 0.34;
  const PARADE_END = 0.78;
  const range = PARADE_END - PARADE_START;
  const segmentSize = range / OTHER_COUNT;
  const start = PARADE_START + index * segmentSize;

  const enterEnd = start + segmentSize * 0.25;
  const exitStart = start + segmentSize * 0.75;
  const end = start + segmentSize;

  const yRaw = useTransform(scrollYProgress, [start, enterEnd, exitStart, end], [80, 0, 0, -80]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  const opacity = useFadeInOut(scrollYProgress, start, start + segmentSize * 0.15, exitStart, end);
  const pointerEvents = usePointerEvents(opacity);

  const rotation = index % 2 === 0 ? -1 : 1;

  return (
    <m.div
      className={`${index === 0 ? '' : 'absolute inset-0'} flex items-center justify-center`}
      style={{ opacity, y, pointerEvents }}
    >
      <article
        className="w-full max-w-3xl text-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <RatingStars rating={testimonial.rating} size="h-4 w-4" className="mb-6 justify-center" />

        <blockquote className="mb-6">
          <p className="text-white/80" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.6rem)' }}>
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </blockquote>

        <footer>
          <cite className="not-italic">
            <div className="text-body-sm font-medium text-white">{testimonial.name}</div>
            <div className="mt-1 flex items-center justify-center gap-2 text-body-xs text-white/50">
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
      </article>
    </m.div>
  );
}

// ── Desktop scrollytelling ──────────────────────────────────────────────────

function TestimonialsDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // ── CTA — visible during parade, exits with last testimonial ──
  const ctaOpacity = useTransform(scrollYProgress, [0.38, 0.44, 0.76, 0.82], [0, 1, 1, 0]);
  const ctaYRaw = useTransform(scrollYProgress, [0.38, 0.44, 0.76, 0.82], [20, 0, 0, -30]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);
  const ctaPointer = usePointerEvents(ctaOpacity);

  return (
    <div ref={sectionRef} className="hidden lg:block" style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <GiantCounter
          scrollYProgress={scrollYProgress}
          countRange={[0.02, 0.12]}
          countValues={[0, 4.9]}
          opacityRange={[0.01, 0.06, 0.76, 0.8]}
        />
        <SectionTitle scrollYProgress={scrollYProgress} />
        <FeaturedQuote scrollYProgress={scrollYProgress} />

        {/* Testimonial parade — one at a time, scroll-linked enter/exit */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-container-x">
          <div className="relative w-full max-w-2xl">
            {OTHERS.map((testimonial, i) => (
              <TestimonialSlide
                key={testimonial.id}
                testimonial={testimonial}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* CTA — appears after parade */}
        <m.div
          className="absolute inset-x-0 bottom-[15%] z-20 flex justify-center"
          style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointer }}
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
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

/**
 * Section HomeTestimonials — Scrollytelling Quote Wall
 *
 * Desktop: Full-screen sticky viewport with scroll-linked animations.
 * Title word-reveal → featured quote (word-by-word) → testimonial parade →
 * outro phrase + CTA → exit gradient to white.
 *
 * Mobile/reduced-motion: Stacked layout with SimpleAnimation wrappers.
 */
function HomeTestimonials() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      data-navbar-theme="light"
      className="relative bg-black"
    >
      {/* Top gradient — smooth yellow → black transition from Services */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[40vh]"
        style={{
          background: [
            'linear-gradient(to bottom,',
            `${ACCENT_HEX} 0%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 92%, black) 8%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 80%, black) 18%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 65%, black) 30%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 45%, black) 44%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 28%, black) 58%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 14%, black) 72%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 5%, black) 86%,`,
            'black 100%)',
          ].join(' '),
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[40vh] backdrop-blur-[1px]"
        style={{
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Desktop scrollytelling — only when animation is enabled */}
      {!prefersReducedMotion && isLg && <TestimonialsDesktop />}

      {/* Mobile / reduced-motion — stacked layout */}
      <div
        className={prefersReducedMotion ? 'pointer-events-auto' : 'pointer-events-auto lg:hidden'}
      >
        <div className="mx-auto max-w-container px-container-x py-section">
          {/* Header with rating */}
          <div className="mb-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2
                id={prefersReducedMotion ? 'testimonials-title' : undefined}
                className="heading-section text-white"
              >
                On ne le dit pas, ils le disent.
              </h2>
            </SimpleAnimation>

            <SimpleAnimation type="fade" delay={100}>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-heading text-accent"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                >
                  4.9
                </span>
                <span className="text-body text-white/60">/5</span>
              </div>
            </SimpleAnimation>
          </div>

          {/* Featured quote */}
          <article className="relative mb-16 border-t border-white/10 pt-10">
            <div
              className="pointer-events-none absolute -top-6 left-0 select-none font-serif text-accent opacity-20"
              style={{ fontSize: 'clamp(5rem, 10vw, 12rem)', lineHeight: '1' }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <div className="relative z-10 max-w-4xl">
              <RatingStars rating={FEATURED.rating} size="h-6 w-6" className="mb-6" />

              <SimpleAnimation type="slide-up" delay={150}>
                <blockquote className="mb-8">
                  <p className="text-white/90" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                    &ldquo;{FEATURED.quote}&rdquo;
                  </p>
                </blockquote>

                <footer>
                  <cite className="not-italic">
                    <div className="mb-1 text-body-lg font-medium text-white">{FEATURED.name}</div>
                    <div className="flex items-center gap-2 text-body-sm text-white/50">
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
              </SimpleAnimation>
            </div>
          </article>

          {/* Other testimonials */}
          <div className="space-y-6">
            {OTHERS.map((testimonial, i) => (
              <SimpleAnimation key={testimonial.id} type="slide-up" delay={200 + i * 80}>
                <article className="rounded-sm bg-white/[0.04] p-6 sm:p-8">
                  <RatingStars rating={testimonial.rating} className="mb-4" />

                  <blockquote className="mb-5">
                    <p className="text-body text-white/70">&ldquo;{testimonial.quote}&rdquo;</p>
                  </blockquote>

                  <footer>
                    <cite className="not-italic">
                      <div className="mb-1 text-body-sm font-medium text-white">
                        {testimonial.name}
                      </div>
                      <div className="flex items-center gap-2 text-body-xs text-white/50">
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
                </article>
              </SimpleAnimation>
            ))}
          </div>

          {/* CTA */}
          <SimpleAnimation type="slide-up" delay={400}>
            <div className="mt-12 text-center">
              <LinkCTA
                href={STORE_INFO.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                theme="dark"
              >
                Voir nos avis Google
              </LinkCTA>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}

export default HomeTestimonials;
