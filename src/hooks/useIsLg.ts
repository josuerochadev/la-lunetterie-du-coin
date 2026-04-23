import { useBreakpoint } from './useBreakpoint';

/**
 * Returns true when the viewport is at least `lg` (1024px).
 * Updates on resize. SSR-safe (defaults to false).
 */
export const useIsLg = () => useBreakpoint(1024);
