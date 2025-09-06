// src/lib/performance.ts

/**
 * Métriques de performance Web Vitals basiques
 * Collecte LCP, FID, CLS pour monitoring
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

const thresholds = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
} as const;

function getRating(name: keyof typeof thresholds, value: number) {
  const threshold = thresholds[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Collecte et log les métriques de performance (dev only)
 */
export function initPerformanceMonitoring() {
  // Only in development for debugging
  if (!import.meta.env.DEV) return;

  // Support PerformanceObserver
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const metric: PerformanceMetric = {
        name: entry.name,
        value: Math.round(entry.value),
        rating: getRating(entry.name as keyof typeof thresholds, entry.value),
        timestamp: Date.now(),
      };

      console.log(`🎯 ${metric.name}:`, {
        value: `${metric.value}ms`,
        rating: metric.rating,
        emoji: metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌',
      });
    }
  });

  // Observer les Web Vitals
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  } catch {
    // Fail silently si pas supporté
  }
}

/**
 * Log des métriques de navigation simples
 */
export function logNavigationTiming() {
  if (!import.meta.env.DEV) return;

  // Attendre que les métriques soient disponibles
  setTimeout(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = {
        'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
        'TCP Connect': navigation.connectEnd - navigation.connectStart,
        'TLS Setup': navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
        'Request': navigation.responseStart - navigation.requestStart,
        'Response': navigation.responseEnd - navigation.responseStart,
        'DOM Parse': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        'Load Event': navigation.loadEventEnd - navigation.loadEventStart,
      };

      console.log('📊 Navigation Timing:', metrics);
    }
  }, 1000);
}