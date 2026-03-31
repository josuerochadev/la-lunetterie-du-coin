import { type MotionValue } from 'framer-motion';

import { SERVICE_COUNT, SERVICES_START, SERVICES_END } from './constants';

import { ProgressDots } from '@/components/motion/ProgressDots';

/**
 * Vertical progress indicator for home services section.
 * Wraps the shared ProgressDots with home-specific scroll constants.
 */
export function ServiceProgressIndicator({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <ProgressDots
      scrollYProgress={scrollYProgress}
      count={SERVICE_COUNT}
      start={SERVICES_START}
      end={SERVICES_END}
    />
  );
}
