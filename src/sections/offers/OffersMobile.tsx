import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';

import {
  OFFER_COUNT,
  SLICE,
  ENTER_OFFSET,
  ENTER_DUR,
  TEXT_COUNTER,
  TEXT_TITLE,
  TEXT_DESC,
  TEXT_DETAILS,
  TEXT_CONDITIONS,
  TEXT_CTA,
  TEXT_STAGGER,
  EXIT_START,
  EXIT_END,
} from './OffersContent.timeline';

import LinkCTA from '@/components/common/LinkCTA';
import { OFFERS_DATA, type OfferData } from '@/data/offers';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG } from '@/lib/motion';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';

// ---------------------------------------------------------------------------
// Progress bar segment
// ---------------------------------------------------------------------------

function OfferProgressSegment({
  progress,
  segStart,
  segEnd,
  index,
}: {
  progress: MotionValue<number>;
  segStart: number;
  segEnd: number;
  index: number;
}) {
  const fill = useTransform(progress, [segStart, segEnd], [0, 100]);
  const clampedFill = useTransform(fill, (v) => `${Math.max(0, Math.min(100, v))}%`);

  const segOpacity = useTransform(progress, (p) => {
    if (p >= segStart && p < segEnd) return 1;
    if (p >= segEnd) return 0.7;
    return 0.35;
  });

  return (
    <m.div
      className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-orange/20"
      style={{ opacity: segOpacity }}
    >
      <m.div
        className="absolute inset-y-0 left-0 rounded-full bg-orange"
        style={{ width: clampedFill }}
      />
      <span className="sr-only">
        Offre {index + 1} sur {OFFER_COUNT}
      </span>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function OfferProgressBar({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lastSliceStart = (OFFER_COUNT - 1) * SLICE;
  const barOpacity = useTransform(
    scrollYProgress,
    [lastSliceStart + EXIT_START, lastSliceStart + EXIT_END],
    [1, 0],
  );

  return (
    <m.div
      className="absolute inset-x-0 bottom-0 z-30 flex items-center gap-3 px-container-x pb-8"
      style={{ opacity: barOpacity }}
      aria-hidden="true"
    >
      {OFFERS_DATA.map((_, i) => (
        <OfferProgressSegment
          key={i}
          index={i}
          progress={progress}
          segStart={i / OFFER_COUNT}
          segEnd={(i + 1) / OFFER_COUNT}
        />
      ))}
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Single offer slide
// ---------------------------------------------------------------------------

function OfferSlide({
  offer,
  index,
  scrollYProgress,
}: {
  offer: OfferData;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const s = index * SLICE;

  // ── Photo entrance — opacity crossfade ──
  const enterStart = Math.max(0, s - ENTER_OFFSET);
  const enterEnd = s + ENTER_DUR - ENTER_OFFSET;
  const photoOpacity = useTransform(scrollYProgress, [enterStart, enterEnd], [0, 1]);

  // Ken Burns zoom
  const photoScaleRaw = useTransform(scrollYProgress, [s, s + EXIT_START], [1, 1.08]);
  const photoScale = useSpring(photoScaleRaw, SPRING_CONFIG);

  // ── Text stagger entrance ──
  const counterOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_COUNTER, s + TEXT_COUNTER + TEXT_STAGGER],
    [0, 1],
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_TITLE, s + TEXT_TITLE + TEXT_STAGGER],
    [0, 1],
  );
  const titleYRaw = useTransform(
    scrollYProgress,
    [s + TEXT_TITLE, s + TEXT_TITLE + TEXT_STAGGER],
    [25, 0],
  );
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  const descOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_DESC, s + TEXT_DESC + TEXT_STAGGER],
    [0, 1],
  );
  const descYRaw = useTransform(
    scrollYProgress,
    [s + TEXT_DESC, s + TEXT_DESC + TEXT_STAGGER],
    [20, 0],
  );
  const descY = useSpring(descYRaw, SPRING_CONFIG);

  const detailsOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_DETAILS, s + TEXT_DETAILS + TEXT_STAGGER],
    [0, 1],
  );

  const condOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_CONDITIONS, s + TEXT_CONDITIONS + TEXT_STAGGER],
    [0, 1],
  );

  const ctaOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_CTA, s + TEXT_CTA + TEXT_STAGGER],
    [0, 1],
  );

  // ── Exit — fade out + slide up ──
  const exitOpacity = useTransform(scrollYProgress, [s + EXIT_START, s + EXIT_END], [1, 0]);
  const exitYRaw = useTransform(scrollYProgress, [s + EXIT_START, s + EXIT_END], [0, -30]);
  const exitY = useSpring(exitYRaw, SPRING_CONFIG);

  // ── Combined visibility ──
  const slideOpacity = useTransform(
    [photoOpacity, exitOpacity] as const,
    ([enter, exit]: number[]) => Math.min(enter, exit),
  );
  const slidePointerEvents = usePointerEvents(slideOpacity);

  return (
    <m.div
      className="absolute inset-0 will-change-[opacity]"
      style={{ opacity: slideOpacity, pointerEvents: slidePointerEvents }}
    >
      {/* Full-viewport photo */}
      <m.img
        src={offer.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        loading={index === 0 ? 'eager' : 'lazy'}
        style={{ scale: photoScale }}
      />

      {/* Gradient overlays for text readability */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[30%]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%]"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Text content — anchored to bottom */}
      <m.div
        className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end px-container-x pb-16"
        style={{ y: exitY }}
      >
        {/* Blur scrim — behind text */}
        <div
          className="pointer-events-none absolute inset-0 -top-8 z-0 backdrop-blur-[6px]"
          style={{
            mask: 'linear-gradient(to bottom, transparent 0%, black 25%)',
            WebkitMask: 'linear-gradient(to bottom, transparent 0%, black 25%)',
          }}
          aria-hidden="true"
        />
        {/* Text wrapper — above blur scrim */}
        <div className="relative z-10 flex flex-col items-start">
          {/* Counter */}
          <m.span
            className="mb-3 block text-body font-medium uppercase tracking-widest text-white/70"
            style={{ opacity: counterOpacity }}
          >
            {String(index + 1).padStart(2, '0')} / {String(OFFER_COUNT).padStart(2, '0')}
          </m.span>

          {/* Title */}
          <m.h3
            className="text-subtitle mb-3 text-title-sm text-white sm:mb-4"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            {offer.catchphrase}
          </m.h3>

          {/* Description */}
          <m.p
            className="mb-4 text-body leading-snug text-white/85 sm:mb-5 sm:text-body-lg sm:leading-relaxed"
            style={{ opacity: descOpacity, y: descY }}
          >
            {offer.description}
          </m.p>

          {/* Details list */}
          <m.ul
            className="mb-4 grid grid-cols-1 gap-y-1.5 sm:mb-5 sm:grid-cols-2 sm:gap-x-6"
            style={{ opacity: detailsOpacity }}
          >
            {offer.details.slice(0, 6).map((detail, i) => (
              <li key={i} className="flex gap-2 text-body-sm text-white/70 sm:text-body">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary-orange"
                  aria-hidden="true"
                />
                <span>{detail}</span>
              </li>
            ))}
          </m.ul>

          {/* Conditions disclosure — collapsed by default to fit short viewports */}
          <m.div className="mb-4 w-full sm:mb-5" style={{ opacity: condOpacity }}>
            <details className="group border-l-2 border-secondary-blue/40 pl-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-body font-medium text-white marker:hidden [&::-webkit-details-marker]:hidden">
                <span>Conditions</span>
                <ChevronDown
                  className="h-4 w-4 text-secondary-orange transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <ul className="mt-3 space-y-1.5 text-body-sm text-white/85">
                {offer.conditions.map((condition, i) => (
                  <li key={i}>{condition}</li>
                ))}
              </ul>
            </details>
          </m.div>

          {/* CTA */}
          <m.div style={{ opacity: ctaOpacity }}>
            <LinkCTA to="/contact" theme="dark" aria-label={`Profiter de ${offer.title}`}>
              En profiter
            </LinkCTA>
          </m.div>
        </div>
      </m.div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Mobile animated wrapper — sticky slideshow
// ---------------------------------------------------------------------------

export default function OffersMobileAnimated() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  return (
    <div ref={ref} className="xl:hidden" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-svh overflow-hidden bg-black">
        {/* Offer slides (layered, crossfading) */}
        <div className="absolute inset-0 z-10">
          {OFFERS_DATA.map((offer, i) => (
            <OfferSlide key={offer.id} offer={offer} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        {/* Progress bar */}
        <OfferProgressBar scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
