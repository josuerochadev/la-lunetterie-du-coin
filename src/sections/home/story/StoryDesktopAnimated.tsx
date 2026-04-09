import { useRef } from 'react';
import {
  m,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';

import { STORY_TITLE, STORY_BODY, STORY_IMAGE, STORY_IMAGE_ALT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { useFadeInOut } from '@/hooks/useFadeInOut';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG, SPRING_CONFIG_SLOW } from '@/lib/motion';

/**
 * Title word on its own block line, with the same scroll-reveal timing as
 * ScrollWordReveal. Block display lets each word anchor independently to the
 * right edge of a `text-right` parent — unlike ScrollWordReveal which wraps
 * words in inline-block spans and carries a trailing nbsp that offsets the
 * first word leftward on the line.
 */
function StoryTitleWord({
  children,
  scrollYProgress,
  index,
  total,
  revealStart,
  revealEnd,
}: {
  children: string;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
  revealStart: number;
  revealEnd: number;
}) {
  const range = revealEnd - revealStart;
  const wordStart = revealStart + (index / total) * range;
  const wordEnd = Math.min(wordStart + range / total + range * 0.2, revealEnd);
  const opacity = useTransform(scrollYProgress, [wordStart, wordEnd], [0, 1]);
  const y = useTransform(scrollYProgress, [wordStart, wordEnd], [12, 0]);

  return (
    <m.span className="block" style={{ opacity, y }}>
      {children}
    </m.span>
  );
}

export function StoryDesktopAnimated() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Phase 1: photo appears alone — starts at ~60% height, grows + zooms continuously
  const photoEntranceOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);
  const photoHeight = useTransform(scrollYProgress, [0.05, 0.5], ['60%', '100%']);
  const photoScale = useTransform(scrollYProgress, [0.05, 0.6], [1, 1.12]);

  // Phase 2: title & text enter
  const titleYRaw = useTransform(scrollYProgress, [0.17, 0.28], [150, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // End sequence: photo expands fullscreen
  // Initial position mirrors the grid middle col: 14vw wide at left 50%
  // (after 4vw pad + 42vw title col + 4vw gap).
  const photoLeft = useTransform(scrollYProgress, [0.5, 0.6], ['50%', '0%']);
  const photoWidth = useTransform(scrollYProgress, [0.5, 0.6], ['14%', '100%']);
  const photoPadding = useTransform(scrollYProgress, [0.5, 0.6], [16, 0]);
  const photoExpandOpacity = useTransform(scrollYProgress, [0.55, 0.62], [1, 0.7]);

  // Transition phrase — appears, then "GRAND" zooms to fill screen
  const phraseOpacity = useTransform(scrollYProgress, [0.58, 0.66], [0, 1]);
  const phraseY = useTransform(scrollYProgress, [0.58, 0.66], [40, 0]);
  const phraseYSpring = useSpring(phraseY, SPRING_CONFIG);

  // "GRAND" zoom-out phase — boosted rasterization for crisp scaling
  // The browser rasterizes text at its layout size then scales the bitmap.
  // By rendering GRAND at RASTER_BOOST× font-size and starting scale at
  // 1/BOOST, the bitmap is high-res so the zoom stays sharp.
  const RASTER_BOOST = 10;
  const grandScale = useTransform(
    scrollYProgress,
    [0.76, 0.88],
    [1 / RASTER_BOOST, 50 / RASTER_BOOST],
  );
  const grandScaleSpring = useSpring(grandScale, SPRING_CONFIG_SLOW);
  const surroundingFade = useTransform(scrollYProgress, [0.75, 0.8], [1, 0]);
  const yellowOverlay = useTransform(scrollYProgress, [0.82, 0.9], [0, 1]);

  // Navbar theme strip — switch to dark when GRAND fills screen with yellow
  const storyStripRef = useRef<HTMLDivElement>(null);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!storyStripRef.current) return;
    if (v >= 0.78) {
      storyStripRef.current.setAttribute('data-navbar-theme', 'dark');
    } else {
      storyStripRef.current.removeAttribute('data-navbar-theme');
    }
  });

  // Pointer events — disable outro overlay when not visible
  const phrasePointer = usePointerEvents(phraseOpacity);

  // Combined opacities — fade in with text entrance, fade out before expand
  const titleCombinedOpacity = useFadeInOut(scrollYProgress, 0.15, 0.25, 0.45, 0.5);
  const textCombinedOpacity = useFadeInOut(scrollYProgress, 0.15, 0.25, 0.45, 0.5);

  return (
    <div ref={sectionRef} className="hidden min-h-[450vh] xl:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative h-full">
          {/* Asymmetric 3-col grid with uniform 4vw spacing:
              [4vw][title 1.5fr = 42vw][4vw][photo 14vw][4vw][body 1fr = 28vw][4vw]
              Title col gets 1.5× the body col so title-xl fits at 1280 without
              clipping the viewport. minmax(0, Xfr) prevents fr cols from
              expanding when the bold title slightly overflows. */}
          <div className="grid h-full grid-cols-[minmax(0,1.5fr)_14vw_minmax(0,1fr)] items-center gap-x-[4vw] px-[4vw]">
            {/* Left — title (right-aligned, one word per block line) */}
            <m.div className="text-right" style={{ y: titleY, opacity: titleCombinedOpacity }}>
              <h2 id="story-title" className="heading-section text-white">
                {STORY_TITLE.split(/\s+/).map((word, i, arr) => (
                  <StoryTitleWord
                    key={word}
                    scrollYProgress={scrollYProgress}
                    index={i}
                    total={arr.length}
                    revealStart={0.15}
                    revealEnd={0.28}
                  >
                    {word}
                  </StoryTitleWord>
                ))}
              </h2>
            </m.div>

            {/* Middle — empty grid cell; photo is absolute-positioned so it can
                escape the grid to fullscreen during the expand phase. */}
            <div aria-hidden="true" />

            {/* Right — body + CTA */}
            <m.div style={{ opacity: textCombinedOpacity }}>
              <ScrollWordReveal
                as="p"
                scrollYProgress={scrollYProgress}
                revealStart={0.17}
                revealEnd={0.32}
                className="text-body-xl text-secondary-blue"
              >
                {STORY_BODY}
              </ScrollWordReveal>
            </m.div>
          </div>

          {/* Photo — absolute, aligns with the middle grid col then expands fullscreen */}
          <m.div
            className="absolute top-1/2 -translate-y-1/2"
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
                src={STORY_IMAGE}
                alt={STORY_IMAGE_ALT}
                className="h-full w-full object-cover"
                loading="lazy"
                style={{ scale: photoScale }}
              />
            </m.div>
          </m.div>
        </div>

        {/* Transition phrase — "GRAND" zooms to yellow fullscreen */}
        <m.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-8"
          style={{ opacity: phraseOpacity, pointerEvents: phrasePointer }}
        >
          <m.div className="flex flex-col items-center" style={{ y: phraseYSpring }}>
            <div className="flex items-baseline gap-[0.3em]">
              <m.span
                className="text-heading text-title-xl text-accent"
                style={{ opacity: surroundingFade }}
              >
                VOYEZ
              </m.span>
              {/* Ghost spacer — keeps flex layout identical to original */}
              <span className="relative inline-flex items-center justify-center">
                <span
                  className="text-heading invisible select-none text-title-xl"
                  aria-hidden="true"
                >
                  GRAND
                </span>
                {/* Actual GRAND — oversized font for crisp zoom rasterization.
                    The inner clamp must match the title-xl tailwind token so
                    GRAND's starting size (fontSize * 1/RASTER_BOOST) lines up
                    with VOYEZ and PAYEZ PETIT on either side. */}
                <m.span
                  className="text-heading absolute inset-0 flex items-center justify-center overflow-visible whitespace-nowrap text-accent"
                  style={{
                    fontSize: 'calc(clamp(3.5rem, 2.2rem + 5.45vw, 15rem) * 10)',
                    lineHeight: '0.9',
                    scale: grandScaleSpring,
                  }}
                >
                  GRAND
                </m.span>
              </span>
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
          className="pointer-events-none absolute inset-0 z-30 bg-accent"
          style={{ opacity: yellowOverlay }}
          aria-hidden="true"
        />

        {/* Navbar theme override — switches to dark when GRAND fills screen */}
        <div
          ref={storyStripRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-40 h-20"
          data-navbar-theme-dynamic=""
        />
      </div>
    </div>
  );
}
