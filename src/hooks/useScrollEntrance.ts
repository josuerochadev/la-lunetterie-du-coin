import { useTransform, useSpring, type MotionValue } from 'framer-motion';

import { SPRING_CONFIG } from '@/lib/motion';

/**
 * Scroll-driven entrance animation — fades in + slides up.
 *
 * Returns `{ opacity, y }` motion values ready for `<m.div style={{ opacity, y }}>`.
 *
 * @param scrollYProgress - scroll progress from useScroll()
 * @param start - normalised scroll position where entrance begins (0-1)
 * @param end - normalised scroll position where entrance completes (0-1)
 * @param offset - initial Y offset in px (default 40)
 */
export function useScrollEntrance(
  scrollYProgress: MotionValue<number>,
  start: number,
  end: number,
  offset = 40,
) {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const yRaw = useTransform(scrollYProgress, [start, end], [offset, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  return { opacity, y };
}
