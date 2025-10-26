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
