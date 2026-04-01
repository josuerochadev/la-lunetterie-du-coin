import { useEffect, useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { GrainOverlay } from './GrainOverlay';
import { SERVICE_COUNT, OUTRO_WORDS } from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_SERVICES, HOMEPAGE_SECTIONS } from '@/data/homepage';
import { BOOKING_URL } from '@/config/endpoints';
import { SPRING_CONFIG } from '@/lib/motion';

// ── Scroll budget ──
// Total height = (SERVICE_COUNT + 3) viewports
// 0.00–0.03 → curtain lift (accent overlay slides up)
// 0.03–0.68 → services crossfade (equally divided), title persists
// 0.68–0.95 → outro phrase + logo (yellow bg)
// 0.95–1.00 → final CTA
const TOTAL_VH = SERVICE_COUNT + 3;
const CURTAIN_END = 0.03;
const SERVICES_START = 0.05;
const SERVICES_END = 0.68;
const SERVICE_RANGE = (SERVICES_END - SERVICES_START) / SERVICE_COUNT;

// Outro budget
const OUTRO_START = 0.7;
const OUTRO_REVEAL_START = 0.72;
const OUTRO_REVEAL_END = 0.8;
const OUTRO_EXIT_START = 0.83;
const OUTRO_EXIT_STAGGER = 0.015;
const OUTRO_LOGO_IN = 0.86;

function getServiceRange(index: number) {
  const start = SERVICES_START + index * SERVICE_RANGE;
  const end = start + SERVICE_RANGE;
  return { start, end };
}

// ── Slide ──
function ServiceSlide({
  service,
  index,
  scrollYProgress,
}: {
  service: (typeof HOMEPAGE_SERVICES)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const { start, end } = getServiceRange(index);
  const mid = start + (end - start) * 0.5;

  // Photo: crossfade in/out + subtle zoom (last slide stays visible for outro transition)
  const isLast = index === SERVICE_COUNT - 1;
  const photoOpacity = useTransform(
    scrollYProgress,
    index === 0
      ? [start, start + 0.04, mid + 0.02, end]
      : isLast
        ? [start - 0.02, start + 0.04, mid + 0.02, 1]
        : [start - 0.02, start + 0.04, mid + 0.02, end],
    index === 0 ? [1, 1, 1, 0] : isLast ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const photoScale = useTransform(scrollYProgress, [start, end], [1.08, 1.0]);

  // Text staggered entrance
  const textIn = start + 0.03;
  const titleOpacity = useTransform(scrollYProgress, [textIn, textIn + 0.04], [0, 1]);
  const titleY = useTransform(scrollYProgress, [textIn, textIn + 0.04], [24, 0]);
  const descOpacity = useTransform(scrollYProgress, [textIn + 0.02, textIn + 0.06], [0, 1]);
  const descY = useTransform(scrollYProgress, [textIn + 0.02, textIn + 0.06], [18, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [textIn + 0.04, textIn + 0.08], [0, 1]);

  // Text exit (before next slide)
  const exitStart = mid + 0.02;
  const textExitOpacity = useTransform(scrollYProgress, [exitStart, exitStart + 0.03], [1, 0]);

  // Combined text opacities
  const combinedTitle = useTransform(
    [titleOpacity, textExitOpacity] as MotionValue<number>[],
    ([inV, outV]: number[]) => Math.min(inV, outV),
  );
  const combinedDesc = useTransform(
    [descOpacity, textExitOpacity] as MotionValue<number>[],
    ([inV, outV]: number[]) => Math.min(inV, outV),
  );
  const combinedCta = useTransform(
    [ctaOpacity, textExitOpacity] as MotionValue<number>[],
    ([inV, outV]: number[]) => Math.min(inV, outV),
  );

  return (
    <>
      {/* Background photo */}
      <m.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{ opacity: photoOpacity, zIndex: index }}
      >
        <m.img
          src={service.image}
          alt=""
          className="h-full w-full object-cover will-change-transform"
          loading={index === 0 ? 'eager' : 'lazy'}
          style={{ scale: photoScale }}
        />
        <GrainOverlay />
      </m.div>

      {/* Text content — positioned in lower-middle area */}
      <m.div
        className="absolute inset-x-0 bottom-[15%] z-20 px-container-x"
        style={{ opacity: combinedTitle }}
        aria-hidden={index > 0 ? true : undefined}
      >
        <m.h3
          className="text-subtitle text-title-sm text-white"
          style={{ opacity: combinedTitle, y: titleY }}
        >
          {service.title}
        </m.h3>
        <m.p
          className="mt-3 max-w-[32ch] text-body text-white/85"
          style={{ opacity: combinedDesc, y: descY }}
        >
          {service.description}
        </m.p>
        <m.div className="mt-4 flex flex-wrap items-center gap-4" style={{ opacity: combinedCta }}>
          <LinkCTA
            to={service.link}
            theme="dark"
            aria-label={`En savoir plus sur ${service.title}`}
          >
            En savoir plus
          </LinkCTA>
          {service.title === 'Examens de vue' && (
            <LinkCTA
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              theme="dark"
              icon={ExternalLink}
              aria-label="Prendre rendez-vous pour un examen de vue"
            >
              Prendre RDV
            </LinkCTA>
          )}
        </m.div>
      </m.div>
    </>
  );
}

// ── Progress indicator (orange, like desktop) ──
function ProgressBar({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const progress = useTransform(scrollYProgress, [SERVICES_START, SERVICES_END], [0, 1]);

  // Hide as soon as last service ends — explicit anchor at 0
  const barOpacity = useTransform(
    scrollYProgress,
    [SERVICES_START, SERVICES_END - 0.03, SERVICES_END, 1],
    [1, 1, 0, 0],
  );

  return (
    <m.div
      className="absolute inset-x-0 bottom-0 z-30 flex items-center gap-3 px-container-x pb-8"
      style={{ opacity: barOpacity }}
      aria-hidden="true"
    >
      {HOMEPAGE_SERVICES.map((service, i) => (
        <ProgressSegment
          key={service.title}
          index={i}
          progress={progress}
          segStart={i / SERVICE_COUNT}
          segEnd={(i + 1) / SERVICE_COUNT}
        />
      ))}
    </m.div>
  );
}

function ProgressSegment({
  index,
  progress,
  segStart,
  segEnd,
}: {
  index: number;
  progress: MotionValue<number>;
  segStart: number;
  segEnd: number;
}) {
  const fill = useTransform(progress, [segStart, segEnd], [0, 100]);
  const clampedFill = useTransform(fill, (v) => `${Math.max(0, Math.min(100, v))}%`);

  const segOpacity = useTransform(progress, (p) => {
    if (p >= segStart && p < segEnd) return 1;
    if (p >= segEnd) return 0.7;
    return 0.35;
  });

  return (
    <m.div
      className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-orange/20"
      style={{ opacity: segOpacity }}
    >
      <m.div
        className="absolute inset-y-0 left-0 rounded-full bg-orange"
        style={{ width: clampedFill }}
      />
      <span className="sr-only">
        Service {index + 1} sur {SERVICE_COUNT}
      </span>
    </m.div>
  );
}

// ── Outro: "TAPEZ-LEUR DANS L'ŒIL" + logo ──
function MobileOutro({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Word timings — staggered reveal
  const wordRange = OUTRO_REVEAL_END - OUTRO_REVEAL_START;
  const wordCount = OUTRO_WORDS.length;
  const wordTimings = OUTRO_WORDS.map((_, i) => {
    const inStart = OUTRO_REVEAL_START + (i / wordCount) * wordRange;
    const inEnd = Math.min(inStart + wordRange / wordCount + wordRange * 0.2, OUTRO_REVEAL_END);
    return { inStart, inEnd };
  });

  // Word entrance
  const w0InOp = useTransform(
    scrollYProgress,
    [wordTimings[0].inStart, wordTimings[0].inEnd],
    [0, 1],
  );
  const w0InY = useTransform(
    scrollYProgress,
    [wordTimings[0].inStart, wordTimings[0].inEnd],
    [16, 0],
  );
  const w1InOp = useTransform(
    scrollYProgress,
    [wordTimings[1].inStart, wordTimings[1].inEnd],
    [0, 1],
  );
  const w1InY = useTransform(
    scrollYProgress,
    [wordTimings[1].inStart, wordTimings[1].inEnd],
    [16, 0],
  );
  const w2InOp = useTransform(
    scrollYProgress,
    [wordTimings[2].inStart, wordTimings[2].inEnd],
    [0, 1],
  );
  const w2InY = useTransform(
    scrollYProgress,
    [wordTimings[2].inStart, wordTimings[2].inEnd],
    [16, 0],
  );

  // Staggered exit upward
  const w0ExitOp = useTransform(
    scrollYProgress,
    [OUTRO_EXIT_START, OUTRO_EXIT_START + 0.02],
    [1, 0],
  );
  const w0ExitYRaw = useTransform(
    scrollYProgress,
    [OUTRO_EXIT_START, OUTRO_EXIT_START + 0.025],
    [0, -40],
  );
  const w0ExitY = useSpring(w0ExitYRaw, SPRING_CONFIG);

  const e1 = OUTRO_EXIT_START + OUTRO_EXIT_STAGGER;
  const w1ExitOp = useTransform(scrollYProgress, [e1, e1 + 0.02], [1, 0]);
  const w1ExitYRaw = useTransform(scrollYProgress, [e1, e1 + 0.025], [0, -40]);
  const w1ExitY = useSpring(w1ExitYRaw, SPRING_CONFIG);

  const w2TextOp = useTransform(scrollYProgress, [OUTRO_LOGO_IN - 0.02, OUTRO_LOGO_IN], [1, 0]);
  const w2ExitYRaw = useTransform(scrollYProgress, [OUTRO_LOGO_IN - 0.02, OUTRO_LOGO_IN], [0, -20]);
  const w2ExitY = useSpring(w2ExitYRaw, SPRING_CONFIG);

  // Combined entrance + exit
  const w0Op = useTransform([w0InOp, w0ExitOp] as const, ([a, b]: number[]) => Math.min(a, b));
  const w0Y = useTransform([w0InY, w0ExitY] as const, ([a, b]: number[]) => a + b);
  const w1Op = useTransform([w1InOp, w1ExitOp] as const, ([a, b]: number[]) => Math.min(a, b));
  const w1Y = useTransform([w1InY, w1ExitY] as const, ([a, b]: number[]) => a + b);
  const w2Op = useTransform([w2InOp, w2TextOp] as const, ([a, b]: number[]) => Math.min(a, b));
  const w2Y = useTransform([w2InY, w2ExitY] as const, ([a, b]: number[]) => a + b);

  // Logo video — visible from 0.86 to 0.99, no early fade
  const logoOpacity = useTransform(
    scrollYProgress,
    [OUTRO_LOGO_IN, OUTRO_LOGO_IN + 0.01, 0.99, 1],
    [0, 1, 1, 0],
  );
  const logoScale = useTransform(
    scrollYProgress,
    [OUTRO_LOGO_IN, OUTRO_LOGO_IN + 0.04, 0.96, 1],
    [1, 3, 4.5, 4],
  );
  const logoScaleSpring = useSpring(logoScale, SPRING_CONFIG);
  const logoYRaw = useTransform(
    scrollYProgress,
    [OUTRO_LOGO_IN, OUTRO_LOGO_IN + 0.04, 0.95, 1],
    [0, 10, 5, -40],
  );
  const logoYVh = useTransform(logoYRaw, (v: number) => `${v}vh`);
  const logoRotateRaw = useTransform(scrollYProgress, [OUTRO_LOGO_IN + 0.02, 1], [0, Math.PI * 2]);
  const logoRotate = useTransform(logoRotateRaw, (v: number) => Math.sin(v) * 3);

  // Overall outro container opacity — anchored at 1 until end
  const outroOpacity = useTransform(
    scrollYProgress,
    [OUTRO_START, OUTRO_REVEAL_START, 1],
    [0, 1, 1],
  );

  // Yellow bg — reaches full opacity before text appears, stays solid until end
  const outroBgOpacity = useTransform(
    scrollYProgress,
    [SERVICES_END, OUTRO_REVEAL_START, 1],
    [0, 1, 1],
  );

  // CTA — appears with the phrase, exits with it
  const ctaOpacity = useTransform(
    scrollYProgress,
    [OUTRO_REVEAL_END - 0.02, OUTRO_REVEAL_END, OUTRO_EXIT_START, OUTRO_EXIT_START + 0.02],
    [0, 1, 1, 0],
  );
  const ctaYRaw = useTransform(
    scrollYProgress,
    [OUTRO_REVEAL_END - 0.02, OUTRO_REVEAL_END],
    [20, 0],
  );
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);

  // Play/pause video based on visibility
  useEffect(() => {
    const unsubscribe = logoOpacity.on('change', (v: number) => {
      const video = videoRef.current;
      if (!video) return;
      if (v > 0.05) {
        if (video.paused) {
          video.playbackRate = 2;
          video.play().catch(() => {});
        }
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
      {/* Yellow background for outro */}
      <m.div
        className="pointer-events-none absolute inset-0 z-20 bg-accent"
        style={{ opacity: outroBgOpacity }}
        aria-hidden="true"
      />

      {/* Outro content — left-aligned like OffersMobileAnimated outro */}
      <m.div
        className="pointer-events-none absolute inset-0 z-30 flex flex-col items-start justify-center gap-6 px-container-x"
        style={{ opacity: outroOpacity }}
      >
        {/* Phrase — word-by-word, left-aligned */}
        <h3 className="text-heading text-fluid-outro text-black">
          {/* TAPEZ-LEUR */}
          <span className="inline-block">
            <m.span className="inline-block" style={{ opacity: w0Op, y: w0Y }}>
              {OUTRO_WORDS[0]}
            </m.span>
          </span>
          <br />
          {/* DANS */}
          <span className="inline-block">
            <m.span className="inline-block" style={{ opacity: w1Op, y: w1Y }}>
              {OUTRO_WORDS[1]}
            </m.span>
          </span>
          {'\u00A0'}
          {/* L'ŒIL + logo */}
          <span className="relative inline-block align-bottom">
            <m.span className="inline-block" style={{ opacity: w2Op, y: w2Y }}>
              {OUTRO_WORDS[2]}
            </m.span>

            {/* Logo video — spawns at L'ŒIL, then grows + floats */}
            <m.span
              className="absolute left-1/2 top-1/2 inline-flex origin-center items-center justify-center"
              style={{
                opacity: logoOpacity,
                scale: logoScaleSpring,
                y: logoYVh,
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
                preload="metadata"
                className="h-[1em] w-auto rounded-lg object-contain"
                aria-label="Logo animé La Lunetterie du Coin"
              />
            </m.span>
          </span>
        </h3>

        {/* CTA */}
        <m.div className="pointer-events-auto" style={{ opacity: ctaOpacity, y: ctaY }}>
          <LinkCTA
            to={HOMEPAGE_SECTIONS.services.cta.link}
            aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
          >
            {HOMEPAGE_SECTIONS.services.cta.text}
          </LinkCTA>
        </m.div>
      </m.div>
    </>
  );
}

// ── Main component ──
export function ServicesMobileAnimated() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
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
    <div className="lg:hidden">
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
          <ProgressBar scrollYProgress={scrollYProgress} />

          {/* Outro: phrase + logo + CTA (yellow bg) */}
          <MobileOutro scrollYProgress={scrollYProgress} />

          {/* Accent curtain — slides up to reveal photos (same curve as HomeStory dome, inverted) */}
          <m.div
            className="pointer-events-none absolute inset-0 z-40 bg-accent will-change-transform"
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
