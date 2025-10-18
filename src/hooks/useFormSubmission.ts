import type React from 'react';

import { FORMSPREE_ENDPOINT } from '@/config/constants';
import { fetchWithRetry } from '@/lib/retryLogic';
import {
  validateHoneypot,
  createFormRequest,
  handleResponse,
  handleError,
  type SubmissionResult,
  type FormErrors,
} from '@/lib/formSubmissionHelpers';

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
    const formData = new FormData(form);

    // Honeypot spam protection
    if (validateHoneypot(formData)) {
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
        createFormRequest(formData, controller.signal),
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

      clearTimeout(timeoutId);

      const result = await handleResponse(response, retryCount);

      // Reset form only on success
      if (result.success) {
        form.reset();
      }

      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      return handleError(err, retryCount);
    }
  };

  return { submitForm };
}

export type { FormErrors, SubmissionResult };
