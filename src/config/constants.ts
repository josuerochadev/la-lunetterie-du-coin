export const MENU_ANIMATION_DURATION = 300;

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xanbvzql';

export const CALENDLY_URL = 'https://calendly.com/lalunetterieducoin';

// Navigation principale - structure plate pour navbar horizontale
export const LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Nos services', href: '/services' },
  { label: 'Nos offres', href: '/#offers' },
  { label: 'Témoignages', href: '/#testimonials' },
  { label: 'Nous contacter', href: '/#contact' },
  { label: 'Prendre rendez‑vous', href: CALENDLY_URL },
];

// Navigation structurée par catégories pour le menu full-screen
export const MENU_CATEGORIES = [
  {
    title: 'DÉCOUVRIR',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'À propos', href: '/a-propos' },
      { label: 'Nos services', href: '/services' },
    ],
  },
  {
    title: 'OFFRES',
    links: [
      { label: 'Nos offres', href: '/#offers' },
      { label: 'Lunettes neuves', href: '/services#neuves' },
      { label: "Lunettes d'occasion", href: '/services#occasion' },
    ],
  },
  {
    title: 'CONTACT',
    links: [
      { label: 'Témoignages', href: '/#testimonials' },
      { label: 'Nous contacter', href: '/#contact' },
      { label: 'Prendre rendez-vous', href: CALENDLY_URL, featured: true },
    ],
  },
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

export const HERO_PHRASES = [
  'Des lunettes qui ont du style, une démarche qui a du sens',
  'Des lunettes à la mode et pas de déchet en vue !',
  'Payez vos lunettes moins cher en recyclant vos anciennes paires',
];

export const OFFERS = [
  {
    id: 1,
    title: 'Recyclage',
    imageBase: '/illustrations/recycle',
    summary: "Jusqu'à 70€ de remise en rapportant vos anciennes montures.",
    details:
      "Cette démarche vise à encourager le recyclage, donner une seconde vie à vos lunettes tout en réduisant les déchets.\n\nConditions : Offre limitée à 1 monture par transaction, valable uniquement pour un équipement de classe B, non cumulable avec d'autres promotions exceptionnelles.",
  },
  {
    id: 2,
    title: 'Deuxième paire',
    imageBase: '/illustrations/two-eyeframes',
    summary: 'Obtenez une deuxième paire à partir de 59€ selon vos besoins.',
    details:
      "59€ : monture + verres unifocaux\n89€ : verres progressifs\nVerres antireflet durci ou solaires UV cat.3\nOrigine France Garantie — Ophtalmic Vision.\n\nOffre valable sur la monture la moins chère pour l'achat d'un équipement de classe B, cumulable avec l'offre de recyclage. +40€ pour option polarisée sur les solaires.\n\nVoir conditions en magasin.",
  },
];

export const SERVICES = [
  {
    title: 'Lunettes neuves',
    description:
      'Large sélection de montures contemporaines et intemporelles. Marques indépendantes et créateurs locaux.',
    icon: '👓',
    link: '/services#neuves',
  },
  {
    title: "Lunettes d'occasion",
    description:
      'Montures de seconde main restaurées avec soin. Du vintage rare aux modèles récents à petits prix.',
    icon: '♻️',
    link: '/services#occasion',
  },
  {
    title: 'Examens de vue',
    description:
      "Contrôle visuel complet réalisé par Romain, opticien diplômé avec 10 ans d'expérience.",
    icon: '👁️',
    link: '/services#examens',
  },
  {
    title: 'Lentilles de contact',
    description:
      'Nous sommes revendeurs de toutes marques (Alcon, Acuvue, CooperVision, etc.). Essai et adaptation sur mesure.',
    icon: '🔍',
    link: '/services#lentilles',
  },
];

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

export const CONCEPT = `✷ Depuis 2016, on mixe **style** ☆ et **conscience** ◇ en plein Strasbourg. 
Des lunettes neuves, oui — mais aussi des montures **recyclées** ✷ restaurées avec soin. 
Ramenez vos anciennes paires. → Jusqu'à **70€ de réduction**. ✧ Donnez-leur une **seconde vie**. 
On voit clair, ○ sans fermer les yeux sur l'**impact écologique**. ▲ La mode change. ◆ La planète, non.`;

export const CONCEPT_PLAIN = `✷ Depuis 2016, on mixe style ☆ et conscience ◇ en plein Strasbourg. 
Des lunettes neuves, oui — mais aussi des montures recyclées ✷ restaurées avec soin. 
Ramenez vos anciennes paires. → Jusqu'à 70€ de réduction. ✧ Donnez-leur une seconde vie. 
On voit clair, ○ sans fermer les yeux sur l'impact écologique. ▲ La mode change. ◆ La planète, non.`;

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
export const HOST_PHONE = '';

// Médiation de la consommation
export const MEDIATOR_NAME = 'Médiateur de la consommation';
export const MEDIATOR_URL = 'https://www.economie.gouv.fr/mediation-conso';
export const MEDIATOR_ADDRESS =
  'Direction générale de la Concurrence, de la Consommation et de la Répression des fraudes';
