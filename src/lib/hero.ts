// src/lib/hero.ts

/**
 * Sélectionne une phrase aléatoire pour la Hero Section.
 * @param phrases - Tableau des punchlines à utiliser dans la Hero Section.
 * @returns Une phrase choisie aléatoirement.
 */

export function getRandomHeroPhrase(phrases: string[]): string {
  if (!Array.isArray(phrases) || phrases.length === 0) {
    throw new Error('Le tableau de phrases HERO_PHRASES est vide ou invalide.');
  }
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index];
}
