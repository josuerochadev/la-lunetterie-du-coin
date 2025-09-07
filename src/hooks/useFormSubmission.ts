import type React from 'react';

import { FORMSPREE_ENDPOINT } from '@/config/constants';
import { analyzeNetworkError, vibrateError, type NetworkError } from '@/lib/networkErrors';
import { fetchWithRetry } from '@/lib/retryLogic';

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

interface SubmissionResult {
  success: boolean;
  error?: string;
  fieldErrors?: FormErrors;
  networkError?: NetworkError;
  retryCount?: number;
}

interface UseFormSubmissionReturn {
  // eslint-disable-next-line no-unused-vars
  submitForm: (e: React.FormEvent<HTMLFormElement>) => Promise<SubmissionResult>;
}

export function useFormSubmission(): UseFormSubmissionReturn {
   
  const submitForm = async (e: React.FormEvent<HTMLFormElement>): Promise<SubmissionResult> => {
    e.preventDefault();

    // Tactile feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    // Force readable subject for client-side
    data.append('_subject', 'Nouveau message - La Lunetterie du Coin');

    // Honeypot spam protection
    const honeypot = data.get('_gotcha');
    if (honeypot) {
      // Silently fail if honeypot is filled (bot detected)
      form.reset();
      return { success: true };
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let retryCount = 0;

    try {
      const response = await fetchWithRetry(
        FORMSPREE_ENDPOINT,
        {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        },
        {
          maxAttempts: 3,
          onRetryAttempt: (attemptNumber, delay) => {
            retryCount = attemptNumber;
            if (import.meta.env.DEV) {
              console.log(`Retry attempt ${attemptNumber} in ${delay}ms`);
            }
          },
          onMaxAttemptsReached: () => {
            if (import.meta.env.DEV) {
              console.log('Max retry attempts reached');
            }
          },
        },
      );

      // Add debug logs to diagnose dashboard vs. code issues
      let payload: unknown = null;
      try {
        payload = await response.clone().json();
      } catch {
        // no-op
      }

      if (!response.ok && import.meta.env.DEV) {
        console.warn('[Formspree Error]', response.status, payload);
      }

      clearTimeout(timeoutId);

      if (response.ok) {
        form.reset();
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]); // Success pattern
        }
        return { success: true };
      } else {
        // Analyse granulaire de l'erreur
        const errorInfo = analyzeNetworkError(null, response);

        // Try to get specific errors from response for validation errors
        if (errorInfo.type === 'validation_error') {
          try {
            const errorData = await response.json();
            if (errorData.errors) {
              const newFieldErrors: FormErrors = {};
              for (const err of errorData.errors) {
                if (err?.field && err?.message && typeof err.field === 'string') {
                  newFieldErrors[err.field as keyof FormErrors] = err.message;
                }
              }
              vibrateError();
              return {
                success: false,
                error: 'Veuillez corriger les erreurs dans le formulaire.',
                fieldErrors: newFieldErrors,
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
    } catch (err) {
      clearTimeout(timeoutId);

      // Analyse granulaire de l'erreur catch
      const errorInfo = analyzeNetworkError(err);
      vibrateError();

      return {
        success: false,
        error: errorInfo.userMessage,
        networkError: errorInfo,
        retryCount,
      };
    }
  };

  return { submitForm };
}

export type { FormErrors, SubmissionResult };