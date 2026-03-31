import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { GiantCounter } from '@/components/motion/GiantCounter';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { STATS_DATA } from '@/data/about';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';

const ENGAGEMENT_TITLE = 'La mode change. La planète, non.';
const ENGAGEMENT_BODY =
  "Des montures restaurées avec soin plutôt que jetées. Ici, l'occasion c'est pas du bas de gamme — c'est du bon sens.";
const ENGAGEMENT_HIGHLIGHT =
  "Ramenez vos anciennes lunettes : jusqu'à 70€ de remise sur votre prochain achat. Bon pour vous, bon pour la planète.";

// ---------------------------------------------------------------------------
// Desktop animated — giant counter bg + stats cascade + text
//
//  280vh container
//
//  0.00 – 0.08  Title ScrollWordReveal
//  0.02 – 0.20  Giant counter 0 → 2000
//  0.10 – 0.30  Stats enter as cascade (staggered)
//  0.25 – 0.45  Body text ScrollWordReveal
//  0.40 – 0.55  Highlight text fades in
//  0.55 – 0.70  Hold
//  0.70 – 0.85  Exit — fade out + Y drift
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Animated stat card — hooks at component level
// ---------------------------------------------------------------------------

function StatCard({
  stat,
  index,
  scrollYProgress,
}: {
  stat: (typeof STATS_DATA)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = 0.1 + index * 0.06;
  const end = start + 0.1;
  const entrance = useScrollEntrance(scrollYProgress, start, end, 60);
  const scale = useTransform(scrollYProgress, [start, end], [0.85, 1]);

  return (
    <m.div
      className="text-center will-change-transform"
      style={{ opacity: entrance.opacity, y: entrance.y, scale }}
    >
      <div className="border-t-2 border-black/10 pt-6">
        <div
          className="text-heading text-secondary-orange"
          style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
        >
          {stat.number}
        </div>
        <div className="mt-2 text-body-sm text-black">{stat.label}</div>
      </div>
    </m.div>
  );
}

function EngagementDesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Title
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.04], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.0, 0.06], [60, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Body text
  const bodyOpacity = useTransform(scrollYProgress, [0.25, 0.32], [0, 1]);

  // Highlight
  const highlight = useScrollEntrance(scrollYProgress, 0.4, 0.5, 20);

  // Exit — fade out content (counter already fades at 0.7–0.8)
  const exitOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.7, 0.85], [0, -40]);

  return (
    <div ref={ref} className="hidden h-[280vh] bg-background lg:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        <GiantCounter
          scrollYProgress={scrollYProgress}
          countRange={[0.02, 0.2]}
          countValues={[0, 2000]}
          formatValue={(v) => Math.round(v).toLocaleString('fr-FR')}
          opacityRange={[0.01, 0.08, 0.7, 0.8]}
          peakOpacity={0.08}
          fontSize="clamp(12rem, 30vw, 40rem)"
          className="text-black/[0.06]"
        />

        <m.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-container-x"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          {/* Title */}
          <m.div className="mb-12 text-center" style={{ opacity: titleOpacity, y: titleY }}>
            <ScrollWordReveal
              as="h2"
              scrollYProgress={scrollYProgress}
              revealStart={0.0}
              revealEnd={0.06}
              className="heading-section text-black"
            >
              {ENGAGEMENT_TITLE}
            </ScrollWordReveal>
          </m.div>

          {/* Stats — staggered cards */}
          <div className="mb-12 grid w-full max-w-4xl grid-cols-3 gap-8">
            {STATS_DATA.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>

          {/* Body text */}
          <m.div className="max-w-3xl text-center" style={{ opacity: bodyOpacity }}>
            <ScrollWordReveal
              as="p"
              scrollYProgress={scrollYProgress}
              revealStart={0.26}
              revealEnd={0.4}
              className="text-body-lg text-black"
            >
              {ENGAGEMENT_BODY}
            </ScrollWordReveal>
          </m.div>

          {/* Highlight */}
          <m.p
            className="mt-8 max-w-2xl text-center text-body italic text-secondary-orange"
            style={{
              opacity: highlight.opacity,
              y: highlight.y,
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))',
            }}
          >
            {ENGAGEMENT_HIGHLIGHT}
          </m.p>
        </m.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AboutEngagement() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="engagement"
      aria-label="Notre engagement écologique"
      className="relative w-full bg-background"
      data-navbar-theme="dark"
    >
      {/* Desktop animated */}
      {!prefersReducedMotion && <EngagementDesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="mx-auto max-w-container px-container-x py-section">
          <div className="mx-auto max-w-4xl">
            <SimpleAnimation type="slide-up" delay={0}>
              <div className="mb-8 text-center">
                <h2 className="heading-section">{ENGAGEMENT_TITLE}</h2>
              </div>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={100}>
              <div className="mb-8 grid grid-cols-1 gap-4 border-y border-black/10 py-6 sm:grid-cols-3">
                {STATS_DATA.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="mb-1 text-title-sm font-bold text-secondary-orange sm:text-title-md">
                      {stat.number}
                    </div>
                    <div className="text-body-xs text-black sm:text-body-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={150}>
              <div className="space-y-6 text-body text-black">
                <p className="text-text">{ENGAGEMENT_BODY}</p>
                <p className="text-body-sm italic text-secondary-orange">{ENGAGEMENT_HIGHLIGHT}</p>
              </div>
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
