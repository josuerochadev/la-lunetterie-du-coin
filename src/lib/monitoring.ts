/**
 * Enhanced monitoring and alerting configuration
 * Production-ready Sentry setup with custom alerts
 */

import * as Sentry from '@sentry/react';
import React from 'react';
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';

// Performance monitoring thresholds
export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals thresholds (Google standards)
  LCP_THRESHOLD: 2500, // Largest Contentful Paint
  FID_THRESHOLD: 100, // First Input Delay
  CLS_THRESHOLD: 0.1, // Cumulative Layout Shift

  // Custom app thresholds
  PAGE_LOAD_THRESHOLD: 3000,
  API_RESPONSE_THRESHOLD: 1000,
  ERROR_RATE_THRESHOLD: 0.01, // 1% error rate
} as const;

// Error types that should trigger immediate alerts
export const CRITICAL_ERROR_TYPES = [
  'ChunkLoadError',
  'NetworkError',
  'SecurityError',
  'TypeError',
] as const;

/**
 * Initialize advanced Sentry monitoring with custom alerts
 */
export function initAdvancedMonitoring() {
  if (import.meta.env.MODE !== 'production' || !import.meta.env.VITE_SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,

    // Performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions for performance
    profilesSampleRate: 0.1, // 10% for profiling

    // Session tracking
    autoSessionTracking: true,

    // Enhanced integrations
    integrations: [
      Sentry.browserTracingIntegration({
        // Track Core Web Vitals
        enableInp: true,
        enableLongTask: true,

        // Custom performance marks
        markTags: ['navigation', 'resource'],

        // Route change tracking
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        ),
      }),

      // User feedback integration
      Sentry.feedbackIntegration({
        colorScheme: 'light',
        showBranding: false,
      }),

      // Replay for error debugging (sample rate low for performance)
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: true,
        sampleRate: 0.1, // 10% of sessions
        errorSampleRate: 1.0, // 100% of error sessions
      }),
    ],

    // Environment and release tracking
    environment: import.meta.env.MODE,
    release: `lunetterie-du-coin@${import.meta.env.VITE_BUILD_TIME || 'unknown'}`,

    // Error filtering to reduce noise
    beforeSend(event, hint) {
      // Filter out non-critical errors
      const error = hint.originalException;

      if (error instanceof Error) {
        // Ignore known non-critical errors
        const ignoredErrors = [
          'ResizeObserver loop limit exceeded',
          'Non-Error promise rejection captured',
          'Script error.',
          'Network request failed',
        ];

        if (ignoredErrors.some((ignored) => error.message?.includes(ignored))) {
          return null;
        }

        // Add critical error tags for alerting
        if (CRITICAL_ERROR_TYPES.some((type) => error.name?.includes(type))) {
          event.tags = { ...event.tags, critical: true, alert: 'immediate' };
        }
      }

      return event;
    },

    // Performance event filtering
    beforeSendTransaction(event) {
      // Only send slow transactions to reduce noise
      const duration =
        event.timestamp && event.start_timestamp
          ? (event.timestamp - event.start_timestamp) * 1000
          : 0;

      if (duration < 100) {
        return null; // Skip fast transactions
      }

      // Add performance alerts for slow operations
      if (duration > PERFORMANCE_THRESHOLDS.PAGE_LOAD_THRESHOLD) {
        event.tags = { ...event.tags, performance_alert: 'slow_page_load' };
      }

      return event;
    },

    // Additional context
    initialScope: {
      tags: {
        component: 'lunetterie-du-coin-frontend',
        framework: 'react-19',
        build_tool: 'vite-7',
      },
      user: {
        // Set user context when available (GDPR compliant)
        segment: 'anonymous',
      },
    },
  });

  // Set up custom performance monitoring
  setupPerformanceMonitoring();

  // Set up business metrics tracking
  setupBusinessMetrics();
}

/**
 * Enhanced performance monitoring with Core Web Vitals
 */
function setupPerformanceMonitoring() {
  // Track Core Web Vitals with custom thresholds
  if ('web-vitals' in window || typeof window !== 'undefined') {
    import('web-vitals').then(({ onCLS, onFID, onLCP }) => {
      onLCP((metric) => {
        Sentry.addBreadcrumb({
          category: 'performance',
          message: `LCP: ${metric.value}ms`,
          level: metric.value > PERFORMANCE_THRESHOLDS.LCP_THRESHOLD ? 'warning' : 'info',
        });

        if (metric.value > PERFORMANCE_THRESHOLDS.LCP_THRESHOLD) {
          Sentry.captureMessage(`Slow LCP detected: ${metric.value}ms`, 'warning');
        }
      });

      onFID((metric) => {
        if (metric.value > PERFORMANCE_THRESHOLDS.FID_THRESHOLD) {
          Sentry.captureMessage(`High FID detected: ${metric.value}ms`, 'warning');
        }
      });

      onCLS((metric) => {
        if (metric.value > PERFORMANCE_THRESHOLDS.CLS_THRESHOLD) {
          Sentry.captureMessage(`High CLS detected: ${metric.value}`, 'warning');
        }
      });
    });
  }

  // Track custom performance metrics
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        Sentry.addBreadcrumb({
          category: 'performance.measure',
          message: `${entry.name}: ${entry.duration}ms`,
          level: 'info',
        });
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch {
    // PerformanceObserver not supported
  }
}

/**
 * Business metrics and conversion tracking
 */
function setupBusinessMetrics() {
  // Track form submissions with success/failure rates
  const trackFormSubmission = (formType: string, success: boolean, errorType?: string) => {
    Sentry.addBreadcrumb({
      category: 'business.form',
      message: `${formType} form ${success ? 'submitted' : 'failed'}`,
      level: success ? 'info' : 'error',
      data: { formType, success, errorType },
    });

    if (!success) {
      Sentry.captureMessage(`Form submission failed: ${formType}`, {
        level: 'warning',
        tags: { business_metric: 'form_failure', form_type: formType },
        extra: { errorType },
      });
    }
  };

  // Track page views and user engagement
  const trackPageView = (page: string, loadTime: number) => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page viewed: ${page} (${loadTime}ms)`,
      level: 'info',
      data: { page, loadTime },
    });

    if (loadTime > PERFORMANCE_THRESHOLDS.PAGE_LOAD_THRESHOLD) {
      Sentry.captureMessage(`Slow page load: ${page}`, {
        level: 'warning',
        tags: { performance_alert: 'slow_navigation', page },
        extra: { loadTime },
      });
    }
  };

  // Export tracking functions for use in components
  (window as any).sentryTracking = {
    trackFormSubmission,
    trackPageView,
  };
}

/**
 * Custom error boundary integration with Sentry
 */
export function captureErrorBoundaryError(error: Error, errorInfo: any, componentStack: string) {
  Sentry.withScope((scope) => {
    scope.setTag('errorBoundary', true);
    scope.setTag('critical', true);
    scope.setLevel('error');
    scope.setContext('errorInfo', {
      componentStack: errorInfo.componentStack,
      errorBoundary: componentStack,
    });
    scope.setContext('react', {
      componentStack: errorInfo.componentStack,
    });

    Sentry.captureException(error);
  });
}

/**
 * API error tracking with automatic alerting
 */
export function captureAPIError(
  endpoint: string,
  status: number,
  error: Error | string,
  duration: number,
) {
  const isCritical = status >= 500 || duration > PERFORMANCE_THRESHOLDS.API_RESPONSE_THRESHOLD;

  Sentry.captureMessage(`API Error: ${endpoint}`, {
    level: isCritical ? 'error' : 'warning',
    tags: {
      api_endpoint: endpoint,
      http_status: status,
      critical: isCritical,
      alert: isCritical ? 'immediate' : 'standard',
    },
    extra: {
      endpoint,
      status,
      error: error.toString(),
      duration,
    },
  });
}

export default { initAdvancedMonitoring, captureErrorBoundaryError, captureAPIError };
