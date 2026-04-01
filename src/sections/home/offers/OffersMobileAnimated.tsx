import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_OFFERS, HOMEPAGE_SECTIONS } from '@/data/homepage';
import { SPRING_CONFIG } from '@/lib/motion';

const SCROLL_HEIGHT_VH = 180;
const OFFER_COUNT = HOMEPAGE_OFFERS.length;

/**
 * Mobile-animated offers — sticky viewport with layered images + cards.
 *
 * Timeline (scroll progress 0→1 over 180vh):
 *   0.00–0.10  Image 1 fade-in + scale
 *   0.08–0.20  Card 1 slide-up + micro-stagger
 *   0.20–0.42  Hold offer 1
 *   0.42–0.55  Card 1 exit + crossfade images
 *   0.55–0.67  Card 2 slide-up + micro-stagger
 *   0.67–0.88  Hold offer 2
 *   0.88–1.00  Card 2 exit
 */
export function OffersMobileAnimated() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // ── Images (faded backdrop — max opacity 0.55 for card readability) ──
  const img0Opacity = useTransform(scrollYProgress, [0.0, 0.1, 0.42, 0.55], [0, 0.55, 0.55, 0]);
  const img0YRaw = useTransform(scrollYProgress, [0.0, 0.55], [60, -60]);
  const img0Y = useSpring(img0YRaw, SPRING_CONFIG);
  const img0Scale = useTransform(scrollYProgress, [0.0, 0.12], [0.88, 1]);

  const img1Opacity = useTransform(scrollYProgress, [0.42, 0.55, 0.88, 1.0], [0, 0.55, 0.55, 0]);
  const img1YRaw = useTransform(scrollYProgress, [0.42, 1.0], [60, -60]);
  const img1Y = useSpring(img1YRaw, SPRING_CONFIG);
  const img1Scale = useTransform(scrollYProgress, [0.42, 0.57], [0.88, 1]);

  // ── Card 0 ──────────────────────────────────────────────────────
  const card0Opacity = useTransform(scrollYProgress, [0.08, 0.18, 0.42, 0.52], [0, 1, 1, 0]);
  const card0YRaw = useTransform(scrollYProgress, [0.08, 0.2, 0.42, 0.52], [60, 0, 0, -40]);
  const card0Y = useSpring(card0YRaw, SPRING_CONFIG);
  const card0Scale = useTransform(scrollYProgress, [0.08, 0.2, 0.42, 0.52], [0.95, 1, 1, 0.95]);

  // Card 0 internals — micro-stagger
  const c0TitleOpacity = useTransform(scrollYProgress, [0.1, 0.18], [0, 1]);
  const c0TitleY = useTransform(scrollYProgress, [0.1, 0.18], [14, 0]);
  const c0DescOpacity = useTransform(scrollYProgress, [0.13, 0.21], [0, 1]);
  const c0DescY = useTransform(scrollYProgress, [0.13, 0.21], [14, 0]);
  const c0CtaOpacity = useTransform(scrollYProgress, [0.16, 0.24], [0, 1]);
  const c0BarScaleY = useTransform(scrollYProgress, [0.1, 0.22], [0, 1]);

  // ── Card 1 ──────────────────────────────────────────────────────
  const card1Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.88, 0.97], [0, 1, 1, 0]);
  const card1YRaw = useTransform(scrollYProgress, [0.55, 0.67, 0.88, 0.97], [60, 0, 0, -40]);
  const card1Y = useSpring(card1YRaw, SPRING_CONFIG);
  const card1Scale = useTransform(scrollYProgress, [0.55, 0.67, 0.88, 0.97], [0.95, 1, 1, 0.95]);

  // Card 1 internals — micro-stagger
  const c1TitleOpacity = useTransform(scrollYProgress, [0.57, 0.65], [0, 1]);
  const c1TitleY = useTransform(scrollYProgress, [0.57, 0.65], [14, 0]);
  const c1DescOpacity = useTransform(scrollYProgress, [0.6, 0.68], [0, 1]);
  const c1DescY = useTransform(scrollYProgress, [0.6, 0.68], [14, 0]);
  const c1CtaOpacity = useTransform(scrollYProgress, [0.63, 0.71], [0, 1]);
  const c1BarScaleY = useTransform(scrollYProgress, [0.57, 0.69], [0, 1]);

  const cardInternals = [
    {
      titleOpacity: c0TitleOpacity,
      titleY: c0TitleY,
      descOpacity: c0DescOpacity,
      descY: c0DescY,
      ctaOpacity: c0CtaOpacity,
      barScaleY: c0BarScaleY,
    },
    {
      titleOpacity: c1TitleOpacity,
      titleY: c1TitleY,
      descOpacity: c1DescOpacity,
      descY: c1DescY,
      ctaOpacity: c1CtaOpacity,
      barScaleY: c1BarScaleY,
    },
  ];

  // ── Title ───────────────────────────────────────────────────────
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.06, 0.95, 1.0], [0, 1, 1, 0]);

  // ── Section CTA ────────────────────────────────────────────────
  const sectionCtaOpacity = useTransform(scrollYProgress, [0.92, 0.97], [0, 1]);
  const sectionCtaYRaw = useTransform(scrollYProgress, [0.92, 0.97], [20, 0]);
  const sectionCtaY = useSpring(sectionCtaYRaw, SPRING_CONFIG);

  const imgTransforms = [
    { opacity: img0Opacity, y: img0Y, scale: img0Scale },
    { opacity: img1Opacity, y: img1Y, scale: img1Scale },
  ];

  const cardTransforms = [
    { opacity: card0Opacity, y: card0Y, scale: card0Scale },
    { opacity: card1Opacity, y: card1Y, scale: card1Scale },
  ];

  return (
    <div ref={sectionRef} className="lg:hidden" style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
      <div className="pointer-events-auto sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* ── Image layer (faded backdrop) ── */}
        <div className="absolute inset-0 z-0">
          {HOMEPAGE_OFFERS.map((offer, i) => (
            <m.div
              key={offer.id}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              style={{
                opacity: imgTransforms[i].opacity,
                y: imgTransforms[i].y,
                scale: imgTransforms[i].scale,
              }}
            >
              <img
                src={offer.image}
                alt=""
                aria-hidden="true"
                className="h-[130vh] w-auto max-w-none object-contain"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </m.div>
          ))}
        </div>

        {/* ── Title + Cards group (centered vertically as one block) ── */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-container-x">
          {/* Title */}
          <m.div className="relative z-10 mb-6" style={{ opacity: titleOpacity }}>
            <ScrollWordReveal
              as="h2"
              id="offers-title"
              scrollYProgress={scrollYProgress}
              revealStart={0.0}
              revealEnd={0.06}
              className="heading-section text-black"
            >
              {HOMEPAGE_SECTIONS.offers.title}
            </ScrollWordReveal>
          </m.div>

          {/* Cards — stacked in a relative wrapper so they don't cover the title */}
          <div className="relative min-h-[280px] sm:min-h-[300px]">
            {HOMEPAGE_OFFERS.map((offer, i) => {
              const number = String(i + 1).padStart(2, '0');
              const internals = cardInternals[i];

              return (
                <m.div
                  key={offer.id}
                  className="absolute inset-x-0 top-0 will-change-transform"
                  style={{
                    opacity: cardTransforms[i].opacity,
                    y: cardTransforms[i].y,
                    scale: cardTransforms[i].scale,
                  }}
                >
                  <div className="relative overflow-hidden rounded-r-2xl bg-black/90 shadow-2xl backdrop-blur-md">
                    {/* Blue accent bar */}
                    <m.div
                      className="absolute bottom-0 left-0 top-0 w-1.5 origin-bottom bg-secondary-blue"
                      style={{ scaleY: internals.barScaleY }}
                      aria-hidden="true"
                    />

                    <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10">
                      <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-white/70">
                        {number} / {String(OFFER_COUNT).padStart(2, '0')}
                      </span>

                      <m.h3
                        className="text-subtitle text-title-sm text-accent"
                        style={{ opacity: internals.titleOpacity, y: internals.titleY }}
                      >
                        {offer.catchphrase}
                      </m.h3>

                      <m.p
                        className="mt-3 text-body-lg text-white"
                        style={{ opacity: internals.descOpacity, y: internals.descY }}
                      >
                        {offer.summary}
                      </m.p>

                      <m.div style={{ opacity: internals.ctaOpacity }}>
                        <LinkCTA
                          to={offer.link}
                          theme="dark"
                          className="mt-5"
                          aria-label={`En savoir plus sur l'offre ${offer.title}`}
                        >
                          En savoir plus
                        </LinkCTA>
                      </m.div>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>

        {/* ── Section CTA ── */}
        <m.div
          className="relative z-20 shrink-0 pb-8 text-center"
          style={{ opacity: sectionCtaOpacity, y: sectionCtaY }}
        >
          <LinkCTA
            to={HOMEPAGE_SECTIONS.offers.cta.link}
            aria-label={HOMEPAGE_SECTIONS.offers.cta.ariaLabel}
          >
            {HOMEPAGE_SECTIONS.offers.cta.text}
          </LinkCTA>
        </m.div>
      </div>
    </div>
  );
}
