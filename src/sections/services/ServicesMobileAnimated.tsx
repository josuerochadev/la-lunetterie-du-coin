import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { SERVICE_COUNT } from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import { SERVICES_DATA, type ServiceData } from '@/data/services';
import { BOOKING_URL } from '@/config/endpoints';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';

// ── Scroll budget (normalised 0–1) ─────────────────────────────
// No intro title — services start immediately.
const SLICE = 1 / SERVICE_COUNT; // 0.20 per service

// ── Per-slide phase offsets (relative to slice start) ───────────
const ENTER_OFFSET = 0.02; // photo starts fading in 0.02 before slice start (crossfade)
const ENTER_DUR = 0.04; // photo fade-in duration
const TEXT_COUNTER = 0.03;
const TEXT_TITLE = 0.04;
const TEXT_DESC = 0.06;
const TEXT_DETAILS = 0.075;
const TEXT_CTA = 0.09;
const TEXT_STAGGER = 0.03; // duration each text element takes to appear
const EXIT_START = 0.16;
const EXIT_END = SLICE; // 0.20

// ────────────────────────────────────────────────────────────────
// ProgressBar — horizontal fill segments (matches homepage pattern)
// ────────────────────────────────────────────────────────────────

function ProgressSegment({
  progress,
  segStart,
  segEnd,
  index,
}: {
  progress: MotionValue<number>;
  segStart: number;
  segEnd: number;
  index: number;
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

function ProgressBar({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-30 flex items-center gap-3 px-container-x pb-8"
      aria-hidden="true"
    >
      {SERVICES_DATA.map((_, i) => (
        <ProgressSegment
          key={i}
          index={i}
          progress={progress}
          segStart={i / SERVICE_COUNT}
          segEnd={(i + 1) / SERVICE_COUNT}
        />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// ServiceSlide — single full-viewport service experience
// ────────────────────────────────────────────────────────────────

function ServiceSlide({
  service,
  index,
  scrollYProgress,
}: {
  service: ServiceData;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const s = index * SLICE;

  // ── Photo entrance — opacity crossfade (overlaps with previous exit) ──
  const enterStart = Math.max(0, s - ENTER_OFFSET);
  const enterEnd = s + ENTER_DUR - ENTER_OFFSET;
  const photoOpacity = useTransform(scrollYProgress, [enterStart, enterEnd], [0, 1]);

  // Subtle Ken Burns zoom throughout the slide
  const photoScaleRaw = useTransform(scrollYProgress, [s, s + EXIT_START], [1, 1.08]);
  const photoScale = useSpring(photoScaleRaw, SPRING_CONFIG);

  // ── Text stagger entrance ─────────────────────────────────────
  const counterOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_COUNTER, s + TEXT_COUNTER + TEXT_STAGGER],
    [0, 1],
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_TITLE, s + TEXT_TITLE + TEXT_STAGGER],
    [0, 1],
  );
  const titleYRaw = useTransform(
    scrollYProgress,
    [s + TEXT_TITLE, s + TEXT_TITLE + TEXT_STAGGER],
    [25, 0],
  );
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  const descOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_DESC, s + TEXT_DESC + TEXT_STAGGER],
    [0, 1],
  );
  const descYRaw = useTransform(
    scrollYProgress,
    [s + TEXT_DESC, s + TEXT_DESC + TEXT_STAGGER],
    [20, 0],
  );
  const descY = useSpring(descYRaw, SPRING_CONFIG);

  const detailsOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_DETAILS, s + TEXT_DETAILS + TEXT_STAGGER],
    [0, 1],
  );

  const ctaOpacity = useTransform(
    scrollYProgress,
    [s + TEXT_CTA, s + TEXT_CTA + TEXT_STAGGER],
    [0, 1],
  );

  // ── Exit — fade out + slide up ────────────────────────────────
  const exitOpacity = useTransform(scrollYProgress, [s + EXIT_START, s + EXIT_END], [1, 0]);
  const exitYRaw = useTransform(scrollYProgress, [s + EXIT_START, s + EXIT_END], [0, -30]);
  const exitY = useSpring(exitYRaw, SPRING_CONFIG);

  // ── Combined visibility (entrance × exit) ─────────────────────
  const slideOpacity = useTransform(
    [photoOpacity, exitOpacity] as const,
    ([enter, exit]: number[]) => Math.min(enter, exit),
  );

  const isExamens = service.id === 'examens';

  return (
    <m.div className="absolute inset-0 will-change-[opacity]" style={{ opacity: slideOpacity }}>
      {/* Full-viewport photo */}
      <m.img
        src={service.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        loading={index === 0 ? 'eager' : 'lazy'}
        style={{ scale: photoScale }}
      />

      {/* Gradient overlays for text readability */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[30%]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%]"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Text content — anchored to bottom of viewport, blurred for readability */}
      <m.div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-container-x pb-16 backdrop-blur-[6px]"
        style={{ y: exitY, top: '38%' }}
      >
        {/* Counter */}
        <m.span
          className="mb-3 block text-body font-medium uppercase tracking-widest text-white/70"
          style={{ opacity: counterOpacity }}
        >
          {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
        </m.span>

        {/* Title — Satoshi Black Caps (matches homepage services) */}
        <m.h3
          className="text-subtitle mb-4 text-title-sm text-white"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          {service.title}
        </m.h3>

        {/* Description */}
        <m.p
          className="mb-5 text-body-lg leading-relaxed text-white/85"
          style={{ opacity: descOpacity, y: descY }}
        >
          {service.description}
        </m.p>

        {/* Details list */}
        <m.ul
          className="mb-5 grid grid-cols-1 gap-y-1.5 sm:grid-cols-2 sm:gap-x-6"
          style={{ opacity: detailsOpacity }}
        >
          {service.details.map((detail, i) => (
            <li key={i} className="flex gap-2 text-body text-white/70">
              <span
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary-orange"
                aria-hidden="true"
              />
              <span>{detail}</span>
            </li>
          ))}
        </m.ul>

        {/* Examens: conditions box */}
        {isExamens && (
          <m.div
            className="mb-5 border-l-2 border-accent/30 pl-4"
            style={{ opacity: detailsOpacity }}
          >
            <h4 className="mb-2 text-body font-medium text-white">
              Conditions pour un examen en magasin
            </h4>
            <ul className="space-y-1 text-body text-white/70">
              <li>
                Ordonnance {'<'} 5 ans (16-42 ans) ou {'<'} 3 ans (42+)
              </li>
              <li>Pas de mention contre-indiquant l&apos;examen hors cabinet</li>
              <li>Non autorisé : diabète, kératocône, glaucome, cataracte</li>
            </ul>
          </m.div>
        )}

        {/* CTA */}
        <m.div style={{ opacity: ctaOpacity }}>
          {isExamens ? (
            <LinkCTA
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              theme="dark"
              icon={ExternalLink}
              aria-label="Prendre rendez-vous pour un examen de vue"
            >
              Prendre rendez-vous
            </LinkCTA>
          ) : (
            <LinkCTA to="/contact" theme="dark" aria-label={`En savoir plus sur ${service.title}`}>
              Nous contacter
            </LinkCTA>
          )}
        </m.div>
      </m.div>
    </m.div>
  );
}

// ────────────────────────────────────────────────────────────────
// ServicesMobileAnimated — sticky slideshow orchestrator
// ────────────────────────────────────────────────────────────────

export function ServicesMobileAnimated() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  return (
    <div ref={ref} className="lg:hidden" style={{ height: '800vh' }}>
      <h2 id="services-content-title" className="sr-only">
        Nos services en détail
      </h2>
      <div className="sticky top-0 h-svh overflow-hidden bg-black">
        {/* ── Service slides (layered, crossfading) ── */}
        <div className="absolute inset-0 z-10">
          {SERVICES_DATA.map((service, i) => (
            <ServiceSlide
              key={service.id}
              service={service}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* ── Progress bar (horizontal segments, bottom) ── */}
        <ProgressBar scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
