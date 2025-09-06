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
    if (import.meta.env.DEV) {
      console.log('📊 Plausible Analytics: Skipped in development');
    }
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

  // @ts-ignore - Plausible global
  if (typeof window.plausible !== 'undefined') {
    // @ts-ignore
    window.plausible(eventName, options);
  }
}

/**
 * Alternative: Google Analytics 4 setup (commented)
 * Uncomment if you prefer GA4 over Plausible
 */
/*
export function initGA4(measurementId: string) {
  if (import.meta.env.DEV) return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  
  gtag('js', new Date());
  gtag('config', measurementId, {
    // Privacy-friendly settings
    anonymize_ip: true,
    cookie_flags: 'secure;samesite=strict',
  });
}
*/
