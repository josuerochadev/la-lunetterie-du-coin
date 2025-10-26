import type { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';

import SectionContainer from '../components/common/SectionContainer';
import FooterLogo from '../components/footer/FooterLogo';
import FooterNavigation from '../components/footer/FooterNavigation';
import FooterContact from '../components/footer/FooterContact';
import FooterSocial from '../components/footer/FooterSocial';
import FooterBottom from '../components/footer/FooterBottom';
import FooterMenu from '../components/footer/FooterMenu';

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
      className={clsx('relative z-10 w-full bg-primary text-accent', className)}
    >
      <SectionContainer className="py-10">
        {/* En-tête */}
        <FooterLogo />

        {/* Grille 3 colonnes avec largeurs adaptées au contenu */}
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
          <FooterNavigation onLinkClick={onLinkClick} />
          <FooterContact />
          <FooterSocial />
        </div>

        {/* Barre inférieure : Liens légaux + Signature */}
        <FooterBottom onLinkClick={onLinkClick} />
      </SectionContainer>
    </footer>
  );
}
