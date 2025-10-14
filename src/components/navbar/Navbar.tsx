import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

import MenuButton from '@/components/navbar/MenuButton';
import FullScreenMenu from '@/components/navbar/FullScreenMenu';
import Logo from '@/components/common/Logo';
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
      <header className="fixed left-0 right-0 top-0 z-navbar bg-cream/95 backdrop-blur-md">
        <SimpleAnimation type="fade" immediate={true}>
          <nav
            className="mx-auto flex h-[72px] max-w-screen-2xl items-center justify-between gap-4 px-container-x"
            aria-label="Navigation principale"
          >
            {/* Gauche : Logo */}
            <div className="flex items-center">
              <Logo variant="icon" size="sm" showWordmark={false} />
            </div>

            {/* Centre : Icônes utilitaires (cachés sur mobile) */}
            <div className="hidden items-center gap-6 md:flex">
              <a
                href={`tel:${STORE_INFO.phone.tel}`}
                className="focus-style group flex items-center gap-2 text-body-sm text-charcoal transition-colors hover:text-orange"
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
                className="focus-style group flex items-center gap-2 text-body-sm text-charcoal transition-colors hover:text-orange"
                aria-label="Voir l'itinéraire sur Google Maps"
              >
                <MapPin
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="hidden font-medium lg:inline">{STORE_INFO.address.city}</span>
              </a>
            </div>

            {/* Droite : CTA + Menu button */}
            <div className="flex items-center gap-4">
              {/* CTA Prendre RDV (caché sur mobile) */}
              <Link
                to={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary hidden sm:inline-flex"
              >
                Prendre RDV
              </Link>

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
