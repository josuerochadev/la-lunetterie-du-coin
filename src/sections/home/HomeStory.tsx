import { forwardRef, useMemo, useRef } from 'react';
import { m, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Word-by-word scroll reveal driven by an external scrollYProgress.
 * Unlike TextReveal, works inside sticky containers.
 */
function ScrollWordReveal({
  children,
  scrollYProgress,
  revealStart,
  revealEnd,
  as: Tag = 'p',
  className,
  style,
}: {
  children: string;
  scrollYProgress: MotionValue<number>;
  /** scrollYProgress value where reveal begins */
  revealStart: number;
  /** scrollYProgress value where all words are fully revealed */
  revealEnd: number;
  as?: 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  style?: import('react').CSSProperties;
}) {
  const words = useMemo(() => children.split(/\s+/).filter(Boolean), [children]);

  return (
    <Tag className={className} style={style}>
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

/**
 * Section HomeStory — 3-column editorial with scroll-driven parallax
 *
 * Desktop layout (scroll-driven):
 *   - Left column: title — scrolls up (slightly slower)
 *   - Center column: photo — sticky, with slight zoom, expands fullscreen at end
 *   - Right column: body text + CTA — scrolls up
 *   - End: photo goes fullscreen, transition phrase fades in centered
 *
 * Mobile: stacked layout with SimpleAnimation entrance.
 * Reduced motion: static layout, no scroll effects.
 */
const HomeStory = forwardRef<HTMLElement>((_, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : sectionRef,
    offset: ['start end', 'end start'],
  });

  // Spring for smooth motion
  const springConfig = { stiffness: 80, damping: 30, mass: 0.5 };

  // --- Phase 1: photo appears alone ---
  // Photo entrance opacity (early reveal)
  const photoEntranceOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);

  // Photo: zoom starts only once CTA is near viewport top
  const photoScale = useTransform(scrollYProgress, [0.62, 0.78], [1, 1.05]);

  // --- Phase 2: title & text enter later, once photo is settled ---
  // Text content fades in after photo is established
  const textEntranceOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);

  // Title scrolls up from below, arrives at top and stays (sticky effect)
  const titleYRaw = useTransform(scrollYProgress, [0.22, 0.33], [150, 0]);
  const titleY = useSpring(titleYRaw, springConfig);

  // Body text scrolls up far — CTA must reach near top of viewport before fade
  const textYRaw = useTransform(scrollYProgress, [0.22, 0.62], [250, -450]);
  const textY = useSpring(textYRaw, springConfig);

  // Both fade out together only once CTA is near the top of the viewport
  const contentFadeOut = useTransform(scrollYProgress, [0.6, 0.64], [1, 0]);

  // --- End sequence: photo expands fullscreen, phrase fades in ---
  const photoLeft = useTransform(scrollYProgress, [0.66, 0.8], ['28%', '0%']);
  const photoWidth = useTransform(scrollYProgress, [0.66, 0.8], ['36%', '100%']);
  const photoPadding = useTransform(scrollYProgress, [0.66, 0.8], [16, 0]);
  const photoExpandOpacity = useTransform(scrollYProgress, [0.7, 0.8], [1, 0.7]);

  // Transition phrase fades in as photo goes fullscreen
  const phraseOpacity = useTransform(scrollYProgress, [0.74, 0.84], [0, 1]);
  const phraseY = useTransform(scrollYProgress, [0.74, 0.84], [40, 0]);
  const phraseYSpring = useSpring(phraseY, springConfig);

  // Combined opacities: fade in + shared fade out
  const titleCombinedOpacity = useTransform(
    [textEntranceOpacity, contentFadeOut] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );
  const textCombinedOpacity = useTransform(
    [textEntranceOpacity, contentFadeOut] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );

  return (
    <section
      ref={ref}
      id="story"
      className="relative w-full bg-black pt-[35vh]"
      aria-labelledby="story-title"
      data-navbar-theme="light"
    >
      {/* Integrated gradient: accent → black, smooth blend with hero behind */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[12vh] h-[62vh]"
        style={{
          background:
            'linear-gradient(to bottom, #FEEB09 0%, #FEEB09 20%, color-mix(in srgb, #FEEB09 90%, black) 35%, color-mix(in srgb, #FEEB09 65%, black) 50%, color-mix(in srgb, #FEEB09 35%, black) 68%, color-mix(in srgb, #FEEB09 12%, black) 82%, black 100%)',
        }}
        aria-hidden="true"
      />

      <div ref={sectionRef} className="relative">
        {/* ===== Mobile layout — stacked ===== */}
        <div className="flex flex-col gap-8 px-6 py-20 sm:px-10 sm:py-28 md:px-16 lg:hidden">
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
            <h2
              id="story-title"
              className="text-heading text-accent"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
            >
              Notre Histoire
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={200}>
            <p className="text-body leading-relaxed text-accent/80">
              Tout a commencé avec une conviction&nbsp;: proposer des lunettes de qualité tout en
              donnant une seconde vie aux montures. Au c&oelig;ur du Faubourg de Pierre à
              Strasbourg, notre boutique indépendante allie expertise optique, style contemporain et
              engagement écologique. Chaque paire est sélectionnée avec soin, qu&apos;elle soit
              neuve ou d&apos;occasion.
            </p>

            <LinkCTA to="/a-propos" theme="dark" className="mt-6 text-body-sm sm:mt-8">
              Nous découvrir
            </LinkCTA>
          </SimpleAnimation>
        </div>

        {/* ===== Desktop layout — 3 columns, scroll-driven ===== */}
        <div className="hidden min-h-[400vh] lg:block">
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* 3-column grid */}
            <div className="relative flex h-full items-start px-16 pt-[12vh] xl:px-20">
              {/* Left column — title (28%), scrolls up */}
              {prefersReducedMotion ? (
                <div className="w-[28%] pr-8">
                  <h2
                    id="story-title"
                    className="text-heading text-accent"
                    style={{ fontSize: 'clamp(2rem, 4vw, 5.5rem)', lineHeight: 0.9 }}
                  >
                    Notre Histoire
                  </h2>
                </div>
              ) : (
                <m.div
                  className="w-[28%] pr-8 will-change-transform"
                  style={{ y: titleY, opacity: titleCombinedOpacity }}
                >
                  <ScrollWordReveal
                    as="h2"
                    scrollYProgress={scrollYProgress}
                    revealStart={0.2}
                    revealEnd={0.35}
                    className="text-heading text-accent"
                    style={{ fontSize: 'clamp(2rem, 4vw, 5.5rem)', lineHeight: 0.9 }}
                  >
                    Notre Histoire
                  </ScrollWordReveal>
                </m.div>
              )}

              {/* Center column — photo (36%), zoom + fullscreen expand */}
              {prefersReducedMotion ? (
                <div className="absolute inset-y-0 left-[28%] w-[36%] px-4">
                  <div className="h-full overflow-hidden">
                    <img
                      src="/images/our-story-eyeglasses.jpg"
                      alt="Lunettes artisanales - La Lunetterie du Coin"
                      className="h-full w-full object-cover transition-all duration-500 ease-out hover:scale-105 hover:brightness-110"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
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
                  <m.div
                    className="h-full overflow-hidden"
                    style={{ opacity: photoEntranceOpacity }}
                  >
                    <div className="h-full transition-transform duration-500 ease-out hover:scale-105">
                      <m.img
                        src="/images/our-story-eyeglasses.jpg"
                        alt="Lunettes artisanales - La Lunetterie du Coin"
                        className="h-full w-full object-cover transition-[filter] duration-500 ease-out hover:brightness-110"
                        loading="lazy"
                        style={{ scale: photoScale }}
                      />
                    </div>
                  </m.div>
                </m.div>
              )}

              {/* Right column — body text + CTA (36%), scrolls up */}
              {prefersReducedMotion ? (
                <div className="ml-[36%] w-[36%] pl-8">
                  <p
                    className="text-accent/80"
                    style={{ fontSize: 'clamp(1.25rem, 2.2vw, 2.25rem)', lineHeight: 1.35 }}
                  >
                    Tout a commencé avec une conviction&nbsp;: proposer des lunettes de qualité tout
                    en donnant une seconde vie aux montures. Au c&oelig;ur du Faubourg de Pierre à
                    Strasbourg, notre boutique indépendante allie expertise optique, style
                    contemporain et engagement écologique. Chaque paire est sélectionnée avec soin,
                    qu&apos;elle soit neuve ou d&apos;occasion.
                  </p>
                  <LinkCTA to="/a-propos" theme="dark" className="mt-8">
                    Nous découvrir
                  </LinkCTA>
                </div>
              ) : (
                <m.div
                  className="ml-[36%] w-[36%] pl-8 will-change-transform"
                  style={{ y: textY, opacity: textCombinedOpacity }}
                >
                  <ScrollWordReveal
                    as="p"
                    scrollYProgress={scrollYProgress}
                    revealStart={0.22}
                    revealEnd={0.38}
                    className="text-accent/80"
                    style={{ fontSize: 'clamp(1.25rem, 2.2vw, 2.25rem)', lineHeight: 1.35 }}
                  >
                    Tout a commencé avec une conviction : proposer des lunettes de qualité tout en
                    donnant une seconde vie aux montures. Au cœur du Faubourg de Pierre à
                    Strasbourg, notre boutique indépendante allie expertise optique, style
                    contemporain et engagement écologique. Chaque paire est sélectionnée avec soin,
                    qu'elle soit neuve ou d'occasion.
                  </ScrollWordReveal>
                  <LinkCTA to="/a-propos" theme="dark" className="mt-8">
                    Nous découvrir
                  </LinkCTA>
                </m.div>
              )}
            </div>

            {/* Transition phrase — fades in as photo goes fullscreen */}
            {!prefersReducedMotion && (
              <m.div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8"
                style={{ opacity: phraseOpacity }}
                aria-hidden="true"
              >
                <m.h3
                  className="text-heading text-center text-accent drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 4rem)',
                    y: phraseYSpring,
                  }}
                >
                  Une expertise complète pour
                  <br />
                  prendre soin de votre vue
                </m.h3>
              </m.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

HomeStory.displayName = 'HomeStory';

export default HomeStory;
