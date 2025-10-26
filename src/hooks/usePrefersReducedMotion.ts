// src/hooks/usePrefersReducedMotion.ts
import { useEffect, useState } from 'react';

/**
 * Hook React qui détecte la préférence utilisateur pour les animations réduites.
 *
 * Ce hook surveille la media query CSS `prefers-reduced-motion` et retourne
 * `true` si l'utilisateur a activé la réduction des mouvements dans ses paramètres
 * système (accessibilité). Utile pour respecter les préférences d'accessibilité
 * et offrir une expérience sans animations pour les utilisateurs sensibles au mouvement.
 *
 * Le hook gère également :
 * - Le SSR (Server-Side Rendering) en retournant `false` par défaut
 * - Les changements dynamiques de préférence en temps réel
 * - La compatibilité avec les anciens navigateurs (addEventListener vs addListener)
 *
 * @returns `true` si l'utilisateur préfère les animations réduites, `false` sinon
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = usePrefersReducedMotion();
 *
 *   return (
 *     <motion.div
 *       animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
 *       transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
 *     >
 *       Contenu animé
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  const [prm, setPrm] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return false;

    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;

    let mediaQuery: MediaQueryList;
    try {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    } catch {
      return;
    }

    const handler = (e: MediaQueryListEvent | MediaQueryList | null) => {
      const matches = e?.matches ?? false;
      setPrm((prev) => (prev !== matches ? matches : prev));
    };

    // Sync immédiat sans re-render inutile
    setPrm((prev) => (prev !== mediaQuery.matches ? mediaQuery.matches : prev));

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handler);
      return () => {
        if (typeof mediaQuery.removeListener === 'function') {
          mediaQuery.removeListener(handler);
        }
      };
    }
  }, []);

  return prm;
}
