import { useEffect, useState } from 'react';

/**
 * Returns true when the viewport is at least `minWidth` pixels wide.
 * Updates on resize via `matchMedia`. SSR-safe (defaults to false).
 */
export function useBreakpoint(minWidth: number): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= minWidth,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [minWidth]);

  return matches;
}
