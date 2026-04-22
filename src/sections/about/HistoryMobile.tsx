import { useRef } from 'react';
import { m, useTransform, useMotionValueEvent } from 'framer-motion';

import { STORY_TITLE, STORY_BODY, STORY_BODY_2 } from './AboutHistory';

import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { usePointerEvents } from '@/hooks/usePointerEvents';

// ---------------------------------------------------------------------------
// Mobile animated — scroll-driven story + outro + photo dissolve to yellow
//
//  350vh container with sticky viewport
//  Total scroll range: 350vh + 100vh = 450vh (offset start-end / end-start)
//
//  Phase 1  (0.04–0.12) : Title "Notre Histoire" slides up + fades in
//  Phase 2  (0.04–0.16) : Body text 1 ScrollWordReveal
//  Phase 3  (0.12–0.24) : Body text 2 ScrollWordReveal
//  Phase 4  (0.12–0.28) : Photo reveals from bottom band (clip 70%)
//  Phase 5  (0.28–0.42) : Photo expands fullscreen (clip 70%→0%, covers text)
//  Phase 6  (0.28–0.58) : Photo Ken Burns zoom
//  Phase 7  (0.12–0.38) : Photo brightens (0.45→0.8)
//  Phase 8  (0.20–0.28) : CTA fades in
//  Phase 9  (0.36–0.46) : Title exit upward (behind photo)
//  Phase 10 (0.38–0.48) : Text + CTA exit upward
//  Phase 11 (0.44–0.52) : Dark overlay on photo (0→0.6)
//  Phase 12 (0.48–0.53) : Outro stagger — UNE / VISION / DIFFÉRENTE
//  Phase 13 (0.54–0.60) : Outro CTA entrance
//  Phase 14 (0.60–0.66) : Outro + CTA fade out
//  Phase 15 (0.64–0.70) : Photo dissolves (opacity → 0)
//  Phase 16 (0.68–0.78) : Yellow overlay fills screen
//  Phase 17 (0.72+)     : Navbar theme → dark
// ---------------------------------------------------------------------------

export default function HistoryMobile() {
  const navRef = useRef<HTMLDivElement>(null);

  // useManualScrollProgress bypasses framer-motion's useScroll bug for
  // targets behind stacked sticky sections.
  const { ref, scrollYProgress } = useManualScrollProgress('end-start');

  // ── Title entrance: slides up + fades in ──
  const titleEntranceOpacity = useTransform(scrollYProgress, [0.04, 0.12], [0, 1]);
  const titleEntranceY = useTransform(scrollYProgress, [0.04, 0.12], [40, 0]);

  // ── Title exit: fades out + slides up (behind photo) ──
  const titleExitOpacity = useTransform(scrollYProgress, [0.36, 0.46], [1, 0]);
  const titleExitY = useTransform(scrollYProgress, [0.36, 0.46], [0, -250]);

  // Combined title transforms
  const titleOpacity = useTransform(
    [titleEntranceOpacity, titleExitOpacity],
    ([enter, exit]: number[]) => Math.min(enter, exit),
  );
  const titleY = useTransform(
    [titleEntranceY, titleExitY],
    ([enter, exit]: number[]) => enter + exit,
  );

  // ── Body text + CTA exit ──
  const textExitOpacity = useTransform(scrollYProgress, [0.38, 0.48], [1, 0]);
  const textExitY = useTransform(scrollYProgress, [0.38, 0.5], [0, -200]);

  // ── CTA entrance (before exit) ──
  const ctaEntranceOpacity = useTransform(scrollYProgress, [0.2, 0.28], [0, 1]);

  // ── Photo: bottom band → fullscreen (grows from bottom to top, covers text) ──
  // Initial band kept low (85%) so it leaves clear breathing room under the CTA.
  const clipTop = useTransform(scrollYProgress, [0.12, 0.28, 0.42], [85, 85, 0]);
  const photoClip = useTransform(clipTop, (t) => `inset(${t}% 0% 0% 0%)`);

  // Ken Burns: gentle zoom only — no vertical drift
  const photoScale = useTransform(scrollYProgress, [0.28, 0.58], [1, 1.15]);

  // Photo brightness: starts dim, brightens as it expands
  const photoBrightness = useTransform(scrollYProgress, [0.12, 0.38], [0.45, 0.8]);
  const photoFilter = useTransform(photoBrightness, (b) => `brightness(${b})`);

  // ── Dark overlay for outro ──
  const overlayOpacity = useTransform(scrollYProgress, [0.44, 0.52], [0, 0.6]);

  // ── Outro: word-by-word stagger — UNE / VISION / DIFFÉRENTE ──
  const STAGGER = 0.025;
  const OUTRO_START = 0.48;

  const word1Opacity = useTransform(scrollYProgress, [OUTRO_START, OUTRO_START + 0.05], [0, 1]);
  const word1Y = useTransform(scrollYProgress, [OUTRO_START, OUTRO_START + 0.05], [40, 0]);

  const word2Opacity = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER, OUTRO_START + STAGGER + 0.05],
    [0, 1],
  );
  const word2Y = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER, OUTRO_START + STAGGER + 0.05],
    [40, 0],
  );

  const word3Opacity = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER * 2, OUTRO_START + STAGGER * 2 + 0.05],
    [0, 1],
  );
  const word3Y = useTransform(
    scrollYProgress,
    [OUTRO_START + STAGGER * 2, OUTRO_START + STAGGER * 2 + 0.05],
    [40, 0],
  );

  const outroPointer = usePointerEvents(word1Opacity);

  // ── Outro CTA entrance ──
  const outroCTAOpacity = useTransform(scrollYProgress, [0.54, 0.6], [0, 1]);

  // ── Outro fade out ──
  const outroFadeOut = useTransform(scrollYProgress, [0.6, 0.66], [1, 0]);

  // ── Photo dissolves on screen — fast fade, no movement ──
  const photoDissolve = useTransform(scrollYProgress, [0.64, 0.7], [1, 0]);

  // ── Yellow overlay — transition to Values section ──
  const yellowOverlay = useTransform(scrollYProgress, [0.68, 0.78], [0, 1]);

  // ── Navbar theme: switch to dark when yellow fills ──
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!navRef.current) return;
    navRef.current.setAttribute('data-navbar-theme', v >= 0.72 ? 'dark' : 'light');
  });

  return (
    <div ref={ref} className="relative h-[350vh] xl:hidden">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* ── Photo — ABOVE text (z-20), grows upward to cover content ── */}
        <m.div
          className="absolute inset-0 z-20 overflow-hidden will-change-[clip-path]"
          style={{ clipPath: photoClip, opacity: photoDissolve }}
        >
          <m.div
            className="h-full w-full will-change-transform"
            style={{ scale: photoScale, filter: photoFilter }}
          >
            <ResponsiveImage
              src="/images/about-history-shop-indoors.png"
              alt="Intérieur de La Lunetterie du Coin"
              className="h-full w-full object-cover"
              loading="lazy"
              sizes="100vw"
              widths={[640, 768, 1024]}
            />
          </m.div>
        </m.div>

        {/* ── Title (below dome area) ── */}
        <m.div
          className="relative z-10 px-container-x pt-[14vw]"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 id="histoire-title" className="text-heading text-fluid-story text-black">
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
            revealStart={0.04}
            revealEnd={0.16}
            className="text-body-xl text-black"
          >
            {STORY_BODY}
          </ScrollWordReveal>

          <div className="mt-4">
            <ScrollWordReveal
              as="p"
              scrollYProgress={scrollYProgress}
              revealStart={0.12}
              revealEnd={0.24}
              className="text-body text-black"
            >
              {STORY_BODY_2}
            </ScrollWordReveal>
          </div>

          <m.div className="mt-6" style={{ opacity: ctaEntranceOpacity }}>
            <LinkCTA to="/services" theme="light">
              Voir nos services
            </LinkCTA>
          </m.div>
        </m.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Dark overlay for outro ── */}
        <m.div
          className="pointer-events-none absolute inset-0 z-30 bg-black"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />

        {/* ── Outro: UNE / VISION / DIFFÉRENTE — stagger entrance, then fade ── */}
        <m.div
          className="absolute inset-0 z-30 flex flex-col items-start justify-center px-container-x"
          style={{ pointerEvents: outroPointer }}
        >
          <m.span
            className="text-heading text-accent will-change-transform"
            style={{
              fontSize: 'clamp(2.5rem, 14vw, 8rem)',
              lineHeight: 0.85,
              opacity: word1Opacity,
              y: word1Y,
            }}
          >
            <m.span style={{ opacity: outroFadeOut }}>UNE</m.span>
          </m.span>

          <m.span
            className="text-heading text-accent will-change-transform"
            style={{
              fontSize: 'clamp(2.5rem, 14vw, 8rem)',
              lineHeight: 0.85,
              opacity: word2Opacity,
              y: word2Y,
            }}
          >
            <m.span style={{ opacity: outroFadeOut }}>VISION</m.span>
          </m.span>

          <m.span
            className="text-heading text-accent will-change-transform"
            style={{
              fontSize: 'clamp(2.5rem, 14vw, 8rem)',
              lineHeight: 0.85,
              opacity: word3Opacity,
              y: word3Y,
            }}
          >
            <m.span style={{ opacity: outroFadeOut }}>DIFFÉRENTE</m.span>
          </m.span>

          {/* CTA — under the outro phrase */}
          <m.div className="mt-6" style={{ opacity: outroCTAOpacity }}>
            <m.div style={{ opacity: outroFadeOut }}>
              <LinkCTA to="/services" theme="dark">
                Voir nos services
              </LinkCTA>
            </m.div>
          </m.div>
        </m.div>

        {/* ── Yellow overlay — transition to Values ── */}
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
