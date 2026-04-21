import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { TIMING } from '@/config/design';
import type { NetworkError } from '@/lib/networkErrors';
import type { FormErrors, SubmissionResult } from '@/types/forms';

/**
 * Hook gérant l'état complet d'une soumission de formulaire :
 * statut (idle → sending → success/error → idle), erreurs par champ,
 * erreurs réseau, compteur de retry, et focus accessible post-soumission.
 *
 * Les messages de succès/erreur se réinitialisent automatiquement
 * après un délai configurable (voir `TIMING` dans `config/design`).
 */

type FormSubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

interface UseFormStatusReturn {
  /** État courant de la soumission. */
  status: FormSubmissionStatus;
  /** Message d'erreur global. */
  error: string;
  /** Erreurs de validation par champ. */
  fieldErrors: FormErrors;
  /** Détails de l'erreur réseau (null si pas d'erreur réseau). */
  networkError: NetworkError | null;
  /** Nombre de tentatives effectuées. */
  retryCount: number;
  /** Ref vers le message de statut pour focus a11y. */
  messageRef: React.RefObject<HTMLDivElement | null>;
  /** Réinitialise l'état avant une nouvelle soumission. */
  handleSubmissionStart: () => void;
  handleSubmissionResult: (result: SubmissionResult) => void;
  clearFieldError: (field: keyof FormErrors) => void;
}

export function useFormStatus(): UseFormStatusReturn {
  const [status, setStatus] = useState<FormSubmissionStatus>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [networkError, setNetworkError] = useState<NetworkError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const messageRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all pending timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
  }, []);

  const handleSubmissionStart = useCallback(() => {
    // Clear any pending reset timers from a previous submission
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setStatus('sending');
    setError('');
    setFieldErrors({});
    setNetworkError(null);
    setRetryCount(0);
  }, []);

  const handleSubmissionResult = useCallback(
    (result: SubmissionResult) => {
      if (result.success) {
        setStatus('success');
        scheduleTimeout(() => {
          setStatus('idle');
        }, TIMING.formSuccessReset);
      } else {
        setStatus('error');
        setError(result.error || 'Une erreur est survenue');
        setFieldErrors(result.fieldErrors || {});
        setNetworkError(result.networkError || null);
        setRetryCount(result.retryCount || 0);

        scheduleTimeout(() => {
          setStatus('idle');
          setNetworkError(null);
        }, TIMING.formErrorReset);
      }

      // Focus message for accessibility
      scheduleTimeout(() => {
        messageRef.current?.focus();
      }, TIMING.formFocusDelay);
    },
    [scheduleTimeout],
  );

  const clearFieldError = useCallback((field: keyof FormErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  return {
    status,
    error,
    fieldErrors,
    networkError,
    retryCount,
    messageRef,
    handleSubmissionStart,
    handleSubmissionResult,
    clearFieldError,
  };
}

export type { FormSubmissionStatus };
