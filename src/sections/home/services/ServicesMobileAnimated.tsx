import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { MobileOutro } from './MobileOutro';
import { MobileProgressBar } from './MobileProgressBar';
import { ServiceSlide } from './ServiceSlide';
import { TOTAL_VH, CURTAIN_END, SERVICES_END } from './ServicesMobileAnimated.timeline';

import { HOMEPAGE_SERVICES, HOMEPAGE_SECTIONS } from '@/data/homepage';

// ── Main component ──
export function ServicesMobileAnimated() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Manual scroll progress — bypasses FM's target tracking which can fail
  // when the element is inside a `transform: translateZ(0)` ancestor.
  // Equivalent to useScroll({ target, offset: ['start start', 'end end'] }).
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, () => {
    const el = sectionRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    if (range <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / range));
  });

  // Curtain — accent overlay slides up to reveal photos (fast: 0 → 3%)
  const curtainY = useTransform(scrollYProgress, [0, CURTAIN_END], ['0%', '-110%']);

  // Title: appears after curtain, persists through all services, fades out before outro
  const titleOpacity = useTransform(
    scrollYProgress,
    [CURTAIN_END, CURTAIN_END + 0.02, SERVICES_END - 0.02, SERVICES_END],
    [0, 1, 1, 0],
  );

  return (
    <div className="xl:hidden">
      <div ref={sectionRef} className="relative" style={{ height: `${TOTAL_VH * 100}vh` }}>
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          {/* Photo layers */}
          <div className="absolute inset-0">
            {HOMEPAGE_SERVICES.map((service, i) => (
              <ServiceSlide
                key={service.title}
                service={service}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          {/* Gradient overlays */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[30%]"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%]"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          {/* Section title — persists through all services */}
          <m.div
            className="absolute inset-x-0 top-0 z-20 px-container-x pt-20"
            style={{ opacity: titleOpacity }}
          >
            <h2 id="services-title" className="heading-section text-white">
              {HOMEPAGE_SECTIONS.services.title}
            </h2>
          </m.div>

          {/* Progress bar */}
          <MobileProgressBar scrollYProgress={scrollYProgress} />

          {/* Outro: phrase + logo + CTA (yellow bg) */}
          <MobileOutro scrollYProgress={scrollYProgress} />

          {/* Accent curtain — slides up to reveal photos (same curve as HomeStory dome, inverted) */}
          <m.div
            className="pointer-events-none absolute inset-0 z-40 bg-accent"
            style={{ y: curtainY }}
            aria-hidden="true"
          >
            {/* Inverted dome at bottom — matches HomeStory curvature */}
            <div
              className="absolute -bottom-[11vw] left-1/2 h-[22.5vw] w-[140vw] -translate-x-1/2 bg-accent"
              style={{ borderRadius: '0 0 50% 50% / 0 0 100% 100%' }}
            />
          </m.div>
        </div>
      </div>
    </div>
  );
}
