import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SERVICE_COUNT, SERVICES_START, SERVICES_END } from './constants';

import { useFadeInOut } from '@/hooks/useFadeInOut';
import { SPRING_CONFIG } from '@/lib/motion';

function ProgressDot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const dotOpacity = useTransform(progress, (v: number) => {
    return v >= index && v < index + 1 ? 1 : 0;
  });
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

/**
 * Vertical progress indicator — 4 segments showing which service is active.
 */
export function ServiceProgressIndicator({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useFadeInOut(
    scrollYProgress,
    SERVICES_START,
    SERVICES_START + 0.03,
    SERVICES_END - 0.03,
    SERVICES_END,
  );

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
