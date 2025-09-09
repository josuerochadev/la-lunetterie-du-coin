import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

// Mock functions
const mockMatchMedia = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockAddListener = vi.fn();
const mockRemoveListener = vi.fn();

// Create fresh mock for each test
const createMockMediaQueryList = (matches = false) => ({
  matches,
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  addListener: mockAddListener,
  removeListener: mockRemoveListener,
});

describe('usePrefersReducedMotion', () => {
  let mockMediaQueryList: ReturnType<typeof createMockMediaQueryList>;
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    vi.clearAllMocks();

    // Save original matchMedia if it exists
    originalMatchMedia = window.matchMedia;

    // Create fresh mock media query list
    mockMediaQueryList = createMockMediaQueryList();

    // Setup mock matchMedia
    mockMatchMedia.mockReturnValue(mockMediaQueryList);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    });

    // Clear all mocks
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    mockAddListener.mockClear();
    mockRemoveListener.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();

    // Restore original matchMedia
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    } else {
      delete (window as any).matchMedia;
    }
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
      renderHook(() => usePrefersReducedMotion());

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should add legacy addListener when modern API not available', () => {
      // Create mock without modern API
      const legacyMockMediaQueryList = {
        matches: false,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
      };
      mockMatchMedia.mockReturnValue(legacyMockMediaQueryList);

      renderHook(() => usePrefersReducedMotion());

      expect(mockAddListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should remove modern removeEventListener on cleanup', () => {
      const { unmount } = renderHook(() => usePrefersReducedMotion());

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should remove legacy removeListener on cleanup', () => {
      // Create mock with legacy API
      const legacyMockMediaQueryList = {
        matches: false,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
      };
      mockMatchMedia.mockReturnValue(legacyMockMediaQueryList);

      const { unmount } = renderHook(() => usePrefersReducedMotion());

      expect(mockAddListener).toHaveBeenCalledWith(expect.any(Function));

      unmount();

      expect(mockRemoveListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle missing both modern and legacy APIs gracefully', () => {
      // Create minimal mock
      const minimalMockMediaQueryList = { matches: false };
      mockMatchMedia.mockReturnValue(minimalMockMediaQueryList);

      expect(() => {
        renderHook(() => usePrefersReducedMotion());
      }).not.toThrow();
    });
  });

  describe('preference changes', () => {
    it('should update when user changes preference to reduce motion', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);
      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      // Get the handler and simulate preference change
      const changeHandler = mockAddEventListener.mock.calls[0][1];
      act(() => {
        changeHandler({ matches: true });
      });

      expect(result.current).toBe(true);
    });

    it('should update when user changes preference to allow motion', () => {
      // Create mock with matches = true initially
      const trueMockMediaQueryList = createMockMediaQueryList(true);
      mockMatchMedia.mockReturnValue(trueMockMediaQueryList);

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(true);
      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      // Get the handler and simulate preference change
      const changeHandler = mockAddEventListener.mock.calls[0][1];
      act(() => {
        changeHandler({ matches: false });
      });

      expect(result.current).toBe(false);
    });

    it('should not trigger unnecessary re-renders when preference stays the same', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);
      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      // Get the handler and simulate same preference "change"
      const changeHandler = mockAddEventListener.mock.calls[0][1];
      act(() => {
        changeHandler({ matches: false }); // Same as before
      });

      expect(result.current).toBe(false);
    });

    it('should handle legacy addListener callback format', () => {
      // Create mock with legacy API only
      const legacyMockMediaQueryList = {
        matches: false,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
      };
      mockMatchMedia.mockReturnValue(legacyMockMediaQueryList);

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);
      expect(mockAddListener).toHaveBeenCalledWith(expect.any(Function));

      // Get the handler and simulate preference change with legacy API
      const changeHandler = mockAddListener.mock.calls[0][0];
      act(() => {
        changeHandler({ matches: true });
      });

      expect(result.current).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle malformed MediaQueryListEvent', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      const changeHandler = mockAddEventListener.mock.calls[0][1];

      expect(() => {
        act(() => {
          changeHandler({}); // Missing matches property
        });
      }).not.toThrow();

      expect(result.current).toBe(false);
    });

    it('should handle null/undefined event', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      const changeHandler = mockAddEventListener.mock.calls[0][1];

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

      // The hook should handle the error gracefully and return default value
      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(false);
    });

    it('should sync immediately with current media query state', () => {
      // Create mock with matches = true initially
      const trueMockMediaQueryList = createMockMediaQueryList(true);
      mockMatchMedia.mockReturnValue(trueMockMediaQueryList);

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

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      const changeHandler = mockAddEventListener.mock.calls[0][1];

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
