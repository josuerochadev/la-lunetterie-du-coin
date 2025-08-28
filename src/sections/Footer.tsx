import type { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import { Link } from 'react-router-dom';

import SectionContainer from '../components/common/SectionContainer';

import { FOOTER_LINKS, FOOTER_SOCIALS } from '@/config/constants';

type FooterProps = ComponentPropsWithoutRef<'footer'> & {
  variant?: 'default' | 'menu';
  onLinkClick?: () => void; // Callback pour fermer le menu
};

/**
 * Composant Footer pour l'affichage du pied de page du site.
 *
 * Affiche l'adresse, les horaires, les liens sociaux, les liens légaux et une signature de développement.
 * Optimisé pour l'accessibilité avec structure sémantique et support screen readers.
 *
 * @param variant - Type d'affichage du footer
 * @param className - Classes CSS additionnelles
 * @param rest - Props HTML standard transmises au footer
 *
 * Variantes disponibles :
 * - `variant="default"` : Version complète pour page principale
 *   • Titre, adresse, horaires, téléphone (mis en valeur en orange/gras)
 *   • Réseaux sociaux avec icônes et labels
 *   • Liens légaux (mentions légales, CGV)
 *   • Signature développeur
 *
 * - `variant="menu"` : Version compacte pour navbar full-screen
 *   • Titre et coordonnées centrés
 *   • Icônes réseaux sociaux (taille optimisée 20px)
 *   • Liens légaux en layout horizontal
 *   • Couleurs adaptées (violet sur transparent)
 *
 *
 * @example
 * ```tsx
 * // Footer principal
 * <Footer />
 *
 * // Footer dans menu
 * <Footer variant="menu" className="text-primary" />
 * ```
 */
export default function Footer({
  className = '',
  variant = 'default',
  onLinkClick,
  ...rest
}: FooterProps) {
  const isMenu = variant === 'menu';

  const footerLinkBase =
    'font-semibold transition-colors duration-300 hover:text-orange focus-style';

  return (
    <footer
      id="footer"
      {...rest}
      className={clsx(
        'relative z-10 w-full',
        isMenu ? 'bg-transparent py-2 text-center text-primary' : 'bg-primary text-accent',
        className,
      )}
    >
      <SectionContainer noSpacing={isMenu} className={isMenu ? '' : 'pt-8'}>
        <h2 className="mx-auto mb-3 text-center text-title-md font-extrabold">
          <span className="font-thin">LA</span>
          LUNETTERIE
          <span className="font-thin">DU</span>
          COIN
        </h2>

        <div
          className={clsx(
            'mx-auto w-fit',
            isMenu
              ? 'flex flex-col items-center space-y-xs'
              : 'grid items-baseline gap-x-section-gap sm:grid-cols-2',
          )}
        >
          {/* Adresse et horaires */}
          <address
            aria-label="Adresse et horaires de la boutique"
            className="space-y-1 text-center text-body-sm not-italic leading-relaxed sm:text-left"
          >
            <p>24&nbsp;Rue&nbsp;du&nbsp;Faubourg-de-Pierre&nbsp;67000&nbsp;STRASBOURG</p>
            <p>
              <a
                href="tel:+33388512440"
                className={clsx(
                  footerLinkBase,
                  !isMenu &&
                    'text-body-lg font-bold text-orange hover:font-black hover:text-primary',
                )}
              >
                03&nbsp;88&nbsp;51&nbsp;24&nbsp;40
              </a>
            </p>
            <p>Du lundi au samedi&nbsp;: 10&nbsp;h–14&nbsp;h / 15&nbsp;h–19&nbsp;h</p>
            <p>Dimanche&nbsp;: fermé</p>
          </address>

          <nav
            aria-label="Navigation de bas de page"
            className={clsx(
              'flex flex-col items-center text-body-sm',
              isMenu ? 'space-y-3 pt-2' : 'space-y-sm sm:items-start',
            )}
          >
            {/* Réseaux sociaux */}
            <div className={clsx('flex space-x-4', !isMenu && 'pt-2')} aria-label="Réseaux sociaux">
              {FOOTER_SOCIALS.map((social) => {
                const iconSize = isMenu ? 20 : 18;
                const iconClassName = isMenu ? '' : 'mr-1 inline';
                const IconComponent = social.icon === 'facebook' ? Facebook : Instagram;

                return (
                  <a
                    key={social.href}
                    href={social.href}
                    className={clsx(footerLinkBase, isMenu && 'text-primary hover:text-orange')}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <IconComponent
                      width={iconSize}
                      height={iconSize}
                      className={iconClassName}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{social.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Liens légaux */}
            <div
              className={clsx('flex', isMenu ? 'space-x-6 text-body-sm' : 'flex-col space-y-sm')}
            >
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  className={clsx(
                    footerLinkBase,
                    isMenu && 'text-body-sm text-primary hover:text-orange',
                  )}
                  to={link.href}
                  onClick={onLinkClick} // Ferme le menu si callback fourni
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {!isMenu && (
              /* Signature */
              <p className="pt-3 text-center text-body-sm">
                Développé&nbsp;par{' '}
                <a
                  href="https://josuerochadev.github.io/portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkBase}
                >
                  Josué&nbsp;Rocha
                </a>
              </p>
            )}
          </nav>
        </div>
      </SectionContainer>
    </footer>
  );
}
