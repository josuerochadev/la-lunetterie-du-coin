import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useBreakpoint } from '../useBreakpoint';

const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

const createMockMediaQueryList = (matches = false) => ({
  matches,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  dispatchEvent: vi.fn(),
});

describe('useBreakpoint', () => {
  let mockMediaQueryList: ReturnType<typeof createMockMediaQueryList>;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();

    originalMatchMedia = window.matchMedia;

    mockMediaQueryList = createMockMediaQueryList(false);

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockReturnValue(mockMediaQueryList),
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  describe('initialization', () => {
    it('should return false when viewport is below breakpoint', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useBreakpoint(1024));

      expect(result.current).toBe(false);
    });

    it('should return true when viewport is at or above breakpoint', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useBreakpoint(1024));

      expect(result.current).toBe(true);
    });

    it('should create matchMedia with correct query', () => {
      renderHook(() => useBreakpoint(768));

      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    });
  });

  describe('change events', () => {
    it('should update when media query changes', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useBreakpoint(1280));

      expect(result.current).toBe(false);

      const changeHandler = mockAddEventListener.mock.calls[0][1];
      act(() => {
        changeHandler({ matches: true } as MediaQueryListEvent);
      });

      expect(result.current).toBe(true);
    });

    it('should update from true to false on change', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useBreakpoint(1024));

      expect(result.current).toBe(true);

      const changeHandler = mockAddEventListener.mock.calls[0][1];
      act(() => {
        changeHandler({ matches: false } as MediaQueryListEvent);
      });

      expect(result.current).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should clean up event listener on unmount', () => {
      const { unmount } = renderHook(() => useBreakpoint(1024));

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      const handler = mockAddEventListener.mock.calls[0][1];

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', handler);
    });
  });
});
