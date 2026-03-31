import type React from 'react';
import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import LogoNO from '@/assets/logo/Logo_LLDC_NO_Noir.svg?react';
import motifCercleUrl from '@/assets/patterns/motif-cercle-jaune.svg';
import LinkCTA from '@/components/common/LinkCTA';
import { getSocialIcon } from '@/lib/iconRegistry';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useMenuAnimation } from '@/hooks/useMenuAnimation';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { MENU_CTA, MENU_LEGAL_LINKS } from '@/config/menu';
import { STORE_INFO } from '@/config/store';
import { FOOTER_SOCIALS, FOOTER_NAV_LINKS } from '@/config/footer';

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

        {/* Contenu principal du menu */}
        <div className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6">
          <div className="grid w-full max-w-5xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Colonne gauche : Navigation principale */}
            <div className="space-y-16 lg:text-right">
              <nav aria-label="Navigation principale" className="space-y-6 lg:text-right">
                {FOOTER_NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <SimpleAnimation
                      key={link.href}
                      type="slide-up"
                      delay={i * 80}
                      immediate={true}
                    >
                      <Link
                        to={link.href}
                        onClick={onClose}
                        className={`text-heading inline-block text-title-lg transition-colors duration-300 hover:text-secondary-orange ${isActive ? 'text-accent' : 'text-white'}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </SimpleAnimation>
                  );
                })}
              </nav>

              {/* Pages légales */}
              <nav aria-label="Pages légales" className="space-y-3 lg:text-right">
                {MENU_LEGAL_LINKS.map((link, i) => (
                  <SimpleAnimation
                    key={link.href}
                    type="fade"
                    delay={FOOTER_NAV_LINKS.length * 80 + 100 + i * 60}
                    immediate={true}
                  >
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className="inline-block text-body-sm text-secondary-blue transition-colors duration-300 hover:text-secondary-orange"
                    >
                      {link.label}
                    </Link>
                  </SimpleAnimation>
                ))}
              </nav>
            </div>

            {/* Colonne droite : Informations pratiques */}
            <aside className="space-y-8 border-t border-secondary-blue/20 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {/* Logo du magasin */}
              <SimpleAnimation type="slide-right" delay={150} immediate={true}>
                <Link
                  to="/"
                  onClick={onClose}
                  className="inline-block transition-opacity duration-200 hover:opacity-80"
                  aria-label="Retour à l'accueil - La Lunetterie Du Coin"
                >
                  <LogoNO className="h-24 w-auto fill-accent sm:h-28" aria-hidden="true" />
                </Link>
              </SimpleAnimation>

              {/* Section Nous rendre visite */}
              <SimpleAnimation type="slide-right" delay={400} immediate={true}>
                <div className="space-y-4">
                  <h3 className="text-subtitle text-body-sm text-accent">Nous rendre visite</h3>

                  {/* Horaires */}
                  <div className="space-y-1">
                    <p className="text-body-sm text-secondary-blue">{STORE_INFO.hours.weekdays}</p>
                    <p className="text-body-sm text-secondary-blue">{STORE_INFO.hours.weekend}</p>
                  </div>

                  {/* Téléphone */}
                  <a
                    href={`tel:${STORE_INFO.phone.tel}`}
                    className="focus-style group/link flex items-center gap-2 text-body-sm text-white"
                  >
                    <Phone className="h-4 w-4 text-secondary-blue" aria-hidden="true" />
                    <span className="relative font-medium">
                      {STORE_INFO.phone.display}
                      <span
                        className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-secondary-orange transition-all duration-300 group-hover/link:w-full"
                        aria-hidden="true"
                      />
                    </span>
                  </a>

                  {/* Adresse */}
                  <a
                    href={STORE_INFO.address.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-style group/link flex items-start gap-2 text-body-sm text-white"
                  >
                    <MapPin
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary-blue"
                      aria-hidden="true"
                    />
                    <span className="relative font-medium">
                      {STORE_INFO.address.street}
                      <br />
                      {STORE_INFO.address.postalCode} {STORE_INFO.address.city}
                      <span
                        className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-secondary-orange transition-all duration-300 group-hover/link:w-full"
                        aria-hidden="true"
                      />
                    </span>
                  </a>

                  {/* CTA Prendre RDV */}
                  <LinkCTA
                    href={MENU_CTA.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    theme="dark"
                    icon={ExternalLink}
                    className="mt-4 text-body-sm"
                  >
                    {MENU_CTA.label}
                  </LinkCTA>
                </div>
              </SimpleAnimation>

              {/* Social Media */}
              <SimpleAnimation type="slide-up" delay={500} immediate={true}>
                <div className="flex items-center gap-6">
                  {FOOTER_SOCIALS.map((social) => {
                    const Icon = getSocialIcon(social.iconName);
                    return (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-style group flex h-10 w-10 items-center justify-center rounded-full text-secondary-blue transition-all duration-300 hover:scale-110 hover:bg-secondary-orange/15 hover:text-secondary-orange"
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </SimpleAnimation>
            </aside>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FullScreenMenu;
