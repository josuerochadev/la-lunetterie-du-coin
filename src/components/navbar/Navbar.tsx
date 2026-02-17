import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

import Logo from '@/components/common/Logo';
import MenuButton from '@/components/navbar/MenuButton';
import FullScreenMenu from '@/components/navbar/FullScreenMenu';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { MENU_ANIMATION_DURATION } from '@/config/menu';
import { CALENDLY_URL } from '@/config/endpoints';
import { STORE_INFO } from '@/config/store';
import { useMotionPreference } from '@/a11y/useMotionPreference';

/**
 * Composant Navbar — Rebranding 2026
 *
 * Barre de navigation horizontale avec nouveau logo.
 *
 * Structure :
 * - Gauche : Logo (symbol mobile, full desktop)
 * - Droite : CTA "Prendre RDV" + Icônes utilitaires + Menu hamburger
 *
 * @component
 */
const Navbar: React.FC = () => {
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

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: prm ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <>
      {/* Navbar horizontale fixe */}
      <header className="fixed left-0 right-0 top-0 z-navbar border-b border-black/10 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 via-50% to-white/50"
          aria-hidden="true"
        ></div>
        <SimpleAnimation type="fade" immediate={true}>
          <nav
            className="relative mx-auto flex min-h-[60px] max-w-container items-center justify-between gap-2 px-4 py-3 sm:min-h-[72px] sm:gap-4 sm:px-6 sm:py-4"
            aria-label="Navigation principale"
          >
            {/* Gauche : Logo */}
            <div className="flex items-center">
              {/* Symbol sur mobile, full sur desktop */}
              <span className="sm:hidden">
                <Logo variant="symbol" color="noir" size="sm" onClick={handleLogoClick} />
              </span>
              <span className="hidden sm:inline-flex">
                <Logo variant="full" color="noir" size="sm" onClick={handleLogoClick} />
              </span>
            </div>

            {/* Droite : CTA + Icônes utilitaires + Menu button */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* CTA Prendre RDV */}
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary px-4 py-2 text-body-sm sm:px-6 sm:py-3"
                aria-label="Prendre rendez-vous"
              >
                <span className="hidden lg:inline">Prendre RDV</span>
                <span className="lg:hidden">RDV</span>
              </a>

              {/* Icônes utilitaires (cachés sur mobile) */}
              <a
                href={`tel:${STORE_INFO.phone.tel}`}
                className="focus-style group hidden items-center gap-2 text-body-sm text-black transition-colors hover:text-accent md:flex"
                aria-label={`Appeler ${STORE_INFO.phone.display}`}
              >
                <Phone
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="hidden font-medium lg:inline">{STORE_INFO.phone.display}</span>
              </a>

              <a
                href={STORE_INFO.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-style group hidden items-center gap-2 text-body-sm text-black transition-colors hover:text-accent md:flex"
                aria-label="Voir l'itinéraire sur Google Maps"
              >
                <MapPin
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="hidden font-medium lg:inline">{STORE_INFO.address.city}</span>
              </a>

              {/* Bouton menu */}
              <MenuButton isOpen={menuActive} onClick={handleToggle} ref={buttonRef} />
            </div>
          </nav>
        </SimpleAnimation>
      </header>

      {/* Menu plein écran */}
      {menuRendered && <FullScreenMenu isOpen={menuActive} onClose={handleClose} />}
    </>
  );
};

export default Navbar;
