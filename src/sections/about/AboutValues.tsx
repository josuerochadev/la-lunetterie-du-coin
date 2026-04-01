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
        <p className="text-body text-black">{value.description}</p>
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
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Title
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.05], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.0, 0.08], [60, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Exit — fade out all content
  const exitOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.7, 0.85], [0, -40]);

  return (
    <div ref={ref} className="hidden h-[300vh] lg:block">
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
// Mobile animated — per-card scroll-driven entrance with accent bar
// ---------------------------------------------------------------------------

type ValueData = (typeof VALUES_DATA)[number];

function MobileValueCard({ value, index }: { value: ValueData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Accent bar: scaleX 0→1 from left (0.00–0.20)
  const barScaleX = useTransform(scrollYProgress, [0.0, 0.2], [0, 1]);

  // Card entrance: scale 0.95→1, opacity 0→1, Y 30→0 (0.05–0.22)
  const cardScale = useTransform(scrollYProgress, [0.05, 0.22], [0.95, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0.05, 0.22], [0, 1]);
  const cardY = useTransform(scrollYProgress, [0.05, 0.22], [30, 0]);

  // Icon: scale 0→1 with slight overshoot (0.08–0.25)
  const iconScale = useTransform(scrollYProgress, [0.08, 0.25], [0, 1.08]);
  const iconSettled = useTransform(scrollYProgress, [0.25, 0.28], [1.08, 1]);

  // Title: opacity + Y (0.12–0.28)
  const titleOpacity = useTransform(scrollYProgress, [0.12, 0.28], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.12, 0.28], [16, 0]);

  // Description: opacity + Y (0.18–0.32)
  const descOpacity = useTransform(scrollYProgress, [0.18, 0.32], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.18, 0.32], [16, 0]);

  const Icon = iconMap[value.iconName];

  // Merge icon overshoot into settled value
  const iconFinalScale = useTransform(
    [iconScale, iconSettled] as const,
    ([s, settled]: [number, number]) => (s >= 1.08 ? settled : s),
  );

  // Alternate subtle rotation for visual variety
  const cardRotate = useTransform(scrollYProgress, [0.05, 0.22], [index % 2 === 0 ? 1 : -1, 0]);

  return (
    <m.div
      ref={ref}
      className="space-y-4 will-change-transform"
      style={{ opacity: cardOpacity, y: cardY, scale: cardScale, rotate: cardRotate }}
    >
      {/* Accent bar */}
      <m.div
        className="h-0.5 w-12 origin-left bg-secondary-orange will-change-transform"
        style={{ scaleX: barScaleX }}
      />

      {/* Icon */}
      <m.div className="will-change-transform" style={{ scale: iconFinalScale }}>
        <Icon className="h-8 w-8 text-secondary-orange" strokeWidth={1.5} aria-hidden="true" />
      </m.div>

      {/* Title */}
      <m.h3
        className="text-subtitle text-title-sm text-black will-change-transform"
        style={{ opacity: titleOpacity, y: titleY }}
      >
        {value.title}
      </m.h3>

      {/* Description */}
      <m.p
        className="text-body text-black will-change-transform"
        style={{ opacity: descOpacity, y: descY }}
      >
        {value.description}
      </m.p>
    </m.div>
  );
}

function ValuesMobileAnimated() {
  const titleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: titleProgress } = useScroll({
    target: titleRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div className="relative z-10 lg:hidden">
      <div className="mx-auto max-w-container px-container-x py-section">
        {/* Title with ScrollWordReveal */}
        <div ref={titleRef} className="mb-12 text-center">
          <ScrollWordReveal
            as="h2"
            scrollYProgress={titleProgress}
            revealStart={0.0}
            revealEnd={0.25}
            className="heading-section text-black"
          >
            Une lunetterie qui a du cœur
          </ScrollWordReveal>
        </div>

        {/* Cards grid */}
        <div className="grid gap-10 sm:grid-cols-2">
          {VALUES_DATA.map((value, i) => (
            <MobileValueCard key={value.title} value={value} index={i} />
          ))}
        </div>
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
                      <p className="text-body text-black">{value.description}</p>
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
