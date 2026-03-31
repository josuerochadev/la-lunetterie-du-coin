import type { NetworkError } from '@/lib/networkErrors';

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
