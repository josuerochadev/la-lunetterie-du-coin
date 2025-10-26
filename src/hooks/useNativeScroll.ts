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

    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.documentElement.style.scrollPaddingTop = '';
    };
  }, []);
}
