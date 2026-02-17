/**
 * withSuspense HOC
 *
 * Higher-Order Component qui enveloppe un composant lazy-loaded avec React.Suspense.
 * Fournit une UI de fallback par défaut pendant le chargement du composant.
 *
 * @module components/common/withSuspense
 *
 * @example
 * ```tsx
 * // Utilisation de base avec fallback par défaut
 * const AboutPage = lazy(() => import('./pages/AboutPage'));
 * const SuspendedAboutPage = withSuspense(AboutPage);
 *
 * // Utilisation avec fallback personnalisé
 * const SuspendedServicesPage = withSuspense(ServicesPage, {
 *   fallback: <CustomLoader />
 * });
 * ```
 */

import type { ComponentType, ReactNode } from 'react';
import { Suspense } from 'react';

/**
 * Options de configuration pour withSuspense
 */
type WithSuspenseOptions = {
  /**
   * Composant de fallback affiché pendant le chargement
   * @default <div className="p-4 text-body">…</div>
   */
  fallback?: ReactNode;
};

/**
 * Fallback par défaut affiché pendant le chargement
 *
 * Simple indicateur de chargement accessible et discret.
 */
const DEFAULT_FALLBACK = (
  <div className="flex min-h-screen items-center justify-center p-4">
    <span className="text-body text-black" aria-live="polite">
      Chargement…
    </span>
  </div>
);

/**
 * HOC qui enveloppe un composant avec React.Suspense
 *
 * Élimine la duplication du code Suspense dans App.tsx et fournit
 * une UI de fallback cohérente et accessible pour tous les lazy-loaded components.
 *
 * @param Component - Le composant à envelopper (généralement un lazy component)
 * @param options - Options de configuration
 * @returns Un composant enveloppé avec Suspense
 *
 * @example
 * ```tsx
 * // Dans App.tsx
 * const AboutPage = lazy(() => import('./pages/AboutPage'));
 * const SuspendedAboutPage = withSuspense(AboutPage);
 *
 * // Dans le render
 * <Route path="/a-propos" element={<SuspendedAboutPage />} />
 * ```
 */
export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  options: WithSuspenseOptions = {},
): ComponentType<P> {
  const { fallback = DEFAULT_FALLBACK } = options;

  // Composant wrapper avec nom d'affichage pour le debugging
  const WithSuspense = (props: P) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );

  // Nom d'affichage pour React DevTools
  WithSuspense.displayName = `withSuspense(${Component.displayName || Component.name || 'Component'})`;

  return WithSuspense;
}
