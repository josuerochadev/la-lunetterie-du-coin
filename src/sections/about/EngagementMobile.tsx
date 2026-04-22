import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { ENGAGEMENT_TITLE, ENGAGEMENT_BODY, ENGAGEMENT_HIGHLIGHT } from './AboutEngagement';

import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { GiantCounter } from '@/components/motion/GiantCounter';
import { STATS_DATA, type StatData } from '@/data/about';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';

// ---------------------------------------------------------------------------
// Mobile animated stat card — uses section scrollYProgress
// ---------------------------------------------------------------------------

function MobileStatCard({
  stat,
  index,
  scrollYProgress,
}: {
  stat: StatData;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const stagger = index * 0.05;
  const start = 0.12 + stagger;
  const end = start + 0.12;

  const numberScale = useTransform(scrollYProgress, [start, end], [0.8, 1]);
  const numberOpacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const numberY = useTransform(scrollYProgress, [start, end], [30, 0]);

  const borderScaleX = useTransform(scrollYProgress, [start, start + 0.08], [0, 1]);

  const labelOpacity = useTransform(scrollYProgress, [start + 0.04, end + 0.04], [0, 1]);
  const labelYRaw = useTransform(scrollYProgress, [start + 0.04, end + 0.04], [20, 0]);
  const labelY = useSpring(labelYRaw, SPRING_CONFIG);

  return (
    <div className="text-center">
      <m.div
        className="mx-auto mb-4 h-0.5 w-full origin-left bg-secondary-orange will-change-transform"
        style={{ scaleX: borderScaleX }}
      />
      <m.div
        className="text-heading text-secondary-orange will-change-transform"
        style={{
          fontSize: 'clamp(1.75rem, 6vw, 3rem)',
          scale: numberScale,
          opacity: numberOpacity,
          y: numberY,
        }}
      >
        {stat.number}
      </m.div>
      <m.div
        className="mt-2 text-body-xs text-black will-change-transform sm:text-body-sm"
        style={{ opacity: labelOpacity, y: labelY }}
      >
        {stat.label}
      </m.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile animated — sticky viewport with scroll-driven animations
//
//  200vh container with sticky viewport
//  useManualScrollProgress('start-start') — progress 0→1 over 100vh
//
//  0.00 – 0.10  Title entrance (opacity + Y slide)
//  0.00 – 0.15  Title ScrollWordReveal (word-by-word)
//  0.12 – 0.35  Stats cascade (3-col, staggered on section scroll)
//  0.30 – 0.50  Body text ScrollWordReveal (centered)
//  0.45 – 0.60  Highlight entrance (centered)
//  0.75 – 0.90  Exit — gentle fade out + drift up
// ---------------------------------------------------------------------------

export default function EngagementMobile() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Title entrance
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.1], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.0, 0.1], [40, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Body text gate
  const bodyOpacity = useTransform(scrollYProgress, [0.3, 0.38], [0, 1]);

  // Highlight entrance
  const highlightOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const highlightYRaw = useTransform(scrollYProgress, [0.45, 0.6], [20, 0]);
  const highlightY = useSpring(highlightYRaw, SPRING_CONFIG);

  // Exit — gentle fade
  const exitOpacity = useTransform(scrollYProgress, [0.75, 0.9], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.75, 0.9], [0, -30]);

  return (
    <div ref={ref} className="h-[200vh] bg-background">
      <div className="sticky top-0 h-svh overflow-hidden bg-background">
        {/* GiantCounter background */}
        <GiantCounter
          scrollYProgress={scrollYProgress}
          countRange={[0.02, 0.25]}
          countValues={[0, 2000]}
          formatValue={(v) => Math.round(v).toLocaleString('fr-FR')}
          opacityRange={[0.01, 0.08, 0.75, 0.9]}
          peakOpacity={0.08}
          fontSize="clamp(8rem, 22vw, 14rem)"
          className="text-black/[0.06]"
        />

        <m.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-container-x"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          <div className="w-full max-w-4xl">
            {/* Title — centered */}
            <m.div className="mb-6 text-center" style={{ opacity: titleOpacity, y: titleY }}>
              <ScrollWordReveal
                as="h2"
                scrollYProgress={scrollYProgress}
                revealStart={0.0}
                revealEnd={0.15}
                className="heading-section text-black"
              >
                {ENGAGEMENT_TITLE}
              </ScrollWordReveal>
            </m.div>

            {/* Stats — 3-col centered, staggered cascade */}
            <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
              {STATS_DATA.map((stat, i) => (
                <MobileStatCard
                  key={stat.label}
                  stat={stat}
                  index={i}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>

            {/* Body — centered */}
            <m.div className="mb-6 text-center" style={{ opacity: bodyOpacity }}>
              <ScrollWordReveal
                as="p"
                scrollYProgress={scrollYProgress}
                revealStart={0.3}
                revealEnd={0.5}
                className="text-body text-black"
              >
                {ENGAGEMENT_BODY}
              </ScrollWordReveal>
            </m.div>

            {/* Highlight — centered */}
            <m.p
              className="text-center text-body-sm italic text-secondary-orange will-change-transform"
              style={{ opacity: highlightOpacity, y: highlightY }}
            >
              {ENGAGEMENT_HIGHLIGHT}
            </m.p>
          </div>
        </m.div>
      </div>
    </div>
  );
}
