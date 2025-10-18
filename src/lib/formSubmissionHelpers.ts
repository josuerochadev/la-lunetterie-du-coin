// src/lib/formSubmissionHelpers.ts

import { analyzeNetworkError, vibrateError, type NetworkError } from '@/lib/networkErrors';

export type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export interface SubmissionResult {
  success: boolean;
  error?: string;
  fieldErrors?: FormErrors;
  networkError?: NetworkError;
  retryCount?: number;
}

/**
 * Validates honeypot field to detect bots
 * @param formData - Form data to validate
 * @returns true if honeypot is filled (bot detected), false otherwise
 */
export function validateHoneypot(formData: FormData): boolean {
  const honeypot = formData.get('_gotcha');
  return !!honeypot;
}

/**
 * Creates a configured fetch request for form submission
 * @param formData - Form data to submit
 * @param signal - AbortSignal for request cancellation
 * @returns RequestInit configuration object
 */
export function createFormRequest(formData: FormData, signal: AbortSignal): globalThis.RequestInit {
  // Ensure subject is set for email notification
  if (!formData.has('_subject')) {
    formData.append('_subject', 'Nouveau message - La Lunetterie du Coin');
  }

  return {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
    signal,
  };
}

/**
 * Handles successful or failed HTTP response
 * @param response - Fetch Response object
 * @param retryCount - Number of retry attempts made
 * @returns Promise<SubmissionResult>
 */
export async function handleResponse(
  response: Response,
  retryCount: number,
): Promise<SubmissionResult> {
  // Debug logging in development
  if (!response.ok && import.meta.env.DEV) {
    let payload: unknown = null;
    try {
      payload = await response.clone().json();
    } catch {
      // no-op
    }
    console.warn('[Formspree Error]', response.status, payload);
  }

  if (response.ok) {
    // Success: vibrate success pattern
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    return { success: true };
  }

  // Error: analyze and return detailed error info
  const errorInfo = analyzeNetworkError(null, response);

  // Handle validation errors specifically (422 Unprocessable Entity)
  if (errorInfo.type === 'validation_error' || response.status === 422) {
    try {
      const errorData = await response.json();
      if (errorData.errors) {
        const fieldErrors: FormErrors = {};
        for (const err of errorData.errors) {
          if (err?.field && err?.message && typeof err.field === 'string') {
            fieldErrors[err.field as keyof FormErrors] = err.message;
          }
        }
        vibrateError();
        return {
          success: false,
          error: 'Veuillez corriger les erreurs dans le formulaire.',
          fieldErrors,
          networkError: errorInfo,
          retryCount,
        };
      }
    } catch {
      // Fallback to generic error
    }
  }

  vibrateError();
  return {
    success: false,
    error: errorInfo.userMessage,
    networkError: errorInfo,
    retryCount,
  };
}

/**
 * Handles fetch errors (network failures, timeouts, etc.)
 * @param error - Error object caught during fetch
 * @param retryCount - Number of retry attempts made
 * @returns SubmissionResult
 */
export function handleError(error: unknown, retryCount: number): SubmissionResult {
  const errorInfo = analyzeNetworkError(error);
  vibrateError();

  return {
    success: false,
    error: errorInfo.userMessage,
    networkError: errorInfo,
    retryCount,
  };
}
