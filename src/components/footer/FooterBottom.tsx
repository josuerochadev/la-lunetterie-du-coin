import { Link } from 'react-router-dom';

import { FOOTER_LINKS } from '@/config/footer';

type FooterBottomProps = {
  onLinkClick?: () => void;
};

/**
 * FooterBottom - Barre inférieure avec liens légaux et signature
 */
export default function FooterBottom({ onLinkClick }: FooterBottomProps) {
  return (
    <div className="mx-auto mt-10 max-w-7xl pt-6">
      <div className="flex flex-col items-center justify-between gap-4 text-body-sm text-white sm:flex-row">
        {/* Liens légaux */}
        <div className="flex gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="focus-style transition-colors duration-300 hover:text-secondary-orange"
              onClick={onLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Signature */}
        <p className="text-white">
          Développé par{' '}
          <a
            href="https://josuerocha.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-style font-semibold text-secondary-blue transition-colors duration-300 hover:text-secondary-orange"
          >
            Josué Rocha
          </a>
        </p>
      </div>
    </div>
  );
}
