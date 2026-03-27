import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { TITLE_END, ZOOM_END } from './constants';

import { HOMEPAGE_SECTIONS } from '@/data/homepage';
import { SPRING_CONFIG } from '@/lib/motion';

/**
 * Title "Nos Services" — fades in centered, rises to top, then fades out.
 */
export function SectionTitle({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const yRaw = useTransform(scrollYProgress, [0, TITLE_END], ['40vh', '6vh']);
  const y = useSpring(yRaw, SPRING_CONFIG);

  const fadeIn = useTransform(scrollYProgress, [0, 0.02], [0, 1]);
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
