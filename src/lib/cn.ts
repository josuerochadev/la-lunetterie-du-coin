import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusionne plusieurs valeurs de classes CSS en une seule chaîne, en supprimant les doublons et en gérant les conflits.
 *
 * @param {...ClassValue[]} inputs - Liste des valeurs de classes à fusionner. Peut inclure des chaînes, des objets ou des tableaux.
 * @returns {string} La chaîne de classes CSS fusionnée et optimisée.
 *
 * @example
 * cn('btn', condition && 'btn-active', ['extra-class']);
 * // Retourne : 'btn btn-active extra-class' (si condition est vraie)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
