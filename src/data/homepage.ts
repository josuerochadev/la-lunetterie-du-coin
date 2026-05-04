/**
 * Homepage Data
 *
 * Centralized data for homepage sections (Services, Offers).
 * Separates content from presentation for easier maintenance.
 */

export type HomepageService = {
  title: string;
  description: string;
  image: string;
  link: string;
};

export type HomepageOffer = {
  id: number;
  title: string;
  image: string;
  catchphrase: string;
  summary: string;
  link: string;
};

/**
 * Services displayed on homepage
 */
export const HOMEPAGE_SERVICES: HomepageService[] = [
  {
    title: 'Lunettes neuves',
    description:
      "Créateurs indépendants, marques pointues. Des montures qui ne ressemblent qu'à vous.",
    image: '/images-optimized/homepage-services-new-glasses-1920w.jpg',
    link: '/services#neuves',
  },
  {
    title: "Lunettes d'occasion",
    description: 'Du vintage rare au modèle récent, restauré avec soin. Le style sans le prix.',
    image: '/images-optimized/homepage-services-second-hand-1920w.jpg',
    link: '/services#occasion',
  },
  {
    title: 'Examens de vue',
    description:
      'Un contrôle complet par Romain, opticien depuis plus de 15 ans. Vos yeux sont entre de bonnes mains.',
    image: '/images-optimized/homepage-services-exam-1920w.jpg',
    link: '/services#examens',
  },
  {
    title: 'Lentilles de contact',
    description: "Toutes les marques, essai et adaptation sur mesure. On s'occupe de tout.",
    image: '/images-optimized/homepage-services-contact-lenses-1920w.jpg',
    link: '/services#lentilles',
  },
];

/**
 * Offers displayed on homepage
 */
export const HOMEPAGE_OFFERS: HomepageOffer[] = [
  {
    id: 1,
    title: 'Recyclage',
    image: '/images-optimized/homepage-offer-recyclage-1920w.jpg',
    catchphrase: 'DU PASSÉ FAITES TABLE RASE',
    summary: "Ramenez vos anciennes paires, repartez avec jusqu'à 70€ de remise.",
    link: '/offres#recyclage',
  },
  {
    id: 2,
    title: 'Deuxième paire',
    image: '/images-optimized/homepage-offer-second-pair-1920w.jpg',
    catchphrase: 'LE COUP DE FOUDRE ×2',
    summary: 'Une deuxième paire à partir de 59€. Solaires, lecture, secours — à vous de voir.',
    link: '/offres#deuxieme-paire',
  },
];

/**
 * Homepage section headers
 */
export const HOMEPAGE_SECTIONS = {
  services: {
    title: 'Nos services',
    subtitle: 'Une expertise complète pour prendre soin de votre vue',
    cta: {
      text: 'Voir nos services',
      link: '/services',
      ariaLabel: 'Voir nos services',
    },
  },
  offers: {
    title: 'Nos offres',
    subtitle: 'Des solutions pensées pour votre budget et pour la planète',
    cta: {
      text: 'Voir nos offres',
      link: '/offres',
      ariaLabel: 'Voir nos offres',
    },
  },
} as const;
