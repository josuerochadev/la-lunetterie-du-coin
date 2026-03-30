import { FEATURED, OTHERS } from './constants';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { RatingStars } from '@/components/common/RatingStars';
import { STORE_INFO } from '@/config/store';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function TestimonialsMobile() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
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
                  <div className="mb-1 text-body-sm font-medium text-white">{testimonial.name}</div>
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
  );
}
