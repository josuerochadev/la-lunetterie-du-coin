import type React from 'react';
import { useRef, useEffect } from 'react';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';

import MenuCategory from './MenuCategory';

import { useClickOutside } from '@/hooks/useClickOutside';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { MENU_CATEGORIES, STORE_INFO, FOOTER_SOCIALS } from '@/config/constants';

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
      className="fixed inset-0 z-menu flex min-h-dvh touch-pan-y flex-col overflow-y-auto bg-cream/[0.97] backdrop-blur-3xl"
    >
      <div ref={menuRef} className="flex w-full flex-1 flex-col">
        {/* Bouton de fermeture */}
        <div className="fixed right-0 top-0 z-10 px-container-x pt-6">
          <SimpleAnimation type="fade" delay={100} immediate={true}>
            <button
              onClick={onClose}
              className="focus-style group flex h-12 w-12 items-center justify-center rounded-full bg-charcoal/5 transition-all duration-200 hover:bg-orange hover:text-cream"
              aria-label="Fermer le menu"
            >
              <span className="text-title-sm font-light">×</span>
            </button>
          </SimpleAnimation>
        </div>

        {/* Contenu principal du menu */}
        <div className="mx-auto w-full max-w-container flex-1 px-4 pb-[80px] pt-[120px] sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
            {/* Colonne gauche : Catégories de navigation */}
            <section aria-label="Navigation par catégories" className="space-y-12">
              {MENU_CATEGORIES.map((category, index) => (
                <MenuCategory
                  key={category.title}
                  title={category.title}
                  links={category.links}
                  onLinkClick={onClose}
                  animationDelay={index * 100}
                />
              ))}
            </section>

            {/* Colonne droite : Informations pratiques */}
            <aside className="space-y-8 border-t border-charcoal/10 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {/* Tagline & USP */}
              <SimpleAnimation type="fade" delay={300} immediate={true}>
                <div className="space-y-3">
                  <p className="text-body-sm font-semibold text-charcoal">{STORE_INFO.tagline}</p>
                  <p className="text-body-sm text-orange">{STORE_INFO.usp}</p>
                </div>
              </SimpleAnimation>

              {/* Horaires */}
              <SimpleAnimation type="fade" delay={350} immediate={true}>
                <div className="space-y-2">
                  <h3 className="text-body-sm font-bold uppercase tracking-wide text-stone">
                    Horaires
                  </h3>
                  <p className="text-body-sm text-charcoal">{STORE_INFO.hours.weekdays}</p>
                  <p className="text-body-sm text-charcoal">{STORE_INFO.hours.weekend}</p>
                </div>
              </SimpleAnimation>

              {/* Contact */}
              <SimpleAnimation type="fade" delay={400} immediate={true}>
                <div className="space-y-3">
                  <h3 className="text-body-sm font-bold uppercase tracking-wide text-stone">
                    Contact
                  </h3>

                  <a
                    href={`tel:${STORE_INFO.phone.tel}`}
                    className="focus-style group flex items-center gap-2 text-body-sm text-charcoal transition-colors hover:text-orange"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span className="font-medium">{STORE_INFO.phone.display}</span>
                  </a>

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
                        className="focus-style text-charcoal transition-colors hover:text-orange"
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
