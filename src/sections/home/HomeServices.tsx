import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

import { SERVICE_COUNT } from './services/constants';
import { PatternBackground } from './services/PatternBackground';
import { SectionTitle } from './services/SectionTitle';
import { PhotoStack } from './services/PhotoStack';
import { ServiceText } from './services/ServiceText';
import { SectionOutro } from './services/SectionOutro';
import { ServiceProgressIndicator } from './services/ServiceProgressIndicator';
import { StaticServiceList } from './services/StaticServiceList';
import { ServicesMobileAnimated } from './services/ServicesMobileAnimated';

import { HOMEPAGE_SERVICES, HOMEPAGE_SECTIONS } from '@/data/homepage';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { ACCENT_HEX } from '@/config/design';
import LinkCTA from '@/components/common/LinkCTA';

/**
 * Section HomeServices — Scrollytelling with circle pattern
 *
 * Desktop: sticky viewport with scroll-linked animations.
 * Mobile: simple stacked cards with SimpleAnimation.
 */
function HomeServices() {
  const variant = useResponsiveMotion();
  const isLg = useIsLg();
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldAnimate = variant === 'desktop-animated';

  const { scrollYProgress } = useScroll({
    target: shouldAnimate ? sectionRef : undefined,
    offset: ['start start', 'end end'],
  });

  // Sticky viewport bg: white during carousel, yellow for outro + exit
  const stickyBg = useTransform(scrollYProgress, [0.86, 0.92], ['#ffffff', ACCENT_HEX]);

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      data-navbar-theme="dark"
      className="pointer-events-none relative bg-accent [overflow-x:clip]"
    >
      {/* Subtle noise texture over white background */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Concave dome — desktop/static only (mobile uses internal curtain) */}
      <div
        className="pointer-events-none absolute -top-[1px] left-1/2 z-20 hidden h-[12vw] w-[140vw] -translate-x-1/2 rounded-b-[50%] bg-accent lg:block"
        aria-hidden="true"
      />

      {/* ── Mobile: scroll-driven / Reduced-motion: static ── */}
      {variant === 'mobile-animated' ? (
        <ServicesMobileAnimated />
      ) : (
        <div className="pointer-events-auto bg-white px-container-x py-section lg:hidden">
          <div className="relative z-10 mx-auto max-w-container">
            <h2 id="services-title" className="heading-section mb-12 text-black">
              {HOMEPAGE_SECTIONS.services.title}
            </h2>
            <StaticServiceList />
            <div className="mt-16 text-center">
              <LinkCTA
                to={HOMEPAGE_SECTIONS.services.cta.link}
                theme="light"
                aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
              >
                {HOMEPAGE_SECTIONS.services.cta.text}
              </LinkCTA>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop: Scrollytelling (or desktop static fallback) ── */}
      {isLg && (
        <div ref={sectionRef} className="relative">
          <div className="bg-accent" style={{ height: `${(SERVICE_COUNT * 2 + 1) * 100}vh` }}>
            <m.div
              className="sticky top-0 h-screen overflow-hidden"
              style={{ backgroundColor: stickyBg }}
            >
              {shouldAnimate && <PatternBackground scrollYProgress={scrollYProgress} />}

              {shouldAnimate ? (
                <SectionTitle scrollYProgress={scrollYProgress} />
              ) : (
                <div className="absolute inset-x-0 top-[6vh] z-30 flex justify-center">
                  <h2 id="services-title" className="heading-section text-black">
                    {HOMEPAGE_SECTIONS.services.title}
                  </h2>
                </div>
              )}

              {!shouldAnimate ? (
                <div className="flex h-full items-center">
                  <StaticServiceList />
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 z-10 flex items-center justify-center px-container-x">
                    <div className="mx-auto flex w-full max-w-container items-center gap-12 xl:gap-16">
                      <PhotoStack scrollYProgress={scrollYProgress} />
                      <ServiceProgressIndicator scrollYProgress={scrollYProgress} />
                      <div className="relative flex w-[45%] flex-col justify-center">
                        {HOMEPAGE_SERVICES.map((service, i) => (
                          <ServiceText
                            key={service.title}
                            service={service}
                            index={i}
                            scrollYProgress={scrollYProgress}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <SectionOutro scrollYProgress={scrollYProgress} />
                </>
              )}
            </m.div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HomeServices;
