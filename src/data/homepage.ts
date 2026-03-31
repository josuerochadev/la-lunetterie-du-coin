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
    image: '/images/homepage-services-new-glasses.jpg',
    link: '/services#neuves',
  },
  {
    title: "Lunettes d'occasion",
    description: 'Du vintage rare au modèle récent, restauré avec soin. Le style sans le prix.',
    image: '/images/homepage-services-second-hand.jpg',
    link: '/services#occasion',
  },
  {
    title: 'Examens de vue',
    description:
      'Un contrôle complet par Romain, opticien depuis plus de 15 ans. Vos yeux sont entre de bonnes mains.',
    image: '/images/homepage-services-exam.jpg',
    link: '/services#examens',
  },
  {
    title: 'Lentilles de contact',
    description: "Toutes les marques, essai et adaptation sur mesure. On s'occupe de tout.",
    image: '/images/homepage-services-contact-lenses.jpg',
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
    image: '/images/homepage-offer-recyclage.webp',
    catchphrase: 'DU PASSÉ FAITES TABLE RASE',
    summary: "Ramenez vos anciennes paires, repartez avec jusqu'à 70€ de remise.",
    link: '/offres#recyclage',
  },
  {
    id: 2,
    title: 'Deuxième paire',
    image: '/images/homepage-offer-second-pair.webp',
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
