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
      'Large sélection de montures contemporaines et intemporelles. Marques indépendantes et créateurs locaux.',
    image: '/images/homepage-services-new-glasses.jpg',
    link: '/services#neuves',
  },
  {
    title: "Lunettes d'occasion",
    description:
      'Montures de seconde main restaurées avec soin. Du vintage rare aux modèles récents à petits prix.',
    image: '/images/homepage-services-second-hand.jpg',
    link: '/services#occasion',
  },
  {
    title: 'Examens de vue',
    description:
      "Contrôle visuel complet réalisé par Romain, opticien diplômé avec 10 ans d'expérience.",
    image: '/images/homepage-services-exam.jpg',
    link: '/services#examens',
  },
  {
    title: 'Lentilles de contact',
    description:
      'Nous sommes revendeurs de toutes marques (Alcon, Acuvue, CooperVision, etc.). Essai et adaptation sur mesure.',
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
    summary: "Jusqu'à 70€ de remise en rapportant vos anciennes montures.",
    link: '/offres#recyclage',
  },
  {
    id: 2,
    title: 'Deuxième paire',
    image: '/images/homepage-offer-second-pair.webp',
    catchphrase: 'LE COUP DE FOUDRE ×2',
    summary: 'Obtenez une deuxième paire à partir de 59€ selon vos besoins.',
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
      text: 'Découvrir nos services',
      link: '/services',
      ariaLabel: 'Découvrir nos services',
    },
  },
  offers: {
    title: 'Nos offres',
    subtitle: 'Des solutions pensées pour votre budget et pour la planète',
    cta: {
      text: 'Découvrir nos offres',
      link: '/offres',
      ariaLabel: 'Découvrir nos offres',
    },
  },
} as const;
