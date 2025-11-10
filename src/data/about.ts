/**
 * About Page Data
 *
 * Contient toutes les données de la page À propos.
 * Extraction depuis AboutPage.tsx pour une meilleure séparation des responsabilités.
 *
 * Cette couche data est pure : elle ne dépend d'aucun composant UI.
 * Les icônes sont référencées par leur nom (string) et résolues dans le composant.
 *
 * @module data/about
 */

/**
 * Type pour les noms d'icônes Lucide supportés
 */
export type IconName = 'heart' | 'leaf' | 'award';

/**
 * Interface pour les données d'une valeur
 */
export interface ValueData {
  title: string;
  description: string;
  iconName: IconName;
}

/**
 * Interface pour les données d'une statistique
 */
export interface StatData {
  number: string;
  label: string;
}

/**
 * Nos valeurs fondamentales
 */
export const VALUES_DATA: ValueData[] = [
  {
    title: 'Authenticité',
    description:
      'Des conseils sincères, sans pression commerciale. Nous prenons le temps de vous connaître pour trouver LA paire qui vous correspond.',
    iconName: 'heart',
  },
  {
    title: 'Engagement écologique',
    description:
      "Le recyclage au cœur de notre modèle. Chaque monture d'occasion sauvée, c'est un déchet en moins et une nouvelle vie pour un objet de qualité.",
    iconName: 'leaf',
  },
  {
    title: 'Expertise',
    description:
      "10 ans d'expérience en optique. Romain maîtrise tous les aspects du métier, des examens de vue aux ajustements les plus délicats.",
    iconName: 'award',
  },
];

/**
 * Statistiques clés de l'entreprise
 */
export const STATS_DATA: StatData[] = [
  { number: '2016', label: 'Année de création' },
  { number: '2000+', label: 'Paires recyclées' },
  { number: '70€', label: 'Réduction maximum' },
];
