import { useRef } from 'react';
import { m, useTransform, useSpring, useMotionValueEvent, type MotionValue } from 'framer-motion';

import { STORY_TITLE, STORY_BODY, STORY_BODY_2 } from './AboutHistory';

import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG } from '@/lib/motion';

/**
 * Title word on its own block line, with the same scroll-reveal timing as
 * ScrollWordReveal. Mirrors the helper used in home StoryDesktopAnimated so
 * the right-aligned title anchors cleanly to the column edge without the
 * trailing nbsp that ScrollWordReveal would otherwise insert.
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

// ---------------------------------------------------------------------------
// Desktop animated — scroll-driven photo reveal + text + expansion
//
//  400vh container
//
//  0.00 – 0.10  Photo appears with clipPath reveal (grows from center)
//  0.05 – 0.12  Title "Notre Histoire" enters with Y slide
//  0.10 – 0.30  Photo height grows 60% → 100%, continuous zoom
//  0.12 – 0.30  Body text ScrollWordReveal
//  0.30 – 0.40  Text fades out
//  0.35 – 0.50  Photo expands fullscreen (left + width)
//  0.50 – 0.62  Transition phrase "UNE VISION DIFFÉRENTE" appears
//  0.65 – 0.80  Yellow overlay fills screen
//  0.80 – 1.00  Hold
// ---------------------------------------------------------------------------

export default function HistoryDesktop() {
  // useManualScrollProgress bypasses framer-motion's useScroll bug for
  // targets behind stacked sticky sections.
  const { ref: sectionRef, scrollYProgress } = useManualScrollProgress('end-start');

  // Phase 1: Photo clipPath reveal + grow (delayed so dome settles first)
  const photoClipProgress = useTransform(scrollYProgress, [0.06, 0.16], [0, 1]);
  const photoClip = useTransform(photoClipProgress, (v) => {
    const inset = 50 - v * 50;
    return `inset(${inset}% ${inset}% ${inset}% ${inset}%)`;
  });
  const photoHeight = useTransform(scrollYProgress, [0.09, 0.35], ['60%', '100%']);
  const photoScale = useTransform(scrollYProgress, [0.09, 0.45], [1, 1.15]);
  const photoEntranceOpacity = useTransform(scrollYProgress, [0.06, 0.12], [0, 1]);

  // Phase 2: Title + text
  const textOpacity = useTransform(scrollYProgress, [0.12, 0.18], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.12, 0.2], [100, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);
  const contentFadeOut = useTransform(scrollYProgress, [0.36, 0.42], [1, 0]);

  // Combined opacities
  const titleCombinedOpacity = useTransform(
    [textOpacity, contentFadeOut] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );
  const textCombinedOpacity = useTransform(
    [textOpacity, contentFadeOut] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );

  // Phase 3: Photo expands fullscreen
  // Initial position mirrors the grid middle col: 14vw wide at left 50%
  // (after 4vw pad + 42vw title col + 4vw gap).
  const photoLeft = useTransform(scrollYProgress, [0.42, 0.54], ['50%', '0%']);
  const photoWidth = useTransform(scrollYProgress, [0.42, 0.54], ['14%', '100%']);
  const photoPadding = useTransform(scrollYProgress, [0.42, 0.54], [16, 0]);
  const photoExpandOpacity = useTransform(scrollYProgress, [0.49, 0.58], [1, 0.6]);

  // Phase 4: Transition phrase
  const phraseOpacity = useTransform(scrollYProgress, [0.54, 0.62], [0, 1]);
  const phraseYRaw = useTransform(scrollYProgress, [0.54, 0.62], [40, 0]);
  const phraseY = useSpring(phraseYRaw, SPRING_CONFIG);
  const phraseFadeOut = useTransform(scrollYProgress, [0.72, 0.78], [1, 0]);
  const phrasePointer = usePointerEvents(phraseOpacity);

  // Phase 5: Yellow overlay — starts right as phrase fades out
  const yellowOverlay = useTransform(scrollYProgress, [0.69, 0.8], [0, 1]);

  // Navbar theme strip — toggle data-navbar-theme attribute via ref
  // IO detects the attribute change on the next scroll-driven resolveTheme()
  const stripRef = useRef<HTMLDivElement>(null);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!stripRef.current) return;
    if (v >= 0.69) {
      stripRef.current.setAttribute('data-navbar-theme', 'dark');
    } else {
      stripRef.current.removeAttribute('data-navbar-theme');
    }
  });

  return (
    <div ref={sectionRef} className="relative z-10 hidden min-h-[400vh] xl:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative h-full">
          {/* Asymmetric 3-col grid with uniform 4vw spacing:
              [4vw][title 1.5fr = 42vw][4vw][photo 14vw][4vw][body 1fr = 28vw][4vw]
              Mirrors the home StoryDesktopAnimated grid — title col wider so
              heading-section fits at 1280, photo narrower in the middle,
              body on the right. minmax(0, Xfr) keeps the layout symmetric
              when the bold title slightly overflows. */}
          <div className="grid h-full grid-cols-[minmax(0,1.5fr)_14vw_minmax(0,1fr)] items-center gap-x-[4vw] px-[4vw]">
            {/* Left — title (right-aligned, one word per block line) */}
            <m.div
              className="text-right will-change-transform"
              style={{ y: titleY, opacity: titleCombinedOpacity }}
            >
              <h2 id="histoire-title" className="heading-section text-black">
                {STORY_TITLE.split(/\s+/).map((word, i, arr) => (
                  <StoryTitleWord
                    key={word}
                    scrollYProgress={scrollYProgress}
                    index={i}
                    total={arr.length}
                    revealStart={0.12}
                    revealEnd={0.22}
                  >
                    {word}
                  </StoryTitleWord>
                ))}
              </h2>
            </m.div>

            {/* Middle — empty grid cell; photo is absolute-positioned so it
                can escape the grid to fullscreen during the expand phase. */}
            <div aria-hidden="true" />

            {/* Right — body text */}
            <m.div className="will-change-transform" style={{ opacity: textCombinedOpacity }}>
              <ScrollWordReveal
                as="p"
                scrollYProgress={scrollYProgress}
                revealStart={0.16}
                revealEnd={0.28}
                className="text-body-xl text-black/60"
              >
                {STORY_BODY}
              </ScrollWordReveal>

              <m.div className="mt-8" style={{ opacity: textCombinedOpacity }}>
                <ScrollWordReveal
                  as="p"
                  scrollYProgress={scrollYProgress}
                  revealStart={0.26}
                  revealEnd={0.32}
                  className="text-body-lg text-black/40"
                >
                  {STORY_BODY_2}
                </ScrollWordReveal>
              </m.div>
            </m.div>
          </div>

          {/* Photo — absolute, aligns with the middle grid col then expands fullscreen */}
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
            <m.div
              className="h-full overflow-hidden"
              style={{ opacity: photoEntranceOpacity, clipPath: photoClip }}
            >
              <m.div className="h-full w-full" style={{ scale: photoScale }}>
                <ResponsiveImage
                  src="/images/about-history-shop-indoors.png"
                  alt="Intérieur de La Lunetterie du Coin"
                  className="h-full w-full object-cover"
                  loading="eager"
                  widths={[640, 768, 1024, 1280, 1920]}
                  sizes="14vw"
                />
              </m.div>
            </m.div>
          </m.div>
        </div>

        {/* Transition phrase — "UNE VISION DIFFÉRENTE" */}
        <m.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-8"
          style={{ opacity: phraseOpacity, pointerEvents: phrasePointer }}
        >
          <m.div className="text-center" style={{ y: phraseY, opacity: phraseFadeOut }}>
            <ScrollWordReveal
              as="h3"
              scrollYProgress={scrollYProgress}
              revealStart={0.56}
              revealEnd={0.66}
              className="text-heading text-title-xl text-black"
            >
              UNE VISION DIFFÉRENTE
            </ScrollWordReveal>
          </m.div>

          <m.div style={{ opacity: phraseFadeOut }}>
            <LinkCTA to="/services" theme="light">
              Voir nos services
            </LinkCTA>
          </m.div>
        </m.div>

        {/* Yellow overlay — transition to Values section */}
        <m.div
          className="pointer-events-none absolute inset-0 z-30 bg-accent"
          style={{ opacity: yellowOverlay }}
          aria-hidden="true"
        />

        {/* Navbar theme override — attribute toggled via ref when yellow
            overlay is visible. IO picks it up as the most nested element. */}
        <div
          ref={stripRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-40 h-20"
          data-navbar-theme-dynamic=""
        />
      </div>
    </div>
  );
}
