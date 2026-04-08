import { useEffect, useState } from 'react';

const XL_BREAKPOINT = 1280;

/**
 * Returns true when the viewport is at least `xl` (1280px).
 * Updates on resize. SSR-safe (defaults to false).
 *
 * Used as the switch point between the mobile-animated and desktop-animated
 * experiences so that iPad-class devices (<= 1024px) receive the mobile layout.
 */
export function useIsXl(): boolean {
  const [isXl, setIsXl] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= XL_BREAKPOINT,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${XL_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsXl(e.matches);
    mql.addEventListener('change', handler);
    setIsXl(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isXl;
}
