import { Link } from 'react-router-dom';

import SectionContainer from '../common/SectionContainer';

import Logo from '@/components/common/Logo';
import { OpeningHoursList } from '@/components/common/OpeningHoursList';
import { getSocialIcon } from '@/lib/iconRegistry';
import { FOOTER_SOCIALS, FOOTER_LINKS } from '@/config/footer';
import { STORE_INFO } from '@/config/store';

type FooterMenuProps = {
  onLinkClick?: () => void;
};

/**
 * FooterMenu - Variante compacte du footer pour le menu mobile
 */
export default function FooterMenu({ onLinkClick }: FooterMenuProps) {
  return (
    <SectionContainer noSpacing>
      <div className="mx-auto mb-3 flex justify-center">
        <Logo variant="full" color="noir" size="sm" />
      </div>

      <div className="mx-auto flex w-fit flex-col items-center space-y-xs">
        <address
          aria-label="Adresse et horaires de la boutique"
          className="space-y-3 text-center text-body-sm not-italic"
        >
          <p>
            {STORE_INFO.address.street} {STORE_INFO.address.postalCode} {STORE_INFO.address.city}
          </p>
          <p>
            <a
              href={`tel:${STORE_INFO.phone.tel}`}
              className="focus-style font-semibold transition-colors duration-300 hover:text-secondary-orange"
            >
              {STORE_INFO.phone.display}
            </a>
          </p>
          <OpeningHoursList centered />
        </address>

        <nav
          aria-label="Navigation de bas de page"
          className="flex flex-col items-center space-y-3 pt-2 text-body-sm"
        >
          <div className="flex space-x-4" aria-label="Réseaux sociaux">
            {FOOTER_SOCIALS.map((social) => {
              const Icon = getSocialIcon(social.iconName);
              return (
                <a
                  key={social.href}
                  href={social.href}
                  className="focus-style text-secondary-blue transition-colors duration-300 hover:text-secondary-orange"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <Icon width={20} height={20} aria-hidden="true" />
                  <span className="sr-only">{social.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex space-x-6 text-body-sm">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                className="focus-style text-body-sm font-semibold text-black transition-colors duration-300 hover:text-secondary-orange"
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
  );
}
