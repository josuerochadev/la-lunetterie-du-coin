import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

import MenuButton from '@/components/navbar/MenuButton';
import FullScreenMenu from '@/components/navbar/FullScreenMenu';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { MENU_ANIMATION_DURATION, CALENDLY_URL, STORE_INFO } from '@/config/constants';

/**
 * Composant Navbar
 *
 * Barre de navigation horizontale moderne inspirée de La Pima et Kinfolk.
 *
 * Structure :
 * - Gauche : Logo + Wordmark
 * - Centre : Icônes utilitaires (téléphone, localisation)
 * - Droite : CTA "Prendre RDV" + Bouton menu hamburger
 *
 * Fonctionnalités :
 * - Menu plein écran avec animation
 * - Gestion d'état menuActive/menuRendered pour éviter les doubles toggles
 * - Restauration du focus après fermeture
 * - Accessibilité complète (ARIA, focus management)
 * - Responsive avec breakpoints optimisés
 *
 * @component
 */
const Navbar: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Contrôle le rendu du menu (pour éviter toggle duplo)
  useEffect(() => {
    if (menuActive) {
      setMenuRendered(true);
    } else {
      const timeout = setTimeout(() => setMenuRendered(false), MENU_ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [menuActive]);

  // Empêche le double toggle lors de la fermeture
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
      {/* Navbar horizontale fixe */}
      <header className="fixed left-0 right-0 top-0 z-navbar shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <div
          className="absolute inset-0 bg-gradient-to-b from-cream/40 via-cream/25 via-50% to-cream/10"
          aria-hidden="true"
        ></div>
        <SimpleAnimation type="fade" immediate={true}>
          <nav
            className="relative mx-auto flex min-h-[60px] max-w-container items-center justify-between gap-2 px-4 py-3 sm:min-h-[72px] sm:gap-4 sm:px-6 sm:py-4"
            aria-label="Navigation principale"
          >
            {/* Gauche : Wordmark */}
            <div className="flex items-center">
              <Link to="/" aria-label="Retour à l'accueil">
                <span className="cursor-pointer text-body-sm font-bold uppercase leading-tight tracking-tight transition-all duration-300 hover:scale-105 hover:text-orange sm:text-title-sm">
                  <span className="font-thin">LA</span>LUNETTERIE
                  <span className="font-thin">DU</span>COIN
                </span>
              </Link>
            </div>

            {/* Droite : CTA + Icônes utilitaires + Menu button */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* CTA Prendre RDV - toujours visible */}
              <Link
                to={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-accent bg-transparent px-4 py-2 text-body-sm font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream sm:px-6 sm:py-3"
                aria-label="Prendre rendez-vous"
              >
                <span className="hidden lg:inline">Prendre RDV</span>
                <span className="lg:hidden">RDV</span>
              </Link>

              {/* Icônes utilitaires (cachés sur mobile) */}
              <a
                href={`tel:${STORE_INFO.phone.tel}`}
                className="focus-style group hidden items-center gap-2 text-body-sm text-charcoal transition-colors hover:text-orange md:flex"
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
                className="focus-style group hidden items-center gap-2 text-body-sm text-charcoal transition-colors hover:text-orange md:flex"
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
