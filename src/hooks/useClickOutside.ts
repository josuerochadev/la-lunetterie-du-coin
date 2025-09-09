import type React from 'react';
import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook React permettant de détecter un clic en dehors d'un élément référencé.
 *
 * @param ref - Référence vers l'élément HTML à surveiller.
 * @param handler - Fonction appelée lorsqu'un clic est détecté en dehors de l'élément.
 * @param active - Booléen pour activer ou désactiver l'écoute des clics.
 *
 * @example
 * const ref = useRef(null);
 * useClickOutside(ref, () => setOpen(false), open);
 *
 * @remarks
 * Ce hook ajoute un écouteur d'événement 'mousedown' sur le document lorsque `active` est vrai.
 * Lorsque l'utilisateur clique en dehors de l'élément référencé, la fonction `handler` est appelée.
 * L'écouteur est automatiquement retiré lors du démontage du composant ou lorsque `active` devient faux.
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  active: boolean,
) {
  // Use useRef to store the current values to avoid recreating the effect
  const handlerRef = useRef(handler);
  const refRef = useRef(ref);

  handlerRef.current = handler;
  refRef.current = ref;

  const handleClick = useCallback((event: MouseEvent) => {
    // Guard against non-Node targets
    const target = event.target;
    if (!target || !(target instanceof Node)) {
      handlerRef.current();
      return;
    }

    // If ref is null, consider all clicks as "outside"
    if (!refRef.current.current) {
      handlerRef.current();
      return;
    }

    // Check if click is outside the referenced element
    if (!refRef.current.current.contains(target)) {
      handlerRef.current();
    }
  }, []);

  useEffect(() => {
    if (!active) return;

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [active, handleClick]);
}
