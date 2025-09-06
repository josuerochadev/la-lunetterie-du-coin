// src/lib/retryLogic.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { withRetry, fetchWithRetry } from './retryLogic';

// Mock networkErrors module
vi.mock('./networkErrors', () => ({
  analyzeNetworkError: vi.fn().mockReturnValue({
    type: 'network_error',
    canRetry: true,
  }),
  shouldRetryError: vi.fn().mockReturnValue(true),
  getRetryDelay: vi.fn().mockImplementation((attempt) => attempt * 100), // Fast delays for tests
}));

describe('retryLogic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');

      const result = await withRetry(mockFn, { maxAttempts: 3 });

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValue('success');

      const onRetryAttempt = vi.fn();
      const onMaxAttemptsReached = vi.fn();

      const promise = withRetry(mockFn, { 
        maxAttempts: 3,
        onRetryAttempt,
        onMaxAttemptsReached 
      });

      // Advance timers to handle delays
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(onRetryAttempt).toHaveBeenCalledWith(1, 100);
      expect(onMaxAttemptsReached).not.toHaveBeenCalled();
    });


    it('should not retry when shouldRetryError returns false', async () => {
      const { shouldRetryError } = await import('./networkErrors');
      vi.mocked(shouldRetryError).mockReturnValueOnce(false);

      const mockFn = vi.fn().mockRejectedValue(new Error('Non-retryable error'));

      await expect(withRetry(mockFn, { maxAttempts: 3 })).rejects.toThrow('Non-retryable error');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchWithRetry', () => {
    beforeEach(() => {
      // @ts-expect-error - Mocking global fetch for tests
      // eslint-disable-next-line no-undef
      global.fetch = vi.fn();
    });

    it('should succeed with ok response', async () => {
      const mockResponse = { ok: true, status: 200 };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const result = await fetchWithRetry('https://api.example.com', {});

      expect(result).toBe(mockResponse);
      expect(fetch).toHaveBeenCalledWith('https://api.example.com', {});
    });

    it('should throw error with response for non-ok status', async () => {
      const mockResponse = { ok: false, status: 404, statusText: 'Not Found' };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      const promise = fetchWithRetry('https://api.example.com', {}, { maxAttempts: 1 });

      await expect(promise).rejects.toThrow('HTTP 404: Not Found');
    });

    it('should retry on network failure', async () => {
      vi.mocked(fetch)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ ok: true, status: 200 } as Response);

      // Reset shouldRetryError to return true for this test
      const { shouldRetryError } = await import('./networkErrors');
      vi.mocked(shouldRetryError).mockReturnValue(true);

      const promise = fetchWithRetry('https://api.example.com', {}, { maxAttempts: 2 });
      
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toEqual({ ok: true, status: 200 });
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should attach response to error for failed responses', async () => {
      const mockResponse = { ok: false, status: 500, statusText: 'Server Error' };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      try {
        await fetchWithRetry('https://api.example.com', {}, { maxAttempts: 1 });
      } catch (error: any) {
        expect(error.response).toBe(mockResponse);
        expect(error.message).toBe('HTTP 500: Server Error');
      }
    });
  });
});