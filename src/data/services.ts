/**
 * Services Data
 *
 * Contient toutes les données des services proposés par La Lunetterie du Coin.
 * Extraction depuis ServicesPage.tsx pour une meilleure séparation des responsabilités.
 *
 * @module data/services
 */

export interface ServiceData {
  id: string;
  title: string;
  image: string;
  description: string;
  details: string[];
}

/**
 * Liste complète des services proposés
 */
export const SERVICES_DATA: ServiceData[] = [
  {
    id: 'neuves',
    title: 'Lunettes neuves',
    image: '/images/services-new-glasses-sun.jpg',
    description: 'Une sélection pointue de créateurs indépendants et de marques iconiques.',
    details: [
      'Large choix de montures contemporaines et intemporelles',
      'Marques indépendantes et créateurs locaux',
      'Montures vintage et modèles rares',
      'Verres de qualité et origine française',
      'Verres progressifs dernière génération',
      'Verres anti-lumière bleue',
      'Traitement antireflet durci',
    ],
  },
  {
    id: 'occasion',
    title: "Lunettes d'occasion",
    image: '/images/services-second-hand-glasses.jpg',
    description:
      'Des montures de seconde main restaurées avec soin, pour un style unique à petit prix.',
    details: [
      'Montures vintage authentiques',
      'Modèles récents à prix réduits',
      'Toutes restaurées et nettoyées professionnellement',
      'Contrôle qualité systématique',
      'Du rare au classique',
      'Prix accessibles',
      'Stock renouvelé régulièrement',
    ],
  },
  {
    id: 'examens',
    title: 'Examens de vue',
    image: '/images/services-exams-machine.png',
    description:
      "Contrôle visuel complet réalisé par Romain, opticien diplômé avec 10 ans d'expérience.",
    details: [
      'Examen de vue complet (30 min)',
      'Réfraction précise',
      'Test de vision binoculaire',
      'Mesure de la pression intraoculaire',
      'Conseils personnalisés',
      'Prise en charge mutuelle possible',
      'Sur rendez-vous ou en visite libre',
    ],
  },
  {
    id: 'lentilles',
    title: 'Lentilles de contact',
    image: '/images/services-contact-lenses-shop-mirror.png',
    description: 'Nous sommes revendeurs de toutes marques avec essai et adaptation sur mesure.',
    details: [
      'Revendeurs de toutes marques (Alcon, Acuvue, CooperVision, etc.)',
      'Lentilles journalières, mensuelles, annuelles',
      'Lentilles souples et rigides',
      'Lentilles toriques (astigmatisme)',
      'Lentilles progressives',
      'Essai gratuit en magasin',
      'Suivi et adaptation personnalisée',
    ],
  },
  {
    id: 'reparations',
    title: 'Réparations & Ajustements',
    image: '/images/services-reparations.jpg',
    description: 'Service après-vente complet pour garder vos lunettes en parfait état.',
    details: [
      'Ajustements gratuits à vie pour nos clients',
      'Nettoyage professionnel gratuit',
      'Remplacement plaquettes gratuit pour nos clients',
      'Visserie gratuite pour nos clients',
      'Réparation de charnières',
      'Remplacement de branches',
      'Service rapide (souvent immédiat)',
    ],
  },
];
