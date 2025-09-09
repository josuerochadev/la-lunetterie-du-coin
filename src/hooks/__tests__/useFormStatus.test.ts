import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useFormStatus } from '../useFormStatus';

import type { SubmissionResult } from '../useFormSubmission';
import type { NetworkError } from '@/lib/networkErrors';

// Mock timers
vi.useFakeTimers();

describe('useFormStatus', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useFormStatus());

      expect(result.current.status).toBe('idle');
      expect(result.current.error).toBe('');
      expect(result.current.fieldErrors).toEqual({});
      expect(result.current.networkError).toBeNull();
      expect(result.current.retryCount).toBe(0);
      expect(result.current.messageRef.current).toBeNull();
    });

    it('should provide all required functions', () => {
      const { result } = renderHook(() => useFormStatus());

      expect(typeof result.current.handleSubmissionStart).toBe('function');
      expect(typeof result.current.handleSubmissionResult).toBe('function');
      expect(typeof result.current.clearFieldError).toBe('function');
    });
  });

  describe('handleSubmissionStart', () => {
    it('should set status to sending and clear all errors', () => {
      const { result } = renderHook(() => useFormStatus());

      // Set some initial error state
      act(() => {
        const errorResult: SubmissionResult = {
          success: false,
          error: 'Test error',
          fieldErrors: { name: 'Name error', email: 'Email error' },
          networkError: { type: 'network', message: 'Network error', isRetryable: true } as NetworkError,
          retryCount: 2,
        };
        result.current.handleSubmissionResult(errorResult);
      });

      // Start submission
      act(() => {
        result.current.handleSubmissionStart();
      });

      expect(result.current.status).toBe('sending');
      expect(result.current.error).toBe('');
      expect(result.current.fieldErrors).toEqual({});
      expect(result.current.networkError).toBeNull();
      expect(result.current.retryCount).toBe(0);
    });
  });

  describe('handleSubmissionResult', () => {
    describe('success case', () => {
      it('should set status to success', () => {
        const { result } = renderHook(() => useFormStatus());

        act(() => {
          const successResult: SubmissionResult = { success: true };
          result.current.handleSubmissionResult(successResult);
        });

        expect(result.current.status).toBe('success');
        expect(result.current.error).toBe('');
        expect(result.current.fieldErrors).toEqual({});
        expect(result.current.networkError).toBeNull();
        expect(result.current.retryCount).toBe(0);
      });

      it('should reset to idle after 5 seconds on success', () => {
        const { result } = renderHook(() => useFormStatus());

        act(() => {
          const successResult: SubmissionResult = { success: true };
          result.current.handleSubmissionResult(successResult);
        });

        expect(result.current.status).toBe('success');

        act(() => {
          vi.advanceTimersByTime(5000);
        });

        expect(result.current.status).toBe('idle');
      });
    });

    describe('error cases', () => {
      it('should set status to error with default error message', () => {
        const { result } = renderHook(() => useFormStatus());

        act(() => {
          const errorResult: SubmissionResult = { success: false };
          result.current.handleSubmissionResult(errorResult);
        });

        expect(result.current.status).toBe('error');
        expect(result.current.error).toBe('Une erreur est survenue');
        expect(result.current.fieldErrors).toEqual({});
        expect(result.current.networkError).toBeNull();
        expect(result.current.retryCount).toBe(0);
      });

      it('should set status to error with custom error message', () => {
        const { result } = renderHook(() => useFormStatus());

        act(() => {
          const errorResult: SubmissionResult = {
            success: false,
            error: 'Custom error message',
          };
          result.current.handleSubmissionResult(errorResult);
        });

        expect(result.current.status).toBe('error');
        expect(result.current.error).toBe('Custom error message');
      });

      it('should handle field errors', () => {
        const { result } = renderHook(() => useFormStatus());
        const fieldErrors = { name: 'Name is required', email: 'Invalid email' };

        act(() => {
          const errorResult: SubmissionResult = {
            success: false,
            fieldErrors,
          };
          result.current.handleSubmissionResult(errorResult);
        });

        expect(result.current.fieldErrors).toEqual(fieldErrors);
      });

      it('should handle network errors', () => {
        const { result } = renderHook(() => useFormStatus());
        const networkError: NetworkError = {
          type: 'network',
          message: 'Network connection failed',
          isRetryable: true,
        };

        act(() => {
          const errorResult: SubmissionResult = {
            success: false,
            networkError,
          };
          result.current.handleSubmissionResult(errorResult);
        });

        expect(result.current.networkError).toEqual(networkError);
      });

      it('should handle retry count', () => {
        const { result } = renderHook(() => useFormStatus());

        act(() => {
          const errorResult: SubmissionResult = {
            success: false,
            retryCount: 3,
          };
          result.current.handleSubmissionResult(errorResult);
        });

        expect(result.current.retryCount).toBe(3);
      });

      it('should reset to idle after 8 seconds on error', () => {
        const { result } = renderHook(() => useFormStatus());
        const networkError: NetworkError = {
          type: 'network',
          message: 'Network error',
          isRetryable: true,
        };

        act(() => {
          const errorResult: SubmissionResult = {
            success: false,
            networkError,
          };
          result.current.handleSubmissionResult(errorResult);
        });

        expect(result.current.status).toBe('error');
        expect(result.current.networkError).toEqual(networkError);

        act(() => {
          vi.advanceTimersByTime(8000);
        });

        expect(result.current.status).toBe('idle');
        expect(result.current.networkError).toBeNull();
      });
    });

    describe('accessibility focus', () => {
      it('should focus message ref after submission result', () => {
        const { result } = renderHook(() => useFormStatus());
        const mockFocus = vi.fn();

        // Mock the ref to have a focus method
        Object.defineProperty(result.current.messageRef, 'current', {
          value: { focus: mockFocus },
          writable: true,
        });

        act(() => {
          const successResult: SubmissionResult = { success: true };
          result.current.handleSubmissionResult(successResult);
        });

        act(() => {
          vi.advanceTimersByTime(100);
        });

        expect(mockFocus).toHaveBeenCalledTimes(1);
      });

      it('should not crash if messageRef is null', () => {
        const { result } = renderHook(() => useFormStatus());

        expect(() => {
          act(() => {
            const successResult: SubmissionResult = { success: true };
            result.current.handleSubmissionResult(successResult);
          });

          act(() => {
            vi.advanceTimersByTime(100);
          });
        }).not.toThrow();
      });
    });
  });

  describe('clearFieldError', () => {
    it('should clear specific field error', () => {
      const { result } = renderHook(() => useFormStatus());

      // Set initial field errors
      act(() => {
        const errorResult: SubmissionResult = {
          success: false,
          fieldErrors: { name: 'Name error', email: 'Email error', message: 'Message error' },
        };
        result.current.handleSubmissionResult(errorResult);
      });

      // Clear name error
      act(() => {
        result.current.clearFieldError('name');
      });

      expect(result.current.fieldErrors).toEqual({
        name: undefined,
        email: 'Email error',
        message: 'Message error',
      });
    });

    it('should not affect other fields when clearing one field error', () => {
      const { result } = renderHook(() => useFormStatus());

      act(() => {
        const errorResult: SubmissionResult = {
          success: false,
          fieldErrors: { name: 'Name error', email: 'Email error' },
        };
        result.current.handleSubmissionResult(errorResult);
      });

      act(() => {
        result.current.clearFieldError('name');
      });

      expect(result.current.fieldErrors.email).toBe('Email error');
      expect(result.current.fieldErrors.name).toBeUndefined();
    });

    it('should handle clearing non-existent field error', () => {
      const { result } = renderHook(() => useFormStatus());

      expect(() => {
        act(() => {
          result.current.clearFieldError('name');
        });
      }).not.toThrow();

      expect(result.current.fieldErrors.name).toBeUndefined();
    });
  });

  describe('timer cleanup', () => {
    it('should not cause memory leaks when component unmounts', () => {
      const { result, unmount } = renderHook(() => useFormStatus());

      act(() => {
        const successResult: SubmissionResult = { success: true };
        result.current.handleSubmissionResult(successResult);
      });

      unmount();

      expect(() => {
        vi.advanceTimersByTime(5000);
      }).not.toThrow();
    });
  });
});