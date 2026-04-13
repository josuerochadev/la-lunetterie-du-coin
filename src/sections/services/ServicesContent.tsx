import { SERVICE_COUNT, SERVICES_START, SERVICES_END } from './constants';
import { PhotoStack } from './PhotoStack';
import { ServiceCard } from './ServiceCard';
import { MobileServiceList } from './MobileServiceList';
import { ServicesMobileAnimated } from './ServicesMobileAnimated';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { ProgressDots } from '@/components/motion/ProgressDots';
import { ConvexDome } from '@/components/common/ConvexDome';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SERVICES_DATA } from '@/data/services';
import { ACCENT_HEX } from '@/config/design';

export default function ServicesContent() {
  const variant = useResponsiveMotion();

  // useManualScrollProgress bypasses framer-motion's useScroll bug for
  // targets behind stacked sticky sections.
  const { ref: sectionRef, scrollYProgress } = useManualScrollProgress('start-start');

  return (
    <section
      id="services-content"
      aria-labelledby="services-content-title"
      data-navbar-theme="light"
      className="relative"
      style={{ background: 'linear-gradient(to bottom, transparent 12vw, #000 12vw)' }}
    >
      <ConvexDome color="black" />

      {/* Static fallback (reduced motion) */}
      {variant === 'static' && (
        <div className="px-container-x py-section">
          <div className="mx-auto max-w-container">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2 id="services-content-title" className="heading-section mb-12 text-white lg:mb-16">
                Chaque service mérite son moment
              </h2>
            </SimpleAnimation>
            <MobileServiceList />
          </div>
        </div>
      )}

      {/* Mobile animated */}
      {variant === 'mobile-animated' && <ServicesMobileAnimated />}

      {/* Desktop: Scrollytelling */}
      {variant === 'desktop-animated' && (
        <div ref={sectionRef} className="relative">
          <div style={{ height: `${(SERVICE_COUNT * 2 + 2) * 100}vh` }}>
            <div className="sticky top-0 h-screen overflow-hidden">
              <h2 id="services-content-title" className="sr-only">
                Nos services en détail
              </h2>

              <div className="absolute inset-0 z-10 flex items-center justify-center px-container-x">
                <div className="mx-auto flex w-full max-w-container items-center gap-12 xl:gap-16">
                  <PhotoStack scrollYProgress={scrollYProgress} />

                  <ProgressDots
                    scrollYProgress={scrollYProgress}
                    count={SERVICE_COUNT}
                    start={SERVICES_START}
                    end={SERVICES_END}
                  />

                  <div className="relative flex flex-1 flex-col justify-center px-[3vw]">
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
