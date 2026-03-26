import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { SERVICES_DATA, type ServiceData } from '@/data/services';
import { CALENDLY_URL } from '@/config/endpoints';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const SERVICE_COUNT = SERVICES_DATA.length;

// Scroll budget
const SERVICES_START = 0.05;
const SERVICES_END = 0.95;

// ---------------------------------------------------------------------------
// Desktop sub-components
// ---------------------------------------------------------------------------

/**
 * Photo for a single service — clips from bottom to top, then clips out when next arrives.
 */
function ServicePhoto({
  service,
  index,
  scrollYProgress,
}: {
  service: ServiceData;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const range = SERVICES_END - SERVICES_START;
  const segmentSize = range / SERVICE_COUNT;
  const start = SERVICES_START + index * segmentSize;

  // Reveal: clipPath from bottom
  const revealStart = start;
  const revealEnd = start + segmentSize * 0.25;
  const clipRaw = useTransform(scrollYProgress, [revealStart, revealEnd], [100, 0]);
  const clipSmooth = useSpring(clipRaw, SPRING_CONFIG);
  const clipPath = useTransform(clipSmooth, (v: number) => `inset(${v}% 0 0 0)`);

  // Fade out at end of segment (except last service which fades at section end)
  const fadeOutStart = start + segmentSize * 0.8;
  const fadeOutEnd = start + segmentSize;
  const opacity =
    index < SERVICE_COUNT - 1
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useTransform(
          scrollYProgress,
          [revealStart, revealEnd, fadeOutStart, fadeOutEnd],
          [0, 1, 1, 0],
        )
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useTransform(scrollYProgress, [revealStart, revealEnd], [0, 1]);

  // Alternating position: even = left, odd = right
  const isLeft = index % 2 === 0;

  return (
    <m.div
      className={`absolute top-1/2 aspect-[3/4] w-[42%] -translate-y-1/2 overflow-hidden rounded-sm ${
        isLeft ? 'left-0' : 'right-0'
      }`}
      style={{ clipPath, opacity }}
    >
      <img
        src={service.image}
        alt={service.title}
        className="h-full w-full object-cover"
        loading={index === 0 ? 'eager' : 'lazy'}
      />
    </m.div>
  );
}

/**
 * Text block for a single service — scrolls up alongside the photo.
 */
function ServiceTextBlock({
  service,
  index,
  scrollYProgress,
}: {
  service: ServiceData;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const range = SERVICES_END - SERVICES_START;
  const segmentSize = range / SERVICE_COUNT;
  const start = SERVICES_START + index * segmentSize;

  const enterEnd = start + segmentSize * 0.2;
  const textScrollEnd = start + segmentSize * 0.7;
  const exitStart = start + segmentSize * 0.75;
  const end = start + segmentSize;

  // Y movement: enter from below → settle → exit up
  const yRaw = useTransform(
    scrollYProgress,
    [start, enterEnd, textScrollEnd, exitStart, end],
    ['55vh', '0vh', '0vh', '0vh', '-55vh'],
  );
  const y = useSpring(yRaw, SPRING_CONFIG);

  // Opacity
  const fadeIn = useTransform(scrollYProgress, [start, start + segmentSize * 0.1], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [exitStart, end], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));
  const pointerEvents = useTransform(opacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));

  // Title scroll reveal range
  const titleRevealStart = start;
  const titleRevealEnd = start + segmentSize * 0.2;

  // Alternating position: even = text right, odd = text left
  const isLeft = index % 2 === 0;
  const isExamens = service.id === 'examens';

  return (
    <m.div
      className={`absolute inset-0 flex items-center ${isLeft ? 'justify-end' : 'justify-start'}`}
      style={{ opacity, y, pointerEvents }}
    >
      <div className={`w-[48%] ${isLeft ? '' : ''}`}>
        <span className="mb-4 block text-body-sm font-medium uppercase tracking-widest text-white/30">
          {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
        </span>

        <ScrollWordReveal
          as="h3"
          scrollYProgress={scrollYProgress}
          revealStart={titleRevealStart}
          revealEnd={titleRevealEnd}
          className="text-subtitle mb-5 text-title-sm text-white"
        >
          {service.title}
        </ScrollWordReveal>

        <p className="mb-6 max-w-lg text-body-lg text-white/50">{service.description}</p>

        {/* Details list */}
        <div className="mb-6 border border-white/10 p-5">
          <ul className="space-y-2">
            {service.details.map((detail, i) => (
              <li key={i} className="flex gap-3 text-body-sm text-white/40">
                <span className="text-accent" aria-hidden="true">
                  •
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Calendly CTA for examens */}
        {isExamens && (
          <LinkCTA
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            theme="dark"
            aria-label="Prendre rendez-vous pour un examen de vue"
          >
            Prendre rendez-vous
          </LinkCTA>
        )}
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Mobile fallback
// ---------------------------------------------------------------------------

function MobileServiceList() {
  return (
    <div className="space-y-20">
      {SERVICES_DATA.map((service, index) => {
        const isExamens = service.id === 'examens';
        return (
          <article key={service.id}>
            <SimpleAnimation type="fade" delay={index * 80}>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="mt-6 space-y-4">
                <span className="text-body-sm font-medium uppercase tracking-widest text-white/30">
                  {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
                </span>
                <h3 className="text-subtitle text-title-sm text-white">{service.title}</h3>
                <p className="text-body-lg text-white/50">{service.description}</p>

                <div className="border border-white/10 p-5">
                  <ul className="space-y-2">
                    {service.details.map((detail, i) => (
                      <li key={i} className="flex gap-3 text-body-sm text-white/40">
                        <span className="text-accent" aria-hidden="true">
                          •
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isExamens && (
                  <LinkCTA
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    theme="dark"
                    aria-label="Prendre rendez-vous pour un examen de vue"
                  >
                    Prendre rendez-vous
                  </LinkCTA>
                )}
              </div>
            </SimpleAnimation>
          </article>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

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
      className="relative bg-black"
    >
      {/* Convex curve transition from yellow hero */}
      <div
        className="pointer-events-none absolute -top-[11vw] left-1/2 z-20 h-[45vw] w-[140vw] -translate-x-1/2 rounded-[50%] bg-black"
        data-navbar-theme="light"
        aria-hidden="true"
      />

      {/* Mobile / reduced-motion */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="px-container-x py-section">
          <div className="mx-auto max-w-container">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2
                id={prefersReducedMotion ? 'services-content-title' : undefined}
                className="heading-section mb-16 text-white"
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
          <div style={{ height: `${SERVICE_COUNT * 180}vh` }}>
            <div className="sticky top-0 h-screen overflow-hidden">
              <div className="absolute inset-0 z-10 px-container-x">
                <div className="relative mx-auto h-full max-w-container">
                  {/* Photos — alternating left/right with clipPath reveal */}
                  {SERVICES_DATA.map((service, i) => (
                    <ServicePhoto
                      key={service.id}
                      service={service}
                      index={i}
                      scrollYProgress={scrollYProgress}
                    />
                  ))}

                  {/* Text blocks — opposite side of photos */}
                  {SERVICES_DATA.map((service, i) => (
                    <ServiceTextBlock
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
      )}
    </section>
  );
}
