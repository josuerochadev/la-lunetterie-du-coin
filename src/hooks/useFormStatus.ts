import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { FormErrors, SubmissionResult } from './useFormSubmission';

import { TIMING } from '@/config/design';
import type { NetworkError } from '@/lib/networkErrors';

type FormSubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

interface UseFormStatusReturn {
  status: FormSubmissionStatus;
  error: string;
  fieldErrors: FormErrors;
  networkError: NetworkError | null;
  retryCount: number;
  messageRef: React.RefObject<HTMLDivElement | null>;
  handleSubmissionStart: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSubmissionResult: (result: SubmissionResult) => void;
  // eslint-disable-next-line no-unused-vars
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
