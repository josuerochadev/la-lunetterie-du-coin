import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { STORY_TITLE, STORY_BODY, STORY_IMAGE, STORY_IMAGE_ALT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';

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

  // Text entrances
  const titleEntrance = useScrollEntrance(textProgress, 0.0, 0.12);
  const ctaEntrance = useScrollEntrance(textProgress, 0.2, 0.3);

  // Photo starts small and centered, expands to fill the screen
  const insetX = useTransform(photoProgress, [0, 0.6], ['7.5%', '0%']);
  const insetY = useTransform(photoProgress, [0, 0.6], ['25%', '0%']);
  // Extra zoom once the photo is near fullscreen
  const photoScale = useTransform(photoProgress, [0.4, 1], [1, 1.15]);

  return (
    <div className="lg:hidden">
      {/* Text content — reads first in normal flow */}
      <div ref={textRef} className="px-container-x pb-16 sm:pb-20">
        <m.h2
          id="story-title"
          className="text-heading text-fluid-story text-white"
          style={{
            opacity: titleEntrance.opacity,
            y: titleEntrance.y,
          }}
        >
          {STORY_TITLE}
        </m.h2>

        <div className="mt-8">
          <ScrollWordReveal
            as="p"
            scrollYProgress={textProgress}
            revealStart={0.05}
            revealEnd={0.22}
            className="text-body-xl text-white/80"
          >
            {STORY_BODY}
          </ScrollWordReveal>
        </div>

        <m.div className="mt-10" style={{ opacity: ctaEntrance.opacity, y: ctaEntrance.y }}>
          <LinkCTA to="/a-propos" theme="dark" className="text-body-sm">
            Nous découvrir
          </LinkCTA>
        </m.div>
      </div>

      {/* Sticky photo — starts small, zooms to fullscreen, covered by next section */}
      <div ref={photoWrapRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen">
          <m.div
            className="absolute overflow-hidden"
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
              className="h-full w-full object-cover"
              loading="lazy"
              style={{ scale: photoScale }}
            />
          </m.div>
        </div>
      </div>
    </div>
  );
}
