// src/lib/analytics.ts

/**
 * Analytics léger avec Plausible (recommandé pour RGPD et performance)
 * Alternative: Google Analytics 4 (plus lourd mais plus complet)
 */

interface PlausibleOptions {
  domain: string;
  apiHost?: string;
}

/**
 * Initialize Plausible Analytics
 * Lightweight, privacy-friendly analytics (< 1KB)
 */
export function initPlausible(options: PlausibleOptions) {
  // Only in production
  if (import.meta.env.DEV) {
    console.log('📊 Plausible Analytics: Skipped in development');
    return;
  }

  const script = document.createElement('script');
  script.defer = true;
  script.src = `${options.apiHost || 'https://plausible.io'}/js/script.js`;
  script.setAttribute('data-domain', options.domain);

  // Load after page is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.head.appendChild(script);
    });
  } else {
    document.head.appendChild(script);
  }
}

/**
 * Track custom events (Plausible)
 */
export function trackEvent(
  eventName: string,
  options?: { props?: Record<string, string | number> },
) {
  if (import.meta.env.DEV) return;

  // eslint-disable-next-line no-unused-vars
  const plausible = (window as Window & { plausible?: (...args: unknown[]) => void }).plausible;
  if (plausible) {
    plausible(eventName, options);
  }
}
