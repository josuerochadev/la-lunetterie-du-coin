// src/lib/retryLogic.ts

import { analyzeNetworkError, shouldRetryError, getRetryDelay } from './networkErrors';

export interface RetryConfig {
  maxAttempts: number;
  // eslint-disable-next-line no-unused-vars
  onRetryAttempt?: (attemptNumber: number, delay: number) => void;
  onMaxAttemptsReached?: () => void;
}

/**
 * Execute une fonction avec retry automatique intelligent
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxAttempts: 3 },
): Promise<T> {
  const { maxAttempts, onRetryAttempt, onMaxAttemptsReached } = config;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Si c'est le dernier essai, on lance l'erreur
      if (attempt === maxAttempts) {
        onMaxAttemptsReached?.();
        throw error;
      }

      // Analyse de l'erreur pour décider si on doit retry
      let shouldRetry = false;
      let response: Response | undefined;

      // Extraction de la response si c'est une erreur de fetch
      if (error && typeof error === 'object' && 'response' in error) {
        response = (error as any).response;
      }

      const errorInfo = analyzeNetworkError(error, response);
      shouldRetry = shouldRetryError(errorInfo);

      // Si l'erreur ne justifie pas un retry, on arrête
      if (!shouldRetry) {
        throw error;
      }

      // Calcul du délai avant retry
      const delay = getRetryDelay(attempt);

      // Notification du retry
      onRetryAttempt?.(attempt, delay);

      // Attendre avant le prochain essai
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Ne devrait jamais arriver, mais TypeScript l'exige
  throw lastError;
}

/**
 * Version spécialisée pour les requêtes fetch
 */
export async function fetchWithRetry(
  url: string,
  options: globalThis.RequestInit,
  config: RetryConfig = { maxAttempts: 3 },
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, options);

    // Si la réponse n'est pas ok, on lance une erreur avec la réponse
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as any;
      error.response = response;
      throw error;
    }

    return response;
  }, config);
}
