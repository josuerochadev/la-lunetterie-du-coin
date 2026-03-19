import { forwardRef, useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollParallaxImage from '@/components/motion/ScrollParallaxImage';
import TextReveal from '@/components/motion/TextReveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { HOMEPAGE_OFFERS, HOMEPAGE_SECTIONS } from '@/data/homepage';

/**
 * Decorative number with internal parallax translateY.
 */
function ParallaxNumber({ number }: { number: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <m.div
      ref={ref}
      className="pointer-events-none absolute right-6 top-6 select-none text-accent opacity-10 lg:right-8 lg:top-8"
      style={{
        fontSize: 'clamp(8rem, 20vw, 20rem)',
        lineHeight: '1',
        y,
      }}
      aria-hidden="true"
    >
      {number}
    </m.div>
  );
}

/**
 * Section HomeOffers — Manifesto Panels
 *
 * Each offer takes min-h-[80vh] for more visual weight.
 * ScrollParallaxImage on images, larger decorative numbers with internal parallax.
 * TextReveal viewport mode on titles, staggered text entry.
 * Header reduced to small label above first offer.
 *
 * Mobile: image top (60vh), text below. SimpleAnimation fallback.
 *
 * @component
 */
const HomeOffers = forwardRef<HTMLElement>(() => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="offers"
      className="relative w-full bg-background"
      aria-labelledby="offers-title"
      data-navbar-theme="dark"
    >
      {/* Small label header */}
      <div className="mx-auto max-w-container px-container-x pb-8 pt-section">
        <SimpleAnimation type="slide-up" delay={0}>
          <span className="mb-2 block text-body-sm font-medium uppercase tracking-wider text-black/50">
            {HOMEPAGE_SECTIONS.offers.title}
          </span>
          <h2 id="offers-title" className="sr-only">
            {HOMEPAGE_SECTIONS.offers.title}
          </h2>
          <p className="text-body-lg text-black/50">{HOMEPAGE_SECTIONS.offers.subtitle}</p>
        </SimpleAnimation>
      </div>

      {/* Offer panels */}
      <div>
        {HOMEPAGE_OFFERS.map((offer, index) => {
          const isEven = index % 2 === 0;
          const number = String(index + 1).padStart(2, '0');

          return (
            <article key={offer.id} className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-12">
              {/* Image — 60% (7 cols) */}
              <div
                className={`relative h-[60vh] lg:h-auto ${
                  isEven ? 'lg:col-span-7' : 'lg:order-2 lg:col-span-7'
                }`}
              >
                {/* Mobile: SimpleAnimation. Desktop: ScrollParallaxImage */}
                <div className="h-full lg:hidden">
                  <SimpleAnimation type="fade" delay={0} className="h-full">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </SimpleAnimation>
                </div>

                <div className="hidden h-full lg:block">
                  <ScrollParallaxImage
                    src={offer.image}
                    alt={offer.title}
                    parallaxRange={[-50, 50]}
                    scaleRange={[1.02, 1.1]}
                    loading="lazy"
                    sizes="60vw"
                    className="h-full w-full"
                  />
                </div>
              </div>

              {/* Text — 40% (5 cols) on black bg */}
              <div
                className={`relative flex items-center bg-black px-6 py-12 sm:px-10 lg:px-12 ${
                  isEven ? 'lg:col-span-5' : 'lg:order-1 lg:col-span-5'
                }`}
              >
                {/* Decorative number with parallax (desktop) / static (mobile) */}
                {prefersReducedMotion ? (
                  <div
                    className="pointer-events-none absolute right-6 top-6 select-none text-accent opacity-10 lg:right-8 lg:top-8"
                    style={{
                      fontSize: 'clamp(8rem, 20vw, 20rem)',
                      lineHeight: '1',
                    }}
                    aria-hidden="true"
                  >
                    {number}
                  </div>
                ) : (
                  <ParallaxNumber number={number} />
                )}

                <div className="relative z-10 max-w-md space-y-5">
                  {/* Title: TextReveal viewport on desktop, SimpleAnimation on mobile */}
                  <div className="lg:hidden">
                    <SimpleAnimation type="slide-up" delay={0}>
                      <h3
                        className="text-heading text-white"
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                      >
                        {offer.title}
                      </h3>
                    </SimpleAnimation>
                  </div>

                  <div className="hidden lg:block">
                    <TextReveal
                      as="h3"
                      mode="viewport"
                      splitBy="words"
                      className="text-heading text-white"
                      style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                    >
                      {offer.title}
                    </TextReveal>
                  </div>

                  {/* Staggered text entry */}
                  <SimpleAnimation type="slide-up" delay={200}>
                    <p className="text-heading text-body-lg uppercase text-accent">
                      {offer.catchphrase}
                    </p>
                  </SimpleAnimation>

                  <SimpleAnimation type="slide-up" delay={400}>
                    <p className="text-body-lg font-medium leading-relaxed text-white">
                      {offer.summary}
                    </p>
                  </SimpleAnimation>

                  <SimpleAnimation type="fade" delay={600}>
                    <p className="whitespace-pre-line text-body leading-relaxed text-white/50">
                      {offer.details}
                    </p>
                  </SimpleAnimation>

                  <SimpleAnimation type="slide-up" delay={600}>
                    <a
                      href={offer.link}
                      className="button-primary group mt-2 inline-flex items-center gap-2 px-6 py-3 text-body"
                      aria-label={`En savoir plus sur l'offre ${offer.title}`}
                    >
                      Découvrir l'offre
                      <ArrowRight
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </SimpleAnimation>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* CTA global */}
      <div className="mx-auto max-w-container px-container-x pb-section pt-16 text-center">
        <SimpleAnimation type="slide-up" delay={200}>
          <a
            href={HOMEPAGE_SECTIONS.offers.cta.link}
            className="button-secondary px-6 py-3 text-body"
            aria-label={HOMEPAGE_SECTIONS.offers.cta.ariaLabel}
          >
            {HOMEPAGE_SECTIONS.offers.cta.text}
          </a>
        </SimpleAnimation>
      </div>
    </section>
  );
});

HomeOffers.displayName = 'HomeOffers';

export default HomeOffers;
