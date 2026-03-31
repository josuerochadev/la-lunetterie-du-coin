import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';
import Heart from 'lucide-react/dist/esm/icons/heart';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Award from 'lucide-react/dist/esm/icons/award';

import { VALUES_DATA } from '@/data/about';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
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
    <div ref={sectionRef} className="hidden h-[300vh] lg:block">
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
// Main component
// ---------------------------------------------------------------------------

export default function AboutValues() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="valeurs"
      aria-label="Nos valeurs"
      className="relative w-full bg-accent"
      data-navbar-theme="dark"
    >
      <EyePattern variant="jaune" opacity={0.07} />

      {/* Desktop animated */}
      {!prefersReducedMotion && <ValuesDesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={prefersReducedMotion ? 'relative z-10' : 'relative z-10 lg:hidden'}>
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
    </section>
  );
}
