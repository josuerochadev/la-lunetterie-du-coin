import { useEffect, useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { RatingStars } from '@/components/common/RatingStars';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const FEATURED = TESTIMONIALS[0];
const OTHERS = TESTIMONIALS.slice(1);
const OTHER_COUNT = OTHERS.length;
const SCROLL_HEIGHT_VH = 600;

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/La+Lunetterie+Du+Coin+Neuf+%26+Occasion/@48.5823394,7.7453277,17z/data=!4m8!3m7!1s0x4796c84f95e5e877:0x88d0f0f0f0f0f0f0!8m2!3d48.5823394!4d7.7479026!9m1!1b1!16s%2Fg%2F11c1qx0x0x';

// ── Scroll budget (normalised 0–1) ──────────────────────────────────────────
//
//  0.00 – 0.06  Title word-reveal
//  0.01 – 0.80  Giant counter visible (0.0 → 4.9 during 0.02–0.12)
//  0.08 – 0.28  Featured quote (word-by-word 0.10–0.24) + author
//  0.28 – 0.34  Featured exits upward
//  0.34 – 0.78  Testimonial parade (5 items, one at a time)
//  0.80 – 0.92  Outro phrase word-by-word
//  0.85 – 0.93  CTA visible
//  0.93 – 1.00  Background → white exit gradient
// ─────────────────────────────────────────────────────────────────────────────

// ── Desktop sub-components ──────────────────────────────────────────────────

/**
 * Giant background rating counter — counts from 0.0 to 4.9 on scroll.
 * Replaces both the decorative guillemet and the small rating display.
 * DOM text updated directly via ref (no re-renders).
 */
function GiantRating({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const countRef = useRef<HTMLSpanElement>(null);

  // Counter: 0.0 → 4.9 during title/intro phase, then holds
  const count = useTransform(scrollYProgress, [0.02, 0.12], [0, 4.9]);

  useEffect(() => {
    const unsubscribe = count.on('change', (v) => {
      if (countRef.current) {
        countRef.current.textContent = v.toFixed(1);
      }
    });
    return unsubscribe;
  }, [count]);

  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const scale = useSpring(scaleRaw, SPRING_CONFIG);
  const opacity = useTransform(scrollYProgress, [0.01, 0.06, 0.78, 0.82], [0, 0.18, 0.18, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);

  return (
    <m.div
      className="text-heading pointer-events-none absolute right-[5%] top-1/2 z-0 -translate-y-1/2 select-none text-accent"
      style={{
        fontSize: 'clamp(18rem, 35vw, 45rem)',
        lineHeight: 1,
        scale,
        opacity,
        y,
      }}
      aria-hidden="true"
    >
      <span ref={countRef}>0.0</span>
    </m.div>
  );
}

/**
 * Section title — word-by-word reveal, rises from center to top, then fades.
 */
function SectionTitle({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const yRaw = useTransform(scrollYProgress, [0, 0.08], ['40vh', '6vh']);
  const y = useSpring(yRaw, SPRING_CONFIG);
  const fadeIn = useTransform(scrollYProgress, [0, 0.03], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [0.78, 0.82], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));

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
        Ils nous font confiance
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
              className="leading-relaxed text-white"
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

  const fadeIn = useTransform(scrollYProgress, [start, start + segmentSize * 0.15], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [exitStart, end], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));
  const pointerEvents = useTransform(opacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));

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
          <p
            className="leading-relaxed text-white/80"
            style={{ fontSize: 'clamp(1.15rem, 2vw, 1.6rem)' }}
          >
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

/**
 * Outro — word-by-word phrase reveal + CTA + white exit gradient.
 *
 * Timeline:
 *   0.80 – 0.88  Phrase word-reveal
 *   0.85 – 0.89  CTA fades in
 *   0.90 – 0.93  Phrase + CTA fade out
 *   0.93 – 1.00  Background → white
 */
function SectionOutro({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const phraseOpacity = useTransform(scrollYProgress, [0.8, 0.85, 0.9, 0.93], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.89, 0.9, 0.93], [0, 1, 1, 0]);
  const ctaYRaw = useTransform(scrollYProgress, [0.85, 0.89], [20, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);
  const ctaPointer = useTransform(ctaOpacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));

  const bgOpacity = useTransform(scrollYProgress, [0.93, 1.0], [0, 1]);

  return (
    <>
      {/* White exit gradient — covers everything for seamless transition to next section */}
      <m.div
        className="pointer-events-none absolute inset-0 z-30 bg-white"
        style={{ opacity: bgOpacity }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center gap-8 px-8">
        <m.div style={{ opacity: phraseOpacity }}>
          <ScrollWordReveal
            as="h3"
            scrollYProgress={scrollYProgress}
            revealStart={0.8}
            revealEnd={0.88}
            className="text-heading text-center text-title-xl text-white"
          >
            {`ILS L'ONT DIT MIEUX QUE NOUS`}
          </ScrollWordReveal>
        </m.div>

        <m.div
          className="pointer-events-auto"
          style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointer }}
        >
          <LinkCTA href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" theme="dark">
            Voir nos avis Google
          </LinkCTA>
        </m.div>
      </div>
    </>
  );
}

// ── Desktop scrollytelling ──────────────────────────────────────────────────

function TestimonialsDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={sectionRef} className="hidden lg:block" style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <GiantRating scrollYProgress={scrollYProgress} />
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

        <SectionOutro scrollYProgress={scrollYProgress} />
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

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      data-navbar-theme="light"
      className="pointer-events-none relative bg-black"
    >
      {/* Desktop scrollytelling — only when animation is enabled */}
      {!prefersReducedMotion && <TestimonialsDesktop />}

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
                Ils nous font confiance
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
                <span className="text-body text-white/40">/5</span>
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
                  <p
                    className="leading-relaxed text-white/90"
                    style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
                  >
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
                    <p className="text-body leading-relaxed text-white/70">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
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
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                theme="dark"
              >
                Voir nos avis Google
              </LinkCTA>
            </div>
          </SimpleAnimation>
        </div>

        {/* Bottom gradient — smooth black → white transition for SectionTransition below */}
        <div className="h-20 bg-gradient-to-b from-black to-white" aria-hidden="true" />
      </div>
    </section>
  );
}

export default HomeTestimonials;
