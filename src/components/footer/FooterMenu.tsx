import { Link } from 'react-router-dom';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';

import SectionContainer from '../common/SectionContainer';

import { FOOTER_SOCIALS, FOOTER_LINKS, STORE_INFO } from '@/config/constants';

type FooterMenuProps = {
  onLinkClick?: () => void;
};

/**
 * FooterMenu - Variante compacte du footer pour le menu mobile
 */
export default function FooterMenu({ onLinkClick }: FooterMenuProps) {
  return (
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
            {STORE_INFO.address.street} {STORE_INFO.address.postalCode} {STORE_INFO.address.city}
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
  );
}
