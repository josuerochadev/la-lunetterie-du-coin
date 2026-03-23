import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { HOMEPAGE_OFFERS, HOMEPAGE_SECTIONS } from '@/data/homepage';
import motifBlancUrl from '@/assets/patterns/motif-blanc.svg';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const OFFER_COUNT = HOMEPAGE_OFFERS.length;

// ---------------------------------------------------------------------------
// Desktop — parallax layers: catchphrase + floating product + text
// ---------------------------------------------------------------------------

function OfferBlock({ offer, index }: { offer: (typeof HOMEPAGE_OFFERS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const number = String(index + 1).padStart(2, '0');
  const isEven = index % 2 === 0;

  // Layer 1 — Catchphrase: slowest parallax
  const catchphraseOpacity = useTransform(scrollYProgress, [0.1, 0.22], [0, 1]);
  const catchphraseYRaw = useTransform(scrollYProgress, [0.0, 1.0], [100, -50]);
  const catchphraseY = useSpring(catchphraseYRaw, SPRING_CONFIG);

  // Layer 2 — Product image: medium parallax, larger range
  const imageOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);
  const imageYRaw = useTransform(scrollYProgress, [0.0, 1.0], [200, -120]);
  const imageY = useSpring(imageYRaw, SPRING_CONFIG);
  const imageRotate = useTransform(scrollYProgress, [0.0, 1.0], isEven ? [-6, 6] : [6, -6]);
  const imageScale = useTransform(scrollYProgress, [0.1, 0.5], [0.92, 1]);

  // Layer 3 — Summary/CTA: fastest parallax
  const textOpacity = useTransform(scrollYProgress, [0.22, 0.35], [0, 1]);
  const textYRaw = useTransform(scrollYProgress, [0.0, 1.0], [280, -140]);
  const textY = useSpring(textYRaw, SPRING_CONFIG);

  const ctaOpacity = useTransform(scrollYProgress, [0.3, 0.42], [0, 1]);

  return (
    <div ref={ref} className="hidden min-h-[80vh] py-[12vh] lg:block">
      <div className="mx-auto flex max-w-container items-center gap-8 px-container-x xl:gap-12">
        {/* Text column — 40% */}
        <div className={`relative z-10 w-[40%] ${isEven ? 'order-1' : 'order-2'}`}>
          {/* Label + Catchphrase — slow layer */}
          <m.div style={{ opacity: catchphraseOpacity, y: catchphraseY }}>
            <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-black/30">
              {number} / {String(OFFER_COUNT).padStart(2, '0')}
            </span>
            <h3 className="text-subtitle text-title-sm text-black">{offer.catchphrase}</h3>
          </m.div>

          {/* Summary + CTA — fast layer */}
          <m.div className="mt-5" style={{ opacity: textOpacity, y: textY }}>
            <p className="max-w-lg text-body-lg leading-relaxed text-black/50">{offer.summary}</p>
            <m.div style={{ opacity: ctaOpacity }} className="mt-4">
              <LinkCTA href={offer.link} aria-label={`En savoir plus sur l'offre ${offer.title}`}>
                En savoir plus
              </LinkCTA>
            </m.div>
          </m.div>
        </div>

        {/* Product image — 60%, larger */}
        <m.div
          className={`relative w-[60%] ${isEven ? 'order-2' : 'order-1'}`}
          style={{ opacity: imageOpacity, y: imageY, rotate: imageRotate, scale: imageScale }}
        >
          <img
            src={offer.image}
            alt={offer.title}
            className="h-auto w-full object-contain"
            loading="lazy"
          />
        </m.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile — stacked editorial cards
// ---------------------------------------------------------------------------

function OfferMobileBlock({
  offer,
  index,
}: {
  offer: (typeof HOMEPAGE_OFFERS)[number];
  index: number;
}) {
  const number = String(index + 1).padStart(2, '0');
  return (
    <article className="py-12 lg:hidden">
      <div className="px-container-x">
        <SimpleAnimation type="slide-up" delay={0}>
          <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-black/30">
            {number} / {String(OFFER_COUNT).padStart(2, '0')}
          </span>
          <h3 className="text-subtitle text-title-sm text-black">{offer.catchphrase}</h3>
        </SimpleAnimation>
      </div>

      <div className="mt-6 px-container-x">
        <SimpleAnimation type="fade" delay={100}>
          <img
            src={offer.image}
            alt={offer.title}
            className="h-auto w-full object-contain"
            loading="lazy"
          />
        </SimpleAnimation>
      </div>

      <div className="mt-6 px-container-x">
        <SimpleAnimation type="slide-up" delay={200}>
          <p className="text-body-lg leading-relaxed text-black/50">{offer.summary}</p>
          <LinkCTA
            href={offer.link}
            className="mt-4"
            aria-label={`En savoir plus sur l'offre ${offer.title}`}
          >
            En savoir plus
          </LinkCTA>
        </SimpleAnimation>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Background pattern with scroll-driven fade-in
// ---------------------------------------------------------------------------

function PatternBackground({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0.0, 0.08], [0, 0.4]);

  return (
    <m.div
      className="pointer-events-none sticky top-0 z-0 -mb-[100vh] flex h-screen items-center justify-center"
      style={{ opacity }}
      aria-hidden="true"
    >
      <img src={motifBlancUrl} alt="" className="h-[140%] w-[140%] max-w-none object-contain" />
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function HomeOffers() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={sectionRef}
      id="offers"
      className="relative w-full bg-accent"
      aria-labelledby="offers-title"
      data-navbar-theme="dark"
    >
      {/* Background pattern — sticky, fades in once, stays for whole section */}
      {!prefersReducedMotion && <PatternBackground scrollYProgress={scrollYProgress} />}

      {/* Section title */}
      <div className="relative z-10 mx-auto max-w-container px-container-x pb-4 pt-section">
        <SimpleAnimation type="slide-up" delay={0}>
          <h2 id="offers-title" className="heading-section text-black">
            {HOMEPAGE_SECTIONS.offers.title}
          </h2>
        </SimpleAnimation>
      </div>

      {/* Offers — editorial longform */}
      <div className="relative z-10">
        {HOMEPAGE_OFFERS.map((offer, index) =>
          prefersReducedMotion ? (
            <OfferMobileBlock key={offer.id} offer={offer} index={index} />
          ) : (
            <div key={offer.id}>
              <OfferBlock offer={offer} index={index} />
              <OfferMobileBlock offer={offer} index={index} />
            </div>
          ),
        )}
      </div>

      {/* CTA global */}
      <div className="relative z-10 mx-auto max-w-container px-container-x pb-section pt-8 text-center lg:pt-4">
        <SimpleAnimation type="slide-up" delay={200}>
          <LinkCTA
            href={HOMEPAGE_SECTIONS.offers.cta.link}
            aria-label={HOMEPAGE_SECTIONS.offers.cta.ariaLabel}
          >
            {HOMEPAGE_SECTIONS.offers.cta.text}
          </LinkCTA>
        </SimpleAnimation>
      </div>
    </section>
  );
}

export default HomeOffers;
