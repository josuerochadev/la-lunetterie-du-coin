// src/hooks/useIntersectionObserver.ts

import { useState, useEffect, useRef } from 'react';

/**
 * Hook React permettant de détecter si un élément DOM est visible dans la fenêtre d'affichage
 * grâce à l'API Intersection Observer.
 *
 * @param threshold - (optionnel) Le pourcentage de visibilité requis pour considérer l'élément comme intersectant. Par défaut à 0.1 (10%).
 * @returns Un objet contenant :
 *   - targetRef : une référence à attacher à l'élément à observer (React.RefObject<HTMLDivElement>)
 *   - isIntersecting : un booléen indiquant si l'élément est actuellement visible selon le seuil défini
 *
 * @example
 * const { targetRef, isIntersecting } = useIntersectionObserver(0.5);
 * return <div ref={targetRef}>{isIntersecting ? 'Visible' : 'Non visible'}</div>;
 */
export function useIntersectionObserver(threshold = 0.1) {
  const [isIntersecting, setIsIntersecting] = useState(true);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const currentTarget = targetRef.current;

    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      { threshold },
    );

    observerRef.current = observer;
    observer.observe(currentTarget);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold]);

  return { targetRef, isIntersecting };
}
