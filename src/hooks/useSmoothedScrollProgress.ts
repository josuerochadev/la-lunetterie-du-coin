import { useEffect, useRef, useState } from 'react';

import { useScrollProgress } from './useScrollProgress';

/**
 * Hook React permettant de lisser la progression du scroll avec un effet d'inertie.
 *
 * Ce hook retourne une valeur de progression de scroll (entre 0 et 1) qui suit la valeur réelle
 * mais avec un effet de lissage configurable via le paramètre `smoothing`.
 * Utile pour créer des animations ou effets visuels réactifs au scroll sans à-coups.
 *
 * @param smoothing - Facteur de lissage (compris entre 0 et 1). Plus la valeur est faible, plus le lissage est fort (par défaut : 0.05).
 * @returns La progression du scroll lissée, mise à jour à chaque frame d'animation.
 */
export function useSmoothedScrollProgress(smoothing = 0.05) {
  const target = useScrollProgress();
  const [smoothProgress, setSmoothProgress] = useState(target);
  const animationFrame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = () => {
      setSmoothProgress((prev) => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.001) {
          // Stop animation when close enough
          return target;
        }
        // Continue animation only if there's a meaningful difference
        animationFrame.current = requestAnimationFrame(animate);
        return prev + diff * smoothing;
      });
    };

    // Only start animation if there's a difference
    if (Math.abs(target - smoothProgress) > 0.001) {
      animationFrame.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame.current !== undefined) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [target, smoothing, smoothProgress]);

  return smoothProgress;
}
