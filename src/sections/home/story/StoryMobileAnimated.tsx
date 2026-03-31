import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { STORY_TITLE, STORY_BODY, STORY_IMAGE, STORY_IMAGE_ALT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';

export function StoryMobileAnimated() {
  const textRef = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ['start end', 'end start'],
  });

  const { scrollYProgress: photoProgress } = useScroll({
    target: photoWrapRef,
    offset: ['start start', 'end start'],
  });

  // CTA — scroll-driven opacity instead of generic slide-up
  const ctaOpacity = useTransform(textProgress, [0.2, 0.28], [0, 1]);

  // ── Phase 2: Photo — lens opening effect ──
  // Starts with inset + rounded corners, expands to fill viewport
  const insetX = useTransform(photoProgress, [0, 0.35], ['7.5%', '0%']);
  const insetY = useTransform(photoProgress, [0, 0.35], ['20%', '0%']);
  // Continuous internal zoom for life
  const photoScale = useTransform(photoProgress, [0, 0.5], [1, 1.12]);

  // ── Phase 3: Transition phrase + exit ──
  // Dark overlay fades in over the photo
  const overlayOpacity = useTransform(photoProgress, [0.4, 0.55], [0, 0.65]);
  // "VOYEZ GRAND" entrance
  const voyezOpacity = useTransform(photoProgress, [0.45, 0.55], [0, 1]);
  const voyezY = useTransform(photoProgress, [0.45, 0.55], [30, 0]);
  const voyezScale = useTransform(photoProgress, [0.55, 0.8], [1, 1.3]);
  // "PAYEZ PETIT" entrance — slight delay
  const petitOpacity = useTransform(photoProgress, [0.52, 0.62], [0, 1]);
  const petitY = useTransform(photoProgress, [0.52, 0.62], [20, 0]);
  // Everything fades out at the end
  const exitOpacity = useTransform(photoProgress, [0.78, 0.92], [1, 0]);

  return (
    <div className="lg:hidden">
      {/* Phase 1: Text content — scroll-driven word reveals */}
      <div ref={textRef} className="px-container-x">
        <ScrollWordReveal
          as="h2"
          id="story-title"
          scrollYProgress={textProgress}
          revealStart={0.0}
          revealEnd={0.12}
          className="text-heading text-fluid-story text-white"
        >
          {STORY_TITLE}
        </ScrollWordReveal>

        <div className="mt-8">
          <ScrollWordReveal
            as="p"
            scrollYProgress={textProgress}
            revealStart={0.05}
            revealEnd={0.22}
            className="text-body-xl text-secondary-blue"
          >
            {STORY_BODY}
          </ScrollWordReveal>
        </div>

        <m.div className="mt-10" style={{ opacity: ctaOpacity }}>
          <LinkCTA to="/a-propos" theme="dark" className="text-body-sm !text-white">
            Nous découvrir
          </LinkCTA>
        </m.div>
      </div>

      {/* Phase 2 + 3: Photo cinématique + transition phrase */}
      <div ref={photoWrapRef} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen">
          {/* Photo — expands from inset to fullscreen */}
          <m.div
            className="absolute z-0 overflow-hidden will-change-[top,bottom,left,right]"
            style={{
              top: insetY,
              bottom: insetY,
              left: insetX,
              right: insetX,
            }}
          >
            <m.img
              src={STORY_IMAGE}
              alt={STORY_IMAGE_ALT}
              className="h-full w-full object-cover will-change-transform"
              loading="lazy"
              style={{ scale: photoScale }}
            />
          </m.div>

          {/* Dark overlay — above the photo */}
          <m.div
            className="pointer-events-none absolute inset-0 z-10 bg-black"
            style={{ opacity: overlayOpacity }}
            aria-hidden="true"
          />

          {/* Transition phrase — "VOYEZ GRAND / PAYEZ PETIT" */}
          <m.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2"
            style={{ opacity: exitOpacity }}
            aria-hidden="true"
          >
            <m.span
              className="text-heading text-title-md text-accent will-change-transform"
              style={{ opacity: voyezOpacity, y: voyezY, scale: voyezScale }}
            >
              VOYEZ GRAND
            </m.span>
            <m.span
              className="text-heading text-title-sm text-accent"
              style={{ opacity: petitOpacity, y: petitY }}
            >
              PAYEZ PETIT
            </m.span>
          </m.div>
        </div>
      </div>
    </div>
  );
}
