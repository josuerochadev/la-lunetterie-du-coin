// src/main.tsx
import * as Sentry from '@sentry/react';
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

// Configuration Sentry
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      // Replay seulement en production pour éviter le spam en dev
      ...(import.meta.env.PROD
        ? [
            Sentry.replayIntegration({
              maskAllText: false,
              blockAllMedia: false,
            }),
          ]
        : []),
    ],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1, // 100% en dev, 10% en prod
    replaysSessionSampleRate: import.meta.env.PROD ? 0.05 : 0,
    replaysOnErrorSampleRate: import.meta.env.PROD ? 1.0 : 0,
    environment: import.meta.env.MODE,
    debug: import.meta.env.DEV, // Logs Sentry en dev
  });
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
