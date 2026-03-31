/**
 * Configuration du menu de navigation
 */

import { BOOKING_URL } from '@/config/endpoints';

export const MENU_ANIMATION_DURATION = 300;

// CTA principal du menu
export const MENU_CTA = {
  label: 'Prendre rendez-vous',
  href: BOOKING_URL,
  featured: true,
};

// Pages légales (affichées en bas du menu)
export const MENU_LEGAL_LINKS = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Conditions de vente', href: '/conditions-de-vente' },
];
