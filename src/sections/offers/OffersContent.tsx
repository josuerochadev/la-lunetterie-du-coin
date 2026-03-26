import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { OFFERS_DATA, type OfferData } from '@/data/offers';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const OFFER_COUNT = OFFERS_DATA.length;

// Per-offer scroll windows (normalised 0–1)
const OFFERS_TIMELINE = [
  {
    imgIn: [0.02, 0.12],
    hold: [0.12, 0.4],
    imgOut: [0.4, 0.5],
    cardIn: [0.1, 0.2],
    cardOut: [0.4, 0.48],
  },
  {
    imgIn: [0.5, 0.6],
    hold: [0.6, 0.85],
    imgOut: [0.85, 0.95],
    cardIn: [0.56, 0.66],
    cardOut: [0.85, 0.93],
  },
] as const;

// 3D tilt: alternating left/right
const IMAGE_LAYOUT = [
  { x: '-15%', rotateZ: -6, rotateY: 10, rotateX: 6 },
  { x: '15%', rotateZ: 5, rotateY: -10, rotateX: 6 },
] as const;

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

  return (
    <m.div
      className="absolute w-full max-w-2xl px-container-x"
      style={{
        opacity: cardOpacity,
        y: cardY,
        x: cardX,
        rotate: cardRotate,
        scale: cardScale,
        pointerEvents: cardPointer,
      }}
    >
      <div className="group/card relative overflow-hidden rounded-r-3xl bg-white/90 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.2)]">
        {/* Accent bar */}
        <div
          className="absolute bottom-0 left-0 top-0 w-2.5 bg-accent transition-all duration-300 ease-out group-hover/card:w-3.5"
          aria-hidden="true"
        />

        <div className="relative z-10 px-10 py-10 xl:px-14 xl:py-12">
          <h3 className="text-subtitle text-title-sm text-black">{offer.catchphrase}</h3>

          <p className="mt-5 max-w-md text-body-lg text-black/50">{offer.description}</p>

          {/* Key highlights — first 3 details only */}
          <ul className="mt-6 space-y-2">
            {offer.details.slice(0, 3).map((detail, i) => (
              <li key={i} className="flex gap-3 text-body-sm text-black/40">
                <span className="text-black" aria-hidden="true">
                  •
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          <LinkCTA
            to="/contact"
            theme="light"
            className="mt-8"
            aria-label={`Profiter de ${offer.title}`}
          >
            En profiter
          </LinkCTA>
        </div>
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Offer image sub-component (extracted to avoid hooks in map)
// ---------------------------------------------------------------------------

function OfferImage({
  offer,
  index,
  scrollYProgress,
}: {
  offer: OfferData;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const tl = OFFERS_TIMELINE[index];
  const layout = IMAGE_LAYOUT[index];

  const imgOpacity = useTransform(
    scrollYProgress,
    [tl.imgIn[0], tl.imgIn[1], tl.imgOut[0], tl.imgOut[1]],
    [0, 1, 1, 0],
  );
  const imgRotateYRaw = useTransform(
    scrollYProgress,
    [tl.imgIn[0], tl.hold[0]],
    [layout.rotateY + (index === 0 ? 10 : -10), layout.rotateY],
  );
  const imgRotateY = useSpring(imgRotateYRaw, SPRING_CONFIG);
  const imgRotateXRaw = useTransform(
    scrollYProgress,
    [tl.imgIn[0], tl.hold[0]],
    [layout.rotateX + 8, layout.rotateX],
  );
  const imgRotateX = useSpring(imgRotateXRaw, SPRING_CONFIG);
  const imgYRaw = useTransform(scrollYProgress, [tl.imgIn[0], tl.imgOut[1]], [300, -300]);
  const imgY = useSpring(imgYRaw, SPRING_CONFIG);
  const imgScale = useTransform(
    scrollYProgress,
    [tl.imgIn[0], tl.hold[0], tl.imgOut[1]],
    [0.85, 1, 1.04],
  );

  return (
    <m.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity: imgOpacity,
        rotateX: imgRotateX,
        rotateY: imgRotateY,
        y: imgY,
        scale: imgScale,
        rotate: layout.rotateZ,
        x: layout.x,
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d',
      }}
    >
      <img
        src={offer.image}
        alt={offer.title}
        className="h-[200vh] w-auto max-w-none object-contain drop-shadow-2xl"
        loading={index === 0 ? 'eager' : 'lazy'}
      />
    </m.div>
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
    <div ref={sectionRef} className="hidden lg:block" style={{ height: '550vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: '800px' }}>
        {/* Image layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {OFFERS_DATA.map((offer, i) => (
            <OfferImage key={offer.id} offer={offer} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        {/* Card layer */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pt-24">
          {OFFERS_DATA.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} index={i} scrollYProgress={scrollYProgress} />
          ))}
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
        background:
          'linear-gradient(to bottom, transparent 12vw, rgb(var(--color-yellow-rgb)) 12vw)',
      }}
      data-navbar-theme="dark"
    >
      {/* Convex dome — accent dome with transparent corners revealing the hero behind */}
      <svg
        className="pointer-events-none absolute left-0 top-0 z-[1] w-full"
        style={{ height: '12vw' }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,120 Q720,-120 1440,120 Z" fill="rgb(var(--color-yellow-rgb))" />
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
    </section>
  );
}
