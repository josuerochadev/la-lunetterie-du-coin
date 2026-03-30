import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SERVICE_COUNT, SERVICES_START, SERVICES_END } from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_SERVICES } from '@/data/homepage';
import { useFadeInOut } from '@/hooks/useFadeInOut';
import { SPRING_CONFIG } from '@/lib/motion';

/**
 * Service text block — scrolls independently alongside the photo stack.
 * Each text enters from below, scrolls up, then exits.
 */
export function ServiceText({
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

  const yRaw = useTransform(
    scrollYProgress,
    [start, enterEnd, textScrollEnd, exitStart, end],
    ['65vh', '18vh', '-18vh', '-18vh', '-65vh'],
  );
  const y = useSpring(yRaw, SPRING_CONFIG);

  const opacity = useFadeInOut(scrollYProgress, start, start + segmentSize * 0.08, exitStart, end);
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

      <p className="mb-8 max-w-lg text-body-lg text-black/60">{service.description}</p>

      <LinkCTA to={service.link} theme="light" aria-label={`En savoir plus sur ${service.title}`}>
        En savoir plus
      </LinkCTA>
    </m.div>
  );
}
