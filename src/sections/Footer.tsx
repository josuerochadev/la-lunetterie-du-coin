import type { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import { Link } from 'react-router-dom';

import SectionContainer from '../components/common/SectionContainer';

import {
  FOOTER_NAV_LINKS,
  FOOTER_LINKS,
  FOOTER_SOCIALS,
  STORE_INFO,
  COMPANY_EMAIL,
} from '@/config/constants';

type FooterProps = ComponentPropsWithoutRef<'footer'> & {
  variant?: 'default' | 'menu';
  onLinkClick?: () => void;
};

/**
 * Composant Footer redesigné
 *
 * Structure moderne en 3 colonnes :
 * - Navigation : Liens principaux du site
 * - Contact : Coordonnées complètes
 * - Suivez-nous : Réseaux sociaux
 *
 * Barre inférieure avec liens légaux et signature développeur
 */
export default function Footer({
  className = '',
  variant = 'default',
  onLinkClick,
  ...rest
}: FooterProps) {
  const isMenu = variant === 'menu';

  // Si c'est le menu, on garde l'ancien design compact
  if (isMenu) {
    return (
      <footer
        id="footer"
        {...rest}
        className={clsx(
          'relative z-10 w-full bg-transparent py-2 text-center text-primary',
          className,
        )}
      >
        <SectionContainer noSpacing>
          <h2 className="mx-auto mb-3 text-center text-title-md font-extrabold">
            <span className="font-thin">LA</span>
            LUNETTERIE
            <span className="font-thin">DU</span>
            COIN
          </h2>

          <div className="mx-auto flex w-fit flex-col items-center space-y-xs">
            <address
              aria-label="Adresse et horaires de la boutique"
              className="space-y-1 text-center text-body-sm not-italic leading-relaxed"
            >
              <p>
                {STORE_INFO.address.street} {STORE_INFO.address.postalCode}{' '}
                {STORE_INFO.address.city}
              </p>
              <p>
                <a
                  href={`tel:${STORE_INFO.phone.tel}`}
                  className="focus-style font-semibold transition-colors duration-300 hover:text-orange"
                >
                  {STORE_INFO.phone.display}
                </a>
              </p>
              <p>{STORE_INFO.hours.weekdays}</p>
              <p>{STORE_INFO.hours.weekend}</p>
            </address>

            <nav
              aria-label="Navigation de bas de page"
              className="flex flex-col items-center space-y-3 pt-2 text-body-sm"
            >
              <div className="flex space-x-4" aria-label="Réseaux sociaux">
                {FOOTER_SOCIALS.map((social) => {
                  const IconComponent = social.icon === 'facebook' ? Facebook : Instagram;
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      className="focus-style text-primary transition-colors duration-300 hover:text-orange"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <IconComponent width={20} height={20} aria-hidden="true" />
                      <span className="sr-only">{social.label}</span>
                    </a>
                  );
                })}
              </div>

              <div className="flex space-x-6 text-body-sm">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    className="focus-style text-body-sm font-semibold text-primary transition-colors duration-300 hover:text-orange"
                    to={link.href}
                    onClick={onLinkClick}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </SectionContainer>
      </footer>
    );
  }

  // Nouveau design pour le footer principal
  return (
    <footer
      id="footer"
      {...rest}
      className={clsx('relative z-10 w-full bg-primary text-accent', className)}
    >
      <SectionContainer className="py-10">
        {/* En-tête */}
        <div className="mx-auto mb-8 text-center">
          <h2 className="mb-2 text-title-md font-extrabold text-cream">
            <span className="font-thin">LA</span>
            LUNETTERIE
            <span className="font-thin">DU</span>
            COIN
          </h2>
          <p className="text-body-sm text-cream">Neuf & Occasion. Depuis 2016.</p>
        </div>

        {/* Grille 3 colonnes avec largeurs adaptées au contenu */}
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
          {/* Colonne 1 : Navigation (plus étroite) */}
          <nav aria-label="Navigation du footer" className="lg:w-auto">
            <h3 className="mb-3 text-body font-bold uppercase tracking-wider text-cream">
              Navigation
            </h3>
            <ul className="space-y-2">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="focus-style text-body-sm text-cream transition-colors duration-300 hover:text-orange"
                    onClick={onLinkClick}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonne 2 : Contact (plus large car plus de contenu) */}
          <address className="not-italic lg:max-w-md lg:flex-1" aria-label="Coordonnées">
            <h3 className="mb-3 text-body font-bold uppercase tracking-wider text-cream">
              Contact
            </h3>
            <div className="space-y-3 text-body-sm text-cream">
              {/* Adresse */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p>{STORE_INFO.address.street}</p>
                  <p>
                    {STORE_INFO.address.postalCode} {STORE_INFO.address.city}
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${STORE_INFO.phone.tel}`}
                  className="focus-style font-semibold transition-colors duration-300 hover:text-orange"
                >
                  {STORE_INFO.phone.display}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="focus-style font-semibold transition-colors duration-300 hover:text-orange"
                >
                  {COMPANY_EMAIL}
                </a>
              </div>

              {/* Horaires */}
              <div className="pt-2 text-body-sm">
                <p className="font-semibold">{STORE_INFO.hours.weekdays}</p>
                <p>{STORE_INFO.hours.weekend}</p>
              </div>
            </div>
          </address>

          {/* Colonne 3 : Réseaux sociaux (plus étroite) */}
          <div className="lg:w-auto">
            <h3 className="mb-3 text-body font-bold uppercase tracking-wider text-cream">
              Suivez-nous
            </h3>
            <div className="flex gap-4">
              {FOOTER_SOCIALS.map((social) => {
                const IconComponent = social.icon === 'facebook' ? Facebook : Instagram;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    className="focus-style flex h-10 w-10 items-center justify-center border border-cream text-cream transition-all duration-300 hover:border-orange hover:bg-orange"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barre inférieure : Liens légaux + Signature */}
        <div className="mx-auto mt-16 max-w-7xl border-t border-cream/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-body-sm text-cream sm:flex-row">
            {/* Liens légaux */}
            <div className="flex gap-6">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="focus-style transition-colors duration-300 hover:text-orange"
                  onClick={onLinkClick}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Signature */}
            <p>
              Développé par{' '}
              <a
                href="https://josuerocha.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-style font-semibold transition-colors duration-300 hover:text-orange"
              >
                Josué Rocha
              </a>
            </p>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
