import { useRef } from 'react';
import { m, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

import { STORY_TITLE, STORY_BODY, STORY_IMAGE, STORY_IMAGE_ALT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { useFadeInOut } from '@/hooks/useFadeInOut';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG, SPRING_CONFIG_SLOW } from '@/lib/motion';

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
  const photoLeft = useTransform(scrollYProgress, [0.5, 0.6], ['28%', '0%']);
  const photoWidth = useTransform(scrollYProgress, [0.5, 0.6], ['36%', '100%']);
  const photoPadding = useTransform(scrollYProgress, [0.5, 0.6], [16, 0]);
  const photoExpandOpacity = useTransform(scrollYProgress, [0.55, 0.62], [1, 0.7]);

  // Transition phrase — appears, then "GRAND" zooms to fill screen
  const phraseOpacity = useTransform(scrollYProgress, [0.58, 0.66], [0, 1]);
  const phraseY = useTransform(scrollYProgress, [0.58, 0.66], [40, 0]);
  const phraseYSpring = useSpring(phraseY, SPRING_CONFIG);

  // "GRAND" zoom-out phase
  const grandScale = useTransform(scrollYProgress, [0.76, 0.88], [1, 50]);
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
    <div ref={sectionRef} className="hidden min-h-[450vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative flex h-full items-start px-16 pt-[12vh] xl:px-20">
          {/* Left — title */}
          <m.div className="w-[28%] pr-8" style={{ y: titleY, opacity: titleCombinedOpacity }}>
            <ScrollWordReveal
              as="h2"
              id="story-title"
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

          {/* Right — body + CTA */}
          <m.div className="ml-[36%] w-[36%] pl-8" style={{ opacity: textCombinedOpacity }}>
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
