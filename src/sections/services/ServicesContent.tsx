import { useRef } from 'react';
import { useScroll } from 'framer-motion';

import { SERVICE_COUNT, SERVICES_START, SERVICES_END } from './constants';
import { PhotoStack } from './PhotoStack';
import { ServiceCard } from './ServiceCard';
import { MobileServiceList } from './MobileServiceList';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { ProgressDots } from '@/components/motion/ProgressDots';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { SERVICES_DATA } from '@/data/services';
import { ACCENT_HEX } from '@/config/design';

export default function ServicesContent() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldAnimate = !prefersReducedMotion && isLg;

  const { scrollYProgress } = useScroll({
    target: shouldAnimate ? sectionRef : undefined,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="services-content"
      aria-labelledby="services-content-title"
      data-navbar-theme="light"
      className="relative"
      style={{ background: 'linear-gradient(to bottom, transparent 12vw, #000 12vw)' }}
    >
      {/* Convex dome */}
      <svg
        className="pointer-events-none absolute left-0 top-0 z-[1] w-full"
        style={{ height: '12vw' }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,120 Q720,-120 1440,120 Z" fill="#000" />
      </svg>

      {/* Mobile / reduced-motion */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="px-container-x py-section">
          <div className="mx-auto max-w-container">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2
                id={prefersReducedMotion ? 'services-content-title' : undefined}
                className="heading-section mb-12 text-white lg:mb-16"
              >
                Chaque service mérite son moment
              </h2>
            </SimpleAnimation>
            <MobileServiceList />
          </div>
        </div>
      </div>

      {/* Desktop: Scrollytelling */}
      {isLg && (
        <div ref={sectionRef} className="relative">
          <div style={{ height: `${(SERVICE_COUNT * 2 + 2) * 100}vh` }}>
            <div className="sticky top-0 h-screen overflow-hidden">
              <h2 id="services-content-title" className="sr-only">
                Nos services en détail
              </h2>

              {shouldAnimate && (
                <div className="absolute inset-0 z-10 flex items-center justify-center px-container-x">
                  <div className="mx-auto flex w-full max-w-container items-center gap-12 xl:gap-16">
                    <PhotoStack scrollYProgress={scrollYProgress} />

                    <ProgressDots
                      scrollYProgress={scrollYProgress}
                      count={SERVICE_COUNT}
                      start={SERVICES_START}
                      end={SERVICES_END}
                    />

                    <div className="relative flex w-[45%] flex-col justify-center">
                      {SERVICES_DATA.map((service, i) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          index={i}
                          scrollYProgress={scrollYProgress}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom gradient dissolve */}
      <div
        className="pointer-events-none relative z-[1] h-[65vh]"
        style={{
          background: [
            'linear-gradient(to bottom,',
            'black 0%,',
            `color-mix(in srgb, ${ACCENT_HEX} 5%, black) 14%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 14%, black) 28%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 28%, black) 42%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 45%, black) 56%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 65%, black) 70%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 80%, black) 82%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 92%, black) 92%,`,
            `${ACCENT_HEX} 100%)`,
          ].join(' '),
        }}
        aria-hidden="true"
      />
    </section>
  );
}
