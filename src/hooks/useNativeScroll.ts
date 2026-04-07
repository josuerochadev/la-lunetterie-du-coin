// src/hooks/useNativeScroll.ts
import { useEffect } from 'react';

/**
 * Hook ultra-léger pour smooth scroll natif
 *
 * Remplace Lenis par du CSS scroll-behavior natif
 * 0kB de JavaScript - 100% CSS natif !
 */
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
    // browser restores a scroll position (reload, HMR, back/forward nav).
    // Uses scrollTo instead of dispatching a synthetic Event to avoid crashes
    // in browser extensions that expect event.target.contains to exist.
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: window.scrollY });
    });

    return () => {
      cancelAnimationFrame(id);
      document.documentElement.style.scrollBehavior = '';
      document.documentElement.style.scrollPaddingTop = '';
    };
  }, []);
}
