import type React from 'react';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

import motifCercleUrl from '@/assets/patterns/motif-cercle-jaune.svg';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useMenuAnimation } from '@/hooks/useMenuAnimation';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import MobileMenuLayout from '@/components/navbar/MobileMenuLayout';
import DesktopMenuLayout from '@/components/navbar/DesktopMenuLayout';

type FullScreenMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Composant `FullScreenMenu` — Rebranding 2026
 *
 * Menu plein écran immersif avec motif cercle en arrière-plan.
 *
 * @param isOpen - Indique si le menu est ouvert
 * @param onClose - Fonction appelée pour fermer le menu
 */
const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useClickOutside(menuRef, () => onClose(), isOpen);
  useMenuAnimation(isOpen, onClose, menuRef);

  if (!isOpen) return null;

  return (
    <nav
      id="main-menu"
      aria-label="Menu de navigation principal"
      tabIndex={-1}
      className="fixed inset-0 z-menu flex min-h-dvh touch-pan-y flex-col overflow-y-auto bg-black"
    >
      {/* Motif cercle arrière-plan */}
      <SimpleAnimation type="fade" delay={200} immediate={true}>
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url(${motifCercleUrl})`,
            backgroundSize: '600px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
          }}
          aria-hidden="true"
        />
      </SimpleAnimation>

      <div ref={menuRef} className="relative flex w-full flex-1 flex-col">
        {/* Bouton de fermeture */}
        <div className="fixed right-0 top-0 z-10 px-4 pt-6 sm:px-6">
          <SimpleAnimation type="slide-down" delay={50} immediate={true}>
            <button
              onClick={onClose}
              className="focus-style group flex h-12 w-12 items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:text-secondary-orange"
              aria-label="Fermer le menu"
            >
              <span className="text-[2rem] font-light leading-none">&times;</span>
            </button>
          </SimpleAnimation>
        </div>

        <MobileMenuLayout pathname={pathname} onClose={onClose} />
        <DesktopMenuLayout pathname={pathname} onClose={onClose} />
      </div>
    </nav>
  );
};

export default FullScreenMenu;
