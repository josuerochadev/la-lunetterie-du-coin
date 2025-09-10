// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { LazyMotion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';

import App from './App';

import { MotionProvider } from '@/a11y/MotionProvider';
import ScrollToTop from '@/components/routing/ScrollToTop';
import { loadFeatures } from '@/lib/loadMotionFeatures';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { validateEnvironment, env } from '@/lib/env';
import { initPerformanceMonitoring, logNavigationTiming } from '@/lib/performance';
import { initPlausible } from '@/lib/analytics';

// Validate environment variables
validateEnvironment();

// Initialize performance monitoring (dev only)
initPerformanceMonitoring();
logNavigationTiming();

// Initialize analytics (production only)
if (env.VITE_ANALYTICS_DOMAIN) {
  initPlausible({ domain: env.VITE_ANALYTICS_DOMAIN });
}

// Ultra-minimal Sentry loading strategy
const initSentry = async () => {
  // Only load Sentry in production with DSN configured
  if (import.meta.env.MODE !== 'production' || !import.meta.env.VITE_SENTRY_DSN) {
    return;
  }

  try {
    // Skip Sentry on mobile and slow connections for performance
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isSlowConnection =
      'connection' in navigator &&
      // @ts-ignore - NetworkInformation not in standard types
      navigator.connection?.effectiveType === 'slow-2g';

    if (isMobile || isSlowConnection) {
      // Sentry disabled for performance reasons (mobile/slow connection)
      return;
    }

    // Dynamic import only when needed
    const { init, browserTracingIntegration } = await import('@sentry/react');

    init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        browserTracingIntegration({
          // Minimal tracing for better performance
          enableInp: false,
          enableLongTask: false,
        }),
      ],
      tracesSampleRate: 0.005, // Ultra low sampling (0.5%)
      environment: import.meta.env.MODE,
      debug: false,
      beforeSend(event) {
        // Only log critical errors
        if (event.level === 'warning' || event.level === 'info') return null;
        return event;
      },
      // Reduce bundle size
      beforeSendTransaction(event) {
        // Skip most transactions
        return Math.random() < 0.01 ? event : null;
      },
    });
  } catch (error) {
    // Silently fail to avoid blocking app startup
    if (import.meta.env.DEV) {
      console.warn('Sentry init failed:', error);
    }
  }
};

// Initialize Sentry after a delay to not block initial page load
// Use requestIdleCallback for better back/forward cache compatibility
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => setTimeout(initSentry, 1000));
} else {
  setTimeout(initSentry, 2000);
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <HelmetProvider>
          <MotionProvider>
            <LazyMotion features={loadFeatures} strict>
              <ScrollToTop />
              <App />
              <Analytics />
            </LazyMotion>
          </MotionProvider>
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
