import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SCROLL_HEIGHT_VH, OFFERS_TIMELINE, IMAGE_LAYOUT } from './constants';

import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_OFFERS, HOMEPAGE_SECTIONS } from '@/data/homepage';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG } from '@/lib/motion';

export function OffersDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Title
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.03, 0.78, 0.83], [0, 1, 1, 0]);

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

  // --- Card 0 ---
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

  // --- Card 1 ---
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

  const card0Pointer = usePointerEvents(card0Opacity);
  const card1Pointer = usePointerEvents(card1Opacity);

  // --- Outro ---
  const phraseOpacity = useTransform(scrollYProgress, [0.82, 0.87, 0.97, 1.0], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.87, 0.91, 0.97, 1.0], [0, 1, 1, 0]);
  const ctaYRaw = useTransform(scrollYProgress, [0.87, 0.91], [20, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);
  const ctaPointer = usePointerEvents(ctaOpacity);

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
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: '800px' }}>
        {/* Title */}
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

        {/* Image layer */}
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

        {/* Card layer */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pt-24">
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
              <div className="group/card relative overflow-hidden rounded-r-2xl bg-black/90 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)]">
                <div
                  className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue transition-all duration-300 ease-out group-hover/card:w-2.5"
                  aria-hidden="true"
                />
                <div className="relative z-10 px-10 py-10 xl:px-14 xl:py-12">
                  <h3 className="text-subtitle text-title-sm text-accent">{offer.catchphrase}</h3>
                  <p className="mt-5 max-w-md text-body-lg text-white">{offer.summary}</p>
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

        {/* Outro */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-8">
          <m.div
            className="text-heading text-center text-title-xl text-black"
            style={{ opacity: phraseOpacity }}
          >
            <ScrollWordReveal
              as="h3"
              scrollYProgress={scrollYProgress}
              revealStart={0.82}
              revealEnd={0.88}
              className="text-heading text-center text-title-xl text-black"
            >
              UNE PAIRE QUI A DU CHIEN
            </ScrollWordReveal>
          </m.div>

          <m.div style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointer }}>
            <LinkCTA
              to={HOMEPAGE_SECTIONS.offers.cta.link}
              aria-label={HOMEPAGE_SECTIONS.offers.cta.ariaLabel}
            >
              {HOMEPAGE_SECTIONS.offers.cta.text}
            </LinkCTA>
          </m.div>
        </div>
      </div>
    </div>
  );
}
