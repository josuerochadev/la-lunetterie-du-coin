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
 * Analyse une erreur réseau et détermine son type, sa capacité de retry et le message à afficher.
 *
 * Cette fonction examine l'erreur et la réponse HTTP pour déterminer :
 * - Le type d'erreur (offline, timeout, server_error, etc.)
 * - Si une nouvelle tentative est recommandée
 * - Le message technique pour les logs
 * - Le message utilisateur convivial à afficher
 *
 * @param error - L'erreur capturée (Error, TypeError, AbortError, ou autre)
 * @param response - La réponse HTTP optionnelle pour analyser le status code
 * @returns Un objet NetworkError contenant le type, les messages et la capacité de retry
 *
 * @example
 * ```typescript
 * try {
 *   const response = await fetch(url);
 *   if (!response.ok) {
 *     const error = analyzeNetworkError(new Error('HTTP error'), response);
 *     console.log(error.userMessage); // Message à afficher à l'utilisateur
 *   }
 * } catch (err) {
 *   const error = analyzeNetworkError(err);
 *   if (error.canRetry) {
 *     // Retry logic
 *   }
 * }
 * ```
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
 * Détermine si une erreur réseau justifie une nouvelle tentative automatique.
 *
 * Analyse le type d'erreur pour décider si un retry est pertinent. Les erreurs
 * temporaires (timeout, server_error, network_error, rate_limited) sont candidates
 * au retry, tandis que les erreurs permanentes (validation, client error) ne le sont pas.
 *
 * @param errorInfo - L'objet NetworkError retourné par analyzeNetworkError
 * @returns `true` si l'erreur justifie un retry, `false` sinon
 *
 * @example
 * ```typescript
 * const error = analyzeNetworkError(err, response);
 * if (shouldRetryError(error)) {
 *   const delay = getRetryDelay(attemptNumber);
 *   await new Promise(resolve => setTimeout(resolve, delay));
 *   // Retry request
 * }
 * ```
 */
export function shouldRetryError(errorInfo: NetworkError): boolean {
  return (
    errorInfo.canRetry &&
    ['timeout', 'server_error', 'network_error', 'rate_limited'].includes(errorInfo.type)
  );
}

/**
 * Calcule le délai d'attente avant une nouvelle tentative avec backoff exponentiel.
 *
 * Implémente une stratégie de backoff exponentiel pour éviter de surcharger le serveur :
 * - Tentative 1 : 1 seconde
 * - Tentative 2 : 2 secondes
 * - Tentative 3 : 4 secondes
 * - Maximum : 8 secondes
 *
 * @param attemptNumber - Le numéro de la tentative actuelle (1, 2, 3, etc.)
 * @returns Le délai en millisecondes à attendre avant le prochain retry
 *
 * @example
 * ```typescript
 * for (let attempt = 1; attempt <= 3; attempt++) {
 *   try {
 *     return await sendRequest();
 *   } catch (err) {
 *     if (attempt < 3) {
 *       const delay = getRetryDelay(attempt);
 *       await new Promise(resolve => setTimeout(resolve, delay));
 *     }
 *   }
 * }
 * ```
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
  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    // Pattern d'erreur: long-court-long (différent du succès)
    navigator.vibrate([200, 50, 200]);
  }
}
