import type React from 'react';
import { useRef, useEffect } from 'react';

import Footer from '../../sections/Footer';

import MenuLinkItem from './MenuLinkItem';

import { useClickOutside } from '@/hooks/useClickOutside';
import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';
import { LINKS } from '@/config/constants';

type FullScreenMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Composant `FullScreenMenu`
 *
 * Affiche un menu de navigation plein écran, accessible et animé, qui s'ouvre en superposition.
 *
 * Fonctionnalités principales :
 * - Affichage conditionnel selon l’état `isOpen`.
 * - Fermeture automatique lors d’un clic en dehors du menu ou à l’appui sur la touche Échap.
 * - Gestion du focus à l’ouverture pour l’accessibilité.
 * - Affichage d’une liste de liens principaux animés et d’un pied de page personnalisé.
 *
 * Props :
 * @param {boolean} isOpen - Indique si le menu est ouvert.
 * @param {() => void} onClose - Fonction appelée pour fermer le menu.
 *
 * Accessibilité :
 * - Utilise `aria-label` et `tabIndex` pour une meilleure navigation clavier.
 * - Gère le focus et la fermeture via la touche Échap.
 *
 * @component
 */
const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Gère la fermeture au clic hors du menu uniquement si ouvert
  useClickOutside(menuRef, () => onClose(), isOpen);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    // Gestion du focus à l'ouverture
    menuRef.current?.focus();

    // Empêche le scroll du body quand le menu est ouvert
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <nav
      id="main-menu"
      aria-label="Navigation principale"
      tabIndex={-1}
      className="fixed inset-0 z-menu flex min-h-dvh touch-pan-y flex-col overflow-y-auto bg-accent/60 px-container-x pt-[8rem] backdrop-blur-[100px]"
    >
      {/* Wrapper pour le menu - inclut maintenant le footer */}
      <div ref={menuRef} className="flex w-full flex-1 flex-col">
        {/* Groupe des liens principaux */}
        <section
          aria-label="Navigation principale"
          className="mx-auto flex w-fit flex-1 items-center justify-center space-y-4 text-left sm:space-y-6"
        >
          <ul>
            {LINKS.map((link, i) => (
              <li key={link.href} className="touch-manipulation">
                <OptimizedAnimateItem
                  key={link.href}
                  index={i}
                  type="fade-up"
                  immediate={true}
                  className="block py-1 sm:py-2"
                >
                  <MenuLinkItem {...link} index={i} onClick={onClose} />
                </OptimizedAnimateItem>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer du menu - maintenant dans menuRef */}
        <footer className="w-full">
          <OptimizedAnimateItem
            index={LINKS.length}
            type="fade-up"
            immediate={true}
            className="p-section-gap"
          >
            <Footer variant="menu" className="text-primary" onLinkClick={onClose} />
          </OptimizedAnimateItem>
        </footer>
      </div>
    </nav>
  );
};

export default FullScreenMenu;
