import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { TITLE_END, ZOOM_END, OUTRO_START } from './constants';

import motifCercleUrl from '@/assets/patterns/motif-cercle-jaune.svg';
import { SPRING_CONFIG } from '@/lib/motion';

/**
 * Circle pattern background — zooms in to open center space for content.
 */
export function PatternBackground({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const scale = useTransform(
    scrollYProgress,
    [0, TITLE_END * 0.5, ZOOM_END, OUTRO_START, OUTRO_START + 0.08],
    [1.15, 1.15, 1.6, 1.6, 1.0],
  );
  const scaleSpring = useSpring(scale, SPRING_CONFIG);

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.02, OUTRO_START, OUTRO_START + 0.06],
    [0, 0.12, 0.12, 0.3],
  );

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
