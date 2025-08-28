// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { LazyMotion } from 'framer-motion';

import App from './App';

import { MotionProvider } from '@/a11y/MotionProvider';
import ScrollToTop from '@/components/routing/ScrollToTop';
import { loadFeatures } from '@/lib/loadMotionFeatures';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { validateEnvironment } from '@/lib/env';

// Validate environment variables
validateEnvironment();

// Ultra-minimal Sentry for mobile performance
const initSentry = async () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    try {
      const Sentry = await import('@sentry/react');

      // Skip Sentry on mobile for performance
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        console.log('Sentry disabled on mobile for performance');
        return;
      }

      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          // Only basic error tracking - no replay, no canvas, no feedback
          Sentry.browserTracingIntegration(),
        ],
        tracesSampleRate: 0.01, // Very low sampling for performance
        environment: import.meta.env.MODE,
        debug: false, // Never debug in production
        // Disable all expensive features
        beforeSend(event) {
          // Skip non-critical errors for performance
          if (event.level === 'warning') return null;
          return event;
        },
      });
    } catch (error) {
      console.warn('Failed to initialize Sentry:', error);
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
            </LazyMotion>
          </MotionProvider>
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
