import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useIsLg } from '../useIsLg';

const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

const createMockMediaQueryList = (matches = false) => ({
  matches,
  media: '(min-width: 1024px)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  dispatchEvent: vi.fn(),
});

describe('useIsLg', () => {
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
    it('should return false by default when matchMedia returns false', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useIsLg());

      expect(result.current).toBe(false);
    });

    it('should return true when matchMedia matches', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useIsLg());

      expect(result.current).toBe(true);
    });
  });

  describe('change events', () => {
    it('should listen to change events and update', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useIsLg());

      expect(result.current).toBe(false);
      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      const changeHandler = mockAddEventListener.mock.calls[0][1];
      act(() => {
        changeHandler({ matches: true } as MediaQueryListEvent);
      });

      expect(result.current).toBe(true);
    });

    it('should update from true to false on change', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useIsLg());

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
      const { unmount } = renderHook(() => useIsLg());

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      const handler = mockAddEventListener.mock.calls[0][1];

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', handler);
    });
  });
});
