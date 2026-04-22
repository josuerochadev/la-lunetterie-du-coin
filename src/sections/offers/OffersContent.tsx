import OffersDesktop from './OffersDesktop';
import OffersMobileAnimated from './OffersMobile';
import OfferStaticBlock from './OffersStatic';

import { ConvexDome } from '@/components/common/ConvexDome';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { OFFERS_DATA } from '@/data/offers';
import { ACCENT_HEX } from '@/config/design';

export default function OffersContent() {
  const variant = useResponsiveMotion();

  return (
    <section
      id="offers-content"
      className="relative"
      style={{
        background: 'linear-gradient(to bottom, transparent 12vw, #000 12vw)',
      }}
      data-navbar-theme="light"
    >
      <ConvexDome color="black" />

      {variant === 'desktop-animated' && <OffersDesktop />}
      {variant === 'mobile-animated' && <OffersMobileAnimated />}
      {variant === 'static' && (
        <div className="mx-auto max-w-container px-container-x py-section">
          {OFFERS_DATA.map((offer, index) => (
            <OfferStaticBlock key={offer.id} offer={offer} index={index} />
          ))}
        </div>
      )}

      {/* Bottom gradient dissolve — black → accent for CTA transition */}
      <div
        className="pointer-events-none relative z-[1] h-[65vh]"
        style={{
          background: [
            'linear-gradient(to bottom,',
            'black 0%,',
            `color-mix(in srgb, ${ACCENT_HEX} 5%, black) 14%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 14%, black) 28%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 28%, black) 42%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 45%, black) 56%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 65%, black) 70%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 80%, black) 82%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 92%, black) 92%,`,
            `${ACCENT_HEX} 100%)`,
          ].join(' '),
        }}
        aria-hidden="true"
      />
    </section>
  );
}
