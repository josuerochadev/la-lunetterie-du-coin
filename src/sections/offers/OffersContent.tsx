import { type ReactNode, useRef } from 'react';
import { m, useTransform, useSpring, useScroll, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
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
    <div ref={ref} className="hidden lg:block" style={{ height: '500vh' }}>
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
// Mobile — scroll-driven animated
// ---------------------------------------------------------------------------

function OfferMobileBlock({ offer, index }: { offer: OfferData; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // ── Photo: clipPath reveal from bottom + scale + Y parallax ──
  const clipRaw = useTransform(scrollYProgress, [0.0, 0.25], [100, 0]);
  const clipSmooth = useSpring(clipRaw, SPRING_CONFIG);
  const clipPath = useTransform(clipSmooth, (v: number) => `inset(0 0 ${v}% 0)`);
  const imgScale = useTransform(scrollYProgress, [0.0, 0.25], [1.06, 1]);
  const imgY = useTransform(scrollYProgress, [0.0, 0.5], ['-3%', '3%']);

  // ── Dark gradient overlay ──
  const overlayOpacity = useTransform(scrollYProgress, [0.0, 0.25], [0, 0.35]);

  // ── Counter ──
  const counterOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);

  // ── Title (catchphrase) ──
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.26], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.1, 0.26], [25, 0]);
  const titleScale = useTransform(scrollYProgress, [0.1, 0.26], [0.96, 1]);

  // ── Description ──
  const descOpacity = useTransform(scrollYProgress, [0.16, 0.3], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.16, 0.3], [20, 0]);

  // ── Details list ──
  const detailsOpacity = useTransform(scrollYProgress, [0.22, 0.35], [0, 1]);
  const detailsY = useTransform(scrollYProgress, [0.22, 0.35], [15, 0]);

  // ── Conditions box ──
  const condOpacity = useTransform(scrollYProgress, [0.28, 0.4], [0, 1]);
  const condY = useTransform(scrollYProgress, [0.28, 0.4], [15, 0]);

  // ── CTA ──
  const ctaOpacity = useTransform(scrollYProgress, [0.33, 0.45], [0, 1]);

  // ── Accent separator line (skip first) ──
  const separatorScaleX = useTransform(scrollYProgress, [0.0, 0.18], [0, 1]);

  return (
    <article ref={ref} className="relative">
      {/* Accent separator line between offers */}
      {index > 0 && (
        <m.div
          className="mx-auto mb-12 h-px w-full origin-left bg-black/15 will-change-transform"
          style={{ scaleX: separatorScaleX }}
          aria-hidden="true"
        />
      )}

      {/* Photo with clipPath reveal */}
      <m.div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-sm will-change-[clip-path]"
        style={{ clipPath }}
      >
        <m.img
          src={offer.image}
          alt={offer.title}
          className="h-full w-full object-cover will-change-transform"
          style={{ scale: imgScale, y: imgY }}
          loading="lazy"
        />
        {/* Dark gradient overlay */}
        <m.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      </m.div>

      {/* Content */}
      <div className="mt-6 space-y-4">
        {/* Counter */}
        <m.span
          className="block text-body-sm font-medium uppercase tracking-widest text-black will-change-transform"
          style={{ opacity: counterOpacity }}
        >
          {String(index + 1).padStart(2, '0')} / {String(OFFER_COUNT).padStart(2, '0')}
        </m.span>

        {/* Title */}
        <m.h3
          className="text-subtitle text-title-sm text-black will-change-transform"
          style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
        >
          {offer.catchphrase}
        </m.h3>

        {/* Description */}
        <m.p
          className="text-body-lg text-black will-change-transform"
          style={{ opacity: descOpacity, y: descY }}
        >
          {offer.description}
        </m.p>

        {/* Details list */}
        <m.ul
          className="grid grid-cols-1 gap-y-2 will-change-transform sm:grid-cols-2 sm:gap-x-6"
          style={{ opacity: detailsOpacity, y: detailsY }}
        >
          {offer.details.map((detail, i) => (
            <li key={i} className="flex gap-2.5 text-body-sm text-black">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-orange"
                aria-hidden="true"
              />
              <span>{detail}</span>
            </li>
          ))}
        </m.ul>

        {/* Conditions box */}
        <m.div
          className="group/cond relative overflow-hidden rounded-r-2xl bg-black/[0.04] will-change-transform"
          style={{ opacity: condOpacity, y: condY }}
        >
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
        </m.div>

        {/* CTA */}
        <m.div style={{ opacity: ctaOpacity }} className="will-change-transform">
          <LinkCTA to="/contact" theme="light" aria-label={`Profiter de ${offer.title}`}>
            En profiter
          </LinkCTA>
        </m.div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Mobile animated wrapper
// ---------------------------------------------------------------------------

function OffersMobileAnimated() {
  const titleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: titleProgress } = useScroll({
    target: titleRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div className="mx-auto max-w-container px-container-x py-section lg:hidden">
      <div ref={titleRef} className="mb-12">
        <ScrollWordReveal
          as="h2"
          scrollYProgress={titleProgress}
          revealStart={0.0}
          revealEnd={0.2}
          className="heading-section text-black"
        >
          NOS OFFRES
        </ScrollWordReveal>
      </div>

      <div className="flex flex-col gap-16">
        {OFFERS_DATA.map((offer, index) => (
          <OfferMobileBlock key={offer.id} offer={offer} index={index} />
        ))}
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
