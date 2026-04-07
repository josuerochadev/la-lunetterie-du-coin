import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import ResponsiveImage from '@/components/common/ResponsiveImage';
import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_OFFERS } from '@/data/homepage';

const OFFER_COUNT = HOMEPAGE_OFFERS.length;

export function OfferMobileBlock({
  offer,
  index,
}: {
  offer: (typeof HOMEPAGE_OFFERS)[number];
  index: number;
}) {
  const number = String(index + 1).padStart(2, '0');
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // ── Image — scale entrance + fade ──
  const imgScale = useTransform(scrollYProgress, [0, 0.3], [0.92, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const imgY = useTransform(scrollYProgress, [0, 0.5], ['3%', '-3%']);

  // ── Card — slide up from below ──
  const cardY = useTransform(scrollYProgress, [0.1, 0.32], [50, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0.1, 0.28], [0, 1]);

  // ── Card internals — micro-stagger ──
  const titleOpacity = useTransform(scrollYProgress, [0.16, 0.3], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.16, 0.3], [12, 0]);
  const descOpacity = useTransform(scrollYProgress, [0.2, 0.34], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.2, 0.34], [12, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.24, 0.38], [0, 1]);

  // ── Blue accent bar — scales from bottom to top ──
  const barScaleY = useTransform(scrollYProgress, [0.12, 0.34], [0, 1]);

  return (
    <article ref={ref} className="py-10 lg:hidden">
      {/* Image with scale entrance */}
      <div className="px-container-x">
        <m.div style={{ scale: imgScale, opacity: imgOpacity, y: imgY }}>
          <ResponsiveImage
            src={offer.image}
            alt={offer.title}
            className="h-auto w-full object-contain"
            loading="lazy"
            sizes="(min-width: 768px) 50vw, 100vw"
            widths={[384, 640, 768]}
          />
        </m.div>
      </div>

      {/* Card with scroll-driven slide-up + internal stagger */}
      <div className="mt-6 px-container-x">
        <m.div style={{ y: cardY, opacity: cardOpacity }}>
          <div className="relative overflow-hidden rounded-r-2xl bg-black">
            <m.div
              className="absolute bottom-0 left-0 top-0 w-1.5 origin-bottom bg-secondary-blue"
              style={{ scaleY: barScaleY }}
              aria-hidden="true"
            />
            <div className="relative z-10 px-6 py-8">
              <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-white">
                {number} / {String(OFFER_COUNT).padStart(2, '0')}
              </span>
              <m.h3
                className="text-subtitle text-title-sm text-accent"
                style={{ opacity: titleOpacity, y: titleY }}
              >
                {offer.catchphrase}
              </m.h3>
              <m.p
                className="mt-3 text-body-lg text-white"
                style={{ opacity: descOpacity, y: descY }}
              >
                {offer.summary}
              </m.p>
              <m.div style={{ opacity: ctaOpacity }}>
                <LinkCTA
                  href={offer.link}
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
      </div>
    </article>
  );
}
