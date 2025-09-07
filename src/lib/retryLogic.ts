// src/lib/retryLogic.ts

import { analyzeNetworkError, shouldRetryError, getRetryDelay } from './networkErrors';

// ========================================
// SOLID LSP: Classe d'erreur dédiée
// ========================================

/**
 * Classe d'erreur spécialisée pour les erreurs fetch avec réponse
 * Respecte LSP - hérite proprement d'Error sans modification dynamique
 */
export class FetchErrorWithResponse extends Error {
  constructor(
    message: string,
    // eslint-disable-next-line no-unused-vars
    public readonly response: Response,
  ) {
    super(message);
    this.name = 'FetchErrorWithResponse';

    // Maintenir la pile d'erreurs correcte
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchErrorWithResponse);
    }
  }

  /**
   * Status code de la réponse HTTP
   */
  get status(): number {
    return this.response.status;
  }

  /**
   * Status text de la réponse HTTP
   */
  get statusText(): string {
    return this.response.statusText;
  }

  /**
   * Méthode utilitaire pour vérifier si une erreur est de ce type
   */
  static isFetchErrorWithResponse(error: unknown): error is FetchErrorWithResponse {
    return error instanceof FetchErrorWithResponse;
  }

  /**
   * Crée une instance à partir d'une réponse fetch
   */
  static fromResponse(response: Response, customMessage?: string): FetchErrorWithResponse {
    const message = customMessage || `HTTP ${response.status}: ${response.statusText}`;
    return new FetchErrorWithResponse(message, response);
  }
}

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

      // Extraction de la response si c'est une FetchErrorWithResponse
      if (FetchErrorWithResponse.isFetchErrorWithResponse(error)) {
        response = error.response;
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

    // Si la réponse n'est pas ok, on lance une FetchErrorWithResponse
    if (!response.ok) {
      throw FetchErrorWithResponse.fromResponse(response);
    }

    return response;
  }, config);
}
