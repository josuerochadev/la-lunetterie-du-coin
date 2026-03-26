import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { SERVICES_DATA, type ServiceData } from '@/data/services';
import { CALENDLY_URL } from '@/config/endpoints';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const SERVICE_COUNT = SERVICES_DATA.length;

// Scroll budget
const SERVICES_START = 0.06;
const SERVICES_END = 0.94;

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
 * Service text card — HomeOffers card style with accent bar.
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

  // Opacity: fade in / fade out
  const fadeIn = useTransform(scrollYProgress, [start, start + segmentSize * 0.08], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [exitStart, end], [1, 0]);
  const opacity = useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));
  const pointerEvents = useTransform(opacity, (v: number) => (v > 0.1 ? 'auto' : 'none'));

  const isExamens = service.id === 'examens';

  return (
    <m.div
      className={`${index === 0 ? '' : 'absolute inset-0'} flex flex-col justify-center`}
      style={{ opacity, y, pointerEvents }}
    >
      {/* Card — editorial cutout with accent bar (HomeOffers style) */}
      <div className="relative overflow-hidden rounded-r-2xl bg-black/80 shadow-2xl backdrop-blur-md">
        {/* Accent bar — left edge */}
        <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-accent" aria-hidden="true" />

        <div className="relative z-10 px-8 py-8 xl:px-10 xl:py-10">
          {/* Counter */}
          <span className="mb-3 block text-body-sm font-medium uppercase tracking-widest text-white/30">
            {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
          </span>

          {/* Title */}
          <h3 className="text-subtitle mb-4 text-title-sm text-accent">{service.title}</h3>

          {/* Description */}
          <p className="mb-6 max-w-md text-body leading-relaxed text-white/60">
            {service.description}
          </p>

          {/* Details — top 4 only on desktop to stay digestible */}
          <ul className="mb-6 space-y-2">
            {service.details.slice(0, 4).map((detail, i) => (
              <li key={i} className="flex gap-3 text-body text-white/40">
                <span className="text-accent" aria-hidden="true">
                  •
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          {/* Examens: conditions + Calendly CTA */}
          {isExamens && (
            <div className="mb-6 border-l-4 border-accent/30 bg-accent/5 p-4">
              <h4 className="mb-2 text-body-sm font-medium text-white/60">
                Conditions pour un examen en magasin
              </h4>
              <ul className="space-y-1 text-body-sm text-white/40">
                <li>
                  • Ordonnance {'<'} 5 ans (16-42 ans) ou {'<'} 3 ans (42+)
                </li>
                <li>• Pas de mention contre-indiquant l&apos;examen hors cabinet</li>
                <li>• Non autorisé : diabète, kératocône, glaucome, cataracte</li>
              </ul>
            </div>
          )}

          {/* CTA */}
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
        </div>
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
                <p className="text-body leading-relaxed text-white/60">{service.description}</p>

                <div className="border border-white/10 p-5">
                  <ul className="space-y-2">
                    {service.details.map((detail, i) => (
                      <li key={i} className="flex gap-3 text-body text-white/40">
                        <span className="text-accent" aria-hidden="true">
                          •
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isExamens && (
                  <>
                    <div className="border-l-4 border-accent/30 bg-accent/5 p-4">
                      <h4 className="mb-2 text-body-sm font-medium text-white/60">
                        Conditions pour un examen en magasin
                      </h4>
                      <ul className="space-y-1 text-body-sm text-white/40">
                        <li>
                          • Ordonnance {'<'} 5 ans (16-42 ans) ou {'<'} 3 ans (42+)
                        </li>
                        <li>• Pas de mention contre-indiquant l&apos;examen hors cabinet</li>
                        <li>• Non autorisé : diabète, kératocône, glaucome, cataracte</li>
                      </ul>
                    </div>
                    <LinkCTA
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      theme="dark"
                      aria-label="Prendre rendez-vous pour un examen de vue"
                    >
                      Prendre rendez-vous
                    </LinkCTA>
                  </>
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
      {/* Concave curve — accent ellipse masks the top, matching hero color (like HomeServices) */}
      <div
        className="pointer-events-none absolute -top-[1px] left-1/2 z-20 h-[12vw] w-[140vw] -translate-x-1/2 rounded-b-[50%] bg-accent"
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
          {/* Scroll height: per-service scroll + outro phase */}
          <div style={{ height: `${(SERVICE_COUNT * 2 + 2) * 100}vh` }}>
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen overflow-hidden">
              <h2 id="services-content-title" className="sr-only">
                Nos services en détail
              </h2>

              {/* Service content — photo stack left + card right (HomeServices layout) */}
              {shouldAnimate && (
                <div className="absolute inset-0 z-10 flex items-center justify-center px-container-x">
                  <div className="mx-auto flex w-full max-w-container items-center gap-12 xl:gap-16">
                    {/* Photo stack — clip-path volet transitions */}
                    <PhotoStack scrollYProgress={scrollYProgress} />

                    {/* Text cards — each scrolls independently alongside photos */}
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
    </section>
  );
}
