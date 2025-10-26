export const MENU_ANIMATION_DURATION = 300;

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xanbvzql';

export const CALENDLY_URL = 'https://calendly.com/lalunetterieducoin';

// CTA principal du menu
export const MENU_CTA = {
  label: 'Prendre rendez-vous',
  href: CALENDLY_URL,
  featured: true,
};

// Pages légales (affichées en bas du menu)
export const MENU_LEGAL_LINKS = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Conditions de vente', href: '/conditions-de-vente' },
];

// Informations pratiques pour la navbar et le menu
export const STORE_INFO = {
  address: {
    street: '24 Rue du Faubourg-de-Pierre',
    city: 'Strasbourg',
    postalCode: '67000',
    full: '24 Rue du Faubourg-de-Pierre, 67000 Strasbourg',
    googleMapsUrl: 'https://maps.app.goo.gl/wNiTx6KzzzcVE8MCA',
  },
  phone: {
    display: '03 88 51 24 40',
    tel: '+33388512440',
  },
  hours: {
    weekdays: 'Lun–Sam : 10h–14h / 15h–19h',
    weekend: 'Dimanche : Fermé',
  },
  tagline: 'Opticien indépendant depuis 2016',
  usp: "Jusqu'à 70€ de remise avec notre offre recyclage",
};

export const TESTIMONIALS = [
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

export const FOOTER_NAV_LINKS = [
  { label: 'À propos', href: '/a-propos' },
  { label: 'Nos services', href: '/services' },
  { label: 'Nos offres', href: '/offres' },
  { label: 'Nous contacter', href: '/contact' },
];

export const FOOTER_LINKS = [
  { label: 'Mentions légales', href: '/mentions-legales', type: 'page' },
  { label: 'Conditions de vente', href: '/conditions-de-vente', type: 'page' },
];

export const FOOTER_SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/LaLunetterieDuCoinStrasbourg/',
    icon: 'facebook',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/lalunetterieducoin/',
    icon: 'instagram',
  },
];

// --- Legal / Company ---
export const COMPANY_NAME = 'La Lunetterie Du Coin Neuf & Occasion';
export const COMPANY_LEGAL_FORM = 'SASU';
export const COMPANY_ADDRESS = '24 rue du Faubourg de Pierre, 67000 Strasbourg, France';
export const COMPANY_SIRET = '81765775200017';
export const COMPANY_RCS = '817 657 752 RCS Strasbourg';
export const PUBLICATION_DIRECTOR = 'CORATO Romain-Guy';

// Optionnels mais recommandés
export const COMPANY_SHARE_CAPITAL = ''; // ex: "5 000 €"
export const COMPANY_VAT = ''; // ex: "FRxx 817657752"

// Contact
export const COMPANY_EMAIL = 'strasbourg@lalunetterieducoin.fr';
export const COMPANY_PHONE = '03 88 51 24 40';

// Hébergeur
export const HOST_NAME = 'Vercel Inc.';
export const HOST_ADDRESS = '340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis';

// Médiation de la consommation
export const MEDIATOR_NAME = 'Médiateur de la consommation';
export const MEDIATOR_URL = 'https://www.economie.gouv.fr/mediation-conso';
export const MEDIATOR_ADDRESS =
  'Direction générale de la Concurrence, de la Consommation et de la Répression des fraudes';
