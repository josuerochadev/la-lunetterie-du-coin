import { Component, type ErrorInfo, type ReactNode } from 'react';
import * as Sentry from '@sentry/react';

import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary pour capturer et gérer les erreurs React en production.
 * Intègre automatiquement avec Sentry pour le reporting d'erreurs.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Met à jour le state pour afficher l'UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur vers Sentry avec contexte supplémentaire
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', true);
      scope.setLevel('error');
      scope.setContext('errorInfo', {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
      });
      Sentry.captureException(error);
    });

    // Log local pour debug (dev seulement)
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback personnalisée
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-accent px-4">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange/20">
                <span className="text-title-md">⚠️</span>
              </div>
              <h1 className="mb-4 text-title-md font-bold text-primary">
                Oups ! Quelque chose s'est mal passé
              </h1>
              <p className="mb-md text-body text-primary/80">
                Une erreur inattendue s'est produite. Notre équipe a été automatiquement notifiée et
                nous travaillons pour résoudre le problème.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={this.handleReload}
                className="w-full"
                aria-label="Recharger la page"
              >
                Recharger la page
              </Button>

              <Button
                variant="secondary"
                onClick={this.handleGoHome}
                className="w-full"
                aria-label="Retourner à l'accueil"
              >
                Retourner à l'accueil
              </Button>
            </div>

            <div className="mt-8 text-body-sm text-primary/60">
              <p>
                Si le problème persiste, contactez-nous au{' '}
                <a
                  href="tel:+33388512440"
                  className="focus-style font-semibold text-orange hover:underline"
                >
                  03 88 51 24 40
                </a>
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-body-sm text-primary/60">
                  Détails de l'erreur (dev uniquement)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap rounded bg-primary/10 p-3 text-xs text-primary">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
