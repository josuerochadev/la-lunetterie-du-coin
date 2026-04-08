// src/hooks/useNativeScroll.ts
import { useEffect } from 'react';

/**
 * Hook ultra-léger pour smooth scroll natif
 *
 * Remplace Lenis par du CSS scroll-behavior natif
 * 0kB de JavaScript - 100% CSS natif !
 */

// Tracks whether the framer-motion scroll nudge has run for this session.
// Module-level so it persists across page mounts inside the same SPA session.
let initialScrollNudgeDone = false;

export function useNativeScroll() {
  useEffect(() => {
    // Respecter les préférences utilisateur
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Activer le smooth scroll CSS natif
    document.documentElement.style.scrollBehavior = 'smooth';

    // Optionnel: Améliorer l'expérience avec scroll-padding
    document.documentElement.style.scrollPaddingTop = '2rem';

    // Force Framer Motion useScroll hooks to recalculate after layout settles.
    // Without this, scroll-driven animations can stay at opacity 0 when the
    // browser restores a non-zero scroll position (reload, back/forward nav).
    // Uses scrollTo instead of dispatching a synthetic Event to avoid crashes
    // in browser extensions that expect event.target.contains to exist.
    //
    // Gated behind a session-level flag and a `scrollY > 0` check so it only
    // fires on the very first page mount when the browser has restored a
    // scroll position. Subsequent SPA route navigations are handled by
    // <ScrollToTop />, which would otherwise be sabotaged by a synchronous
    // re-scroll to the previous (footer) position mid-animation.
    let rafId: number | undefined;
    if (!initialScrollNudgeDone) {
      initialScrollNudgeDone = true;
      if (window.scrollY > 0) {
        rafId = requestAnimationFrame(() => {
          window.scrollTo({ top: window.scrollY });
        });
      }
    }

    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      document.documentElement.style.scrollBehavior = '';
      document.documentElement.style.scrollPaddingTop = '';
    };
  }, []);
}
