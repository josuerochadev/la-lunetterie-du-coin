import { useRef } from 'react';

import { OffersDesktop } from './offers/OffersDesktop';
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
 * Mobile: stacked cards with SimpleAnimation.
 */
function HomeOffers() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();
  const sectionRef = useRef<HTMLElement>(null);

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

      {/* Mobile / reduced-motion — stacked */}
      <div
        className={prefersReducedMotion ? 'pointer-events-auto' : 'pointer-events-auto lg:hidden'}
      >
        <div className="mx-auto max-w-container px-container-x pb-4 pt-section text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2
              id={prefersReducedMotion ? 'offers-title' : undefined}
              className="heading-section text-black"
            >
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
    </section>
  );
}

export default HomeOffers;
