import { m, useSpring, useTransform, type MotionValue } from 'framer-motion';

import { TITLE_END, ZOOM_END } from './constants';

import { HOMEPAGE_SECTIONS } from '@/data/homepage';
import { useFadeInOut } from '@/hooks/useFadeInOut';
import { SPRING_CONFIG } from '@/lib/motion';

/**
 * Title "Nos Services" — fades in centered, rises to top, then fades out.
 */
export function SectionTitle({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const yRaw = useTransform(scrollYProgress, [0, TITLE_END], ['40vh', '6vh']);
  const y = useSpring(yRaw, SPRING_CONFIG);

  const opacity = useFadeInOut(scrollYProgress, 0, 0.02, ZOOM_END, ZOOM_END + 0.04);

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
