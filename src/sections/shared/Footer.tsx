import type { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';

import SectionContainer from '@/components/common/SectionContainer';
import FooterLogo from '@/components/footer/FooterLogo';
import FooterNavigation from '@/components/footer/FooterNavigation';
import FooterContact from '@/components/footer/FooterContact';
import FooterSocial from '@/components/footer/FooterSocial';
import FooterBottom from '@/components/footer/FooterBottom';
import FooterMenu from '@/components/footer/FooterMenu';

type FooterProps = ComponentPropsWithoutRef<'footer'> & {
  variant?: 'default' | 'menu';
  onLinkClick?: () => void;
};

/**
 * Composant Footer redesigné
 *
 * Structure moderne en 3 colonnes :
 * - Navigation : Liens principaux du site
 * - Contact + Horaires : Coordonnées et horaires d'ouverture
 * - Prendre RDV + Suivez-nous : Lien externe + réseaux sociaux
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

  // Variante menu mobile compacte
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
        <FooterMenu onLinkClick={onLinkClick} />
      </footer>
    );
  }

  // Footer principal
  return (
    <footer
      id="footer"
      {...rest}
      className={clsx(
        'relative z-20 -mt-[12svh] w-full bg-primary text-accent [overflow-x:clip] sm:-mt-[10svh] lg:-mt-[8vw] print:hidden',
        className,
      )}
    >
      {/* Convex eyelid curve — enlarged on mobile for the "label" effect.
          data-navbar-theme makes IO detect this as footer → hides navbar early */}
      <div
        className="pointer-events-none absolute -top-[10svh] left-1/2 h-[30svh] w-[160vw] -translate-x-1/2 rounded-[50%] bg-primary sm:-top-[8svh] sm:h-[24svh] lg:-top-[11vw] lg:h-[45vw] lg:w-[140vw]"
        aria-hidden="true"
        data-navbar-theme="light"
      />

      {/* Logo sitting on the curve */}
      <div className="absolute -top-[7svh] left-1/2 z-10 -translate-x-1/2 sm:-top-[6svh] lg:-top-[6vw]">
        <FooterLogo />
      </div>

      <SectionContainer className="relative px-container-x pb-8 pt-[10svh] sm:pt-[8svh] lg:pb-10 lg:pt-[10vw]">
        {/* Grille responsive : 1 col mobile → 2 cols tablette → 3 cols desktop (xl) */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <FooterNavigation onLinkClick={onLinkClick} />
          <FooterContact />
          <FooterSocial className="sm:col-span-2 xl:col-span-1" />
        </div>

        {/* Barre inférieure : Liens légaux + Signature */}
        <FooterBottom onLinkClick={onLinkClick} />
      </SectionContainer>
    </footer>
  );
}
