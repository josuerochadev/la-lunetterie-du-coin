import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { HOMEPAGE_SERVICES, HOMEPAGE_SECTIONS } from '@/data/homepage';
import motifCercleUrl from '@/assets/patterns/motif-cercle-jaune.svg';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const SERVICE_COUNT = HOMEPAGE_SERVICES.length;

// Scroll budget
const TITLE_END = 0.08; // Title arrives at top
const ZOOM_END = 0.13; // Pattern zoom complete, services begin
const SERVICES_START = ZOOM_END;
const SERVICES_END = 0.78; // Services end earlier to leave room for outro
const OUTRO_START = 0.8; // Pattern zooms to yellow + phrase appears

// ---------------------------------------------------------------------------
// Desktop sub-components
// ---------------------------------------------------------------------------

/**
 * Circle pattern background — zooms in to open center space for content.
 */
function PatternBackground({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Intro zoom out → hold during services → outro zoom in (circle closes, eyes fill screen)
  const scale = useTransform(
    scrollYProgress,
    [0, TITLE_END * 0.5, ZOOM_END, OUTRO_START, OUTRO_START + 0.08],
    [1.15, 1.15, 1.6, 1.6, 1.0],
  );
  const scaleSpring = useSpring(scale, SPRING_CONFIG);

  // Opacity: subtle during services, stronger during outro
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.02, OUTRO_START, OUTRO_START + 0.06],
    [0, 0.12, 0.12, 0.3],
  );

  // Color: black during services → original yellow during outro
  const brightness = useTransform(scrollYProgress, [OUTRO_START, OUTRO_START + 0.06], [0, 1]);
  const filter = useTransform(brightness, (v: number) => `brightness(${v})`);

  return (
    <m.div
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      style={{ scale: scaleSpring, opacity }}
      aria-hidden="true"
    >
      <m.img
        src={motifCercleUrl}
        alt=""
        className="h-[140%] w-[140%] max-w-none object-contain"
        style={{ filter }}
      />
    </m.div>
  );
}

/**
 * Title "Nos Services" — fades in centered, rises to top, then fades out.
 */
function SectionTitle({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Rise from center to top
  const yRaw = useTransform(scrollYProgress, [0, TITLE_END], ['40vh', '6vh']);
  const y = useSpring(yRaw, SPRING_CONFIG);

  // Fade in quickly
  const fadeIn = useTransform(scrollYProgress, [0, 0.02], [0, 1]);
  // Fade out before services start
  const fadeOut = useTransform(scrollYProgress, [ZOOM_END, ZOOM_END + 0.04], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));

  return (
    <m.div
      className="pointer-events-none absolute inset-x-0 z-30 flex justify-center"
      style={{ top: y, opacity }}
    >
      <h2 id="services-title" className="heading-section text-center text-black">
        {HOMEPAGE_SECTIONS.services.title}
      </h2>
    </m.div>
  );
}

/**
 * Photo stack — all photos layered in the same position.
 * Transitions use clipPath (slide-up reveal) instead of crossfade.
 * First photo fades in on entrance, last photo fades out on exit.
 */
function PhotoStack({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const range = SERVICES_END - SERVICES_START;
  const segmentSize = range / SERVICE_COUNT;

  // Shared Y: photo container enters from below, settles, then exits at end
  const firstStart = SERVICES_START;
  const enterEnd = firstStart + segmentSize * 0.2;
  const lastEnd = SERVICES_START + range;
  const exitStart = lastEnd - segmentSize * 0.22;

  const yRaw = useTransform(
    scrollYProgress,
    [firstStart, enterEnd, exitStart, lastEnd],
    ['55vh', '0vh', '0vh', '-55vh'],
  );
  const y = useSpring(yRaw, SPRING_CONFIG);

  // Fade in first photo, fade out last photo
  const entranceFade = useTransform(
    scrollYProgress,
    [firstStart, firstStart + segmentSize * 0.08],
    [0, 1],
  );
  const exitFade = useTransform(scrollYProgress, [exitStart, lastEnd], [1, 0]);
  const containerOpacity = useTransform([entranceFade, exitFade] as const, ([a, b]: number[]) =>
    Math.min(a, b),
  );

  return (
    <m.div
      className="relative aspect-[3/4] w-[45%] shrink-0 overflow-hidden rounded-sm"
      style={{ y, opacity: containerOpacity }}
    >
      {/* Base photo (service 0) — always visible underneath */}
      <img
        src={HOMEPAGE_SERVICES[0].image}
        alt={HOMEPAGE_SERVICES[0].title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Photos 1+ reveal via clipPath slide-up (volet effect) */}
      {HOMEPAGE_SERVICES.slice(1).map((service, i) => {
        const idx = i + 1; // actual service index
        const revealStart = SERVICES_START + idx * segmentSize;
        const revealEnd = revealStart + segmentSize * 0.3;

        return (
          <PhotoReveal
            key={service.title}
            src={service.image}
            alt={service.title}
            scrollYProgress={scrollYProgress}
            revealStart={revealStart}
            revealEnd={revealEnd}
          />
        );
      })}
    </m.div>
  );
}

/**
 * Single photo that reveals from bottom to top via clipPath.
 * Once revealed, stays visible (stacks on top of previous photos).
 */
function PhotoReveal({
  src,
  alt,
  scrollYProgress,
  revealStart,
  revealEnd,
}: {
  src: string;
  alt: string;
  scrollYProgress: MotionValue<number>;
  revealStart: number;
  revealEnd: number;
}) {
  // clipPath: inset(100% 0 0 0) → inset(0% 0 0 0) — reveals from bottom
  const clipRaw = useTransform(scrollYProgress, [revealStart, revealEnd], [100, 0]);
  const clipSmooth = useSpring(clipRaw, SPRING_CONFIG);
  const clipPath = useTransform(clipSmooth, (v: number) => `inset(${v}% 0 0 0)`);

  return (
    <m.div className="absolute inset-0" style={{ clipPath }}>
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </m.div>
  );
}

/**
 * Service text block — scrolls independently alongside the photo stack.
 * Each text enters from below, scrolls up, then exits.
 */
function ServiceText({
  service,
  index,
  scrollYProgress,
}: {
  service: (typeof HOMEPAGE_SERVICES)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const range = SERVICES_END - SERVICES_START;
  const segmentSize = range / SERVICE_COUNT;
  const start = SERVICES_START + index * segmentSize;

  const enterEnd = start + segmentSize * 0.2;
  const textScrollEnd = start + segmentSize * 0.75;
  const exitStart = start + segmentSize * 0.78;
  const end = start + segmentSize;

  // Text: enter from below → scroll up alongside photo → exit up
  const yRaw = useTransform(
    scrollYProgress,
    [start, enterEnd, textScrollEnd, exitStart, end],
    ['65vh', '18vh', '-18vh', '-18vh', '-65vh'],
  );
  const y = useSpring(yRaw, SPRING_CONFIG);

  // Opacity: fade in / fade out
  const fadeIn = useTransform(scrollYProgress, [start, start + segmentSize * 0.08], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [exitStart, end], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));
  const pointerEvents = useTransform(opacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));

  return (
    <m.div
      className={`${index === 0 ? '' : 'absolute inset-0'} flex flex-col justify-center`}
      style={{ opacity, y, pointerEvents }}
    >
      <span className="mb-4 text-sm font-medium uppercase tracking-widest text-black/30">
        {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
      </span>

      <h3 className="text-subtitle mb-5 text-title-sm text-black">{service.title}</h3>

      <p className="mb-8 max-w-lg text-body-lg leading-relaxed text-black/50">
        {service.description}
      </p>

      <LinkCTA to={service.link} theme="light" aria-label={`En savoir plus sur ${service.title}`}>
        En savoir plus
      </LinkCTA>
    </m.div>
  );
}

/**
 * Outro — pattern zooms to yellow, big phrase + CTA appear centered.
 */
function SectionOutro({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const phraseStart = OUTRO_START + 0.04;
  const phraseEnd = phraseStart + 0.06;

  // Phrase fades in and rises
  const phraseOpacity = useTransform(scrollYProgress, [phraseStart, phraseEnd], [0, 1]);
  const phraseYRaw = useTransform(scrollYProgress, [phraseStart, phraseEnd], [50, 0]);
  const phraseY = useSpring(phraseYRaw, SPRING_CONFIG);

  // CTA fades in slightly after phrase
  const ctaOpacity = useTransform(scrollYProgress, [phraseEnd, phraseEnd + 0.04], [0, 1]);
  const ctaYRaw = useTransform(scrollYProgress, [phraseEnd, phraseEnd + 0.04], [20, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);
  const pointerEvents = useTransform(ctaOpacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-8">
      <m.h3
        className="text-heading text-center text-title-xl text-black"
        style={{ opacity: phraseOpacity, y: phraseY }}
      >
        TAPEZ-LEUR
        <br />
        DANS L&apos;OEIL
      </m.h3>

      <m.div style={{ opacity: ctaOpacity, y: ctaY, pointerEvents }}>
        <LinkCTA
          to={HOMEPAGE_SECTIONS.services.cta.link}
          theme="light"
          aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
        >
          {HOMEPAGE_SECTIONS.services.cta.text}
        </LinkCTA>
      </m.div>
    </div>
  );
}

/**
 * Static fallback for reduced motion.
 */
function StaticServiceList() {
  return (
    <div className="mx-auto max-w-container space-y-16 px-container-x">
      {HOMEPAGE_SERVICES.map((service, i) => (
        <div key={service.title} className="flex items-center gap-12">
          <div className="relative aspect-[3/4] w-[45%] shrink-0 overflow-hidden rounded-sm">
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="w-[45%]">
            <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-black/30">
              {String(i + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
            </span>
            <h3
              id={i === 0 ? 'services-title' : undefined}
              className="text-subtitle mb-3 text-title-sm text-black"
            >
              {service.title}
            </h3>
            <p className="text-body leading-relaxed text-black/50">{service.description}</p>
            <LinkCTA
              to={service.link}
              theme="light"
              className="mt-4"
              aria-label={`En savoir plus sur ${service.title}`}
            >
              En savoir plus
            </LinkCTA>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Section HomeServices — Scrollytelling with circle pattern
 *
 * White background with circle eye-pattern (zooms to reveal center space).
 * Title rises to top, then services parade through:
 *   - Photo enters from below, settles at center
 *   - Text scrolls up alongside the photo
 *   - When text reaches top of photo, next service enters
 *
 * Mobile: simple stacked cards with SimpleAnimation.
 */
function HomeServices() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      data-navbar-theme="dark"
      className="relative bg-white"
    >
      {/* No gradient — StickySection stacking creates the depth/overlap effect */}

      {/* ── Mobile ── */}
      <div className="px-container-x py-section lg:hidden">
        <div className="relative z-10 mx-auto max-w-container">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="services-title" className="heading-section mb-12 text-black">
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
                    <h3 className="text-subtitle text-title-sm text-black">{service.title}</h3>
                    <p className="text-body leading-relaxed text-black/50">{service.description}</p>
                    <LinkCTA
                      to={service.link}
                      theme="light"
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
                to={HOMEPAGE_SECTIONS.services.cta.link}
                theme="light"
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
        {/* Scroll height: title/zoom intro + per-service scroll + exit buffer */}
        {/* Extra height for outro phase (pattern zoom + phrase) */}
        <div style={{ height: `${(SERVICE_COUNT * 2 + 3) * 100}vh` }}>
          {/* Sticky viewport */}
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Circle pattern background */}
            {!prefersReducedMotion && <PatternBackground scrollYProgress={scrollYProgress} />}

            {/* Title — rises to top then fades */}
            {!prefersReducedMotion ? (
              <SectionTitle scrollYProgress={scrollYProgress} />
            ) : (
              <div className="absolute inset-x-0 top-[6vh] z-30 flex justify-center">
                <h2 id="services-title" className="heading-section text-black">
                  {HOMEPAGE_SECTIONS.services.title}
                </h2>
              </div>
            )}

            {/* Service content — photo stack + text */}
            {prefersReducedMotion ? (
              <div className="flex h-full items-center">
                <StaticServiceList />
              </div>
            ) : (
              <>
                {/* Shared layout: photo left, text right */}
                <div className="absolute inset-0 z-10 flex items-center justify-center px-container-x">
                  <div className="mx-auto flex w-full max-w-container items-center gap-12 xl:gap-16">
                    {/* Photo stack — clip-path volet transitions */}
                    <PhotoStack scrollYProgress={scrollYProgress} />

                    {/* Text — each service scrolls independently */}
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeServices;
