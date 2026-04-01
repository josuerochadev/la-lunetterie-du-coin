import { useRef } from 'react';

import { OffersDesktop } from './offers/OffersDesktop';
import { OffersMobileAnimated } from './offers/OffersMobileAnimated';
import { OfferMobileBlock } from './offers/OfferMobileBlock';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { HOMEPAGE_OFFERS, HOMEPAGE_SECTIONS } from '@/data/homepage';

/**
 * Section HomeOffers — Scrollytelling offer showcase
 *
 * Desktop: sticky viewport with 3D tilted images + card overlays.
 * Mobile-animated: sticky viewport with layered floating images + sequential cards.
 * Reduced-motion: static stacked cards.
 */
function HomeOffers() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();
  const sectionRef = useRef<HTMLElement>(null);

  const isMobileAnimated = !prefersReducedMotion && !isLg;

  return (
    <section
      ref={sectionRef}
      id="offers"
      className="pointer-events-none relative w-full bg-accent"
      aria-labelledby="offers-title"
      data-navbar-theme="dark"
    >
      {/* Desktop — sticky scrollytelling */}
      {!prefersReducedMotion && isLg && <OffersDesktop />}

      {/* Mobile-animated — sticky viewport with layered images + cards */}
      {isMobileAnimated && <OffersMobileAnimated />}

      {/* Reduced-motion — static stacked cards */}
      {prefersReducedMotion && <OffersStatic />}
    </section>
  );
}

/** Static fallback for reduced-motion preference. */
function OffersStatic() {
  return (
    <div className="pointer-events-auto">
      <div className="mx-auto max-w-container px-container-x pb-4 pt-section text-center">
        <SimpleAnimation type="slide-up" delay={0}>
          <h2 id="offers-title" className="heading-section text-black">
            {HOMEPAGE_SECTIONS.offers.title}
          </h2>
        </SimpleAnimation>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {HOMEPAGE_OFFERS.map((offer, index) => (
          <OfferMobileBlock key={offer.id} offer={offer} index={index} />
        ))}
      </div>

      <div className="mx-auto max-w-container px-container-x pb-section pt-8 text-center">
        <SimpleAnimation type="slide-up" delay={200}>
          <LinkCTA
            href={HOMEPAGE_SECTIONS.offers.cta.link}
            aria-label={HOMEPAGE_SECTIONS.offers.cta.ariaLabel}
          >
            {HOMEPAGE_SECTIONS.offers.cta.text}
          </LinkCTA>
        </SimpleAnimation>
      </div>
    </div>
  );
}

export default HomeOffers;
