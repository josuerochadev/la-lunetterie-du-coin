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

type MobileMenuLayoutProps = {
  pathname: string;
  onClose: () => void;
};

const MobileMenuLayout: React.FC<MobileMenuLayoutProps> = ({ pathname, onClose }) => {
  return (
    <div className="flex min-h-dvh flex-col md:hidden">
      {/* Logo */}
      <div className="px-6 pt-4 sm:pt-6">
        <SimpleAnimation type="fade" delay={50} immediate={true}>
          <Link
            to="/"
            onClick={onClose}
            className="inline-block transition-opacity duration-200 hover:opacity-80"
            aria-label="Retour à l'accueil - La Lunetterie Du Coin"
          >
            <Logo className="h-20 w-auto fill-accent sm:h-24" aria-hidden="true" />
          </Link>
        </SimpleAnimation>
      </div>

      {/* Nav links + CTA — centered vertically, main focus */}
      <div className="flex flex-1 flex-col items-start justify-center px-6">
        <nav aria-label="Navigation principale" className="space-y-3 sm:space-y-4">
          {FOOTER_NAV_LINKS.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <SimpleAnimation key={link.href} type="slide-up" delay={i * 80} immediate={true}>
                <Link
                  to={link.href}
                  onClick={onClose}
                  className={`text-heading block text-title-md transition-colors duration-300 hover:text-secondary-orange sm:text-title-lg ${isActive ? 'text-accent' : 'text-white'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </SimpleAnimation>
            );
          })}
        </nav>

        {/* CTA Prendre RDV — style footer */}
        <SimpleAnimation type="slide-up" delay={FOOTER_NAV_LINKS.length * 80} immediate={true}>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group/cta focus-style relative mt-6 inline-flex items-center gap-2 sm:mt-8"
          >
            <span className="text-subtitle text-body-sm text-accent transition-[font-weight] duration-300 group-hover/cta:font-black">
              Prendre RDV
            </span>
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
      </div>

      {/* Bottom — infos empilées */}
      <div className="px-6 pb-6 sm:pb-8">
        <SimpleAnimation type="slide-up" delay={FOOTER_NAV_LINKS.length * 80 + 50} immediate={true}>
          <div className="space-y-3 border-t border-secondary-blue/20 pt-4">
            {/* Horaires */}
            <OpeningHoursList />

            {/* Téléphone */}
            <a
              href={`tel:${STORE_INFO.phone.tel}`}
              className="focus-style flex items-center gap-2 text-body-sm text-white md:gap-3 md:text-body"
            >
              <Phone className="h-4 w-4 text-secondary-blue md:h-5 md:w-5" aria-hidden="true" />
              <span className="font-medium">{STORE_INFO.phone.display}</span>
            </a>

            {/* Adresse */}
            <a
              href={STORE_INFO.address.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-style flex items-start gap-2 text-body-sm text-white md:gap-3 md:text-body"
            >
              <MapPin
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary-blue md:h-5 md:w-5"
                aria-hidden="true"
              />
              <span className="font-medium">
                {STORE_INFO.address.street}, {STORE_INFO.address.postalCode}{' '}
                {STORE_INFO.address.city}
              </span>
            </a>

            {/* Socials */}
            <div className="flex items-center gap-4 pt-1">
              {FOOTER_SOCIALS.map((social) => {
                const Icon = getSocialIcon(social.iconName);
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-style text-secondary-blue transition-colors duration-300 hover:text-secondary-orange"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>

            {/* Legal */}
            <div className="flex gap-4 pt-1">
              {MENU_LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={onClose}
                  className="text-caption text-secondary-blue/50 transition-colors duration-300 hover:text-secondary-orange"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </SimpleAnimation>
      </div>
    </div>
  );
};

export default MobileMenuLayout;
