import { useRef } from 'react';
import { m, useScroll, useSpring, useTransform } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// ---------------------------------------------------------------------------
// Shared content
// ---------------------------------------------------------------------------

const STORY_TITLE = 'Notre Histoire';
const STORY_BODY =
  "Tout a commencé avec une conviction : proposer des lunettes de qualité tout en donnant une seconde vie aux montures. Au cœur du Faubourg de Pierre à Strasbourg, notre boutique indépendante allie expertise optique, style contemporain et engagement écologique. Chaque paire est sélectionnée avec soin, qu'elle soit neuve ou d'occasion.";
const STORY_BODY_HTML = (
  <>
    Tout a commencé avec une conviction&nbsp;: proposer des lunettes de qualité tout en donnant une
    seconde vie aux montures. Au c&oelig;ur du Faubourg de Pierre à Strasbourg, notre boutique
    indépendante allie expertise optique, style contemporain et engagement écologique. Chaque paire
    est sélectionnée avec soin, qu&apos;elle soit neuve ou d&apos;occasion.
  </>
);

// ---------------------------------------------------------------------------
// Desktop animated layout — all scroll hooks live here
// ---------------------------------------------------------------------------

function StoryDesktopAnimated() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const springConfig = { stiffness: 80, damping: 30, mass: 0.5 };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Phase 1: photo appears alone — starts at ~60% height, grows + zooms continuously
  const photoEntranceOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);
  const photoHeight = useTransform(scrollYProgress, [0.05, 0.5], ['60%', '100%']);
  const photoScale = useTransform(scrollYProgress, [0.05, 0.6], [1, 1.12]);

  // Phase 2: title & text enter
  const textEntranceOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.17, 0.28], [150, 0]);
  const titleY = useSpring(titleYRaw, springConfig);
  // Text block: no bulk Y translation — each word slides down individually
  const contentFadeOut = useTransform(scrollYProgress, [0.45, 0.5], [1, 0]);

  // End sequence: photo expands fullscreen
  const photoLeft = useTransform(scrollYProgress, [0.5, 0.6], ['28%', '0%']);
  const photoWidth = useTransform(scrollYProgress, [0.5, 0.6], ['36%', '100%']);
  const photoPadding = useTransform(scrollYProgress, [0.5, 0.6], [16, 0]);
  const photoExpandOpacity = useTransform(scrollYProgress, [0.55, 0.62], [1, 0.7]);

  // Transition phrase — appears, then "GRAND" zooms to fill screen
  const phraseOpacity = useTransform(scrollYProgress, [0.58, 0.66], [0, 1]);
  const phraseY = useTransform(scrollYProgress, [0.58, 0.66], [40, 0]);
  const phraseYSpring = useSpring(phraseY, springConfig);

  // "GRAND" zoom-out phase — pushed later to reduce dead yellow scroll before Offers
  const grandScale = useTransform(scrollYProgress, [0.76, 0.88], [1, 50]);
  const grandScaleSpring = useSpring(grandScale, { stiffness: 60, damping: 30, mass: 0.5 });
  const surroundingFade = useTransform(scrollYProgress, [0.75, 0.8], [1, 0]);
  const yellowOverlay = useTransform(scrollYProgress, [0.82, 0.9], [0, 1]);

  // Combined opacities
  const titleCombinedOpacity = useTransform(
    [textEntranceOpacity, contentFadeOut] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );
  const textCombinedOpacity = useTransform(
    [textEntranceOpacity, contentFadeOut] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );

  return (
    <div ref={sectionRef} className="hidden min-h-[450vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative flex h-full items-start px-16 pt-[12vh] xl:px-20">
          {/* Left — title */}
          <m.div
            className="w-[28%] pr-8 will-change-transform"
            style={{ y: titleY, opacity: titleCombinedOpacity }}
          >
            <ScrollWordReveal
              as="h2"
              scrollYProgress={scrollYProgress}
              revealStart={0.15}
              revealEnd={0.28}
              className="heading-section text-white"
            >
              {STORY_TITLE}
            </ScrollWordReveal>
          </m.div>

          {/* Center — photo: starts ~60% height, grows to full + continuous zoom */}
          <m.div
            className="absolute top-1/2 -translate-y-1/2 will-change-transform"
            style={{
              left: photoLeft,
              width: photoWidth,
              height: photoHeight,
              paddingLeft: photoPadding,
              paddingRight: photoPadding,
              opacity: photoExpandOpacity,
            }}
          >
            <m.div className="h-full overflow-hidden" style={{ opacity: photoEntranceOpacity }}>
              <m.img
                src="/images/our-story-eyeglasses.jpg"
                alt="Lunettes artisanales - La Lunetterie du Coin"
                className="h-full w-full object-cover"
                loading="lazy"
                style={{ scale: photoScale }}
              />
            </m.div>
          </m.div>

          {/* Right — body + CTA */}
          <m.div
            className="ml-[36%] w-[36%] pl-8 will-change-transform"
            style={{ opacity: textCombinedOpacity }}
          >
            <ScrollWordReveal
              as="p"
              scrollYProgress={scrollYProgress}
              revealStart={0.17}
              revealEnd={0.32}
              className="text-body-xl text-white/80"
            >
              {STORY_BODY}
            </ScrollWordReveal>
          </m.div>
        </div>

        {/* Transition phrase — "GRAND" zooms to yellow fullscreen */}
        <m.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-8"
          style={{ opacity: phraseOpacity }}
        >
          <m.div className="flex flex-col items-center" style={{ y: phraseYSpring }}>
            <div className="flex items-baseline gap-[0.3em]">
              <m.span
                className="text-heading text-title-xl text-accent"
                style={{ opacity: surroundingFade }}
              >
                VOYEZ
              </m.span>
              <m.span
                className="text-heading text-title-xl text-accent"
                style={{ scale: grandScaleSpring }}
              >
                GRAND
              </m.span>
            </div>
            <m.span
              className="text-heading text-title-xl text-accent"
              style={{ opacity: surroundingFade }}
            >
              PAYEZ PETIT
            </m.span>
          </m.div>
          <m.div style={{ opacity: surroundingFade }}>
            <LinkCTA to="/a-propos" theme="dark">
              Nous découvrir
            </LinkCTA>
          </m.div>
        </m.div>

        {/* Yellow overlay — fills screen as GRAND zooms */}
        <m.div
          className="absolute inset-0 z-30 bg-accent"
          style={{ opacity: yellowOverlay }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop static layout — reduced motion fallback
// ---------------------------------------------------------------------------

function StoryDesktopStatic() {
  return (
    <div className="hidden min-h-[450vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative flex h-full items-start px-16 pt-[12vh] xl:px-20">
          <div className="w-[28%] pr-8">
            <h2 id="story-title" className="heading-section text-white">
              {STORY_TITLE}
            </h2>
          </div>

          <div className="absolute inset-y-0 left-[28%] w-[36%] px-4">
            <div className="h-full overflow-hidden">
              <img
                src="/images/our-story-eyeglasses.jpg"
                alt="Lunettes artisanales - La Lunetterie du Coin"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="ml-[36%] w-[36%] pl-8">
            <p className="text-body-xl text-white/80">{STORY_BODY_HTML}</p>
            <LinkCTA to="/a-propos" theme="dark" className="mt-8">
              Nous découvrir
            </LinkCTA>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Section HomeStory — 3-column editorial with scroll-driven parallax
 *
 * Desktop: scroll-driven parallax with photo expanding fullscreen at end.
 * Mobile: stacked layout with SimpleAnimation entrance.
 * Reduced motion: static desktop layout, no scroll hooks mounted.
 */
function HomeStory() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="story"
      className="relative w-full bg-black pt-[35vh]"
      aria-labelledby="story-title"
      data-navbar-theme="light"
    >
      {/* Convex eyelid curve — elliptical arc wider than viewport, no flat edges */}
      <div
        className="pointer-events-none absolute -top-[11vw] left-1/2 h-[45vw] w-[140vw] -translate-x-1/2 rounded-[50%] bg-black"
        aria-hidden="true"
      />

      {/* Mobile layout — stacked */}
      <div className="flex flex-col gap-8 px-container-x py-20 sm:py-28 lg:hidden">
        <SimpleAnimation type="slide-up" delay={0} className="w-full">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <img
              src="/images/our-story-eyeglasses.jpg"
              alt="Lunettes artisanales - La Lunetterie du Coin"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </SimpleAnimation>

        <SimpleAnimation type="slide-up" delay={100}>
          <h2 id="story-title" className="text-heading text-title-md text-white">
            {STORY_TITLE}
          </h2>
        </SimpleAnimation>

        <SimpleAnimation type="slide-up" delay={200}>
          <p className="text-body-lg leading-relaxed text-white/80">{STORY_BODY_HTML}</p>
          <LinkCTA to="/a-propos" theme="dark" className="mt-6 text-body-sm sm:mt-8">
            Nous découvrir
          </LinkCTA>
        </SimpleAnimation>
      </div>

      {/* Desktop layout */}
      {prefersReducedMotion ? <StoryDesktopStatic /> : <StoryDesktopAnimated />}
    </section>
  );
}

export default HomeStory;
