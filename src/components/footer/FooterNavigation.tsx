import { Link } from 'react-router-dom';

import { FOOTER_NAV_LINKS } from '@/config/footer';

type FooterNavigationProps = {
  onLinkClick?: () => void;
};

/**
 * FooterNavigation - Navigation principale du footer
 */
export default function FooterNavigation({ onLinkClick }: FooterNavigationProps) {
  return (
    <nav aria-label="Navigation du footer" className="lg:w-auto">
      <h3 className="text-subtitle mb-4 text-body-sm text-accent">Navigation</h3>
      <ul className="space-y-2">
        {FOOTER_NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="focus-style text-body-sm text-white transition-colors duration-300 hover:text-secondary-orange"
              onClick={onLinkClick}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
