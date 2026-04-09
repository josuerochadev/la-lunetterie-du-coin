import { useRef } from 'react';
import { m, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

import { STORY_TITLE, STORY_BODY, STORY_IMAGE, STORY_IMAGE_ALT } from './constants';

import ResponsiveImage from '@/components/common/ResponsiveImage';
import LinkCTA from '@/components/common/LinkCTA';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { ACCENT_HEX } from '@/config/design';

export function StoryMobileAnimated() {
  const ref = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // ──────────────────────────────────────────────────────────────────────
  // Scroll math: h-[300vh] + offset ['start end','end start']
  // Total range = 300vh + 100vh = 400vh
  // progress ~0.25 → ref top at viewport top (sticky activates)
  // progress ~0.75 → ref bottom at viewport bottom (sticky ends)
  //
  // Layout: Title → Body text + CTA → Photo (right after CTA)
  //
  // Phase 1 (0.05–0.22) : Entrance — title slide-in, word reveal
  // Phase 2 (0.22–0.48) : Photo grows upward, text slides up naturally
  // Phase 3 (0.48–0.56) : Dark overlay, Ken Burns zoom
  // Phase 4 (0.56–0.68) : VOYEZ / GRAND / PAYEZ / PETIT stagger
  // Phase 5 (0.68–0.74) : Surrounding words fade, GRAND turns yellow
  // Phase 6 (0.74–0.88) : GRAND zooms to fill viewport with yellow
  // ──────────────────────────────────────────────────────────────────────

  // ── Title entrance: slides up + fades in as section approaches ──
  const titleEntranceOpacity = useTransform(scrollYProgress, [0.05, 0.14], [0, 1]);
  const titleEntranceY = useTransform(scrollYProgress, [0.05, 0.14], [40, 0]);

  // ── Title exit: slides up naturally when photo expands ──
  const titleExitOpacity = useTransform(scrollYProgress, [0.26, 0.38], [1, 0]);
  const titleExitY = useTransform(scrollYProgress, [0.26, 0.42], [0, -250]);

  // Combined title transforms
  const titleOpacity = useTransform(
    [titleEntranceOpacity, titleExitOpacity],
    ([enter, exit]: number[]) => Math.min(enter, exit),
  );
  const titleY = useTransform(
    [titleEntranceY, titleExitY],
    ([enter, exit]: number[]) => enter + exit,
  );

  // ── Body text + CTA: slides up naturally (slightly delayed) ──
  const textExitOpacity = useTransform(scrollYProgress, [0.3, 0.44], [1, 0]);
  const textExitY = useTransform(scrollYProgress, [0.3, 0.46], [0, -200]);

  // ── Photo clip: bottom band → fullscreen (grows from bottom to top) ──
  const clipTop = useTransform(scrollYProgress, [0.15, 0.22, 0.48], [70, 70, 0]);
  const photoClip = useTransform(clipTop, (t) => `inset(${t}% 0% 0% 0%)`);

  // Ken Burns: gentle zoom + vertical drift
  const photoScale = useTransform(scrollYProgress, [0.22, 0.68], [1, 1.15]);
  const photoY = useTransform(scrollYProgress, [0.48, 0.68], [0, -20]);

  // Photo darkness: starts dim, brightens as it expands
  const photoBrightness = useTransform(scrollYProgress, [0.15, 0.42], [0.45, 0.8]);
  const photoFilter = useTransform(photoBrightness, (b) => `brightness(${b})`);

  // ── Dark overlay for outro ──
  const overlayOpacity = useTransform(scrollYProgress, [0.48, 0.56], [0, 0.6]);

  // ── Outro: word-by-word stagger — VOYEZ / GRAND / PAYEZ / PETIT ──
  const STAGGER = 0.025;
  const OUTRO_START = 0.56;
  const word1Opacity = useTransform(scrollYProgress, [OUTRO_START, OUTRO_START + 0.04], [0, 1]);
  const word1Y = useTransform(scrollYProgress, [OUTRO_START, OUTRO_START + 0.04], [40, 0]);
  const word2Opacity = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER, OUTRO_START + STAGGER + 0.04],
    [0, 1],
  );
  const word2Y = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER, OUTRO_START + STAGGER + 0.04],
    [40, 0],
  );
  const word3Opacity = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER * 2, OUTRO_START + STAGGER * 2 + 0.04],
    [0, 1],
  );
  const word3Y = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER * 2, OUTRO_START + STAGGER * 2 + 0.04],
    [40, 0],
  );
  const word4Opacity = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER * 3, OUTRO_START + STAGGER * 3 + 0.04],
    [0, 1],
  );
  const word4Y = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER * 3, OUTRO_START + STAGGER * 3 + 0.04],
    [40, 0],
  );
  const ctaOpacity = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER * 4, OUTRO_START + STAGGER * 4 + 0.04],
    [0, 1],
  );
  const outroPointer = usePointerEvents(word1Opacity);

  // ── Phase 5: Surrounding words fade, GRAND isolates ──
  const surroundingFade = useTransform(scrollYProgress, [0.68, 0.74], [1, 0]);

  // GRAND color: white → accent yellow
  const grandColor = useTransform(scrollYProgress, [0.68, 0.74], ['#FFFFFF', ACCENT_HEX]);

  // ── Phase 6: GRAND zooms to fill viewport ──
  // Boosted rasterization: 10× font-size + 1/10 starting scale = crisp zoom
  const RASTER_BOOST = 10;
  const grandScale = useTransform(
    scrollYProgress,
    [0.74, 0.88],
    [1 / RASTER_BOOST, 35 / RASTER_BOOST],
  );
  const yellowOverlay = useTransform(scrollYProgress, [0.84, 0.9], [0, 1]);

  // Navbar theme: switch to dark when yellow fills
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!navRef.current) return;
    navRef.current.setAttribute('data-navbar-theme', v >= 0.82 ? 'dark' : 'light');
  });

  return (
    <div ref={ref} className="relative h-[300vh] xl:hidden">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* ── Photo — below CTA, grows upward, darkened for readability ── */}
        <m.div
          className="absolute inset-0 z-0 overflow-hidden will-change-[clip-path]"
          style={{ clipPath: photoClip }}
        >
          <m.div
            className="h-full w-full will-change-transform"
            style={{ scale: photoScale, y: photoY, filter: photoFilter }}
          >
            <ResponsiveImage
              src={STORY_IMAGE}
              alt={STORY_IMAGE_ALT}
              className="h-full w-full object-cover"
              loading="lazy"
              sizes="100vw"
              widths={[640, 768, 1024]}
            />
          </m.div>
        </m.div>

        {/* ── Title (tight to top / dome) ── */}
        <m.div
          className="relative z-10 px-container-x pt-[2vh]"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 id="story-title" className="text-heading text-fluid-story text-white">
            {STORY_TITLE}
          </h2>
        </m.div>

        {/* ── Body text + CTA ── */}
        <m.div
          className="relative z-10 mt-6 px-container-x"
          style={{ opacity: textExitOpacity, y: textExitY }}
        >
          <ScrollWordReveal
            as="p"
            scrollYProgress={scrollYProgress}
            revealStart={0.05}
            revealEnd={0.18}
            className="text-body-xl text-white/80"
          >
            {STORY_BODY}
          </ScrollWordReveal>
          <div className="mt-6">
            <LinkCTA to="/a-propos" theme="dark" className="!text-white">
              Nous découvrir
            </LinkCTA>
          </div>
        </m.div>

        {/* Spacer — photo band sits right after CTA */}
        <div className="flex-1" />

        {/* ── Dark overlay for outro ── */}
        <m.div
          className="pointer-events-none absolute inset-0 z-20 bg-black"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />

        {/* ── Outro: VOYEZ / GRAND / PAYEZ / PETIT → GRAND zooms yellow ── */}
        <m.div
          className="absolute inset-0 z-30 flex flex-col items-start justify-center px-container-x"
          style={{ pointerEvents: outroPointer }}
        >
          {/* VOYEZ — fades out during GRAND zoom */}
          <m.span
            className="text-heading text-fluid-outro text-white"
            style={{ opacity: word1Opacity, y: word1Y }}
          >
            <m.span style={{ opacity: surroundingFade }}>VOYEZ</m.span>
          </m.span>

          {/* GRAND — stays, changes color, zooms to fill viewport */}
          {/* Ghost spacer — keeps flex layout identical to original */}
          <span className="relative inline-flex items-center">
            <span
              className="text-heading text-fluid-outro invisible select-none"
              aria-hidden="true"
            >
              GRAND
            </span>
            {/* Actual GRAND — oversized font for crisp zoom rasterization */}
            <m.span
              className="text-heading absolute inset-0 flex items-center justify-center overflow-visible whitespace-nowrap will-change-transform"
              style={{
                fontSize: 'calc(clamp(3.5rem, 20vw, 12rem) * 10)',
                lineHeight: '0.85',
                opacity: word2Opacity,
                y: word2Y,
                color: grandColor,
                scale: grandScale,
                transformOrigin: 'center center',
              }}
            >
              GRAND
            </m.span>
          </span>

          {/* PAYEZ — fades out during GRAND zoom */}
          <m.span
            className="text-heading text-fluid-outro mt-2 text-white"
            style={{ opacity: word3Opacity, y: word3Y }}
          >
            <m.span style={{ opacity: surroundingFade }}>PAYEZ</m.span>
          </m.span>

          {/* PETIT — fades out during GRAND zoom */}
          <m.span
            className="text-heading text-fluid-outro text-white"
            style={{ opacity: word4Opacity, y: word4Y }}
          >
            <m.span style={{ opacity: surroundingFade }}>PETIT</m.span>
          </m.span>

          {/* CTA — fades out before GRAND zoom */}
          <m.div className="mt-6" style={{ opacity: ctaOpacity }}>
            <m.div style={{ opacity: surroundingFade }}>
              <LinkCTA to="/a-propos" theme="dark">
                Nous découvrir
              </LinkCTA>
            </m.div>
          </m.div>
        </m.div>

        {/* ── Yellow overlay — safety net as GRAND fills screen ── */}
        <m.div
          className="pointer-events-none absolute inset-0 z-40 bg-accent"
          style={{ opacity: yellowOverlay }}
          aria-hidden="true"
        />

        {/* Navbar theme strip */}
        <div
          ref={navRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-50 h-20"
          data-navbar-theme="light"
        />
      </div>
    </div>
  );
}
