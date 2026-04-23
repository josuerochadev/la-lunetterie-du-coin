import { useBreakpoint } from './useBreakpoint';

/**
 * Returns true when the viewport is at least `xl` (1280px).
 * Updates on resize. SSR-safe (defaults to false).
 *
 * Used as the switch point between the mobile-animated and desktop-animated
 * experiences so that iPad-class devices (<= 1024px) receive the mobile layout.
 */
export const useIsXl = () => useBreakpoint(1280);
