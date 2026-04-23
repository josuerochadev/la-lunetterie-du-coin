import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';
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
        className={cn(
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
      className={cn(
        'relative z-20 -mt-[12svh] w-full bg-primary text-accent [overflow-x:clip] sm:-mt-[10svh] lg:-mt-[8vw] print:hidden',
        className,
      )}
    >
      {/* Convex eyelid curve — half-ellipse (top only), same pattern as ConvexDome.
          data-navbar-theme makes IO detect this as footer → hides navbar early */}
      <div
        className="pointer-events-none absolute -top-[10svh] left-0 z-[1] h-[20svh] w-full overflow-hidden sm:-top-[8svh] sm:h-[16svh] lg:-top-[11vw] lg:h-[22vw]"
        aria-hidden="true"
        data-navbar-theme="light"
      >
        <div
          className="absolute left-1/2 top-0 h-full w-[160vw] -translate-x-1/2 bg-primary sm:w-[160vw] lg:w-[140vw]"
          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
        />
      </div>

      {/* Logo sitting on the curve */}
      <div className="absolute -top-[7svh] left-1/2 z-10 -translate-x-1/2 sm:-top-[6svh] lg:-top-[6vw]">
        <FooterLogo />
      </div>

      <SectionContainer className="relative px-container-x pb-8 pt-[10svh] sm:pt-[8svh] lg:pb-10 lg:pt-[10vw]">
        {/* Grille responsive : 1 col mobile → 2 cols tablette → 3 cols desktop (xl).
            At xl+ we switch to flex + justify-evenly so the three columns sit
            with equal gaps on both sides AND between each other inside the
            centered max-w-7xl container. */}
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 xl:flex xl:items-start xl:justify-evenly xl:gap-0 3xl:max-w-[96rem]">
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
