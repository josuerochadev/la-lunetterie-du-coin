/**
 * Témoignages clients (Google Reviews)
 */

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  date: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Michael Bernard',
    role: 'Google Reviews',
    quote:
      "Chouette boutique de lunettes où vous trouverez forcément quelque chose qui vous plaira. Le personnel a su m'orienter vers une paire de lunettes que je n'aurais pas choisie au premier abord, mais que j'adore maintenant !",
    rating: 5,
    date: 'Août 2024',
  },
  {
    id: 2,
    name: 'Pierre Fritsch',
    role: 'Google Reviews',
    quote:
      "Un grand merci à Romain et son équipe pour leur accueil, professionnalisme et volonté de satisfaire le client. C'est la deuxième fois que je fais refaire mes lunettes et je suis pleinement satisfait !",
    rating: 5,
    date: 'Mai 2024',
  },
  {
    id: 3,
    name: 'Zahra Houari',
    role: 'Google Reviews',
    quote:
      "Une équipe de professionnels passionnés par leur métier et très compétents, qui prennent le temps pour trouver LA paire, même pour les clients les plus indécis comme moi. J'en suis sortie ravie !",
    rating: 5,
    date: 'Avril 2024',
  },
  {
    id: 4,
    name: 'Marie Penone-Lemercier',
    role: 'Google Reviews',
    quote:
      "Mon opticien depuis des années et je ne m'en lasse pas. La sélection faite par Romain est pointue et originale, le conseil y est toujours sur-mesure ! Toute l'équipe est agréable, compétente et à l'écoute.",
    rating: 5,
    date: 'Janvier 2024',
  },
  {
    id: 5,
    name: 'Isabelle Mahoudeau',
    role: 'Google Reviews',
    quote:
      'Une boutique à taille humaine, une employée adorable, de bons conseils, des prix très raisonnables, des montures recyclées (et aussi des neuves si on ne trouve pas son bonheur) et des lunettes prêtes très vite... Bravo !',
    rating: 5,
    date: 'Septembre 2024',
  },
  {
    id: 6,
    name: 'Tom Ludemann',
    role: 'Google Reviews',
    quote:
      'Une expertise et une équipe en or. Conseils et expertise au rendez-vous ! Je conseille fortement pour tous mes myopes et astigmates !',
    rating: 5,
    date: 'Janvier 2024',
  },
];
