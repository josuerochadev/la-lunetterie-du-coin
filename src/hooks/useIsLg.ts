import { useEffect, useState } from 'react';

const LG_BREAKPOINT = 1024;

/**
 * Returns true when the viewport is at least `lg` (1024px).
 * Updates on resize. SSR-safe (defaults to false).
 */
export function useIsLg(): boolean {
  const [isLg, setIsLg] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= LG_BREAKPOINT,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mql.addEventListener('change', handler);
    setIsLg(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isLg;
}
