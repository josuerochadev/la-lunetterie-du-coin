import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';

const STORY_TITLE = 'Notre Histoire';
const STORY_BODY =
  'En 2016, La Lunetterie du Coin ouvre ses portes avec une idée simple : restaurer des montures plutôt que les jeter. Ajoutez une sélection pointue de créateurs, un vrai conseil — et la boutique était née.';
const STORY_BODY_2 =
  "Aujourd'hui, c'est l'adresse à Strasbourg pour des lunettes uniques et un service qui prend le temps.";

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

function HistoryDesktop() {
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
  const photoLeft = useTransform(scrollYProgress, [0.42, 0.54], ['28%', '0%']);
  const photoWidth = useTransform(scrollYProgress, [0.42, 0.54], ['36%', '100%']);
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
    <div ref={sectionRef} className="relative z-10 hidden min-h-[400vh] lg:block">
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
              revealStart={0.12}
              revealEnd={0.22}
              className="heading-section text-black"
            >
              {STORY_TITLE}
            </ScrollWordReveal>
          </m.div>

          {/* Center — photo with clipPath reveal */}
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
                  widths={[640, 768, 1024]}
                  sizes="(min-width: 1024px) 36vw, 100vw"
                />
              </m.div>
            </m.div>
          </m.div>

          {/* Right — body text */}
          <m.div
            className="ml-[36%] w-[36%] pl-8 will-change-transform"
            style={{ opacity: textCombinedOpacity }}
          >
            <ScrollWordReveal
              as="p"
              scrollYProgress={scrollYProgress}
              revealStart={0.16}
              revealEnd={0.28}
              className="text-body-xl text-black"
            >
              {STORY_BODY}
            </ScrollWordReveal>

            <m.div className="mt-8" style={{ opacity: textCombinedOpacity }}>
              <ScrollWordReveal
                as="p"
                scrollYProgress={scrollYProgress}
                revealStart={0.26}
                revealEnd={0.32}
                className="text-body-lg text-black"
              >
                {STORY_BODY_2}
              </ScrollWordReveal>
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

// ---------------------------------------------------------------------------
// Mobile animated — scroll-driven story + photo dissolve to yellow
//
//  200vh container with sticky viewport
//  Total scroll range: 200vh + 100vh = 300vh (offset start-end / end-start)
//
//  Phase 1 (0.05–0.14) : Title "Notre Histoire" slides up + fades in
//  Phase 2 (0.05–0.20) : Body text 1 ScrollWordReveal
//  Phase 3 (0.16–0.30) : Body text 2 ScrollWordReveal
//  Phase 4 (0.16–0.24) : Photo reveals from bottom band (clip 70%→0%)
//  Phase 5 (0.24–0.55) : Photo Ken Burns zoom (no drift)
//  Phase 6 (0.16–0.38) : Photo brightens (0.45→0.8)
//  Phase 7 (0.24–0.32) : CTA fades in
//  Phase 8 (0.32–0.44) : Title + text + CTA fade out + exit upward
//  Phase 9 (0.44–0.60) : Photo dissolves (opacity → 0)
//  Phase 10 (0.52–0.68): Yellow overlay fills screen
//  Phase 11 (0.62+)    : Navbar theme → dark
// ---------------------------------------------------------------------------

function HistoryMobileAnimated() {
  const ref = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // ── Title entrance: slides up + fades in ──
  const titleEntranceOpacity = useTransform(scrollYProgress, [0.05, 0.14], [0, 1]);
  const titleEntranceY = useTransform(scrollYProgress, [0.05, 0.14], [40, 0]);

  // ── Title exit: fades out + slides up ──
  const titleExitOpacity = useTransform(scrollYProgress, [0.32, 0.44], [1, 0]);
  const titleExitY = useTransform(scrollYProgress, [0.32, 0.44], [0, -250]);

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
  const textExitOpacity = useTransform(scrollYProgress, [0.34, 0.46], [1, 0]);
  const textExitY = useTransform(scrollYProgress, [0.34, 0.48], [0, -200]);

  // ── CTA entrance (before exit) ──
  const ctaEntranceOpacity = useTransform(scrollYProgress, [0.24, 0.32], [0, 1]);

  // ── Photo: bottom band → fullscreen (grows from bottom to top) ──
  const clipTop = useTransform(scrollYProgress, [0.16, 0.24, 0.48], [70, 70, 0]);
  const photoClip = useTransform(clipTop, (t) => `inset(${t}% 0% 0% 0%)`);

  // Ken Burns: gentle zoom only — no vertical drift
  const photoScale = useTransform(scrollYProgress, [0.24, 0.55], [1, 1.15]);

  // Photo brightness: starts dim, brightens as it expands
  const photoBrightness = useTransform(scrollYProgress, [0.16, 0.38], [0.45, 0.8]);
  const photoFilter = useTransform(photoBrightness, (b) => `brightness(${b})`);

  // ── Photo dissolves on screen — no movement, just fade ──
  const photoDissolve = useTransform(scrollYProgress, [0.44, 0.6], [1, 0]);

  // ── Yellow overlay — transition to Values section ──
  const yellowOverlay = useTransform(scrollYProgress, [0.52, 0.68], [0, 1]);

  // ── Navbar theme: switch to dark when yellow fills ──
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!navRef.current) return;
    navRef.current.setAttribute('data-navbar-theme', v >= 0.62 ? 'dark' : 'light');
  });

  return (
    <div ref={ref} className="relative h-[200vh] lg:hidden">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* ── Photo — below content, grows upward, dissolves in place ── */}
        <m.div
          className="absolute inset-0 z-0 overflow-hidden will-change-[clip-path]"
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
            revealStart={0.05}
            revealEnd={0.2}
            className="text-body-xl text-black"
          >
            {STORY_BODY}
          </ScrollWordReveal>

          <div className="mt-4">
            <ScrollWordReveal
              as="p"
              scrollYProgress={scrollYProgress}
              revealStart={0.16}
              revealEnd={0.3}
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

        {/* Spacer — photo band sits right after CTA */}
        <div className="flex-1" />

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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AboutHistory() {
  const variant = useResponsiveMotion();

  return (
    <section
      id="histoire"
      className="relative w-full"
      style={{
        background:
          'linear-gradient(to bottom, transparent 12vw, rgb(var(--color-yellow-rgb)) 12vw)',
      }}
      aria-labelledby="histoire-title"
      data-navbar-theme="light"
    >
      {/* Convex dome — CSS border-radius (like HomeStory)
          Height extended to 24vw so it overlaps the gradient start at 12vw,
          preventing a visible seam between dome and section bg. */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[11vw] z-[1] h-[24vw] overflow-hidden"
        aria-hidden="true"
        data-navbar-theme="light"
      >
        <div
          className="absolute left-1/2 top-0 h-full w-[140vw] -translate-x-1/2 bg-accent"
          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
        />
      </div>

      {variant === 'desktop-animated' && <HistoryDesktop />}
      {variant === 'mobile-animated' && <HistoryMobileAnimated />}
      {variant === 'static' && (
        <div>
          <div className="relative w-full">
            <SimpleAnimation type="fade" delay={0} immediate>
              <ResponsiveImage
                src="/images/about-history-shop-indoors.png"
                alt="Intérieur de La Lunetterie du Coin"
                className="max-h-[80vh] min-h-[50vh] w-full object-cover"
                widths={[640, 768, 1024]}
                sizes="100vw"
              />
            </SimpleAnimation>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 pb-8 sm:px-8 sm:pb-12">
              <SimpleAnimation type="slide-up" delay={200}>
                <div className="w-full max-w-4xl space-y-4 bg-accent/90 px-container-x py-container-y backdrop-blur-sm">
                  <span className="text-body-sm font-medium uppercase tracking-wider text-black">
                    Notre histoire
                  </span>
                  <h2 id="histoire-title" className="heading-section text-black">
                    Un peu d&apos;histoire
                  </h2>
                  <p className="text-body-lg text-black">{STORY_BODY}</p>
                  <p className="text-body text-black">{STORY_BODY_2}</p>
                  <LinkCTA to="/services" theme="light" className="mt-4">
                    Voir nos services
                  </LinkCTA>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
