import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import LogoSymboleNoir from '@/assets/logo/Logo_LLDC_Symbole_Noir.svg?react';
import FullScreenMenu from '@/components/navbar/FullScreenMenu';
import { MENU_ANIMATION_DURATION } from '@/config/menu';
import { useMotionPreference } from '@/a11y/useMotionPreference';
import { cn } from '@/lib/cn';

interface NavbarProps {
  /** Controls navbar visibility — used for splash/hero choreography. Default true. */
  revealed?: boolean;
}

/**
 * Composant Navbar — Symbole seul centré
 *
 * Le logo symbole (oeil) centré en haut de page ouvre le menu full-screen.
 * Hover : opacité + léger scale. Active : press effect.
 *
 * Supports delayed reveal via `revealed` prop for splash intro choreography.
 *
 * @component
 */
const Navbar: React.FC<NavbarProps> = ({ revealed = true }) => {
  const [menuActive, setMenuActive] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const prm = useMotionPreference();

  useEffect(() => {
    if (menuActive) {
      setMenuRendered(true);
    } else {
      const timeout = setTimeout(() => setMenuRendered(false), MENU_ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [menuActive]);

  function shouldBlockToggle(menuActive: boolean, menuRendered: boolean): boolean {
    return !menuActive && menuRendered;
  }

  const handleToggle = () => {
    if (shouldBlockToggle(menuActive, menuRendered)) return;
    setMenuActive(!menuActive);
  };

  const handleClose = () => {
    setMenuActive(false);
    buttonRef.current?.focus();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (location.pathname === '/' && e.detail === 2) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: prm ? 'auto' : 'smooth',
      });
      return;
    }
    handleToggle();
  };

  return (
    <>
      {/* Symbole oeil centré — fixe en haut */}
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-navbar flex justify-center pt-4 sm:pt-6',
          'transition-all duration-500 ease-out',
          revealed ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-5 opacity-0',
        )}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          aria-label={menuActive ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuActive}
          aria-controls="main-menu"
          className="cursor-pointer rounded-full p-2 transition-all duration-300 hover:scale-110 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black active:scale-95"
        >
          <LogoSymboleNoir className="h-10 w-auto sm:h-12 lg:h-14" aria-hidden="true" />
        </button>
      </header>

      {/* Menu plein écran */}
      {menuRendered && <FullScreenMenu isOpen={menuActive} onClose={handleClose} />}
    </>
  );
};

export default Navbar;
