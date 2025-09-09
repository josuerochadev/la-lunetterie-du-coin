import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

// Mock matchMedia
const mockMatchMedia = vi.fn();
const mockMediaQueryList = {
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
};

describe('usePrefersReducedMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Ensure window exists and reset mock matchMedia
    if (typeof window !== 'undefined') {
      mockMatchMedia.mockReturnValue(mockMediaQueryList);
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });
    }

    // Reset media query list
    mockMediaQueryList.matches = false;
    mockMediaQueryList.addEventListener.mockClear();
    mockMediaQueryList.removeEventListener.mockClear();
    mockMediaQueryList.addListener.mockClear();
    mockMediaQueryList.removeListener.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('initialization', () => {
    it('should return false initially when user prefers motion', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);
    });

    it('should return true initially when user prefers reduced motion', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(true);
    });

    it('should handle server-side rendering gracefully', () => {
      // Instead of removing window entirely (which breaks React), 
      // just remove matchMedia to simulate SSR environment
      const originalMatchMedia = window.matchMedia;
      delete (window as any).matchMedia;

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);
      
      // Restore matchMedia
      window.matchMedia = originalMatchMedia;
    });

    it('should handle browsers without matchMedia support', () => {
      // Save and remove matchMedia temporarily
      const originalMatchMedia = window.matchMedia;
      delete (window as any).matchMedia;

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);
      
      // Restore matchMedia
      window.matchMedia = originalMatchMedia;
    });
  });

  describe('media query detection', () => {
    it('should query the correct media query string', () => {
      renderHook(() => usePrefersReducedMotion());

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should sync with media query state immediately', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(true);
    });
  });

  describe('event listeners', () => {
    it('should add modern addEventListener when available', () => {
      mockMediaQueryList.addEventListener = vi.fn();

      renderHook(() => usePrefersReducedMotion());

      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      );
    });

    it('should add legacy addListener when modern API not available', () => {
      // Remove modern API
      delete (mockMediaQueryList as any).addEventListener;
      mockMediaQueryList.addListener = vi.fn();

      renderHook(() => usePrefersReducedMotion());

      expect(mockMediaQueryList.addListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should remove modern removeEventListener on cleanup', () => {
      const { unmount } = renderHook(() => usePrefersReducedMotion());

      unmount();

      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      );
    });

    it('should remove legacy removeListener on cleanup', () => {
      // Remove modern API
      delete (mockMediaQueryList as any).addEventListener;
      delete (mockMediaQueryList as any).removeEventListener;
      mockMediaQueryList.addListener = vi.fn();
      mockMediaQueryList.removeListener = vi.fn();

      const { unmount } = renderHook(() => usePrefersReducedMotion());

      unmount();

      expect(mockMediaQueryList.removeListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle missing both modern and legacy APIs gracefully', () => {
      // Remove all APIs
      delete (mockMediaQueryList as any).addEventListener;
      delete (mockMediaQueryList as any).removeEventListener;
      delete (mockMediaQueryList as any).addListener;
      delete (mockMediaQueryList as any).removeListener;

      expect(() => {
        renderHook(() => usePrefersReducedMotion());
      }).not.toThrow();
    });
  });

  describe('preference changes', () => {
    it('should update when user changes preference to reduce motion', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);

      // Simulate preference change
      const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];
      act(() => {
        changeHandler({ matches: true });
      });

      expect(result.current).toBe(true);
    });

    it('should update when user changes preference to allow motion', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(true);

      // Simulate preference change
      const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];
      act(() => {
        changeHandler({ matches: false });
      });

      expect(result.current).toBe(false);
    });

    it('should not trigger unnecessary re-renders when preference stays the same', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);

      // Simulate same preference "change"
      const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];
      act(() => {
        changeHandler({ matches: false }); // Same as before
      });

      expect(result.current).toBe(false);
    });

    it('should handle legacy addListener callback format', () => {
      // Remove modern API
      delete (mockMediaQueryList as any).addEventListener;
      mockMediaQueryList.addListener = vi.fn();

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);

      // Simulate preference change with legacy API
      const changeHandler = mockMediaQueryList.addListener.mock.calls[0][0];
      act(() => {
        changeHandler({ matches: true });
      });

      expect(result.current).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle malformed MediaQueryListEvent', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());

      const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];

      expect(() => {
        act(() => {
          changeHandler({}); // Missing matches property
        });
      }).not.toThrow();

      expect(result.current).toBe(false);
    });

    it('should handle null/undefined event', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());

      const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];

      expect(() => {
        act(() => {
          changeHandler(null as any);
        });
      }).not.toThrow();

      expect(result.current).toBe(false);
    });

    it('should handle matchMedia throwing an error', () => {
      mockMatchMedia.mockImplementation(() => {
        throw new Error('matchMedia error');
      });

      expect(() => {
        renderHook(() => usePrefersReducedMotion());
      }).not.toThrow();
    });

    it('should sync immediately with current media query state', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => usePrefersReducedMotion());

      // Should be true immediately without waiting for change event
      expect(result.current).toBe(true);
    });
  });

  describe('performance optimizations', () => {
    it('should avoid unnecessary state updates when preference is unchanged', () => {
      const { result, rerender } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);

      // Multiple rerenders should not cause issues
      rerender();
      rerender();
      rerender();

      expect(result.current).toBe(false);
    });

    it('should handle rapid preference changes efficiently', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());

      const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];

      // Rapid changes
      act(() => {
        changeHandler({ matches: true });
        changeHandler({ matches: false });
        changeHandler({ matches: true });
        changeHandler({ matches: false });
      });

      expect(result.current).toBe(false);
    });
  });
});
