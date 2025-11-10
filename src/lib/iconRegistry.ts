/**
 * Icon Registry
 *
 * Centralise les imports d'icônes Lucide pour éviter la duplication.
 * Les icônes sont référencées par nom (string) dans la couche data,
 * et résolues dynamiquement via ce registry dans la couche UI.
 *
 * @module lib/iconRegistry
 */

import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';

import type { LucideIcon } from '@/types/lucide-react-icons';

/**
 * Registry des icônes sociales
 *
 * Source unique pour les icônes de réseaux sociaux utilisées dans :
 * - FooterSocial
 * - FooterMenu
 * - FullScreenMenu
 */
export const socialIconRegistry: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
} as const;

/**
 * Type helper pour extraire les clés du registry
 */
export type SocialIconName = keyof typeof socialIconRegistry;
