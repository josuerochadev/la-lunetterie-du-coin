import { useEffect, type RefObject } from 'react';

/**
 * Hook personnalisé pour gérer les animations et comportements du menu
 *
 * Gère:
 * - Fermeture par touche Escape
 * - Blocage du scroll du body quand le menu est ouvert
 * - Focus automatique sur le menu pour l'accessibilité
 *
 * @param isOpen - Indique si le menu est actuellement ouvert
 * @param onClose - Fonction de callback pour fermer le menu
 * @param menuRef - Référence React vers l'élément du menu
 *
 * @example
 * ```tsx
 * const menuRef = useRef<HTMLDivElement>(null);
 * useMenuAnimation(isOpen, handleClose, menuRef);
 * ```
 */
export function useMenuAnimation(
  isOpen: boolean,
  onClose: () => void,
  menuRef: RefObject<HTMLElement>,
): void {
  useEffect(() => {
    // Ne rien faire si le menu est fermé
    if (!isOpen) return;

    /**
     * Gestionnaire d'événement pour fermer le menu avec la touche Escape
     */
    function handleEscape(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    // Focus sur le menu pour l'accessibilité (navigation clavier)
    menuRef.current?.focus();

    // Bloquer le scroll du body quand le menu est ouvert
    document.body.style.overflow = 'hidden';

    // Écouter les touches clavier
    document.addEventListener('keydown', handleEscape);

    // Nettoyage : retirer le listener et restaurer le scroll
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, menuRef]);
}
