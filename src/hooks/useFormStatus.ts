import type React from 'react';
import { useRef, useState } from 'react';

import type { FormErrors, SubmissionResult } from './useFormSubmission';

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

  const handleSubmissionStart = () => {
    setStatus('sending');
    setError('');
    setFieldErrors({});
    setNetworkError(null);
    setRetryCount(0);
  };

  const handleSubmissionResult = (result: SubmissionResult) => {
    if (result.success) {
      setStatus('success');
      // Reset status after showing success message for 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } else {
      setStatus('error');
      setError(result.error || 'Une erreur est survenue');
      setFieldErrors(result.fieldErrors || {});
      setNetworkError(result.networkError || null);
      setRetryCount(result.retryCount || 0);

      // Reset status after showing error for 8 seconds
      setTimeout(() => {
        setStatus('idle');
        setNetworkError(null);
      }, 8000);
    }

    // Focus message for accessibility
    setTimeout(() => {
      messageRef.current?.focus();
    }, 100);
  };

  const clearFieldError = (field: keyof FormErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

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
