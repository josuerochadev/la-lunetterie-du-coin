import { useEffect, useMemo, useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { HOMEPAGE_SERVICES, HOMEPAGE_SECTIONS } from '@/data/homepage';
import motifCercleUrl from '@/assets/patterns/motif-cercle-jaune.svg';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const SERVICE_COUNT = HOMEPAGE_SERVICES.length;
const OUTRO_WORDS = ['TAPEZ-LEUR', 'DANS', "L'OEIL"] as const;

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
 * Outro — word-by-word reveal → hold → staggered word-by-word exit upward →
 * L'OEIL morphs into floating logo video → background white → yellow.
 *
 * Timeline (relative to scrollYProgress):
 *   0.82 – 0.88  Words reveal: TAPEZ-LEUR → DANS → L'OEIL (opacity 0→1)
 *   0.88 – 0.90  Hold — full phrase visible
 *   0.89 – 0.92  CTA fades in
 *   0.90 – 0.93  Staggered exit: TAPEZ-LEUR exits first, DANS next
 *   0.90 – 0.94  Background white → yellow
 *   0.92 – 0.94  L'OEIL text fades out, logo replaces it at same position
 *   0.93 – 0.99  Logo grows large + floats upward with organic drift
 *   0.95 – 0.98  CTA fades out
 */
function SectionOutro({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Word-by-word entrance (opacity starts at 0, not 0.15) ──
  const REVEAL_START = 0.82;
  const REVEAL_END = 0.88;
  const wordCount = OUTRO_WORDS.length;

  const wordTimings = useMemo(() => {
    const rng = REVEAL_END - REVEAL_START;
    return OUTRO_WORDS.map((_, i) => {
      const inStart = REVEAL_START + (i / wordCount) * rng;
      const inEnd = Math.min(inStart + rng / wordCount + rng * 0.2, REVEAL_END);
      return { inStart, inEnd };
    });
  }, [wordCount]);

  // ── Word entrance transforms (0 → 1 opacity) ──
  const w0InOpacity = useTransform(
    scrollYProgress,
    [wordTimings[0].inStart, wordTimings[0].inEnd],
    [0, 1],
  );
  const w0InY = useTransform(
    scrollYProgress,
    [wordTimings[0].inStart, wordTimings[0].inEnd],
    [12, 0],
  );
  const w1InOpacity = useTransform(
    scrollYProgress,
    [wordTimings[1].inStart, wordTimings[1].inEnd],
    [0, 1],
  );
  const w1InY = useTransform(
    scrollYProgress,
    [wordTimings[1].inStart, wordTimings[1].inEnd],
    [12, 0],
  );
  const w2InOpacity = useTransform(
    scrollYProgress,
    [wordTimings[2].inStart, wordTimings[2].inEnd],
    [0, 1],
  );
  const w2InY = useTransform(
    scrollYProgress,
    [wordTimings[2].inStart, wordTimings[2].inEnd],
    [12, 0],
  );

  // ── Staggered exit upward (TAPEZ-LEUR first, DANS next, L'OEIL last) ──
  const EXIT_START = 0.9;
  const EXIT_STAGGER = 0.012;

  // Word 0 exit
  const w0ExitOpacity = useTransform(scrollYProgress, [EXIT_START, EXIT_START + 0.02], [1, 0]);
  const w0ExitYRaw = useTransform(scrollYProgress, [EXIT_START, EXIT_START + 0.025], [0, -60]);
  const w0ExitY = useSpring(w0ExitYRaw, SPRING_CONFIG);

  // Word 1 exit
  const w1ExitOpacity = useTransform(
    scrollYProgress,
    [EXIT_START + EXIT_STAGGER, EXIT_START + EXIT_STAGGER + 0.02],
    [1, 0],
  );
  const w1ExitYRaw = useTransform(
    scrollYProgress,
    [EXIT_START + EXIT_STAGGER, EXIT_START + EXIT_STAGGER + 0.025],
    [0, -60],
  );
  const w1ExitY = useSpring(w1ExitYRaw, SPRING_CONFIG);

  // Word 2 (L'OEIL) — text fades out separately so logo can take over
  const w2TextOpacity = useTransform(scrollYProgress, [0.92, 0.94], [1, 0]);
  const w2ExitYRaw = useTransform(scrollYProgress, [0.92, 0.94], [0, -30]);
  const w2ExitY = useSpring(w2ExitYRaw, SPRING_CONFIG);

  // Combine entrance + exit
  const w0Opacity = useTransform([w0InOpacity, w0ExitOpacity] as const, ([a, b]: number[]) =>
    Math.min(a, b),
  );
  const w0Y = useTransform([w0InY, w0ExitY] as const, ([a, b]: number[]) => a + b);
  const w1Opacity = useTransform([w1InOpacity, w1ExitOpacity] as const, ([a, b]: number[]) =>
    Math.min(a, b),
  );
  const w1Y = useTransform([w1InY, w1ExitY] as const, ([a, b]: number[]) => a + b);
  // L'OEIL: entrance opacity × text fade-out (logo handles the rest)
  const w2Opacity = useTransform([w2InOpacity, w2TextOpacity] as const, ([a, b]: number[]) =>
    Math.min(a, b),
  );
  const w2Y = useTransform([w2InY, w2ExitY] as const, ([a, b]: number[]) => a + b);

  // ── Logo video — appears after bg is fully yellow, descends, holds, rises ──
  const LOGO_IN = 0.94; // synced with bg fully yellow (bgOpacity reaches 1 at 0.94)
  const LOGO_FLOAT_END = 0.99;

  // Logo fades in once background is fully yellow, fades out only at very top of viewport
  const logoOpacity = useTransform(
    scrollYProgress,
    [LOGO_IN, LOGO_IN + 0.01, 0.985, LOGO_FLOAT_END],
    [0, 1, 1, 0],
  );
  // Scale: starts small → grows during descent/hold → shrinks slightly on exit
  const logoScale = useTransform(
    scrollYProgress,
    [LOGO_IN, 0.96, 0.975, LOGO_FLOAT_END],
    [1, 4, 6, 5],
  );
  const logoScaleSpring = useSpring(logoScale, SPRING_CONFIG);
  // Y trajectory: descend → hold center → rise up (arc movement)
  const logoYRaw = useTransform(
    scrollYProgress,
    [LOGO_IN, 0.96, 0.975, LOGO_FLOAT_END],
    [0, 15, 10, -55],
  );
  const logoY = useTransform(logoYRaw, (v: number) => `${v}vh`);
  // Organic drift — sinusoidal X (starts during hold phase)
  const logoXRaw = useTransform(scrollYProgress, [0.95, LOGO_FLOAT_END], [0, Math.PI * 2]);
  const logoX = useTransform(logoXRaw, (v: number) => Math.sin(v) * 40);
  const logoXSpring = useSpring(logoX, { stiffness: 50, damping: 20, mass: 1 });
  // Gentle rotation
  const logoRotateRaw = useTransform(scrollYProgress, [0.95, LOGO_FLOAT_END], [0, Math.PI * 2]);
  const logoRotate = useTransform(logoRotateRaw, (v: number) => Math.sin(v) * 4);

  // ── Background white → yellow ──
  const bgOpacity = useTransform(scrollYProgress, [0.9, 0.94], [0, 1]);

  // ── CTA — follows phrase timing: in after phrase, out shortly after phrase exits ──
  const ctaOpacity = useTransform(scrollYProgress, [0.89, 0.91, 0.92, 0.94], [0, 1, 1, 0]);
  const ctaYRaw = useTransform(scrollYProgress, [0.89, 0.91], [20, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);
  const ctaPointer = useTransform(ctaOpacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));

  // Play/pause video based on visibility
  useEffect(() => {
    const unsubscribe = logoOpacity.on('change', (v: number) => {
      const video = videoRef.current;
      if (!video) return;
      if (v > 0.05) {
        if (video.paused) video.play();
      } else {
        if (!video.paused) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
    return unsubscribe;
  }, [logoOpacity]);

  return (
    <>
      {/* Yellow background overlay */}
      <m.div
        className="pointer-events-none absolute inset-0 z-10 bg-accent"
        style={{ opacity: bgOpacity }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-8">
        {/* Phrase — word-by-word entrance + staggered exit */}
        <h3 className="text-heading text-center text-title-xl text-black">
          {/* Line 1: TAPEZ-LEUR */}
          <span className="inline-block">
            <m.span className="inline-block" style={{ opacity: w0Opacity, y: w0Y }}>
              {OUTRO_WORDS[0]}
            </m.span>
          </span>
          <br />
          {/* Line 2: DANS + L'OEIL → logo */}
          <span className="inline-block">
            <m.span className="inline-block" style={{ opacity: w1Opacity, y: w1Y }}>
              {OUTRO_WORDS[1]}
            </m.span>
          </span>
          {'\u00A0'}
          <span className="relative inline-block align-bottom">
            {/* L'OEIL text — fades out, replaced by logo */}
            <m.span className="inline-block" style={{ opacity: w2Opacity, y: w2Y }}>
              {OUTRO_WORDS[2]}
            </m.span>

            {/* Logo video — spawns at L'OEIL position, then grows + floats */}
            <m.span
              className="absolute left-1/2 top-1/2 inline-flex origin-center items-center justify-center"
              style={{
                opacity: logoOpacity,
                scale: logoScaleSpring,
                y: logoY,
                x: logoXSpring,
                rotate: logoRotate,
                translateX: '-50%',
                translateY: '-50%',
              }}
            >
              <video
                ref={videoRef}
                src="/videos/logo-animated.mp4"
                muted
                playsInline
                loop
                preload="auto"
                className="h-[1em] w-auto rounded-lg object-contain"
                style={{ mixBlendMode: 'multiply' }}
                aria-label="Logo animé La Lunetterie du Coin"
              />
            </m.span>
          </span>
        </h3>

        {/* CTA */}
        <m.div
          className="pointer-events-auto"
          style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointer }}
        >
          <LinkCTA
            to={HOMEPAGE_SECTIONS.services.cta.link}
            theme="light"
            aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
          >
            {HOMEPAGE_SECTIONS.services.cta.text}
          </LinkCTA>
        </m.div>
      </div>
    </>
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
            <h3 className="text-subtitle mb-3 text-title-sm text-black">{service.title}</h3>
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
      className="pointer-events-none relative bg-white"
    >
      {/* Concave curve — accent ellipse masks the top corners, creating an inward arc */}
      <div
        className="pointer-events-none absolute -top-[1px] left-1/2 z-20 h-[12vw] w-[140vw] -translate-x-1/2 rounded-b-[50%] bg-accent"
        aria-hidden="true"
      />

      {/* ── Mobile ── */}
      <div className="pointer-events-auto px-container-x py-section lg:hidden">
        <div className="relative z-10 mx-auto max-w-container">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section mb-12 text-black">{HOMEPAGE_SECTIONS.services.title}</h2>
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
        <div style={{ height: `${(SERVICE_COUNT * 2 + 1) * 100}vh` }}>
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
