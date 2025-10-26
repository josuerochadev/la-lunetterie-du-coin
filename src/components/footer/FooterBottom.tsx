import { Link } from 'react-router-dom';

import { FOOTER_LINKS } from '@/config/constants';

type FooterBottomProps = {
  onLinkClick?: () => void;
};

/**
 * FooterBottom - Barre inférieure avec liens légaux et signature
 */
export default function FooterBottom({ onLinkClick }: FooterBottomProps) {
  return (
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
  );
}
