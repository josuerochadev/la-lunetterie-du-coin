import { forwardRef, useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import TextReveal from '@/components/motion/TextReveal';
import { RatingStars } from '@/components/common/RatingStars';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { TESTIMONIALS } from '@/data/testimonials';

/**
 * Section HomeTestimonials — Quote Wall
 *
 * Featured quote with TextReveal scroll mode (desktop) / viewport mode (mobile).
 * Animated guillemet scale on scroll. Cards with alternating rotation + hover.
 * Yellow separator animates scaleX on scroll.
 *
 * @component
 */
const HomeTestimonials = forwardRef<HTMLElement>(() => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const featured = TESTIMONIALS[0];
  const others = TESTIMONIALS.slice(1);

  // Animated guillemet
  const quoteRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: quoteProgress } = useScroll({
    target: prefersReducedMotion ? undefined : quoteRef,
    offset: ['start end', 'end start'],
  });
  const quoteScale = useTransform(quoteProgress, [0, 1], [0.8, 1.2]);
  const quoteOpacity = useTransform(quoteProgress, [0, 1], [0.1, 0.3]);

  // Animated yellow separator
  const separatorRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sepProgress } = useScroll({
    target: prefersReducedMotion ? undefined : separatorRef,
    offset: ['start end', 'center center'],
  });
  const sepScaleX = useTransform(sepProgress, [0, 1], [0, 1]);

  return (
    <section
      id="testimonials"
      className="relative w-full bg-background py-section"
      aria-labelledby="testimonials-title"
      data-navbar-theme="dark"
    >
      <div className="mx-auto max-w-container px-container-x">
        {/* Header with rating */}
        <div className="mb-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SimpleAnimation type="slide-up" delay={0}>
              <h2 id="testimonials-title" className="heading-section">
                Ils nous font confiance
              </h2>
            </SimpleAnimation>
          </div>

          <SimpleAnimation type="fade" delay={100}>
            <div className="flex items-baseline gap-2">
              <span
                className="text-heading text-accent"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
              >
                4.9
              </span>
              <span className="text-body text-black/50">/5</span>
            </div>
          </SimpleAnimation>
        </div>

        {/* Featured quote */}
        <article ref={quoteRef} className="relative mb-16 border-t border-black/10 pt-10">
          {/* Animated giant guillemet */}
          {prefersReducedMotion ? (
            <div
              className="pointer-events-none absolute -top-6 left-0 select-none font-serif text-accent opacity-30"
              style={{ fontSize: 'clamp(5rem, 10vw, 12rem)', lineHeight: '1' }}
              aria-hidden="true"
            >
              &ldquo;
            </div>
          ) : (
            <m.div
              className="pointer-events-none absolute -top-6 left-0 origin-left select-none font-serif text-accent"
              style={{
                fontSize: 'clamp(5rem, 10vw, 12rem)',
                lineHeight: '1',
                scale: quoteScale,
                opacity: quoteOpacity,
              }}
              aria-hidden="true"
            >
              &ldquo;
            </m.div>
          )}

          <div className="relative z-10 max-w-4xl">
            <RatingStars rating={featured.rating} size="h-6 w-6" className="mb-6" />

            <blockquote className="mb-8">
              {/* Mobile: SimpleAnimation. Desktop: TextReveal scroll */}
              <div className="lg:hidden">
                <SimpleAnimation type="slide-up" delay={150}>
                  <p
                    className="leading-relaxed text-text"
                    style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
                  >
                    &ldquo;{featured.quote}&rdquo;
                  </p>
                </SimpleAnimation>
              </div>

              <div className="hidden lg:block">
                <TextReveal
                  as="p"
                  mode="scroll"
                  splitBy="words"
                  className="leading-relaxed text-text"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}
                >
                  {`\u201C${featured.quote}\u201D`}
                </TextReveal>
              </div>
            </blockquote>

            <footer>
              <cite className="not-italic">
                <div className="mb-1 text-body-lg font-medium text-text">{featured.name}</div>
                <div className="flex items-center gap-2 text-body-sm text-black/50">
                  <span>{featured.role}</span>
                  {featured.date && (
                    <>
                      <span aria-hidden="true">&middot;</span>
                      <time>{featured.date}</time>
                    </>
                  )}
                </div>
              </cite>
            </footer>
          </div>
        </article>

        {/* Animated yellow separator */}
        <div ref={separatorRef} className="mb-12 h-[2px] overflow-hidden" aria-hidden="true">
          {prefersReducedMotion ? (
            <div className="h-full w-full bg-accent" />
          ) : (
            <m.div className="h-full w-full origin-left bg-accent" style={{ scaleX: sepScaleX }} />
          )}
        </div>

        {/* Other testimonials — horizontal scroll with rotation */}
        <SimpleAnimation type="fade" delay={250}>
          <div
            className="scrollbar-hide -mx-container-x flex snap-x snap-mandatory gap-6 overflow-x-auto px-container-x pb-4"
            role="list"
          >
            {others.map((testimonial, i) => {
              const rotation = i % 2 === 0 ? '-1deg' : '1deg';

              return (
                <article
                  key={testimonial.id}
                  className="w-[85vw] flex-shrink-0 snap-start bg-black p-6 transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 sm:w-[400px] sm:p-8"
                  style={{
                    transform: prefersReducedMotion ? undefined : `rotate(${rotation})`,
                  }}
                  role="listitem"
                >
                  <RatingStars rating={testimonial.rating} className="mb-4" />

                  <blockquote className="mb-6">
                    <p className="text-body leading-relaxed text-white/80">
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
              );
            })}
          </div>
        </SimpleAnimation>

        {/* CTA Google Reviews */}
        <SimpleAnimation type="slide-up" delay={300}>
          <div className="mt-12 text-center">
            <a
              href="https://www.google.com/maps/place/La+Lunetterie+Du+Coin+Neuf+%26+Occasion/@48.5823394,7.7453277,17z/data=!4m8!3m7!1s0x4796c84f95e5e877:0x88d0f0f0f0f0f0f0!8m2!3d48.5823394!4d7.7479026!9m1!1b1!16s%2Fg%2F11c1qx0x0x"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-text focus-visible:text-text"
            >
              Voir tous nos avis Google
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </div>
        </SimpleAnimation>
      </div>
    </section>
  );
});

HomeTestimonials.displayName = 'HomeTestimonials';

export default HomeTestimonials;
