import { type ReactNode } from 'react';
import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import {
  OFFER_COUNT,
  OFFERS_TIMELINE,
  BLACK_FADE_START,
  BLACK_FADE_END,
  STAGGER_OFFSET,
} from './OffersContent.timeline';

import LinkCTA from '@/components/common/LinkCTA';
import { OFFERS_DATA, type OfferData } from '@/data/offers';
import { useFadeInOut } from '@/hooks/useFadeInOut';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG } from '@/lib/motion';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';

// ---------------------------------------------------------------------------
// StaggerChild — micro-delayed entrance for each element within a card
// ---------------------------------------------------------------------------

function StaggerChild({
  children,
  scrollYProgress,
  enterStart,
  enterEnd,
  exitStart,
  exitEnd,
  staggerIndex,
}: {
  children: ReactNode;
  scrollYProgress: MotionValue<number>;
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
  staggerIndex: number;
}) {
  const offset = staggerIndex * STAGGER_OFFSET;

  const opacity = useFadeInOut(
    scrollYProgress,
    enterStart + offset,
    enterEnd + offset,
    exitStart - offset,
    exitEnd,
  );

  const yRaw = useTransform(scrollYProgress, [enterStart + offset, enterEnd + offset], [25, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  return (
    <m.div style={{ opacity, y }} className="will-change-transform">
      {children}
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Offer card sub-component (extracted to avoid hooks in map)
// ---------------------------------------------------------------------------

function OfferCard({
  offer,
  index,
  scrollYProgress,
}: {
  offer: OfferData;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const tl = OFFERS_TIMELINE[index];

  // Card entrance/exit
  const cardOpacity = useTransform(
    scrollYProgress,
    [tl.cardIn[0], tl.cardIn[1], tl.cardOut[0], tl.cardOut[1]],
    [0, 1, 1, 0],
  );
  const cardYRaw = useTransform(
    scrollYProgress,
    [tl.cardIn[0], tl.cardIn[1], tl.cardOut[0], tl.cardOut[1]],
    [100, 0, 0, -80],
  );
  const cardY = useSpring(cardYRaw, SPRING_CONFIG);

  // Peel-away direction: first peels left, second peels right
  const peelDir = index === 0 ? -1 : 1;
  const cardRotate = useTransform(
    scrollYProgress,
    [tl.cardOut[0], tl.cardOut[1]],
    [0, peelDir * 6],
  );
  const cardX = useTransform(scrollYProgress, [tl.cardOut[0], tl.cardOut[1]], [0, peelDir * 120]);
  const cardScale = useTransform(
    scrollYProgress,
    [tl.cardIn[0], tl.cardIn[1], tl.cardOut[0], tl.cardOut[1]],
    [0.92, 1, 1, 0.9],
  );
  const cardPointer = usePointerEvents(cardOpacity);

  // Stagger timing
  const stEnter = tl.cardIn[0];
  const stEnterEnd = tl.cardIn[1];
  const stExitStart = tl.cardOut[0];
  const stExitEnd = tl.cardOut[1];

  return (
    <m.div
      className="absolute inset-x-0 top-1/2 mx-auto w-full max-w-2xl xl:max-w-3xl 3xl:max-w-4xl 4xl:max-w-5xl"
      style={{
        opacity: cardOpacity,
        y: cardY,
        x: cardX,
        rotate: cardRotate,
        scale: cardScale,
        pointerEvents: cardPointer,
        translateY: '-50%',
      }}
    >
      <div className="group/card relative overflow-hidden rounded-r-2xl bg-white/90 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.2)]">
        {/* Blue pierre accent bar */}
        <div
          className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue transition-all duration-300 ease-out group-hover/card:w-2.5"
          aria-hidden="true"
        />

        <div className="relative z-10 px-8 py-8 xl:px-10 xl:py-10 4xl:px-14 4xl:py-14">
          {/* Counter */}
          <StaggerChild
            scrollYProgress={scrollYProgress}
            enterStart={stEnter}
            enterEnd={stEnterEnd}
            exitStart={stExitStart}
            exitEnd={stExitEnd}
            staggerIndex={0}
          >
            <span className="mb-3 block text-body-sm font-medium uppercase tracking-widest text-black">
              {String(index + 1).padStart(2, '0')} / {String(OFFER_COUNT).padStart(2, '0')}
            </span>
          </StaggerChild>

          {/* Title — black */}
          <StaggerChild
            scrollYProgress={scrollYProgress}
            enterStart={stEnter}
            enterEnd={stEnterEnd}
            exitStart={stExitStart}
            exitEnd={stExitEnd}
            staggerIndex={1}
          >
            <h3 className="text-subtitle mb-5 text-title-sm text-black">{offer.catchphrase}</h3>
          </StaggerChild>

          {/* Description */}
          <StaggerChild
            scrollYProgress={scrollYProgress}
            enterStart={stEnter}
            enterEnd={stEnterEnd}
            exitStart={stExitStart}
            exitEnd={stExitEnd}
            staggerIndex={2}
          >
            <p className="mb-6 text-body-lg !leading-[1.35] text-black">{offer.description}</p>
          </StaggerChild>

          {/* Details — 2 columns grid with orange bullets */}
          <StaggerChild
            scrollYProgress={scrollYProgress}
            enterStart={stEnter}
            enterEnd={stEnterEnd}
            exitStart={stExitStart}
            exitEnd={stExitEnd}
            staggerIndex={3}
          >
            <ul className="mb-6 space-y-2">
              {offer.details.slice(0, 6).map((detail, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 text-body !leading-[1.2] text-black"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 self-start rounded-full bg-secondary-orange"
                    aria-hidden="true"
                  />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </StaggerChild>

          {/* CTA */}
          <StaggerChild
            scrollYProgress={scrollYProgress}
            enterStart={stEnter}
            enterEnd={stEnterEnd}
            exitStart={stExitStart}
            exitEnd={stExitEnd}
            staggerIndex={4}
          >
            <LinkCTA to="/contact" theme="light" aria-label={`Profiter de ${offer.title}`}>
              En profiter
            </LinkCTA>
          </StaggerChild>
        </div>
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Full-bleed background photo with crossfade (clipPath volet like Services)
// ---------------------------------------------------------------------------

function BackgroundPhotos({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const tl0 = OFFERS_TIMELINE[0];
  const tl1 = OFFERS_TIMELINE[1];

  // First photo: fade in at start, stays visible until second reveals on top
  const photo1Opacity = useTransform(
    scrollYProgress,
    [tl0.imgIn[0], tl0.imgIn[1], tl1.imgOut[0], tl1.imgOut[1]],
    [0, 1, 1, 0],
  );
  const photo1Scale = useTransform(
    scrollYProgress,
    [tl0.imgIn[0], tl0.hold[1], tl0.imgOut[1]],
    [1.05, 1, 0.98],
  );

  // Second photo: clipPath volet reveal from bottom (like Services PhotoReveal)
  const clipRaw = useTransform(scrollYProgress, [tl1.imgIn[0], tl1.imgIn[1]], [100, 0]);
  const clipSmooth = useSpring(clipRaw, SPRING_CONFIG);
  const clipPath = useTransform(clipSmooth, (v: number) => `inset(${v}% 0 0 0)`);
  const photo2Scale = useTransform(
    scrollYProgress,
    [tl1.imgIn[0], tl1.hold[1], tl1.imgOut[1]],
    [1.05, 1, 0.98],
  );

  // Fade to black after second offer
  const blackOpacity = useTransform(scrollYProgress, [BLACK_FADE_START, BLACK_FADE_END], [0, 1]);

  return (
    <>
      {/* Photo 1 — base layer */}
      <m.div className="absolute inset-0" style={{ opacity: photo1Opacity, scale: photo1Scale }}>
        <img
          src={OFFERS_DATA[0].image}
          alt={OFFERS_DATA[0].title}
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* Dark overlay for card legibility */}
        <div className="absolute inset-0 bg-black/40" />
      </m.div>

      {/* Photo 2 — clipPath volet reveal on top */}
      <m.div className="absolute inset-0" style={{ clipPath, scale: photo2Scale }}>
        <img
          src={OFFERS_DATA[1].image}
          alt={OFFERS_DATA[1].title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay for card legibility */}
        <div className="absolute inset-0 bg-black/40" />
      </m.div>

      {/* Fade-to-black layer — covers everything after second offer */}
      <m.div
        className="absolute inset-0 bg-black"
        style={{ opacity: blackOpacity }}
        aria-hidden="true"
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Desktop
// ---------------------------------------------------------------------------

export default function OffersDesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  return (
    <div ref={ref} className="hidden xl:block" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Full-bleed photo layer */}
        <div className="absolute inset-0 z-0">
          <BackgroundPhotos scrollYProgress={scrollYProgress} />
        </div>

        {/* Card layer — centered */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative w-full">
            {OFFERS_DATA.map((offer, i) => (
              <OfferCard key={offer.id} offer={offer} index={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
