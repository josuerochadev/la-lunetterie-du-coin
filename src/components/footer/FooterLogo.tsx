import { Link } from 'react-router-dom';

import LogoNO from '@/assets/logo/Logo_LLDC_NO_Noir.svg?react';

/**
 * FooterLogo - Logo Neuf & Occasion large en jaune (rebranding 2026)
 */
export default function FooterLogo() {
  return (
    <div className="text-center">
      <Link
        to="/"
        className="inline-block text-accent transition-opacity duration-200 hover:opacity-80"
        aria-label="Retour à l'accueil - La Lunetterie Du Coin"
      >
        <LogoNO className="mx-auto h-28 w-auto fill-accent sm:h-36 lg:h-44" aria-hidden="true" />
      </Link>
    </div>
  );
}
