import { forwardRef, useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import EyePattern from '@/components/common/EyePattern';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { HOMEPAGE_SERVICES, HOMEPAGE_SECTIONS } from '@/data/homepage';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const SERVICE_COUNT = HOMEPAGE_SERVICES.length;

// Scroll budget: entrance phase takes ~15%, then services share the rest
const ENTRANCE_END = 0.12;
const SERVICES_START = ENTRANCE_END;
const SERVICES_END = 0.95;

/**
 * Sticky crossfading image that changes based on scroll progress.
 */
function StickyServiceImage({
  scrollYProgress,
}: {
  scrollYProgress: import('framer-motion').MotionValue<number>;
}) {
  const range = SERVICES_END - SERVICES_START;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-sm">
      {HOMEPAGE_SERVICES.map((service, i) => {
        const segmentSize = range / SERVICE_COUNT;
        const start = SERVICES_START + i * segmentSize;
        const fadeIn = start + segmentSize * 0.05;
        const fadeOut = start + segmentSize * 0.85;
        const end = start + segmentSize;

        return (
          <ServiceImage
            key={service.title}
            src={service.image}
            alt={service.title}
            scrollYProgress={scrollYProgress}
            fadeInRange={[Math.max(start - segmentSize * 0.05, SERVICES_START), fadeIn]}
            fadeOutRange={[fadeOut, Math.min(end + segmentSize * 0.05, SERVICES_END)]}
            isFirst={i === 0}
            isLast={i === SERVICE_COUNT - 1}
          />
        );
      })}
    </div>
  );
}

function ServiceImage({
  src,
  alt,
  scrollYProgress,
  fadeInRange,
  fadeOutRange,
  isFirst,
  isLast,
}: {
  src: string;
  alt: string;
  scrollYProgress: import('framer-motion').MotionValue<number>;
  fadeInRange: [number, number];
  fadeOutRange: [number, number];
  isFirst: boolean;
  isLast: boolean;
}) {
  const fadeIn = useTransform(scrollYProgress, fadeInRange, isFirst ? [1, 1] : [0, 1]);
  const fadeOut = useTransform(scrollYProgress, fadeOutRange, isLast ? [1, 1] : [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));
  const scale = useTransform(scrollYProgress, [fadeInRange[0], fadeOutRange[1]], [1.05, 1]);

  return (
    <m.div className="absolute inset-0" style={{ opacity }}>
      <m.img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        style={{ scale }}
      />
    </m.div>
  );
}

/**
 * Drifting eye pattern background with optional parallax entrance.
 */
function DriftingEyePattern({
  scrollYProgress: parentProgress,
}: {
  scrollYProgress?: import('framer-motion').MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Parallax entrance: pattern starts lower and rises into place
  const entranceY = useTransform(parentProgress ?? scrollYProgress, [0, ENTRANCE_END], [60, 0]);
  const entranceYSpring = useSpring(entranceY, SPRING_CONFIG);

  // Pattern opacity ramps up during entrance
  const patternOpacity = useTransform(
    parentProgress ?? scrollYProgress,
    [0, ENTRANCE_END * 0.7],
    [0, 1],
  );

  return (
    <m.div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ y: entranceYSpring, opacity: patternOpacity }}
    >
      <m.div className="absolute inset-0 w-[200%]" style={{ x }}>
        <EyePattern variant="jaune" opacity={0.07} />
      </m.div>
    </m.div>
  );
}

/**
 * Entrance header — title slides up and fades out before services begin.
 */
function EntranceHeader({
  scrollYProgress,
}: {
  scrollYProgress: import('framer-motion').MotionValue<number>;
}) {
  // Fade in during entrance
  const entranceOpacity = useTransform(scrollYProgress, [0.02, ENTRANCE_END * 0.7], [0, 1]);
  // Fade out before services start
  const exitOpacity = useTransform(scrollYProgress, [ENTRANCE_END * 0.85, ENTRANCE_END], [1, 0]);
  const opacity = useTransform([entranceOpacity, exitOpacity] as const, ([a, b]: number[]) =>
    Math.min(a, b),
  );

  const yRaw = useTransform(scrollYProgress, [0.02, ENTRANCE_END * 0.7], [100, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  return (
    <m.div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      style={{ opacity, y }}
    >
      <h2
        id="services-title"
        className="heading-section text-center text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
        style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
      >
        {HOMEPAGE_SECTIONS.services.title}
      </h2>
    </m.div>
  );
}

/**
 * Service content wrapper — handles the entrance fade for the image+text block.
 */
function ServiceContent({
  scrollYProgress,
  rawScrollYProgress,
  prefersReducedMotion,
}: {
  scrollYProgress: import('framer-motion').MotionValue<number>;
  rawScrollYProgress: import('framer-motion').MotionValue<number>;
  prefersReducedMotion: boolean;
}) {
  // Content fades in after the entrance title fades out
  const contentOpacity = useTransform(
    rawScrollYProgress,
    [ENTRANCE_END * 0.8, ENTRANCE_END],
    [0, 1],
  );
  const contentYRaw = useTransform(rawScrollYProgress, [ENTRANCE_END * 0.8, ENTRANCE_END], [40, 0]);
  const contentY = useSpring(contentYRaw, SPRING_CONFIG);

  const inner = (
    <div className="flex w-full items-center gap-12 xl:gap-16">
      {/* Left: Sticky crossfading image */}
      <div className="relative aspect-[3/4] w-[50%] shrink-0 overflow-hidden rounded-sm">
        {prefersReducedMotion ? (
          <img
            src={HOMEPAGE_SERVICES[0].image}
            alt={HOMEPAGE_SERVICES[0].title}
            className="h-full w-full object-cover"
          />
        ) : (
          <StickyServiceImage scrollYProgress={scrollYProgress} />
        )}
      </div>

      {/* Right: Current service text */}
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        {prefersReducedMotion ? (
          <StaticServiceList />
        ) : (
          <ScrollServiceText scrollYProgress={scrollYProgress} />
        )}
      </div>
    </div>
  );

  if (prefersReducedMotion) return inner;

  return <m.div style={{ opacity: contentOpacity, y: contentY }}>{inner}</m.div>;
}

/**
 * Section HomeServices — Scrollytelling
 *
 * Sticky image on the left crossfades between services.
 * Service descriptions scroll on the right, each taking ~100vh.
 * Eye pattern background with horizontal drift.
 * Reveal transition at entry.
 *
 * Mobile: simple stack (image + text per service).
 */
const HomeServices = forwardRef<HTMLElement>(() => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : sectionRef,
    offset: ['start start', 'end end'],
  });

  // Smooth scroll progress for image transitions
  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      data-navbar-theme="light"
      className="relative bg-black"
    >
      {/* ── Mobile ── */}
      <div className="px-container-x py-section lg:hidden">
        {prefersReducedMotion ? (
          <EyePattern variant="jaune" opacity={0.05} />
        ) : (
          <DriftingEyePattern />
        )}

        <div className="relative z-10 mx-auto max-w-container">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="services-title" className="heading-section mb-12 text-white">
              {HOMEPAGE_SECTIONS.services.title}
            </h2>
          </SimpleAnimation>

          <div className="space-y-16">
            {HOMEPAGE_SERVICES.map((service, index) => (
              <article key={service.title}>
                <SimpleAnimation type="fade" delay={index * 100}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-6 space-y-3">
                    <h3
                      className="text-heading text-white"
                      style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-body leading-relaxed text-white/50">{service.description}</p>
                    <LinkCTA
                      href={service.link}
                      theme="dark"
                      aria-label={`En savoir plus sur ${service.title}`}
                    >
                      En savoir plus
                    </LinkCTA>
                  </div>
                </SimpleAnimation>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <SimpleAnimation type="slide-up" delay={400}>
              <LinkCTA
                href={HOMEPAGE_SECTIONS.services.cta.link}
                theme="dark"
                aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
              >
                {HOMEPAGE_SECTIONS.services.cta.text}
              </LinkCTA>
            </SimpleAnimation>
          </div>
        </div>
      </div>

      {/* ── Desktop: Scrollytelling ── */}
      <div ref={sectionRef} className="relative hidden lg:block">
        {/* Height: services + entrance buffer + exit buffer */}
        <div style={{ height: `${(SERVICE_COUNT + 2) * 100}vh` }}>
          {/* Integrated gradient: blends with Story's black ending */}
          <div
            className="pointer-events-none absolute inset-x-0 -top-[10vh] z-20 h-[50vh]"
            style={{
              background:
                'linear-gradient(to bottom, black 0%, black 30%, color-mix(in srgb, black 85%, transparent) 50%, color-mix(in srgb, black 40%, transparent) 70%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          {/* Pattern background with parallax entrance */}
          {prefersReducedMotion ? (
            <EyePattern variant="jaune" opacity={0.07} />
          ) : (
            <DriftingEyePattern scrollYProgress={scrollYProgress} />
          )}

          {/* Sticky container — fills viewport */}
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="relative z-10 mx-auto flex h-full max-w-container flex-col justify-center px-container-x">
              {/* Entrance title — visible during intro, fades out when services start */}
              {!prefersReducedMotion && <EntranceHeader scrollYProgress={scrollYProgress} />}

              {/* Service content — image left, text right */}
              <ServiceContent
                scrollYProgress={smoothProgress}
                rawScrollYProgress={scrollYProgress}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

/**
 * Scroll-driven service text — crossfades between services.
 */
function ScrollServiceText({
  scrollYProgress,
}: {
  scrollYProgress: import('framer-motion').MotionValue<number>;
}) {
  const range = SERVICES_END - SERVICES_START;

  return (
    <div className="relative">
      {HOMEPAGE_SERVICES.map((service, i) => {
        const segmentSize = range / SERVICE_COUNT;
        const start = SERVICES_START + i * segmentSize;
        const fadeIn = start + segmentSize * 0.08;
        const fadeOut = start + segmentSize * 0.82;
        const end = start + segmentSize;

        return (
          <ServiceTextBlock
            key={service.title}
            service={service}
            index={i}
            scrollYProgress={scrollYProgress}
            fadeInRange={[Math.max(start - segmentSize * 0.02, SERVICES_START), fadeIn]}
            fadeOutRange={[fadeOut, Math.min(end + segmentSize * 0.02, SERVICES_END)]}
            isFirst={i === 0}
            isLast={i === SERVICE_COUNT - 1}
          />
        );
      })}

      {/* Section CTA — appears after last service */}
      <ServiceCTA scrollYProgress={scrollYProgress} />
    </div>
  );
}

function ServiceTextBlock({
  service,
  index,
  scrollYProgress,
  fadeInRange,
  fadeOutRange,
  isFirst,
  isLast,
}: {
  service: (typeof HOMEPAGE_SERVICES)[number];
  index: number;
  scrollYProgress: import('framer-motion').MotionValue<number>;
  fadeInRange: [number, number];
  fadeOutRange: [number, number];
  isFirst: boolean;
  isLast: boolean;
}) {
  const fadeIn = useTransform(scrollYProgress, fadeInRange, isFirst ? [1, 1] : [0, 1]);
  const fadeOut = useTransform(scrollYProgress, fadeOutRange, isLast ? [1, 1] : [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));
  const yIn = useTransform(scrollYProgress, fadeInRange, isFirst ? [0, 0] : [30, 0]);
  const yOut = useTransform(scrollYProgress, fadeOutRange, isLast ? [0, 0] : [0, -20]);
  const y = useTransform([yIn, yOut] as const, ([a, b]: number[]) => a + b);

  return (
    <m.div
      className={`${index === 0 ? '' : 'absolute inset-0'} flex flex-col justify-center`}
      style={{ opacity, y }}
    >
      {/* Step indicator */}
      <span className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
        {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
      </span>

      <h2
        id={index === 0 ? 'services-title' : undefined}
        className="text-heading mb-5 text-white"
        style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
      >
        {service.title}
      </h2>

      <p className="mb-8 max-w-lg text-body-lg leading-relaxed text-white/60">
        {service.description}
      </p>

      <LinkCTA href={service.link} theme="dark" aria-label={`En savoir plus sur ${service.title}`}>
        En savoir plus
      </LinkCTA>
    </m.div>
  );
}

/**
 * CTA that appears at the end of the scroll sequence.
 */
function ServiceCTA({
  scrollYProgress,
}: {
  scrollYProgress: import('framer-motion').MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, [0.92, 0.98], [0, 1]);
  const y = useTransform(scrollYProgress, [0.92, 0.98], [20, 0]);

  return (
    <m.div
      className="absolute inset-0 flex flex-col items-start justify-center"
      style={{ opacity, y }}
    >
      <LinkCTA
        href={HOMEPAGE_SECTIONS.services.cta.link}
        theme="dark"
        aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
      >
        {HOMEPAGE_SECTIONS.services.cta.text}
      </LinkCTA>
    </m.div>
  );
}

/**
 * Static fallback for reduced motion.
 */
function StaticServiceList() {
  return (
    <div className="space-y-12">
      {HOMEPAGE_SERVICES.map((service, i) => (
        <div key={service.title}>
          <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-accent">
            {String(i + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
          </span>
          <h2
            id={i === 0 ? 'services-title' : undefined}
            className="text-heading mb-3 text-white"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}
          >
            {service.title}
          </h2>
          <p className="text-body leading-relaxed text-white/50">{service.description}</p>
          <LinkCTA
            href={service.link}
            theme="dark"
            className="mt-3"
            aria-label={`En savoir plus sur ${service.title}`}
          >
            En savoir plus
          </LinkCTA>
        </div>
      ))}
    </div>
  );
}

HomeServices.displayName = 'HomeServices';

export default HomeServices;
