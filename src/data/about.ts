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
      'On vous dit ce qu\'on pense, pas ce qui arrange la caisse. Ici, le conseil est sincère — même si c\'est "revenez demain".',
    iconName: 'heart',
  },
  {
    title: 'Engagement écologique',
    description:
      "Une monture jetée, c'est du gâchis. Nous, on préfère leur offrir une deuxième vie. La planète approuve.",
    iconName: 'leaf',
  },
  {
    title: 'Expertise',
    description:
      'Plus de 15 ans à voir la vie à travers des verres. Examens, ajustements, conseils — on connaît la chanson par cœur.',
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
