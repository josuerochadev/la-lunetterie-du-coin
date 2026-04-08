import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';
import Heart from 'lucide-react/dist/esm/icons/heart';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Award from 'lucide-react/dist/esm/icons/award';

import { VALUES_DATA } from '@/data/about';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import EyePattern from '@/components/common/EyePattern';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';

const iconMap = {
  heart: Heart,
  leaf: Leaf,
  award: Award,
} as const;

// ---------------------------------------------------------------------------
// Animated value card — hooks at component level (not inside .map())
// ---------------------------------------------------------------------------

function ValueCard({
  value,
  index,
  scrollYProgress,
}: {
  value: (typeof VALUES_DATA)[number];
  index: number;
  scrollYProgress: import('framer-motion').MotionValue<number>;
}) {
  const start = 0.1 + index * 0.1;
  const end = start + 0.12;

  const entrance = useScrollEntrance(scrollYProgress, start, end, 100);

  const tiltDir = index === 0 ? 6 : index === 2 ? -6 : 0;
  const rotateYRaw = useTransform(scrollYProgress, [start, end], [tiltDir, 0]);
  const rotateY = useSpring(rotateYRaw, SPRING_CONFIG);
  const rotateXRaw = useTransform(scrollYProgress, [start, end], [8, 0]);
  const rotateX = useSpring(rotateXRaw, SPRING_CONFIG);
  const scale = useTransform(scrollYProgress, [start, end], [0.9, 1]);

  const Icon = iconMap[value.iconName];

  return (
    <m.div
      className="will-change-transform"
      style={{
        opacity: entrance.opacity,
        y: entrance.y,
        rotateY,
        rotateX,
        scale,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="space-y-5">
        <Icon className="h-10 w-10 text-secondary-orange" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="text-subtitle text-title-sm text-black">{value.title}</h3>
        <p className="text-body text-black/60">{value.description}</p>
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Desktop animated — scroll-driven card cascade with 3D tilt
//
//  300vh container
//
//  0.00 – 0.10  Title ScrollWordReveal
//  0.10 – 0.25  Card 1 enters (slide-up + tilt settle)
//  0.20 – 0.35  Card 2 enters (staggered)
//  0.30 – 0.45  Card 3 enters (staggered)
//  0.45 – 0.70  Hold
//  0.70 – 0.85  Exit — fade out + Y drift
// ---------------------------------------------------------------------------

function ValuesDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Title
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.05], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.0, 0.08], [60, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Exit — fade out all content
  const exitOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.7, 0.85], [0, -40]);

  return (
    <div ref={sectionRef} className="hidden h-[300vh] xl:block">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: '800px' }}>
        <m.div
          className="flex h-full flex-col items-center justify-center px-container-x"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          {/* Title */}
          <m.div className="mb-16 text-center" style={{ opacity: titleOpacity, y: titleY }}>
            <ScrollWordReveal
              as="h2"
              scrollYProgress={scrollYProgress}
              revealStart={0.0}
              revealEnd={0.08}
              className="heading-section text-black"
            >
              Une lunetterie qui a du cœur
            </ScrollWordReveal>
          </m.div>

          {/* Cards — 3 columns */}
          <div className="grid w-full max-w-6xl grid-cols-3 gap-12">
            {VALUES_DATA.map((value, i) => (
              <ValueCard
                key={value.title}
                value={value}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </m.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile animated — curtain reveal from History's yellow overlay
//
//  250vh container with sticky viewport
//  Uses useManualScrollProgress('start-start')
//  Total scroll range: 250vh − 100vh = 150vh
//
//  0.00 – 0.27  Clip-path reveals content top → bottom
//  0.05 – 0.17  Title micro-scale 0.97 → 1
//  0.10 – 0.31  Cards staggered micro-movements (scale 0.97→1, Y -8→0)
//  0.31 – 1.00  Hold — content fully visible, Team curtain rises over
//
//  Team's StickySection has -mt-[100vh], so Team enters at progress ~0.33
//  while Values is still pinned → full-viewport curtain effect.
// ---------------------------------------------------------------------------

function MobileRevealCard({
  value,
  index,
  scrollYProgress,
}: {
  value: (typeof VALUES_DATA)[number];
  index: number;
  scrollYProgress: import('framer-motion').MotionValue<number>;
}) {
  const stagger = index * 0.04;
  const start = 0.1 + stagger;
  const end = start + 0.13;

  const scale = useTransform(scrollYProgress, [start, end], [0.97, 1]);
  const y = useTransform(scrollYProgress, [start, end], [-8, 0]);

  const Icon = iconMap[value.iconName];

  return (
    <m.div
      className="space-y-3 text-center will-change-transform sm:space-y-4"
      style={{ scale, y }}
    >
      <Icon
        className="mx-auto h-8 w-8 text-secondary-orange"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h3 className="text-subtitle text-title-sm tracking-[0.1em] text-black sm:tracking-[0.2em]">
        {value.title}
      </h3>
      <p className="text-body text-black">{value.description}</p>
    </m.div>
  );
}

function ValuesMobileAnimated() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Clip-path: reveals content from top to bottom
  const clipBottom = useTransform(scrollYProgress, [0.0, 0.27], [100, 0]);
  const contentClip = useTransform(clipBottom, (b) => `inset(0% 0% ${b}% 0%)`);

  // Title micro-scale — settles into place as clip opens
  const titleScaleRaw = useTransform(scrollYProgress, [0.05, 0.17], [0.97, 1]);
  const titleScale = useSpring(titleScaleRaw, SPRING_CONFIG);

  return (
    <div ref={ref} className="relative z-10 h-[250vh] xl:hidden">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pb-[5vh] pt-[3vh] sm:pb-[6vh] sm:pt-[4vh]">
        <m.div
          className="w-full px-container-x will-change-[clip-path]"
          style={{ clipPath: contentClip }}
        >
          {/* Title — centered, revealed by clip */}
          <m.div
            className="mb-6 text-center will-change-transform sm:mb-8"
            style={{ scale: titleScale }}
          >
            <h2 className="heading-section text-black">Une lunetterie qui a du cœur</h2>
          </m.div>

          {/* Cards grid — staggered micro-movements */}
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-10">
            {VALUES_DATA.map((value, i) => (
              <MobileRevealCard
                key={value.title}
                value={value}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </m.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AboutValues() {
  const variant = useResponsiveMotion();

  return (
    <section
      id="valeurs"
      aria-label="Nos valeurs"
      className="relative w-full bg-accent"
      data-navbar-theme="dark"
    >
      <EyePattern variant="jaune" opacity={0.07} />

      {variant === 'desktop-animated' && <ValuesDesktop />}
      {variant === 'mobile-animated' && <ValuesMobileAnimated />}
      {variant === 'static' && (
        <div className="relative z-10">
          <div className="mx-auto max-w-container px-container-x py-section">
            <SimpleAnimation type="slide-up" delay={0}>
              <div className="mb-12 text-center lg:mb-16">
                <h2 className="heading-section text-black">Une lunetterie qui a du cœur</h2>
              </div>
            </SimpleAnimation>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {VALUES_DATA.map((value, i) => {
                const Icon = iconMap[value.iconName];
                return (
                  <SimpleAnimation key={value.title} type="slide-up" delay={100 + i * 100}>
                    <div className="space-y-4">
                      <Icon
                        className="h-8 w-8 text-secondary-orange"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h3 className="text-subtitle text-title-sm text-black">{value.title}</h3>
                      <p className="text-body text-black/60">{value.description}</p>
                    </div>
                  </SimpleAnimation>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
