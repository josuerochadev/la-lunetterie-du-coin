import { useRef, type ReactNode } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { OFFERS_DATA, type OfferData } from '@/data/offers';

const ACCENT_HEX = '#FEEB09';
const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
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

  const fadeIn = useTransform(scrollYProgress, [enterStart + offset, enterEnd + offset], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [exitStart - offset, exitEnd], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));

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
  const cardPointer = useTransform(cardOpacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));

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
      <div className="group/card relative overflow-hidden rounded-r-3xl bg-white/90 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.2)]">
        {/* Blue pierre accent bar */}
        <div
          className="absolute bottom-0 left-0 top-0 w-2.5 bg-secondary-blue transition-all duration-300 ease-out group-hover/card:w-3.5"
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
            <span className="mb-3 block text-body-sm font-medium uppercase tracking-widest text-black/30">
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
            <h3
              className="text-heading mb-4 text-black"
              style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)', lineHeight: '1.1' }}
            >
              {offer.catchphrase}
            </h3>
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
            <p className="mb-6 max-w-md text-body leading-relaxed text-black/50">
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
                <li key={i} className="flex gap-2 text-body-sm text-black/40">
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={sectionRef} className="hidden lg:block" style={{ height: '500vh' }}>
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
// Mobile
// ---------------------------------------------------------------------------

function MobileOfferBlock({ offer, index }: { offer: OfferData; index: number }) {
  return (
    <article className="py-10">
      <SimpleAnimation type="fade" delay={0}>
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm">
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
          <span className="text-body-sm font-medium uppercase tracking-widest text-black/30">
            {String(index + 1).padStart(2, '0')} / {String(OFFER_COUNT).padStart(2, '0')}
          </span>
          <h3 className="text-subtitle text-title-sm text-black">{offer.catchphrase}</h3>
          <p className="text-body-lg text-black/50">{offer.description}</p>

          <div className="border border-black/10 p-5">
            <ul className="space-y-2">
              {offer.details.map((detail, i) => (
                <li key={i} className="flex gap-3 text-body-sm text-black/40">
                  <span className="text-black" aria-hidden="true">
                    •
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-l-4 border-black/20 bg-black/5 p-4">
            <h4 className="mb-2 text-body-sm font-medium text-black/60">Conditions</h4>
            <ul className="space-y-1">
              {offer.conditions.map((condition, i) => (
                <li key={i} className="text-body-sm text-black/30">
                  {condition}
                </li>
              ))}
            </ul>
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

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

      {/* Desktop */}
      {!prefersReducedMotion && isLg && <OffersDesktop />}

      {/* Mobile / reduced-motion */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="mx-auto max-w-container px-container-x py-section">
          {OFFERS_DATA.map((offer, index) => (
            <MobileOfferBlock key={offer.id} offer={offer} index={index} />
          ))}
        </div>
      </div>

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
