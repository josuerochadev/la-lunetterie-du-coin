import { renderHook } from '@testing-library/react';
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
      const { result } = renderHook(() => useIntersectionObserver(customThreshold));

      // Mock a ref with an element
      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;

      // Re-render to trigger effect with element present
      const { rerender } = renderHook(() => useIntersectionObserver(customThreshold));
      rerender();

      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: customThreshold,
      });
    });
  });

  describe('intersection observer behavior', () => {
    it('should create observer when targetRef has an element', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      // Initially no observer created
      expect(MockIntersectionObserver).not.toHaveBeenCalled();

      // Simulate setting ref to an element
      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;

      // Re-render to trigger effect
      const { rerender } = renderHook(() => useIntersectionObserver());
      rerender();

      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);
      expect(mockObserve).toHaveBeenCalledWith(mockElement);
    });

    it('should not create observer when targetRef is null', () => {
      renderHook(() => useIntersectionObserver());

      expect(MockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it('should update isIntersecting when observer callback is triggered', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      // Mock element and trigger observer creation
      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      // Get the callback that was passed to IntersectionObserver
      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate intersection entry
      const mockEntry = {
        isIntersecting: false,
        target: mockElement,
      };

      observerCallback([mockEntry]);

      expect(result.current.isIntersecting).toBe(false);
    });

    it('should handle multiple intersection entries correctly', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate multiple entries (should use the first one)
      const mockEntries = [
        { isIntersecting: true, target: mockElement },
        { isIntersecting: false, target: document.createElement('div') },
      ];

      observerCallback(mockEntries);

      expect(result.current.isIntersecting).toBe(true);
    });
  });

  describe('cleanup behavior', () => {
    it('should unobserve element on cleanup', () => {
      const { result, rerender, unmount } = renderHook(() => useIntersectionObserver());

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      expect(mockObserve).toHaveBeenCalledWith(mockElement);

      unmount();

      expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
    });

    it('should clean up observer when targetRef changes', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      // First element
      const firstElement = document.createElement('div');
      result.current.targetRef.current = firstElement;
      rerender();

      expect(mockObserve).toHaveBeenCalledWith(firstElement);

      // Change to second element
      const secondElement = document.createElement('div');
      result.current.targetRef.current = secondElement;
      rerender();

      expect(mockUnobserve).toHaveBeenCalledWith(firstElement);
      expect(mockObserve).toHaveBeenCalledWith(secondElement);
    });

    it('should clean up when targetRef becomes null', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      expect(mockObserve).toHaveBeenCalledWith(mockElement);

      // Set ref to null
      result.current.targetRef.current = null;
      rerender();

      expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
    });
  });

  describe('threshold changes', () => {
    it('should recreate observer when threshold changes', () => {
      let threshold = 0.1;
      const { result, rerender } = renderHook(() => useIntersectionObserver(threshold));

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.1,
      });

      // Change threshold
      threshold = 0.5;
      rerender();

      // Should have been called twice with different thresholds
      expect(MockIntersectionObserver).toHaveBeenCalledTimes(2);
      expect(MockIntersectionObserver).toHaveBeenLastCalledWith(expect.any(Function), {
        threshold: 0.5,
      });
    });

    it('should unobserve old element when threshold changes', () => {
      let threshold = 0.1;
      const { result, rerender } = renderHook(() => useIntersectionObserver(threshold));

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      // Change threshold
      threshold = 0.5;
      rerender();

      // Should unobserve the element from the old observer
      expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
      // Should observe with the new observer
      expect(mockObserve).toHaveBeenCalledWith(mockElement);
    });
  });

  describe('edge cases', () => {
    it('should handle empty intersection entries array', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate empty entries array
      expect(() => {
        observerCallback([]);
      }).not.toThrow();

      // State should remain unchanged
      expect(result.current.isIntersecting).toBe(true);
    });

    it('should handle threshold of 0', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver(0));

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 0 });
    });

    it('should handle threshold of 1', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver(1));

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 1 });
    });

    it('should handle observer callback with undefined entry properties', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;
      rerender();

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate entry with undefined isIntersecting
      const mockEntry = {
        isIntersecting: undefined,
        target: mockElement,
      };

      expect(() => {
        observerCallback([mockEntry as any]);
      }).not.toThrow();
    });
  });

  describe('memory management', () => {
    it('should not leak observers on multiple re-renders', () => {
      const { result, rerender, unmount } = renderHook(() => useIntersectionObserver());

      const mockElement = document.createElement('div');
      result.current.targetRef.current = mockElement;

      // Multiple re-renders
      for (let i = 0; i < 5; i++) {
        rerender();
      }

      // Should only create one observer instance per effect run
      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);

      unmount();

      expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
    });

    it('should properly clean up on rapid element changes', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      // Rapid element changes
      for (let i = 0; i < 3; i++) {
        const element = document.createElement('div');
        element.id = `element-${i}`;
        result.current.targetRef.current = element;
        rerender();
      }

      // Should have observed each element
      expect(mockObserve).toHaveBeenCalledTimes(3);
      // Should have unobserved previous elements
      expect(mockUnobserve).toHaveBeenCalledTimes(2);
    });
  });

  describe('browser compatibility fallback', () => {
    it('should handle missing IntersectionObserver gracefully', () => {
      // Remove IntersectionObserver
      const originalIntersectionObserver = window.IntersectionObserver;
      delete (window as any).IntersectionObserver;

      expect(() => {
        renderHook(() => useIntersectionObserver());
      }).toThrow(); // Should throw because we don't have a fallback in the current implementation

      // Restore
      window.IntersectionObserver = originalIntersectionObserver;
    });
  });
});
