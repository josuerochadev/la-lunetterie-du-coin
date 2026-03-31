import { useTransform, type MotionValue } from 'framer-motion';

/**
 * Scroll-driven fade-in / fade-out opacity.
 *
 * Fades from 0→1 over [fadeInStart, fadeInEnd] and from 1→0 over
 * [fadeOutStart, fadeOutEnd]. The two are combined with Math.min so the
 * element is only fully visible when both ranges agree.
 *
 * @returns a single `MotionValue<number>` you can pass to `style={{ opacity }}`.
 */
export function useFadeInOut(
  scrollYProgress: MotionValue<number>,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number,
) {
  const fadeIn = useTransform(scrollYProgress, [fadeInStart, fadeInEnd], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [fadeOutStart, fadeOutEnd], [1, 0]);
  return useTransform([fadeIn, fadeOut] as const, ([a, b]: number[]) => Math.min(a, b));
}
