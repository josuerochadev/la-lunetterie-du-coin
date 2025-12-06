/**
 * Configuration des liens et réseaux sociaux du footer
 */

import type { SocialIconName } from '@/lib/iconRegistry';

/**
 * Liens de navigation du footer
 */
export const FOOTER_NAV_LINKS = [
  { label: 'À propos', href: '/a-propos' },
  { label: 'Nos services', href: '/services' },
  { label: 'Nos offres', href: '/offres' },
  { label: 'Nous contacter', href: '/contact' },
];

/**
 * Liens légaux du footer
 */
export const FOOTER_LINKS = [
  { label: 'Mentions légales', href: '/mentions-legales', type: 'page' },
  { label: 'Conditions de vente', href: '/conditions-de-vente', type: 'page' },
];

/**
 * Interface pour un lien de réseau social
 */
export interface SocialLink {
  label: string;
  href: string;
  iconName: SocialIconName;
}

/**
 * Réseaux sociaux du footer
 *
 * Les icônes sont référencées par nom (string) et résolues
 * via socialIconRegistry dans les composants UI.
 */
export const FOOTER_SOCIALS: SocialLink[] = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/LaLunetterieDuCoinStrasbourg/',
    iconName: 'facebook',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/lalunetterieducoin/',
    iconName: 'instagram',
  },
];
