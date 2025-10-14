import type React from 'react';
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';

import MenuCategory from './MenuCategory';

import { useClickOutside } from '@/hooks/useClickOutside';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import {
  MENU_CATEGORIES,
  MENU_CTA,
  MENU_LEGAL_LINKS,
  STORE_INFO,
  FOOTER_SOCIALS,
} from '@/config/constants';

type FullScreenMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Composant `FullScreenMenu`
 *
 * Menu plein écran moderne et éditorial inspiré de Kinfolk.
 *
 * Structure :
 * - Grid de catégories de navigation (DÉCOUVRIR, OFFRES, CONTACT)
 * - Sidebar avec informations pratiques (horaires, contact, USP)
 * - Footer avec social links
 *
 * Fonctionnalités :
 * - Fermeture au clic extérieur et touche ESC
 * - Blocage du scroll du body
 * - Gestion du focus pour l'accessibilité
 * - Animations stagger sur les catégories
 *
 * @param isOpen - Indique si le menu est ouvert
 * @param onClose - Fonction appelée pour fermer le menu
 */
const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Gère la fermeture au clic hors du menu
  useClickOutside(menuRef, () => onClose(), isOpen);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    menuRef.current?.focus();
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
      aria-label="Menu de navigation principal"
      tabIndex={-1}
      className="fixed inset-0 z-menu flex min-h-dvh touch-pan-y flex-col overflow-y-auto bg-surface"
    >
      <div ref={menuRef} className="relative flex w-full flex-1 flex-col">
        {/* Bouton de fermeture */}
        <div className="fixed right-0 top-0 z-10 px-4 pt-6 sm:px-6">
          <SimpleAnimation type="fade" delay={100} immediate={true}>
            <button
              onClick={onClose}
              className="focus-style group flex h-12 w-12 items-center justify-center text-charcoal transition-all duration-300 hover:scale-110 hover:text-orange"
              aria-label="Fermer le menu"
            >
              <span className="text-[2rem] font-light leading-none">×</span>
            </button>
          </SimpleAnimation>
        </div>

        {/* Contenu principal du menu */}
        <div className="mx-auto w-full max-w-container flex-1 px-4 pb-20 pt-28 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-10">
            {/* Colonne gauche : Catégories de navigation - alignée à droite */}
            <div className="space-y-16">
              <section aria-label="Navigation par catégories" className="space-y-16 lg:text-right">
                {MENU_CATEGORIES.map((category, index) => (
                  <MenuCategory
                    key={category.title}
                    title={category.title}
                    titleHref={category.href}
                    links={category.links}
                    onLinkClick={onClose}
                    animationDelay={index * 50}
                  />
                ))}
              </section>

              {/* Pages légales */}
              <SimpleAnimation type="slide-up" delay={300} immediate={true}>
                <nav aria-label="Pages légales" className="space-y-3 lg:text-right">
                  {MENU_LEGAL_LINKS.map((link) => (
                    <div key={link.href}>
                      <Link
                        to={link.href}
                        onClick={onClose}
                        className="inline-block text-body-sm text-stone transition-colors hover:text-orange"
                      >
                        {link.label}
                      </Link>
                    </div>
                  ))}
                </nav>
              </SimpleAnimation>
            </div>

            {/* Colonne droite : Informations pratiques - alignée à gauche */}
            <aside className="space-y-8 border-t border-charcoal/10 pt-8 lg:sticky lg:bottom-8 lg:self-end lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {/* Nom du magasin */}
              <SimpleAnimation type="fade" delay={300} immediate={true}>
                <div className="space-y-0">
                  <p className="text-body font-bold uppercase leading-tight tracking-tight text-charcoal">
                    <span className="font-thin">LA</span>LUNETTERIE
                    <span className="font-thin">DU</span>COIN
                  </p>
                  <p className="text-body-xs font-medium text-stone">Neuf & Occasion</p>
                </div>
              </SimpleAnimation>

              {/* Section Nous rendre visite */}
              <SimpleAnimation type="fade" delay={350} immediate={true}>
                <div className="space-y-4">
                  <h3 className="text-body-sm font-semibold uppercase tracking-wide text-stone">
                    Nous rendre visite
                  </h3>

                  {/* Horaires */}
                  <div className="space-y-1">
                    <p className="text-body-sm text-charcoal">{STORE_INFO.hours.weekdays}</p>
                    <p className="text-body-sm text-charcoal">{STORE_INFO.hours.weekend}</p>
                  </div>

                  {/* Téléphone */}
                  <a
                    href={`tel:${STORE_INFO.phone.tel}`}
                    className="focus-style group flex items-center gap-2 text-body-sm text-charcoal transition-colors hover:text-orange"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span className="font-medium">{STORE_INFO.phone.display}</span>
                  </a>

                  {/* Adresse */}
                  <a
                    href={STORE_INFO.address.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-style group flex items-start gap-2 text-body-sm text-charcoal transition-colors hover:text-orange"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span className="font-medium leading-relaxed">
                      {STORE_INFO.address.street}
                      <br />
                      {STORE_INFO.address.postalCode} {STORE_INFO.address.city}
                    </span>
                  </a>

                  {/* CTA Prendre RDV */}
                  <a
                    href={MENU_CTA.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="button-primary mt-4 inline-block px-4 py-2 text-body-sm"
                  >
                    {MENU_CTA.label}
                  </a>
                </div>
              </SimpleAnimation>

              {/* Social Media */}
              <SimpleAnimation type="fade" delay={450} immediate={true}>
                <div className="flex items-center gap-6">
                  {FOOTER_SOCIALS.map((social) => {
                    const IconComponent = social.icon === 'facebook' ? Facebook : Instagram;
                    return (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-style group flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-all duration-300 hover:scale-110 hover:bg-orange/10 hover:text-orange"
                        aria-label={social.label}
                      >
                        <IconComponent className="h-5 w-5" aria-hidden="true" />
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
