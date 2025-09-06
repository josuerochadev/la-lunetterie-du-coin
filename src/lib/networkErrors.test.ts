// src/lib/networkErrors.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { 
  analyzeNetworkError, 
  shouldRetryError, 
  getRetryDelay,
  vibrateError 
} from './networkErrors';

describe('networkErrors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset navigator.onLine to true before each test
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  describe('analyzeNetworkError', () => {
    it('should detect offline status', () => {
      // Mock navigator.onLine
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const error = analyzeNetworkError(new Error('Network error'));
      
      expect(error.type).toBe('offline');
      expect(error.canRetry).toBe(true);
      expect(error.userMessage).toContain('hors ligne');
    });

    it('should detect timeout errors', () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'AbortError';

      const error = analyzeNetworkError(timeoutError);
      
      expect(error.type).toBe('timeout');
      expect(error.canRetry).toBe(true);
      expect(error.userMessage).toContain('temps');
    });

    it('should detect validation errors (400)', () => {
      const mockResponse = { status: 400 } as Response;
      const error = analyzeNetworkError(null, mockResponse);
      
      expect(error.type).toBe('validation_error');
      expect(error.canRetry).toBe(false);
      expect(error.statusCode).toBe(400);
    });

    it('should detect rate limiting (429)', () => {
      const mockResponse = { status: 429 } as Response;
      const error = analyzeNetworkError(null, mockResponse);
      
      expect(error.type).toBe('rate_limited');
      expect(error.canRetry).toBe(true);
      expect(error.statusCode).toBe(429);
    });

    it('should detect server errors (500)', () => {
      const mockResponse = { status: 500 } as Response;
      const error = analyzeNetworkError(null, mockResponse);
      
      expect(error.type).toBe('server_error');
      expect(error.canRetry).toBe(true);
      expect(error.statusCode).toBe(500);
    });

    it('should detect network errors (TypeError)', () => {
      const networkError = new TypeError('Network request failed');
      const error = analyzeNetworkError(networkError);
      
      expect(error.type).toBe('network_error');
      expect(error.canRetry).toBe(true);
      expect(error.userMessage).toContain('connexion réseau');
    });
  });

  describe('shouldRetryError', () => {
    it('should retry for retryable errors', () => {
      expect(shouldRetryError({ type: 'timeout', canRetry: true } as any)).toBe(true);
      expect(shouldRetryError({ type: 'server_error', canRetry: true } as any)).toBe(true);
      expect(shouldRetryError({ type: 'network_error', canRetry: true } as any)).toBe(true);
      expect(shouldRetryError({ type: 'rate_limited', canRetry: true } as any)).toBe(true);
    });

    it('should not retry for non-retryable errors', () => {
      expect(shouldRetryError({ type: 'validation_error', canRetry: false } as any)).toBe(false);
      expect(shouldRetryError({ type: 'client_error', canRetry: false } as any)).toBe(false);
    });

    it('should not retry when canRetry is false', () => {
      expect(shouldRetryError({ type: 'timeout', canRetry: false } as any)).toBe(false);
    });
  });

  describe('getRetryDelay', () => {
    it('should use exponential backoff', () => {
      expect(getRetryDelay(1)).toBe(1000);  // 1s
      expect(getRetryDelay(2)).toBe(2000);  // 2s
      expect(getRetryDelay(3)).toBe(4000);  // 4s
      expect(getRetryDelay(4)).toBe(8000);  // 8s (max)
    });

    it('should cap at maximum delay', () => {
      expect(getRetryDelay(5)).toBe(8000);  // Still 8s max
      expect(getRetryDelay(10)).toBe(8000); // Still 8s max
    });
  });

  describe('vibrateError', () => {
    it('should call navigator.vibrate with error pattern', () => {
      const mockVibrate = vi.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: mockVibrate,
      });

      vibrateError();

      expect(mockVibrate).toHaveBeenCalledWith([200, 50, 200]);
    });

    it('should handle missing vibrate API', () => {
      // Mock navigator without vibrate
      Object.defineProperty(navigator, 'vibrate', {
        value: undefined,
        writable: true,
      });
      
      // Should not throw
      expect(() => vibrateError()).not.toThrow();
    });
  });
});