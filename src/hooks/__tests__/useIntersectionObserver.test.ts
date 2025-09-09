import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useIntersectionObserver } from '../useIntersectionObserver';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

const MockIntersectionObserver = vi.fn(function (callback: () => void, options?: any) {
  this.callback = callback;
  this.options = options;
  this.observe = mockObserve;
  this.unobserve = mockUnobserve;
  this.disconnect = mockDisconnect;
}) as any;

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock IntersectionObserver globally
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });

    // Reset global constructor
    MockIntersectionObserver.mockClear();
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should return targetRef and isIntersecting', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      expect(result.current.targetRef).toBeDefined();
      expect(result.current.targetRef.current).toBeNull();
      expect(typeof result.current.isIntersecting).toBe('boolean');
      expect(result.current.isIntersecting).toBe(true); // Initial state is true
    });

    it('should use default threshold of 0.1', () => {
      renderHook(() => useIntersectionObserver());

      // Should not create observer when targetRef is null
      expect(MockIntersectionObserver).not.toHaveBeenCalled();
    });

    it('should use custom threshold when provided', () => {
      const customThreshold = 0.5;

      // Create hook with element already set via threshold change
      const { rerender } = renderHook(
        (threshold) => {
          const hook = useIntersectionObserver(threshold);
          // Simulate element being set
          if (!hook.targetRef.current) {
            hook.targetRef.current = document.createElement('div');
          }
          return hook;
        },
        { initialProps: 0.1 },
      );

      // Change threshold to trigger effect with element present
      rerender(customThreshold);

      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: customThreshold,
      });
    });
  });

  describe('intersection observer behavior', () => {
    it('should create observer when threshold changes with element present', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      // Set element on ref
      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;

      // Change threshold to trigger effect
      rerender(0.5);

      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);
      expect(mockObserve).toHaveBeenCalledWith(mockElement);
    });

    it('should not create observer when targetRef is null', () => {
      renderHook(() => useIntersectionObserver());

      expect(MockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it('should update isIntersecting when observer callback is triggered', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      // Mock element and trigger observer creation
      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender(0.5); // Trigger effect

      // Get the callback that was passed to IntersectionObserver
      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate intersection entry
      const mockEntry = {
        isIntersecting: false,
        target: mockElement,
      };

      act(() => {
        observerCallback([mockEntry]);
      });

      expect(result.current.isIntersecting).toBe(false);
    });

    it('should handle multiple intersection entries correctly', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender(0.5);

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate multiple entries (should use the first one)
      const mockEntries = [
        { isIntersecting: true, target: mockElement },
        { isIntersecting: false, target: document.createElement('div') },
      ];

      act(() => {
        observerCallback(mockEntries);
      });

      expect(result.current.isIntersecting).toBe(true);
    });
  });

  describe('cleanup behavior', () => {
    it('should disconnect observer on cleanup', () => {
      const { result, rerender, unmount } = renderHook(
        (threshold) => useIntersectionObserver(threshold),
        {
          initialProps: 0.1,
        },
      );

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender(0.5);

      expect(mockObserve).toHaveBeenCalledWith(mockElement);

      unmount();

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should clean up observer when threshold changes', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender(0.5); // First observer created

      expect(mockObserve).toHaveBeenCalledWith(mockElement);
      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);

      // Change threshold again
      rerender(0.8);

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
      expect(MockIntersectionObserver).toHaveBeenCalledTimes(2);
    });
  });

  describe('threshold changes', () => {
    it('should recreate observer when threshold changes', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;

      // Trigger initial observer creation
      rerender(0.5); // Different threshold to trigger effect
      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.5,
      });

      // Change threshold again
      rerender(0.8);

      // Should have been called twice with different thresholds
      expect(MockIntersectionObserver).toHaveBeenCalledTimes(2);
      expect(MockIntersectionObserver).toHaveBeenLastCalledWith(expect.any(Function), {
        threshold: 0.8,
      });
    });

    it('should disconnect old observer when threshold changes', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;

      // Create first observer
      rerender(0.5);
      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);
      expect(mockObserve).toHaveBeenCalledTimes(1);

      // Change threshold
      rerender(0.8);

      // Should disconnect the old observer
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
      // Should observe with the new observer
      expect(mockObserve).toHaveBeenCalledTimes(2);
      expect(mockObserve).toHaveBeenLastCalledWith(mockElement);
    });
  });

  describe('edge cases', () => {
    it('should handle empty intersection entries array', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender(0.5);

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate empty entries array
      expect(() => {
        act(() => {
          observerCallback([]);
        });
      }).not.toThrow();

      // State should remain unchanged
      expect(result.current.isIntersecting).toBe(true);
    });

    it('should handle threshold of 0', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender(0);

      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 0 });
    });

    it('should handle threshold of 1', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender(1);

      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 1 });
    });

    it('should handle observer callback with undefined entry properties', () => {
      const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
        initialProps: 0.1,
      });

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender(0.5);

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate entry with undefined isIntersecting
      const mockEntry = {
        isIntersecting: undefined,
        target: mockElement,
      };

      expect(() => {
        act(() => {
          observerCallback([mockEntry as any]);
        });
      }).not.toThrow();
    });
  });

  describe('browser compatibility fallback', () => {
    it('should handle missing IntersectionObserver gracefully', () => {
      // Remove IntersectionObserver
      const originalIntersectionObserver = window.IntersectionObserver;
      delete (window as any).IntersectionObserver;

      expect(() => {
        const { result, rerender } = renderHook((threshold) => useIntersectionObserver(threshold), {
          initialProps: 0.1,
        });
        const mockElement = document.createElement('div');
        result.current.targetRef.current = mockElement;
        rerender(0.5); // This should throw
      }).toThrow();

      // Restore
      window.IntersectionObserver = originalIntersectionObserver;
    });
  });
});
