import type React from 'react';
import { Link } from 'react-router-dom';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import Logo from '@/assets/logo/Logo_LLDC_Noir.svg?react';
import { getSocialIcon } from '@/lib/iconRegistry';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { OpeningHoursList } from '@/components/common/OpeningHoursList';
import { MENU_LEGAL_LINKS } from '@/config/menu';
import { BOOKING_URL } from '@/config/endpoints';
import { STORE_INFO } from '@/config/store';
import { FOOTER_SOCIALS, FOOTER_NAV_LINKS } from '@/config/footer';

type DesktopMenuLayoutProps = {
  pathname: string;
  onClose: () => void;
};

const DesktopMenuLayout: React.FC<DesktopMenuLayoutProps> = ({ pathname, onClose }) => {
  return (
    <div className="hidden min-h-screen w-full items-center justify-center px-6 md:flex">
      <div className="grid w-full max-w-3xl grid-cols-2 gap-10 xl:max-w-[90vw] xl:gap-20">
        {/* Colonne gauche : Navigation principale */}
        <div className="space-y-10 text-right xl:space-y-16">
          <nav aria-label="Navigation principale" className="space-y-5 text-right xl:space-y-6">
            {FOOTER_NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <SimpleAnimation key={link.href} type="slide-up" delay={i * 80} immediate={true}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className={`text-heading inline-block text-title-md transition-colors duration-300 hover:text-secondary-orange ${isActive ? 'text-accent' : 'text-white'}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </SimpleAnimation>
              );
            })}
          </nav>

          {/* Pages légales */}
          <nav aria-label="Pages légales" className="space-y-3 text-right">
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
        <aside className="space-y-6 border-l border-secondary-blue/20 pl-8 xl:space-y-8 xl:pl-12">
          {/* Logo du magasin */}
          <SimpleAnimation type="slide-right" delay={150} immediate={true}>
            <Link
              to="/"
              onClick={onClose}
              className="inline-block transition-opacity duration-200 hover:opacity-80"
              aria-label="Retour à l'accueil - La Lunetterie Du Coin"
            >
              <Logo className="h-24 w-auto fill-accent xl:h-32" aria-hidden="true" />
            </Link>
          </SimpleAnimation>

          {/* CTA Prendre RDV — style footer */}
          <SimpleAnimation type="slide-right" delay={300} immediate={true}>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="group/cta focus-style relative inline-flex items-center gap-2"
            >
              <h3 className="text-subtitle text-body-sm text-accent transition-[font-weight] duration-300 group-hover/cta:font-black">
                Prendre RDV
              </h3>
              <ExternalLink
                className="h-3.5 w-3.5 flex-shrink-0 text-secondary-orange transition-transform duration-300 group-hover/cta:translate-x-1"
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-secondary-orange transition-all duration-300 group-hover/cta:w-full"
                aria-hidden="true"
              />
            </a>
          </SimpleAnimation>

          {/* Infos pratiques */}
          <SimpleAnimation type="slide-right" delay={400} immediate={true}>
            <div className="space-y-4">
              {/* Horaires */}
              <OpeningHoursList />

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
  );
};

export default DesktopMenuLayout;
