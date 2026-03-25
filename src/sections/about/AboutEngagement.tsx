import { useEffect, useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { STATS_DATA } from '@/data/about';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };

const ENGAGEMENT_TITLE = 'La mode change. La planète, non.';
const ENGAGEMENT_BODY =
  "Depuis 2016, nous proposons une alternative durable au marché traditionnel de l'optique. Nos montures d'occasion sont soigneusement restaurées, donnant une seconde vie à des pièces qui auraient fini à la décharge.";
const ENGAGEMENT_HIGHLIGHT =
  "En rapportant vos anciennes lunettes, vous bénéficiez d'une réduction allant jusqu'à 70€ sur votre nouvel achat. Un geste pour votre portefeuille et pour la planète.";

// ---------------------------------------------------------------------------
// Giant background counter — counts from 0 to 2000+ (recycled pairs)
// ---------------------------------------------------------------------------

function GiantCounter({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const countRef = useRef<HTMLSpanElement>(null);
  const count = useTransform(scrollYProgress, [0.02, 0.2], [0, 2000]);

  useEffect(() => {
    const unsubscribe = count.on('change', (v) => {
      if (countRef.current) {
        countRef.current.textContent = Math.round(v).toLocaleString('fr-FR');
      }
    });
    return unsubscribe;
  }, [count]);

  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const scale = useSpring(scaleRaw, SPRING_CONFIG);
  const opacity = useTransform(scrollYProgress, [0.01, 0.08, 0.7, 0.8], [0, 0.08, 0.08, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);

  return (
    <m.div
      className="text-heading pointer-events-none absolute right-[5%] top-1/2 z-0 -translate-y-1/2 select-none text-black/[0.06]"
      style={{
        fontSize: 'clamp(12rem, 30vw, 40rem)',
        lineHeight: 1,
        scale,
        opacity,
        y,
      }}
      aria-hidden="true"
    >
      <span ref={countRef}>0</span>
    </m.div>
  );
}

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
//  0.55 – 1.00  Hold
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
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const yRaw = useTransform(scrollYProgress, [start, end], [60, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);
  const scale = useTransform(scrollYProgress, [start, end], [0.85, 1]);

  return (
    <m.div className="text-center will-change-transform" style={{ opacity, y, scale }}>
      <div className="border-t-2 border-black/10 pt-6">
        <div
          className="text-heading text-secondary-orange"
          style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
        >
          {stat.number}
        </div>
        <div className="mt-2 text-body-sm text-black/50">{stat.label}</div>
      </div>
    </m.div>
  );
}

function EngagementDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Title
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.04], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.0, 0.06], [60, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Body text
  const bodyOpacity = useTransform(scrollYProgress, [0.25, 0.32], [0, 1]);

  // Highlight
  const highlightOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const highlightYRaw = useTransform(scrollYProgress, [0.4, 0.5], [20, 0]);
  const highlightY = useSpring(highlightYRaw, SPRING_CONFIG);

  return (
    <div ref={sectionRef} className="hidden h-[280vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <GiantCounter scrollYProgress={scrollYProgress} />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-container-x">
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
              className="text-body-lg leading-relaxed text-black/60"
            >
              {ENGAGEMENT_BODY}
            </ScrollWordReveal>
          </m.div>

          {/* Highlight */}
          <m.p
            className="mt-8 max-w-2xl text-center text-body italic text-secondary-orange"
            style={{
              opacity: highlightOpacity,
              y: highlightY,
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))',
            }}
          >
            {ENGAGEMENT_HIGHLIGHT}
          </m.p>
        </div>
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
    <section id="engagement" className="relative w-full bg-background" data-navbar-theme="dark">
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
              <div className="mb-8 grid grid-cols-3 gap-4 border-y border-black/10 py-6">
                {STATS_DATA.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="mb-1 text-title-sm font-bold text-secondary-orange sm:text-title-md">
                      {stat.number}
                    </div>
                    <div className="text-body-xs text-black/50 sm:text-body-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={150}>
              <div className="space-y-6 text-body leading-relaxed text-black/50">
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
