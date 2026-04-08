import { type ReactNode } from 'react';
import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { OFFERS_DATA, type OfferData } from '@/data/offers';
import { ACCENT_HEX } from '@/config/design';
import { useFadeInOut } from '@/hooks/useFadeInOut';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG } from '@/lib/motion';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
const OFFER_COUNT = OFFERS_DATA.length;

// Per-offer scroll windows (normalised 0–1)
// Phase layout:  photo1 + card1  →  photo2 + card2  →  fade-to-black
const OFFERS_TIMELINE = [
  {
    imgIn: [0.0, 0.08],
    hold: [0.08, 0.38],
    imgOut: [0.38, 0.48],
    cardIn: [0.06, 0.16],
    cardOut: [0.38, 0.46],
  },
  {
    imgIn: [0.46, 0.54],
    hold: [0.54, 0.76],
    imgOut: [0.76, 0.86],
    cardIn: [0.5, 0.6],
    cardOut: [0.76, 0.84],
  },
] as const;

// Fade-to-black after second offer (transition to gradient → CTA)
const BLACK_FADE_START = 0.84;
const BLACK_FADE_END = 0.96;

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
  const STAGGER_OFFSET = 0.012;
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
      className="absolute inset-x-0 top-1/2 mx-auto w-full max-w-xl xl:max-w-2xl"
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

        <div className="relative z-10 px-8 py-8 xl:px-10 xl:py-10">
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
            <h3 className="text-subtitle mb-4 text-title-sm text-black">{offer.catchphrase}</h3>
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
            <p className="mb-6 max-w-md text-body leading-relaxed text-black">
              {offer.description}
            </p>
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
            <ul className="mb-6 grid max-w-lg grid-cols-2 gap-x-5 gap-y-2">
              {offer.details.slice(0, 6).map((detail, i) => (
                <li key={i} className="flex gap-2 text-body-sm text-black">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-orange"
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

function OffersDesktop() {
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

// ---------------------------------------------------------------------------
// Mobile — immersive sticky slideshow (matches Services pattern)
// ---------------------------------------------------------------------------

// ── Scroll budget (normalised 0–1) ─────────────────────────────
const SLICE = 1 / OFFER_COUNT; // 0.50 per offer

// ── Per-slide phase offsets (relative to slice start) ───────────
const ENTER_OFFSET = 0.02;
const ENTER_DUR = 0.04;
const TEXT_COUNTER = 0.04;
const TEXT_TITLE = 0.06;
const TEXT_DESC = 0.09;
const TEXT_DETAILS = 0.12;
const TEXT_CONDITIONS = 0.15;
const TEXT_CTA = 0.18;
const TEXT_STAGGER = 0.04;
const EXIT_START = 0.4;
const EXIT_END = SLICE;

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

  return (
    <m.div className="absolute inset-0 will-change-[opacity]" style={{ opacity: slideOpacity }}>
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
            className="text-subtitle mb-4 text-title-sm text-white"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            {offer.catchphrase}
          </m.h3>

          {/* Description */}
          <m.p
            className="mb-5 text-body-lg leading-relaxed text-white/85"
            style={{ opacity: descOpacity, y: descY }}
          >
            {offer.description}
          </m.p>

          {/* Details list */}
          <m.ul
            className="mb-5 grid grid-cols-1 gap-y-1.5 sm:grid-cols-2 sm:gap-x-6"
            style={{ opacity: detailsOpacity }}
          >
            {offer.details.slice(0, 6).map((detail, i) => (
              <li key={i} className="flex gap-2 text-body text-white/70">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary-orange"
                  aria-hidden="true"
                />
                <span>{detail}</span>
              </li>
            ))}
          </m.ul>

          {/* Conditions box */}
          <m.div
            className="mb-5 border-l-2 border-secondary-blue/40 pl-4"
            style={{ opacity: condOpacity }}
          >
            <h4 className="mb-2 text-body font-medium text-white">Conditions</h4>
            <ul className="space-y-1 text-body text-white/70">
              {offer.conditions.map((condition, i) => (
                <li key={i}>{condition}</li>
              ))}
            </ul>
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

function OffersMobileAnimated() {
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

// ---------------------------------------------------------------------------
// Static fallback (reduced motion)
// ---------------------------------------------------------------------------

function OfferStaticBlock({ offer, index }: { offer: OfferData; index: number }) {
  return (
    <article className="py-10">
      <SimpleAnimation type="fade" delay={0}>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
          <img
            src={offer.image}
            alt={offer.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={150}>
        <div className="mt-6 space-y-4">
          <span className="text-body-sm font-medium uppercase tracking-widest text-black">
            {String(index + 1).padStart(2, '0')} / {String(OFFER_COUNT).padStart(2, '0')}
          </span>
          <h3 className="text-subtitle text-title-sm text-black">{offer.catchphrase}</h3>
          <p className="text-body-lg text-black">{offer.description}</p>

          <ul className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6">
            {offer.details.map((detail, i) => (
              <li key={i} className="flex gap-2.5 text-body-sm text-black">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-orange"
                  aria-hidden="true"
                />
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          <div className="group/cond relative overflow-hidden rounded-r-2xl bg-black/[0.04]">
            <div
              className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue"
              aria-hidden="true"
            />
            <div className="py-4 pl-6 pr-5">
              <h4 className="mb-2 text-body-sm font-medium text-black">Conditions</h4>
              <ul className="space-y-1">
                {offer.conditions.map((condition, i) => (
                  <li key={i} className="text-body-sm text-black">
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <LinkCTA to="/contact" theme="light" aria-label={`Profiter de ${offer.title}`}>
            En profiter
          </LinkCTA>
        </div>
      </SimpleAnimation>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

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
      {/* Convex dome — black dome with transparent corners revealing the hero behind */}
      <svg
        className="pointer-events-none absolute left-0 top-0 z-[1] w-full"
        style={{ height: '12vw' }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,120 Q720,-120 1440,120 Z" fill="#000" />
      </svg>

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
