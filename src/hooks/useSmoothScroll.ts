import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * Hook React pour activer un défilement fluide (smooth scroll) sur la page à l'aide de la bibliothèque Lenis.
 *
 * Ce hook initialise Lenis avec des paramètres personnalisés pour améliorer l'expérience de défilement,
 * notamment une animation fluide, une gestion optimisée de la molette et du tactile, et une orientation verticale.
 * L'animation est synchronisée avec la boucle de rendu via `requestAnimationFrame`.
 *
 * À la destruction du composant, le hook nettoie correctement l'animation et détruit l'instance Lenis.
 *
 * @example
 * // À utiliser dans un composant React pour activer le smooth scroll globalement :
 * useSmoothScroll();
 *
 * @see https://github.com/studio-freight/lenis pour plus d'informations sur Lenis.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
      wheelMultiplier: 1.15,
      touchMultiplier: 1.2,
      smoothWheel: true,
      gestureOrientation: 'vertical',
      infinite: false,
    });

    let animationFrame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);
}
