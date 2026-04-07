import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { useFadeInOut } from '@/hooks/useFadeInOut';
import { SPRING_CONFIG } from '@/lib/motion';
import { cn } from '@/lib/cn';

function ProgressDot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const dotOpacity = useTransform(progress, (v: number) => (v >= index && v < index + 1 ? 1 : 0));
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
 * Vertical progress dots — shows which item is active based on scroll position.
 *
 * @param scrollYProgress - scroll progress from useScroll()
 * @param count - total number of items
 * @param start - normalised scroll position where tracking begins (0-1)
 * @param end - normalised scroll position where tracking ends (0-1)
 */
export function ProgressDots({
  scrollYProgress,
  count,
  start,
  end,
  className,
}: {
  scrollYProgress: MotionValue<number>;
  count: number;
  start: number;
  end: number;
  className?: string;
}) {
  const opacity = useFadeInOut(scrollYProgress, start, start + 0.03, end - 0.03, end);

  const progressRaw = useTransform(scrollYProgress, [start, end], [0, count]);
  const progress = useSpring(progressRaw, SPRING_CONFIG);

  return (
    <m.div
      className={cn('flex shrink-0 flex-col items-center gap-3', className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProgressDot key={i} index={i} progress={progress} />
      ))}
    </m.div>
  );
}
