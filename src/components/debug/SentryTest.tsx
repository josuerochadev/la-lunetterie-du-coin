// src/components/debug/SentryTest.tsx
import * as Sentry from '@sentry/react';

export default function SentryTest() {
  const triggerError = () => {
    throw new Error('Test Sentry - Erreur volontaire pour tester le monitoring');
  };

  const triggerCustomEvent = () => {
    Sentry.addBreadcrumb({
      message: 'Utilisateur a testé Sentry',
      level: 'info',
    });
    Sentry.captureMessage('Test custom message Sentry', 'info');
  };

  // Ne s'affiche qu'en développement
  if (import.meta.env.PROD) return null;

  return (
    <div
      className="fixed bottom-4 right-4 rounded-lg border border-red-300 bg-red-100 p-4 shadow-lg"
      style={{ zIndex: 9999 }}
    >
      <h3 className="mb-2 text-body-sm font-bold text-red-800">🚨 Sentry Test (dev only)</h3>
      <div className="flex flex-col space-y-xs">
        <button
          onClick={triggerError}
          className="rounded bg-red-500 px-3 py-2 text-body-sm font-medium text-white hover:bg-red-600"
        >
          Déclencher Erreur
        </button>
        <button
          onClick={triggerCustomEvent}
          className="rounded bg-blue-500 px-3 py-2 text-body-sm font-medium text-white hover:bg-blue-600"
        >
          Message Custom
        </button>
      </div>
    </div>
  );
}
