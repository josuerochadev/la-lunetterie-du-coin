import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SERVICE_COUNT, SERVICES_START, SERVICES_END } from './constants';
import { GrainOverlay } from './GrainOverlay';

import ResponsiveImage from '@/components/common/ResponsiveImage';
import { HOMEPAGE_SERVICES } from '@/data/homepage';
import { SPRING_CONFIG } from '@/lib/motion';

/**
 * Single photo that reveals from bottom to top via clipPath.
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
      <ResponsiveImage
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        widths={[640, 1024]}
        sizes="(min-width: 1024px) 36vw, 100vw"
      />
    </m.div>
  );
}

/**
 * Photo stack — all photos layered in the same position.
 * Transitions use clipPath (slide-up reveal) instead of crossfade.
 */
export function PhotoStack({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const range = SERVICES_END - SERVICES_START;
  const segmentSize = range / SERVICE_COUNT;

  const PARALLAX_LAG = 0.02;
  const firstStart = SERVICES_START + PARALLAX_LAG;
  const enterEnd = firstStart + segmentSize * 0.2;
  const lastEnd = SERVICES_START + range;
  const exitStart = lastEnd - segmentSize * 0.22;

  const yRaw = useTransform(
    scrollYProgress,
    [firstStart, enterEnd, exitStart, lastEnd],
    ['60vh', '0vh', '0vh', '-60vh'],
  );
  const y = useSpring(yRaw, SPRING_CONFIG);

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

      {/* Photos 1+ reveal via clipPath slide-up */}
      {HOMEPAGE_SERVICES.slice(1).map((service, i) => {
        const idx = i + 1;
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

      <GrainOverlay />
    </m.div>
  );
}
