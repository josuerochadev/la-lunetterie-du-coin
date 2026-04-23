/**
 * Constantes SEO utilisées par React Helmet et les balises Open Graph.
 * Modifiées ici = impact sur toutes les pages du site.
 */

/** URL canonique du site en production. */
export const SITE_URL = 'https://www.lalunetterieducoin.fr';
/** Nom de marque affiché dans les balises title et OG. */
export const BRAND = 'La Lunetterie Du Coin Neuf & Occasion';
/** Title par défaut (page d'accueil). */
export const DEFAULT_TITLE = BRAND;
/** Template pour les pages intérieures : "Page · Marque". */
export const TITLE_TEMPLATE = `%s · ${BRAND}`;
/** Meta description par défaut. */
export const DEFAULT_DESCRIPTION =
  "Opticien à Strasbourg — montures neuves & d'occasion, conseils personnalisés, ajustage et services atelier.";
/** Image Open Graph par défaut (1200×630 recommandé). */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
/** Locale Open Graph. */
export const OG_LOCALE = 'fr_FR';
