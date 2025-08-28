// src/lib/deviceDetection.ts

/**
 * Utilitaires de détection d'appareil pour optimisations performance
 */

let cachedIsMobile: boolean | null = null;

/**
 * Détecte si l'utilisateur est sur mobile (≤768px)
 * Cache le résultat pour éviter les re-calculs
 */
export function isMobileDevice(): boolean {
  if (cachedIsMobile !== null) return cachedIsMobile;

  cachedIsMobile = window.matchMedia('(max-width: 768px)').matches;
  return cachedIsMobile;
}

/**
 * Hook pour réinitialiser le cache lors du resize (optionnel)
 */
export function resetDeviceCache(): void {
  cachedIsMobile = null;
}

/**
 * Détecte si on doit charger les animations lourdes
 */
export function shouldLoadHeavyAnimations(): boolean {
  // Pas d'animations lourdes sur mobile
  if (isMobileDevice()) return false;

  // Respecter les préférences utilisateur
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  return true;
}
