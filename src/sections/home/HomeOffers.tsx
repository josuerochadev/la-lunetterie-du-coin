import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { HOMEPAGE_OFFERS, HOMEPAGE_SECTIONS } from '@/data/homepage';
import motifJauneUrl from '@/assets/patterns/motif-jaune.svg';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const OFFER_COUNT = HOMEPAGE_OFFERS.length;

// ---------------------------------------------------------------------------
// Scroll budget (fraction of scrollYProgress)
//
//  0.00 – 0.06  Title word-reveal
//  0.06 – 0.18  Image 1 fades in + perspective tilt settles (LEFT)
//  0.18 – 0.38  Image 1 visible, card 1 enters (center, slide-up)
//  0.38 – 0.50  Image 1 fades out + card 1 peels away
//  0.50 – 0.62  Image 2 fades in + perspective tilt settles (RIGHT)
//  0.62 – 0.82  Image 2 visible, card 2 enters
//  0.82 – 0.88  Image 2 fades out + card 2 exits
//  0.86 – 0.96  Outro phrase "UNE PAIRE QUI A DU CHIEN"
//  0.94 – 1.00  Gradient yellow → white
// ---------------------------------------------------------------------------

const SCROLL_HEIGHT_VH = 500; // total scroll budget in vh

// Per-offer scroll windows (normalised 0-1)
const OFFERS_TIMELINE = [
  {
    imgIn: [0.02, 0.12],
    hold: [0.12, 0.34],
    imgOut: [0.34, 0.46],
    cardIn: [0.1, 0.2],
    cardOut: [0.34, 0.44],
  },
  {
    imgIn: [0.46, 0.56],
    hold: [0.56, 0.78],
    imgOut: [0.78, 0.88],
    cardIn: [0.52, 0.62],
    cardOut: [0.78, 0.86],
  },
] as const;

// Image placement: first LEFT, second RIGHT — with strong 3D tilt
const IMAGE_LAYOUT = [
  { x: '-18%', rotateZ: -8, rotateY: 14, rotateX: 8 }, // left-leaning
  { x: '18%', rotateZ: 6, rotateY: -14, rotateX: 8 }, // right-leaning
] as const;

// ---------------------------------------------------------------------------
// Desktop — sticky scrollytelling
// ---------------------------------------------------------------------------

function OffersDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Title — stays visible throughout offers, fades out only for final CTA
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.03, 0.84, 0.89], [0, 1, 1, 0]);

  // --- Image 0 (LEFT) ---
  const img0Opacity = useTransform(
    scrollYProgress,
    [
      OFFERS_TIMELINE[0].imgIn[0],
      OFFERS_TIMELINE[0].imgIn[1],
      OFFERS_TIMELINE[0].imgOut[0],
      OFFERS_TIMELINE[0].imgOut[1],
    ],
    [0, 1, 1, 0],
  );
  // Tilt entrance: starts tilted, settles to layout values
  const img0RotateYRaw = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[0].imgIn[0], OFFERS_TIMELINE[0].hold[0]],
    [IMAGE_LAYOUT[0].rotateY + 10, IMAGE_LAYOUT[0].rotateY],
  );
  const img0RotateY = useSpring(img0RotateYRaw, SPRING_CONFIG);
  const img0RotateXRaw = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[0].imgIn[0], OFFERS_TIMELINE[0].hold[0]],
    [IMAGE_LAYOUT[0].rotateX + 8, IMAGE_LAYOUT[0].rotateX],
  );
  const img0RotateX = useSpring(img0RotateXRaw, SPRING_CONFIG);
  const img0YRaw = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[0].imgIn[0], OFFERS_TIMELINE[0].imgOut[1]],
    [300, -300],
  );
  const img0Y = useSpring(img0YRaw, SPRING_CONFIG);
  const img0Scale = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[0].imgIn[0], OFFERS_TIMELINE[0].hold[0], OFFERS_TIMELINE[0].imgOut[1]],
    [0.85, 1, 1.04],
  );

  // --- Image 1 (RIGHT) ---
  const img1Opacity = useTransform(
    scrollYProgress,
    [
      OFFERS_TIMELINE[1].imgIn[0],
      OFFERS_TIMELINE[1].imgIn[1],
      OFFERS_TIMELINE[1].imgOut[0],
      OFFERS_TIMELINE[1].imgOut[1],
    ],
    [0, 1, 1, 0],
  );
  const img1RotateYRaw = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[1].imgIn[0], OFFERS_TIMELINE[1].hold[0]],
    [IMAGE_LAYOUT[1].rotateY - 10, IMAGE_LAYOUT[1].rotateY],
  );
  const img1RotateY = useSpring(img1RotateYRaw, SPRING_CONFIG);
  const img1RotateXRaw = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[1].imgIn[0], OFFERS_TIMELINE[1].hold[0]],
    [IMAGE_LAYOUT[1].rotateX + 8, IMAGE_LAYOUT[1].rotateX],
  );
  const img1RotateX = useSpring(img1RotateXRaw, SPRING_CONFIG);
  const img1YRaw = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[1].imgIn[0], OFFERS_TIMELINE[1].imgOut[1]],
    [300, -300],
  );
  const img1Y = useSpring(img1YRaw, SPRING_CONFIG);
  const img1Scale = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[1].imgIn[0], OFFERS_TIMELINE[1].hold[0], OFFERS_TIMELINE[1].imgOut[1]],
    [0.85, 1, 1.04],
  );

  // --- Card 0 — enters from below, peels away left ---
  const card0Opacity = useTransform(
    scrollYProgress,
    [
      OFFERS_TIMELINE[0].cardIn[0],
      OFFERS_TIMELINE[0].cardIn[1],
      OFFERS_TIMELINE[0].cardOut[0],
      OFFERS_TIMELINE[0].cardOut[1],
    ],
    [0, 1, 1, 0],
  );
  const card0YRaw = useTransform(
    scrollYProgress,
    [
      OFFERS_TIMELINE[0].cardIn[0],
      OFFERS_TIMELINE[0].cardIn[1],
      OFFERS_TIMELINE[0].cardOut[0],
      OFFERS_TIMELINE[0].cardOut[1],
    ],
    [100, 0, 0, -80],
  );
  const card0Y = useSpring(card0YRaw, SPRING_CONFIG);
  const card0Rotate = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[0].cardOut[0], OFFERS_TIMELINE[0].cardOut[1]],
    [0, -8],
  );
  const card0X = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[0].cardOut[0], OFFERS_TIMELINE[0].cardOut[1]],
    [0, -120],
  );
  const card0Scale = useTransform(
    scrollYProgress,
    [
      OFFERS_TIMELINE[0].cardIn[0],
      OFFERS_TIMELINE[0].cardIn[1],
      OFFERS_TIMELINE[0].cardOut[0],
      OFFERS_TIMELINE[0].cardOut[1],
    ],
    [0.92, 1, 1, 0.9],
  );

  // --- Card 1 — enters from below, peels away right ---
  const card1Opacity = useTransform(
    scrollYProgress,
    [
      OFFERS_TIMELINE[1].cardIn[0],
      OFFERS_TIMELINE[1].cardIn[1],
      OFFERS_TIMELINE[1].cardOut[0],
      OFFERS_TIMELINE[1].cardOut[1],
    ],
    [0, 1, 1, 0],
  );
  const card1YRaw = useTransform(
    scrollYProgress,
    [
      OFFERS_TIMELINE[1].cardIn[0],
      OFFERS_TIMELINE[1].cardIn[1],
      OFFERS_TIMELINE[1].cardOut[0],
      OFFERS_TIMELINE[1].cardOut[1],
    ],
    [100, 0, 0, -80],
  );
  const card1Y = useSpring(card1YRaw, SPRING_CONFIG);
  const card1Rotate = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[1].cardOut[0], OFFERS_TIMELINE[1].cardOut[1]],
    [0, 6],
  );
  const card1X = useTransform(
    scrollYProgress,
    [OFFERS_TIMELINE[1].cardOut[0], OFFERS_TIMELINE[1].cardOut[1]],
    [0, 120],
  );
  const card1Scale = useTransform(
    scrollYProgress,
    [
      OFFERS_TIMELINE[1].cardIn[0],
      OFFERS_TIMELINE[1].cardIn[1],
      OFFERS_TIMELINE[1].cardOut[0],
      OFFERS_TIMELINE[1].cardOut[1],
    ],
    [0.92, 1, 1, 0.9],
  );

  // Pointer events — disable interaction when card is invisible to avoid blocking clicks
  const card0Pointer = useTransform(card0Opacity, (v) => (v > 0.1 ? 'auto' : 'none'));
  const card1Pointer = useTransform(card1Opacity, (v) => (v > 0.1 ? 'auto' : 'none'));

  // --- Outro: phrase + CTA (staggered) + gradient to white ---
  const phraseOpacity = useTransform(scrollYProgress, [0.86, 0.91, 0.96, 1.0], [0, 1, 1, 0]);
  const phraseYRaw = useTransform(scrollYProgress, [0.86, 0.91], [50, 0]);
  const phraseY = useSpring(phraseYRaw, SPRING_CONFIG);
  // CTA appears slightly after phrase, like Story & Services
  const ctaOpacity = useTransform(scrollYProgress, [0.91, 0.95], [0, 1]);
  const ctaYRaw = useTransform(scrollYProgress, [0.91, 0.95], [20, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);
  const ctaPointer = useTransform(ctaOpacity, (v) => (v > 0.1 ? 'auto' : 'none'));
  const gradientOpacity = useTransform(scrollYProgress, [0.96, 1.0], [0, 1]);

  const imgTransforms = [
    {
      opacity: img0Opacity,
      rotateX: img0RotateX,
      rotateY: img0RotateY,
      y: img0Y,
      scale: img0Scale,
    },
    {
      opacity: img1Opacity,
      rotateX: img1RotateX,
      rotateY: img1RotateY,
      y: img1Y,
      scale: img1Scale,
    },
  ];
  const cardTransforms = [
    {
      opacity: card0Opacity,
      y: card0Y,
      x: card0X,
      rotate: card0Rotate,
      scale: card0Scale,
      pointerEvents: card0Pointer,
    },
    {
      opacity: card1Opacity,
      y: card1Y,
      x: card1X,
      rotate: card1Rotate,
      scale: card1Scale,
      pointerEvents: card1Pointer,
    },
  ];

  return (
    <div ref={sectionRef} className="hidden lg:block" style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: '800px' }}>
        {/* Title — fades in/out */}
        <m.div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-section text-center"
          style={{ opacity: titleOpacity }}
        >
          <ScrollWordReveal
            as="h2"
            id="offers-title"
            scrollYProgress={scrollYProgress}
            revealStart={0.0}
            revealEnd={0.04}
            className="heading-section text-black"
          >
            {HOMEPAGE_SECTIONS.offers.title}
          </ScrollWordReveal>
        </m.div>

        {/* Image layer — large, alternating left/right with 3D tilt */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HOMEPAGE_OFFERS.map((offer, i) => (
            <m.div
              key={offer.id}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: imgTransforms[i].opacity,
                rotateX: imgTransforms[i].rotateX,
                rotateY: imgTransforms[i].rotateY,
                y: imgTransforms[i].y,
                scale: imgTransforms[i].scale,
                rotate: IMAGE_LAYOUT[i].rotateZ,
                x: IMAGE_LAYOUT[i].x,
                transformOrigin: 'center center',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="h-[200vh] w-auto max-w-none object-contain drop-shadow-2xl"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </m.div>
          ))}
        </div>

        {/* Card layer — stacked at viewport center */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {HOMEPAGE_OFFERS.map((offer, i) => (
            <m.div
              key={offer.id}
              className="absolute w-full max-w-2xl px-container-x"
              style={{
                opacity: cardTransforms[i].opacity,
                y: cardTransforms[i].y,
                x: cardTransforms[i].x,
                rotate: cardTransforms[i].rotate,
                scale: cardTransforms[i].scale,
                pointerEvents: cardTransforms[i].pointerEvents,
              }}
            >
              {/* Card — editorial cutout with accent bar */}
              <div className="group/card relative overflow-hidden rounded-r-3xl bg-black/90 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)]">
                {/* Accent bar — left edge, expands on hover */}
                <div
                  className="absolute bottom-0 left-0 top-0 w-2.5 bg-secondary-blue transition-all duration-300 ease-out group-hover/card:w-3.5"
                  aria-hidden="true"
                />

                <div className="relative z-10 px-10 py-10 xl:px-14 xl:py-12">
                  {/* Catchphrase — Please Heavy, hero-scale */}
                  <h3 className="text-subtitle text-title-sm text-accent">{offer.catchphrase}</h3>

                  {/* Summary */}
                  <p className="mt-5 max-w-md text-body-lg leading-relaxed text-white/50">
                    {offer.summary}
                  </p>

                  {/* CTA */}
                  <LinkCTA
                    to={offer.link}
                    theme="dark"
                    className="mt-8"
                    aria-label={`En savoir plus sur l'offre ${offer.title}`}
                  >
                    En savoir plus
                  </LinkCTA>
                </div>
              </div>
            </m.div>
          ))}
        </div>

        {/* Outro — phrase + CTA (staggered entrance like Story & Services) */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-8">
          <m.h3
            className="text-heading text-center text-title-xl text-black"
            style={{ opacity: phraseOpacity, y: phraseY }}
          >
            UNE PAIRE
            <br />
            QUI A DU CHIEN
          </m.h3>

          <m.div style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointer }}>
            <LinkCTA
              to={HOMEPAGE_SECTIONS.offers.cta.link}
              aria-label={HOMEPAGE_SECTIONS.offers.cta.ariaLabel}
            >
              {HOMEPAGE_SECTIONS.offers.cta.text}
            </LinkCTA>
          </m.div>
        </div>

        {/* Gradient overlay — yellow to white transition */}
        <m.div
          className="absolute inset-0 z-30"
          style={{
            opacity: gradientOpacity,
            background:
              'linear-gradient(to bottom, rgba(254,235,9,0) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,1) 100%)',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile — stacked: image + black card below
// ---------------------------------------------------------------------------

function OfferMobileBlock({
  offer,
  index,
}: {
  offer: (typeof HOMEPAGE_OFFERS)[number];
  index: number;
}) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="py-10 lg:hidden">
      <div className="px-container-x">
        <SimpleAnimation type="fade" delay={0}>
          <img
            src={offer.image}
            alt={offer.title}
            className="h-auto w-full object-contain"
            loading="lazy"
          />
        </SimpleAnimation>
      </div>

      <div className="mt-6 px-container-x">
        <SimpleAnimation type="slide-up" delay={150}>
          <div className="relative overflow-hidden rounded-2xl bg-black px-6 py-8">
            <img
              src={motifJauneUrl}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
            />
            <div className="relative z-10">
              <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-white/30">
                {number} / {String(OFFER_COUNT).padStart(2, '0')}
              </span>
              <h3 className="text-subtitle text-title-sm text-accent">{offer.catchphrase}</h3>
              <p className="mt-3 text-body-lg leading-relaxed text-white/60">{offer.summary}</p>
              <LinkCTA
                href={offer.link}
                theme="dark"
                className="mt-5"
                aria-label={`En savoir plus sur l'offre ${offer.title}`}
              >
                En savoir plus
              </LinkCTA>
            </div>
          </div>
        </SimpleAnimation>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function HomeOffers() {
  const prefersReducedMotion = usePrefersReducedMotion();
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
      {!prefersReducedMotion && <OffersDesktop />}

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

        {HOMEPAGE_OFFERS.map((offer, index) => (
          <OfferMobileBlock key={offer.id} offer={offer} index={index} />
        ))}

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
