import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SERVICE_COUNT, SERVICES_START, SERVICES_END } from './constants';

import ResponsiveImage from '@/components/common/ResponsiveImage';
import { SERVICES_DATA } from '@/data/services';
import { SPRING_CONFIG } from '@/lib/motion';

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
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </m.div>
  );
}

/**
 * Photo stack — all photos layered in one container, clipPath volet transitions.
 * Container enters from below, exits at end. Photos reveal bottom-to-top.
 */
export function PhotoStack({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const range = SERVICES_END - SERVICES_START;
  const segmentSize = range / SERVICE_COUNT;

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
      <img
        src={SERVICES_DATA[0].image}
        alt={SERVICES_DATA[0].title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />

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
