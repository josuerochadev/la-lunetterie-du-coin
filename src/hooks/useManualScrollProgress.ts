import { useRef, useCallback, useEffect, type RefObject } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';

type ScrollOffset = 'start-start' | 'start-end' | 'end-end' | 'end-start';

/**
 * Manual scroll progress — bypasses framer-motion useScroll bug.
 *
 * useScroll({ target, offset }) returns broken values (~0.02 max instead
 * of 0→1) for deep-page elements behind stacked sticky sections.
 * This hook computes progress from getBoundingClientRect + global scroll.
 *
 * @param offset - Scroll mapping:
 *   'start-start': progress 0 when element top = viewport top, 1 when element bottom = viewport bottom
 *   'start-end':   progress 0 when element top = viewport bottom, 1 when element bottom = viewport bottom
 */
export function useManualScrollProgress(offset: ScrollOffset = 'start-start'): {
  ref: RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);

  const updateProgress = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;

    let raw: number;
    if (offset === 'start-start') {
      // 0 = top at viewport top, 1 = bottom at viewport bottom
      const totalScroll = el.offsetHeight - vh;
      raw = totalScroll > 0 ? -rect.top / totalScroll : 0;
    } else if (offset === 'start-end') {
      // 0 = top at viewport bottom, 1 = bottom at viewport bottom
      const totalScroll = el.offsetHeight;
      raw = totalScroll > 0 ? (vh - rect.top) / totalScroll : 0;
    } else if (offset === 'end-start') {
      // 0 = top at viewport bottom, 1 = bottom at viewport top
      const totalScroll = el.offsetHeight + vh;
      raw = totalScroll > 0 ? (vh - rect.top) / totalScroll : 0;
    } else {
      // end-end: same as start-start
      const totalScroll = el.offsetHeight - vh;
      raw = totalScroll > 0 ? -rect.top / totalScroll : 0;
    }

    scrollYProgress.set(Math.max(0, Math.min(1, raw)));
  }, [scrollYProgress, offset]);

  useEffect(() => {
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress]);

  return { ref, scrollYProgress };
}
