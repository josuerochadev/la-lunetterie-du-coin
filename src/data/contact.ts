/**
 * Contact Data
 *
 * Centralized contact information including opening hours.
 * Separates content from presentation for easier maintenance.
 */

export type OpeningHour = {
  day: string;
  hours: string;
};

/**
 * Detailed opening hours by day
 */
export const OPENING_HOURS: OpeningHour[] = [
  { day: 'Lundi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
  { day: 'Mardi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
  { day: 'Mercredi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
  { day: 'Jeudi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
  { day: 'Vendredi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
  { day: 'Samedi', hours: '10h00 - 14h00 • 15h00 - 19h00' },
  { day: 'Dimanche', hours: 'Fermé' },
];

/**
 * Access information for different transport modes
 */
export const ACCESS_INFO = {
  car: {
    title: 'En voiture',
    description: 'Parking gratuit à proximité (rue de la Krutenau, parking Brant).',
  },
  publicTransport: {
    title: 'En transport en commun',
    description: "Arrêt Porte de l'Hôpital (Tram A, D) à 5 minutes à pied.",
  },
  accessibility: {
    title: 'Accessibilité',
    description: 'Boutique accessible PMR. Contactez-nous pour toute question.',
  },
} as const;
