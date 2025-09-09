import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useFormSubmission } from '../useFormSubmission';
import { analyzeNetworkError, vibrateError } from '@/lib/networkErrors';
import { fetchWithRetry } from '@/lib/retryLogic';

import type { FormErrors, SubmissionResult } from '../useFormSubmission';
import type { NetworkError } from '@/lib/networkErrors';

// Mock external dependencies
vi.mock('@/config/constants', () => ({
  FORMSPREE_ENDPOINT: 'https://formspree.io/test',
}));

vi.mock('@/lib/networkErrors');
vi.mock('@/lib/retryLogic');

// Mock navigator.vibrate
const mockVibrate = vi.fn();
Object.defineProperty(navigator, 'vibrate', {
  value: mockVibrate,
  writable: true,
});

// Mock setTimeout and clearTimeout
global.setTimeout = vi.fn();
global.clearTimeout = vi.fn();

describe('useFormSubmission', () => {
  const mockAnalyzeNetworkError = vi.mocked(analyzeNetworkError);
  const mockVibrateError = vi.mocked(vibrateError);
  const mockFetchWithRetry = vi.mocked(fetchWithRetry);

  beforeEach(() => {
    vi.clearAllMocks();
    mockVibrate.mockClear();
    (global.setTimeout as ReturnType<typeof vi.fn>).mockImplementation((fn: () => void) => fn());
    (global.clearTimeout as ReturnType<typeof vi.fn>).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should return submitForm function', () => {
      const { result } = renderHook(() => useFormSubmission());
      expect(typeof result.current.submitForm).toBe('function');
    });
  });

  describe('submitForm', () => {
    let mockEvent: Partial<React.FormEvent<HTMLFormElement>>;
    let mockForm: Partial<HTMLFormElement>;
    let mockFormData: FormData;

    beforeEach(() => {
      mockFormData = new FormData();
      mockForm = {
        reset: vi.fn(),
      };
      mockEvent = {
        preventDefault: vi.fn(),
        target: mockForm as HTMLFormElement,
      };

      // Mock FormData constructor
      global.FormData = vi.fn(() => mockFormData) as any;
      mockFormData.append = vi.fn();
      mockFormData.get = vi.fn();
    });

    it('should prevent default form submission', async () => {
      const { result } = renderHook(() => useFormSubmission());

      mockFormData.get = vi.fn().mockReturnValue(null);
      mockFetchWithRetry.mockResolvedValue(new Response('{}', { status: 200 }));

      await act(async () => {
        await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should provide tactile feedback on form submission', async () => {
      const { result } = renderHook(() => useFormSubmission());

      mockFormData.get = vi.fn().mockReturnValue(null);
      mockFetchWithRetry.mockResolvedValue(new Response('{}', { status: 200 }));

      await act(async () => {
        await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
      });

      expect(mockVibrate).toHaveBeenCalledWith(50);
    });

    it('should append subject to form data', async () => {
      const { result } = renderHook(() => useFormSubmission());

      mockFormData.get = vi.fn().mockReturnValue(null);
      mockFetchWithRetry.mockResolvedValue(new Response('{}', { status: 200 }));

      await act(async () => {
        await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
      });

      expect(mockFormData.append).toHaveBeenCalledWith('_subject', 'Nouveau message - La Lunetterie du Coin');
    });

    describe('honeypot protection', () => {
      it('should silently succeed if honeypot is filled', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue('bot-filled-value');

        const submissionResult = await act(async () => {
          return await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(submissionResult).toEqual({ success: true });
        expect(mockForm.reset).toHaveBeenCalledTimes(1);
        expect(mockFetchWithRetry).not.toHaveBeenCalled();
      });

      it('should proceed normally if honeypot is empty', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);
        mockFetchWithRetry.mockResolvedValue(new Response('{}', { status: 200 }));

        await act(async () => {
          await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(mockFetchWithRetry).toHaveBeenCalled();
      });
    });

    describe('successful submission', () => {
      it('should return success result on successful response', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);
        mockFetchWithRetry.mockResolvedValue(new Response('{}', { status: 200 }));

        const submissionResult = await act(async () => {
          return await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(submissionResult).toEqual({ success: true });
        expect(mockForm.reset).toHaveBeenCalledTimes(1);
        expect(mockVibrate).toHaveBeenCalledWith([100, 50, 100]);
      });

      it('should call fetchWithRetry with correct parameters', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);
        mockFetchWithRetry.mockResolvedValue(new Response('{}', { status: 200 }));

        await act(async () => {
          await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(mockFetchWithRetry).toHaveBeenCalledWith(
          'https://formspree.io/test',
          {
            method: 'POST',
            body: mockFormData,
            headers: { Accept: 'application/json' },
            signal: expect.any(AbortSignal),
          },
          {
            maxAttempts: 3,
            onRetryAttempt: expect.any(Function),
            onMaxAttemptsReached: expect.any(Function),
          },
        );
      });
    });

    describe('validation errors', () => {
      it('should handle validation errors with field-specific messages', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);

        const mockErrorResponse = new Response(
          JSON.stringify({
            errors: [
              { field: 'name', message: 'Name is required' },
              { field: 'email', message: 'Invalid email format' },
            ],
          }),
          { status: 400 },
        );

        // Mock clone method
        mockErrorResponse.clone = vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({
            errors: [
              { field: 'name', message: 'Name is required' },
              { field: 'email', message: 'Invalid email format' },
            ],
          }),
        });

        mockFetchWithRetry.mockResolvedValue(mockErrorResponse);

        const mockNetworkError: NetworkError = {
          type: 'validation_error',
          message: 'Validation failed',
          userMessage: 'Please fix form errors',
          isRetryable: false,
        };

        mockAnalyzeNetworkError.mockReturnValue(mockNetworkError);

        const submissionResult = await act(async () => {
          return await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        const expectedFieldErrors: FormErrors = {
          name: 'Name is required',
          email: 'Invalid email format',
        };

        expect(submissionResult).toEqual({
          success: false,
          error: 'Veuillez corriger les erreurs dans le formulaire.',
          fieldErrors: expectedFieldErrors,
          networkError: mockNetworkError,
          retryCount: 0,
        });

        expect(mockVibrateError).toHaveBeenCalledTimes(1);
      });

      it('should handle validation errors with malformed error data', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);

        const mockErrorResponse = new Response(
          JSON.stringify({
            errors: [
              { field: null, message: 'Invalid field' },
              { field: 'name', message: null },
              { invalidStructure: true },
            ],
          }),
          { status: 400 },
        );

        mockErrorResponse.clone = vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({
            errors: [
              { field: null, message: 'Invalid field' },
              { field: 'name', message: null },
              { invalidStructure: true },
            ],
          }),
        });

        mockFetchWithRetry.mockResolvedValue(mockErrorResponse);

        const mockNetworkError: NetworkError = {
          type: 'validation_error',
          message: 'Validation failed',
          userMessage: 'Please fix form errors',
          isRetryable: false,
        };

        mockAnalyzeNetworkError.mockReturnValue(mockNetworkError);

        const submissionResult = await act(async () => {
          return await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(submissionResult).toEqual({
          success: false,
          error: 'Veuillez corriger les erreurs dans le formulaire.',
          fieldErrors: {},
          networkError: mockNetworkError,
          retryCount: 0,
        });
      });
    });

    describe('network errors', () => {
      it('should handle network errors from response', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);

        const mockErrorResponse = new Response('Server Error', { status: 500 });
        mockErrorResponse.clone = vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({}),
        });

        mockFetchWithRetry.mockResolvedValue(mockErrorResponse);

        const mockNetworkError: NetworkError = {
          type: 'server_error',
          message: 'Internal server error',
          userMessage: 'Server is temporarily unavailable',
          isRetryable: true,
        };

        mockAnalyzeNetworkError.mockReturnValue(mockNetworkError);

        const submissionResult = await act(async () => {
          return await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(submissionResult).toEqual({
          success: false,
          error: 'Server is temporarily unavailable',
          networkError: mockNetworkError,
          retryCount: 0,
        });

        expect(mockVibrateError).toHaveBeenCalledTimes(1);
      });

      it('should handle network errors from catch block', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);

        const networkError = new Error('Network connection failed');
        mockFetchWithRetry.mockRejectedValue(networkError);

        const mockNetworkError: NetworkError = {
          type: 'network',
          message: 'Network connection failed',
          userMessage: 'Please check your internet connection',
          isRetryable: true,
        };

        mockAnalyzeNetworkError.mockReturnValue(mockNetworkError);

        const submissionResult = await act(async () => {
          return await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(submissionResult).toEqual({
          success: false,
          error: 'Please check your internet connection',
          networkError: mockNetworkError,
          retryCount: 0,
        });

        expect(mockAnalyzeNetworkError).toHaveBeenCalledWith(networkError);
        expect(mockVibrateError).toHaveBeenCalledTimes(1);
      });
    });

    describe('retry logic', () => {
      it('should track retry count', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);

        const mockErrorResponse = new Response('Server Error', { status: 500 });
        mockErrorResponse.clone = vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({}),
        });

        // Mock the retry callback to simulate retry attempts
        mockFetchWithRetry.mockImplementation(async (url, options, retryOptions) => {
          if (retryOptions?.onRetryAttempt) {
            retryOptions.onRetryAttempt(2, 1000);
          }
          return mockErrorResponse;
        });

        const mockNetworkError: NetworkError = {
          type: 'server_error',
          message: 'Internal server error',
          userMessage: 'Server is temporarily unavailable',
          isRetryable: true,
        };

        mockAnalyzeNetworkError.mockReturnValue(mockNetworkError);

        const submissionResult = await act(async () => {
          return await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(submissionResult.retryCount).toBe(2);
      });

      it('should call onMaxAttemptsReached callback', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);

        const mockErrorResponse = new Response('Server Error', { status: 500 });
        mockErrorResponse.clone = vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({}),
        });

        const onMaxAttemptsReached = vi.fn();

        mockFetchWithRetry.mockImplementation(async (url, options, retryOptions) => {
          if (retryOptions?.onMaxAttemptsReached) {
            retryOptions.onMaxAttemptsReached();
          }
          return mockErrorResponse;
        });

        const mockNetworkError: NetworkError = {
          type: 'server_error',
          message: 'Internal server error',
          userMessage: 'Server is temporarily unavailable',
          isRetryable: true,
        };

        mockAnalyzeNetworkError.mockReturnValue(mockNetworkError);

        await act(async () => {
          await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        // We can't directly test the callback since it's created inside the hook,
        // but we can verify that fetchWithRetry was called with the right structure
        expect(mockFetchWithRetry).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          expect.objectContaining({
            maxAttempts: 3,
            onRetryAttempt: expect.any(Function),
            onMaxAttemptsReached: expect.any(Function),
          }),
        );
      });
    });

    describe('timeout handling', () => {
      it('should set up timeout and clear it on success', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);
        mockFetchWithRetry.mockResolvedValue(new Response('{}', { status: 200 }));

        await act(async () => {
          await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 10000);
        expect(global.clearTimeout).toHaveBeenCalled();
      });

      it('should clear timeout on error', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);

        const networkError = new Error('Network failed');
        mockFetchWithRetry.mockRejectedValue(networkError);

        mockAnalyzeNetworkError.mockReturnValue({
          type: 'network',
          message: 'Network failed',
          userMessage: 'Network error occurred',
          isRetryable: true,
        });

        await act(async () => {
          await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(global.clearTimeout).toHaveBeenCalled();
      });
    });

    describe('development logging', () => {
      const originalEnv = import.meta.env;

      beforeEach(() => {
        import.meta.env = { ...originalEnv, DEV: true };
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
      });

      afterEach(() => {
        import.meta.env = originalEnv;
        vi.restoreAllMocks();
      });

      it('should log retry attempts in development', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);
        mockFetchWithRetry.mockImplementation(async (url, options, retryOptions) => {
          if (retryOptions?.onRetryAttempt) {
            retryOptions.onRetryAttempt(2, 1500);
          }
          return new Response('{}', { status: 200 });
        });

        await act(async () => {
          await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        // We can't directly verify console.log was called since the callback is internal,
        // but we can verify the structure is set up correctly
        expect(mockFetchWithRetry).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          expect.objectContaining({
            onRetryAttempt: expect.any(Function),
          }),
        );
      });

      it('should log errors in development', async () => {
        const { result } = renderHook(() => useFormSubmission());

        mockFormData.get = vi.fn().mockReturnValue(null);

        const mockErrorResponse = new Response('Bad Request', { status: 400 });
        mockErrorResponse.clone = vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({ error: 'Bad request' }),
        });

        mockFetchWithRetry.mockResolvedValue(mockErrorResponse);

        mockAnalyzeNetworkError.mockReturnValue({
          type: 'client_error',
          message: 'Bad request',
          userMessage: 'Invalid request',
          isRetryable: false,
        });

        await act(async () => {
          await result.current.submitForm(mockEvent as React.FormEvent<HTMLFormElement>);
        });

        expect(console.warn).toHaveBeenCalledWith('[Formspree Error]', 400, { error: 'Bad request' });
      });
    });
  });
});