import { useRef, type ReactNode } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { SERVICES_DATA, type ServiceData } from '@/data/services';
import { CALENDLY_URL } from '@/config/endpoints';
import { SPRING_CONFIG } from '@/lib/motion';

const ACCENT_HEX = '#FEEB09';
const SERVICE_COUNT = SERVICES_DATA.length;

// Scroll budget
const SERVICES_START = 0.06;
const SERVICES_END = 0.94;

// ---------------------------------------------------------------------------
// Progress indicator — vertical dots showing active service
// ---------------------------------------------------------------------------

function ServiceProgressIndicator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const fadeIn = useTransform(scrollYProgress, [SERVICES_START, SERVICES_START + 0.03], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [SERVICES_END - 0.03, SERVICES_END], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));

  const progressRaw = useTransform(
    scrollYProgress,
    [SERVICES_START, SERVICES_END],
    [0, SERVICE_COUNT],
  );
  const progress = useSpring(progressRaw, SPRING_CONFIG);

  return (
    <m.div
      className="flex shrink-0 flex-col items-center gap-3"
      style={{ opacity }}
      aria-hidden="true"
    >
      {Array.from({ length: SERVICE_COUNT }, (_, i) => (
        <ProgressDot key={i} index={i} progress={progress} />
      ))}
    </m.div>
  );
}

function ProgressDot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const dotOpacity = useTransform(progress, (v: number) => (v >= index && v < index + 1 ? 1 : 0));
  const bgOpacity = useTransform(dotOpacity, (v: number) => (v === 1 ? 0 : 1));

  return (
    <span className="relative h-2.5 w-2.5 rounded-full">
      <m.span
        className="absolute inset-0 rounded-full bg-orange/20"
        style={{ opacity: bgOpacity }}
      />
      <m.span className="absolute inset-0 rounded-full bg-orange" style={{ opacity: dotOpacity }} />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Desktop sub-components — PhotoStack pattern from HomeServices
// ---------------------------------------------------------------------------

/**
 * Photo stack — all photos layered in one container, clipPath volet transitions.
 * Container enters from below, exits at end. Photos reveal bottom-to-top.
 */
function PhotoStack({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const range = SERVICES_END - SERVICES_START;
  const segmentSize = range / SERVICE_COUNT;

  // Shared Y: container enters from below, settles, exits at end
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
        src={SERVICES_DATA[0].image}
        alt={SERVICES_DATA[0].title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />

      {/* Photos 1+ reveal via clipPath slide-up (volet effect) */}
      {SERVICES_DATA.slice(1).map((service, i) => {
        const idx = i + 1;
        const revealStart = SERVICES_START + idx * segmentSize;
        const revealEnd = revealStart + segmentSize * 0.3;

        return (
          <PhotoReveal
            key={service.id}
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
 * Staggered child — adds a micro-delay to each element within a ServiceCard.
 * Uses the card's entrance timing to offset opacity + Y for each child.
 */
function StaggerChild({
  children,
  scrollYProgress,
  enterStart,
  enterEnd,
  exitStart,
  exitEnd,
  staggerIndex,
}: {
  children: ReactNode;
  scrollYProgress: MotionValue<number>;
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
  staggerIndex: number;
}) {
  const STAGGER_OFFSET = 0.008;
  const offset = staggerIndex * STAGGER_OFFSET;

  const fadeIn = useTransform(scrollYProgress, [enterStart + offset, enterEnd + offset], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [exitStart - offset, exitEnd], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));

  const yRaw = useTransform(scrollYProgress, [enterStart + offset, enterEnd + offset], [20, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  return (
    <m.div style={{ opacity, y }} className="will-change-transform">
      {children}
    </m.div>
  );
}

/**
 * Service text — editorial free-text style with staggered children.
 * Scrolls up alongside the photo stack.
 */
function ServiceCard({
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
  const textScrollEnd = start + segmentSize * 0.75;
  const exitStart = start + segmentSize * 0.78;
  const end = start + segmentSize;

  // Y: enter from below → scroll up alongside photo → exit up
  const yRaw = useTransform(
    scrollYProgress,
    [start, enterEnd, textScrollEnd, exitStart, end],
    ['65vh', '18vh', '-18vh', '-18vh', '-65vh'],
  );
  const y = useSpring(yRaw, SPRING_CONFIG);

  // Container opacity: fade in / fade out
  const fadeIn = useTransform(scrollYProgress, [start, start + segmentSize * 0.08], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [exitStart, end], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));
  const pointerEvents = useTransform(opacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));

  const isExamens = service.id === 'examens';

  // Stagger timing — children enter slightly after the card, exit slightly before
  const stEnter = start;
  const stEnterEnd = start + segmentSize * 0.12;
  const stExitStart = exitStart;
  const stExitEnd = end;

  return (
    <m.div
      className={`${index === 0 ? '' : 'absolute inset-0'} flex flex-col justify-center`}
      style={{ opacity, y, pointerEvents }}
    >
      {/* Counter */}
      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={0}
      >
        <span className="mb-4 block text-body-sm font-medium uppercase tracking-widest text-white/30">
          {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
        </span>
      </StaggerChild>

      {/* Title — large accent */}
      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={1}
      >
        <h3
          className="text-heading mb-5 text-accent"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 3.2rem)', lineHeight: '1.05' }}
        >
          {service.title}
        </h3>
      </StaggerChild>

      {/* Description */}
      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={2}
      >
        <p className="mb-8 max-w-lg text-body-lg leading-relaxed text-white/60">
          {service.description}
        </p>
      </StaggerChild>

      {/* Details — 2 columns grid */}
      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={3}
      >
        <ul className="mb-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-2.5">
          {service.details.slice(0, 6).map((detail, i) => (
            <li key={i} className="flex gap-2.5 text-body-sm text-white/40">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-orange"
                aria-hidden="true"
              />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </StaggerChild>

      {/* Examens: conditions */}
      {isExamens && (
        <StaggerChild
          scrollYProgress={scrollYProgress}
          enterStart={stEnter}
          enterEnd={stEnterEnd}
          exitStart={stExitStart}
          exitEnd={stExitEnd}
          staggerIndex={4}
        >
          <div className="mb-8 max-w-lg border-l-2 border-accent/30 pl-5">
            <h4 className="mb-2 text-body-sm font-medium text-white/50">
              Conditions pour un examen en magasin
            </h4>
            <ul className="space-y-1 text-body-sm text-white/35">
              <li>
                Ordonnance {'<'} 5 ans (16-42 ans) ou {'<'} 3 ans (42+)
              </li>
              <li>Pas de mention contre-indiquant l&apos;examen hors cabinet</li>
              <li>Non autorisé : diabète, kératocône, glaucome, cataracte</li>
            </ul>
          </div>
        </StaggerChild>
      )}

      {/* CTA */}
      <StaggerChild
        scrollYProgress={scrollYProgress}
        enterStart={stEnter}
        enterEnd={stEnterEnd}
        exitStart={stExitStart}
        exitEnd={stExitEnd}
        staggerIndex={isExamens ? 5 : 4}
      >
        {isExamens ? (
          <LinkCTA
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            theme="dark"
            aria-label="Prendre rendez-vous pour un examen de vue"
          >
            Prendre rendez-vous
          </LinkCTA>
        ) : (
          <LinkCTA to="/contact" theme="dark" aria-label={`En savoir plus sur ${service.title}`}>
            Nous contacter
          </LinkCTA>
        )}
      </StaggerChild>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Mobile fallback
// ---------------------------------------------------------------------------

function MobileServiceList() {
  return (
    <div className="space-y-16 sm:space-y-20">
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
              <div className="mt-8">
                <span className="mb-3 block text-body-sm font-medium uppercase tracking-widest text-white/30">
                  {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
                </span>
                <h3
                  className="text-heading mb-4 text-accent"
                  style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', lineHeight: '1.1' }}
                >
                  {service.title}
                </h3>
                <p className="mb-6 text-body-lg leading-relaxed text-white/60">
                  {service.description}
                </p>

                <ul className="mb-6 grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex gap-2.5 text-body-sm text-white/40">
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary-orange"
                        aria-hidden="true"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {isExamens && (
                  <div className="mb-6 border-l-2 border-accent/30 pl-4">
                    <h4 className="mb-2 text-body-sm font-medium text-white/50">
                      Conditions pour un examen en magasin
                    </h4>
                    <ul className="space-y-1 text-body-sm text-white/35">
                      <li>
                        Ordonnance {'<'} 5 ans (16-42 ans) ou {'<'} 3 ans (42+)
                      </li>
                      <li>Pas de mention contre-indiquant l&apos;examen hors cabinet</li>
                      <li>Non autorisé : diabète, kératocône, glaucome, cataracte</li>
                    </ul>
                  </div>
                )}

                {isExamens ? (
                  <LinkCTA
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    theme="dark"
                    aria-label="Prendre rendez-vous pour un examen de vue"
                  >
                    Prendre rendez-vous
                  </LinkCTA>
                ) : (
                  <LinkCTA
                    to="/contact"
                    theme="dark"
                    aria-label={`En savoir plus sur ${service.title}`}
                  >
                    Nous contacter
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
      className="relative"
      style={{ background: 'linear-gradient(to bottom, transparent 12vw, #000 12vw)' }}
    >
      {/* Convex dome — black dome with transparent corners revealing the hero behind */}
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
          {/* Scroll height: per-service scroll + outro phase */}
          <div style={{ height: `${(SERVICE_COUNT * 2 + 2) * 100}vh` }}>
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen overflow-hidden">
              <h2 id="services-content-title" className="sr-only">
                Nos services en détail
              </h2>

              {/* Service content — photo stack left + progress + text right */}
              {shouldAnimate && (
                <>
                  <div className="absolute inset-0 z-10 flex items-center justify-center px-container-x">
                    <div className="mx-auto flex w-full max-w-container items-center gap-12 xl:gap-16">
                      {/* Photo stack — clip-path volet transitions */}
                      <PhotoStack scrollYProgress={scrollYProgress} />

                      {/* Progress indicator — vertical dots */}
                      <ServiceProgressIndicator scrollYProgress={scrollYProgress} />

                      {/* Text — each service scrolls independently */}
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
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom gradient dissolve — smooth black → accent for CTA transition */}
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
