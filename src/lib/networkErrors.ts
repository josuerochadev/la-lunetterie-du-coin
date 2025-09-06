// src/lib/networkErrors.ts

/**
 * Types d'erreurs réseau pour une gestion granulaire
 */
export type NetworkErrorType =
  | 'offline'
  | 'timeout'
  | 'server_error'
  | 'client_error'
  | 'validation_error'
  | 'rate_limited'
  | 'network_error'
  | 'unknown';

export interface NetworkError {
  type: NetworkErrorType;
  message: string;
  userMessage: string;
  canRetry: boolean;
  statusCode?: number;
}

/**
 * Analyse une erreur de fetch et retourne des informations détaillées
 */
export function analyzeNetworkError(error: unknown, response?: Response): NetworkError {
  // Vérification si offline
  if (!navigator.onLine) {
    return {
      type: 'offline',
      message: 'User is offline',
      userMessage: 'Vous êtes actuellement hors ligne. Vérifiez votre connexion internet.',
      canRetry: true,
    };
  }

  // Erreur d'AbortController (timeout)
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      type: 'timeout',
      message: 'Request timed out',
      userMessage: 'La demande a pris trop de temps. Vérifiez votre connexion et réessayez.',
      canRetry: true,
    };
  }

  // TypeError généralement = problème réseau
  if (error instanceof TypeError) {
    return {
      type: 'network_error',
      message: 'Network connection failed',
      userMessage: 'Problème de connexion réseau. Vérifiez votre connexion internet.',
      canRetry: true,
    };
  }

  // Analyse du status code de la réponse
  if (response) {
    const status = response.status;

    // Erreurs de validation (400-499)
    if (status >= 400 && status < 500) {
      if (status === 400) {
        return {
          type: 'validation_error',
          message: 'Validation failed',
          userMessage: 'Les données envoyées ne sont pas valides. Vérifiez le formulaire.',
          canRetry: false,
          statusCode: status,
        };
      }

      if (status === 429) {
        return {
          type: 'rate_limited',
          message: 'Rate limited',
          userMessage: 'Trop de tentatives. Attendez quelques minutes avant de réessayer.',
          canRetry: true,
          statusCode: status,
        };
      }

      return {
        type: 'client_error',
        message: `Client error: ${status}`,
        userMessage: 'Erreur dans la demande. Rechargez la page et réessayez.',
        canRetry: false,
        statusCode: status,
      };
    }

    // Erreurs serveur (500-599)
    if (status >= 500) {
      return {
        type: 'server_error',
        message: `Server error: ${status}`,
        userMessage: 'Le serveur rencontre des difficultés. Réessayez dans quelques instants.',
        canRetry: true,
        statusCode: status,
      };
    }
  }

  // Erreur inconnue
  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : 'Unknown error',
    userMessage: "Une erreur inattendue s'est produite. Réessayez plus tard.",
    canRetry: true,
  };
}

/**
 * Détermine si une erreur justifie un retry automatique
 */
export function shouldRetryError(errorInfo: NetworkError): boolean {
  return (
    errorInfo.canRetry &&
    ['timeout', 'server_error', 'network_error', 'rate_limited'].includes(errorInfo.type)
  );
}

/**
 * Calcule le délai avant retry avec backoff exponentiel
 */
export function getRetryDelay(attemptNumber: number): number {
  const baseDelay = 1000; // 1 seconde
  const maxDelay = 8000; // 8 secondes max

  const delay = baseDelay * Math.pow(2, attemptNumber - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Vibration pattern pour les erreurs (si supporté)
 */
export function vibrateError(): void {
  if ('vibrate' in navigator) {
    // Pattern d'erreur: long-court-long (différent du succès)
    navigator.vibrate([200, 50, 200]);
  }
}
