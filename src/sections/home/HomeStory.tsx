import { useMemo, useRef } from 'react';
import { m, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
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
// ScrollWordReveal — word-by-word scroll reveal
// ---------------------------------------------------------------------------

function ScrollWordReveal({
  children,
  scrollYProgress,
  revealStart,
  revealEnd,
  as: Tag = 'p',
  className,
}: {
  children: string;
  scrollYProgress: MotionValue<number>;
  revealStart: number;
  revealEnd: number;
  as?: 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}) {
  const words = useMemo(() => children.split(/\s+/).filter(Boolean), [children]);

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block">
          <ScrollWord
            scrollYProgress={scrollYProgress}
            index={i}
            total={words.length}
            rangeStart={revealStart}
            rangeEnd={revealEnd}
          >
            {word}
          </ScrollWord>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}

function ScrollWord({
  children,
  scrollYProgress,
  index,
  total,
  rangeStart,
  rangeEnd,
}: {
  children: string;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
}) {
  const range = rangeEnd - rangeStart;
  const wordStart = rangeStart + (index / total) * range;
  const wordEnd = Math.min(wordStart + range / total + range * 0.2, rangeEnd);
  const opacity = useTransform(scrollYProgress, [wordStart, wordEnd], [0.15, 1]);

  return (
    <m.span className="inline-block" style={{ opacity }}>
      {children}
    </m.span>
  );
}

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

  // Phase 1: photo appears alone
  const photoEntranceOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
  const photoScale = useTransform(scrollYProgress, [0.62, 0.78], [1, 1.05]);

  // Phase 2: title & text enter
  const textEntranceOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.22, 0.33], [150, 0]);
  const titleY = useSpring(titleYRaw, springConfig);
  const textYRaw = useTransform(scrollYProgress, [0.22, 0.62], [250, -450]);
  const textY = useSpring(textYRaw, springConfig);
  const contentFadeOut = useTransform(scrollYProgress, [0.6, 0.64], [1, 0]);

  // End sequence: photo expands fullscreen
  const photoLeft = useTransform(scrollYProgress, [0.66, 0.8], ['28%', '0%']);
  const photoWidth = useTransform(scrollYProgress, [0.66, 0.8], ['36%', '100%']);
  const photoPadding = useTransform(scrollYProgress, [0.66, 0.8], [16, 0]);
  const photoExpandOpacity = useTransform(scrollYProgress, [0.7, 0.8], [1, 0.7]);

  // Transition phrase
  const phraseOpacity = useTransform(scrollYProgress, [0.74, 0.84], [0, 1]);
  const phraseY = useTransform(scrollYProgress, [0.74, 0.84], [40, 0]);
  const phraseYSpring = useSpring(phraseY, springConfig);

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
    <div ref={sectionRef} className="hidden min-h-[400vh] lg:block">
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
              revealStart={0.2}
              revealEnd={0.35}
              className="heading-section text-accent"
            >
              {STORY_TITLE}
            </ScrollWordReveal>
          </m.div>

          {/* Center — photo */}
          <m.div
            className="absolute inset-y-0 will-change-transform"
            style={{
              left: photoLeft,
              width: photoWidth,
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
            style={{ y: textY, opacity: textCombinedOpacity }}
          >
            <ScrollWordReveal
              as="p"
              scrollYProgress={scrollYProgress}
              revealStart={0.22}
              revealEnd={0.38}
              className="text-body-lg text-accent/80"
            >
              {STORY_BODY}
            </ScrollWordReveal>
            <LinkCTA to="/a-propos" theme="dark" className="mt-8">
              Nous découvrir
            </LinkCTA>
          </m.div>
        </div>

        {/* Transition phrase */}
        <m.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8"
          style={{ opacity: phraseOpacity }}
          aria-hidden="true"
        >
          <m.h3
            className="text-heading text-center text-title-xl text-accent drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
            style={{ y: phraseYSpring }}
          >
            Une expertise complète pour
            <br />
            prendre soin de votre vue
          </m.h3>
        </m.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop static layout — reduced motion fallback
// ---------------------------------------------------------------------------

function StoryDesktopStatic() {
  return (
    <div className="hidden min-h-[400vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative flex h-full items-start px-16 pt-[12vh] xl:px-20">
          <div className="w-[28%] pr-8">
            <h2 id="story-title" className="heading-section text-accent">
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
            <p className="text-body-lg text-accent/80">{STORY_BODY_HTML}</p>
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
      {/* Integrated gradient: accent → black */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[12vh] h-[62vh]"
        style={{
          background: 'linear-gradient(to bottom, #FEEB09 0%, #FEEB09 20%, transparent 100%)',
        }}
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
          <h2 id="story-title" className="text-heading text-title-md text-accent">
            {STORY_TITLE}
          </h2>
        </SimpleAnimation>

        <SimpleAnimation type="slide-up" delay={200}>
          <p className="text-body leading-relaxed text-accent/80">{STORY_BODY_HTML}</p>
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
