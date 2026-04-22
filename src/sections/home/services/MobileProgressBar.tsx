import { m, useTransform, type MotionValue } from 'framer-motion';

import { SERVICE_COUNT } from './constants';
import { SERVICES_START, SERVICES_END } from './ServicesMobileAnimated.timeline';

import { HOMEPAGE_SERVICES } from '@/data/homepage';

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

export function MobileProgressBar({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
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
