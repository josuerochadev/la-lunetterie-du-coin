/**
 * Offers Data
 *
 * Contient toutes les données des offres proposées par La Lunetterie du Coin.
 * Extraction depuis OffersPage.tsx pour une meilleure séparation des responsabilités.
 *
 * @module data/offers
 */

export interface OfferData {
  id: string;
  title: string;
  image: string;
  catchphrase: string;
  description: string;
  details: string[];
  conditions: string[];
}

/**
 * Liste complète des offres disponibles
 */
export const OFFERS_DATA: OfferData[] = [
  {
    id: 'recyclage',
    title: 'Programme de recyclage',
    image: '/images/offers-recyclage-sunglasses.jpg',
    catchphrase: "Vos anciennes lunettes valent de l'or",
    description:
      "Rapportez vos anciennes lunettes et économisez jusqu'à 70€ sur votre nouvel achat. Un geste pour votre budget et pour la planète.",
    details: [
      "Jusqu'à 70€ de réduction immédiate sur votre équipement complet",
      'Toutes marques acceptées, peu importe leur état',
      'Montures cassées, rayées ou démodées : tout est bon !',
      'Geste écologique récompensé : donnez une seconde vie',
      'Les montures sont restaurées professionnellement puis revendues',
      'Réduction directement déduite en magasin',
      'Pas de limite de quantité : plus vous apportez, plus vous économisez',
    ],
    conditions: [
      'Offre limitée à 1 monture par transaction',
      'Valable uniquement pour un équipement de classe B (monture + verres)',
      "Non cumulable avec d'autres promotions exceptionnelles",
      'Les montures doivent être propres et complètes (branches et façade)',
    ],
  },
  {
    id: 'deuxieme-paire',
    title: 'Deuxième paire',
    image: '/images/offers-second-sunglasses-clip.jpg',
    catchphrase: 'Deux paires, deux styles, un prix imbattable',
    description:
      'Obtenez une deuxième paire à partir de 59€ selon vos besoins. Lunettes de soleil, de lecture ou de secours : doublez votre style sans vous ruiner.',
    details: [
      '59€ : monture + verres unifocaux standards',
      '89€ : verres progressifs pour votre deuxième paire',
      'Verres antireflet durci inclus',
      'Option solaires UV cat.3 au même prix',
      'Origine France Garantie — Ophtalmic Vision',
      'Large choix de montures disponibles',
      'Qualité professionnelle garantie',
    ],
    conditions: [
      'Offre valable sur la monture la moins chère',
      "Applicable lors de l'achat d'un équipement de classe B",
      "Cumulable avec l'offre de recyclage",
      '+40€ pour option polarisée sur les solaires',
      'Voir conditions détaillées en magasin',
    ],
  },
];
