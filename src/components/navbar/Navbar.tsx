import type React from 'react';
import { useState, useEffect, useRef } from 'react';

import MenuButton from '@/components/navbar/MenuButton';
import FullScreenMenu from '@/components/navbar/FullScreenMenu';
import { MENU_ANIMATION_DURATION } from '@/config/constants';

/**
 * Composant Navbar
 *
 * Ce composant représente la barre de navigation principale de l'application.
 * Il gère l'affichage d'un menu plein écran avec animation, en évitant les toggles multiples
 * ou les problèmes de réouverture pendant l'animation de fermeture.
 *
 * Fonctionnalités :
 * - Affiche un bouton pour ouvrir/fermer le menu.
 * - Gère l'état d'activation (`menuActive`) et de rendu (`menuRendered`) du menu pour contrôler l'animation.
 * - Empêche le double toggle lors de la fermeture du menu.
 * - Restaure le focus sur le bouton d'ouverture après la fermeture du menu.
 *
 * Accessibilité :
 * - Utilise `aria-hidden` pour indiquer l'état de visibilité du menu.
 *
 * @component
 */
const Navbar: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Controla renderização do menu (para evitar toggle duplo)
  useEffect(() => {
    if (menuActive) {
      setMenuRendered(true);
    } else {
      const timeout = setTimeout(() => setMenuRendered(false), MENU_ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [menuActive]);

  // Empêche le double toggle lors de la fermeture (évite la réouverture si l'animation de fermeture n'est pas terminée)
  function isToggleBlocked(menuActive: boolean, menuRendered: boolean): boolean {
    return !menuActive && menuRendered;
  }

  const handleToggle = () => {
    if (isToggleBlocked(menuActive, menuRendered)) return;
    setMenuActive(!menuActive);
  };

  const handleClose = () => {
    setMenuActive(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <MenuButton isOpen={menuActive} onClick={handleToggle} ref={buttonRef} />
      {menuRendered && <FullScreenMenu isOpen={menuActive} onClose={handleClose} />}
    </>
  );
};

export default Navbar;
