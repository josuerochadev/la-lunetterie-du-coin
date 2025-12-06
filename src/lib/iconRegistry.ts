/**
 * Icon Registry
 *
 * Centralise les imports d'icônes Lucide pour éviter la duplication.
 * Les icônes sont référencées par nom (string) dans la couche data,
 * et résolues dynamiquement via ce registry dans la couche UI.
 *
 * Implémente un fallback pour gérer les icônes manquantes de façon robuste.
 *
 * @module lib/iconRegistry
 */

import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';

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
 * Icône de fallback affichée quand une icône n'est pas trouvée dans le registry
 */
const FALLBACK_ICON = HelpCircle;

/**
 * Type helper pour extraire les clés du registry
 */
export type SocialIconName = keyof typeof socialIconRegistry;

/**
 * Récupère une icône du registry avec fallback automatique
 *
 * Si l'icône n'existe pas dans le registry, retourne l'icône de fallback
 * et log un warning en développement pour faciliter le debug.
 *
 * @param iconName - Nom de l'icône à récupérer
 * @returns L'icône correspondante ou l'icône de fallback
 *
 * @example
 * ```tsx
 * const Icon = getSocialIcon('facebook'); // Returns Facebook icon
 * const Icon = getSocialIcon('unknown');  // Returns HelpCircle + logs warning
 * ```
 */
export function getSocialIcon(iconName: string): LucideIcon {
  const icon = socialIconRegistry[iconName];

  if (!icon) {
    // Log warning en développement uniquement
    if (import.meta.env.DEV) {
      console.warn(
        `[Icon Registry] Icon "${iconName}" not found in socialIconRegistry. Using fallback icon.`,
        `\nAvailable icons:`,
        Object.keys(socialIconRegistry),
      );
    }
    return FALLBACK_ICON;
  }

  return icon;
}
