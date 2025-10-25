/**
 * About Page Data
 *
 * Contient toutes les données de la page À propos.
 * Extraction depuis AboutPage.tsx pour une meilleure séparation des responsabilités.
 *
 * @module data/about
 */

import Heart from 'lucide-react/dist/esm/icons/heart';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Award from 'lucide-react/dist/esm/icons/award';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LucideProps } from 'lucide-react/dist/esm/shared';

export type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

export interface ValueData {
  title: string;
  description: string;
  icon: LucideIcon;
}

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
    icon: Heart,
  },
  {
    title: 'Engagement écologique',
    description:
      "Le recyclage au cœur de notre modèle. Chaque monture d'occasion sauvée, c'est un déchet en moins et une nouvelle vie pour un objet de qualité.",
    icon: Leaf,
  },
  {
    title: 'Expertise',
    description:
      "10 ans d'expérience en optique. Romain maîtrise tous les aspects du métier, des examens de vue aux ajustements les plus délicats.",
    icon: Award,
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
