import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useNativeScroll } from '../useNativeScroll';

describe('useNativeScroll', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();

    originalMatchMedia = window.matchMedia;

    // Default: prefers-reduced-motion does NOT match (motion is allowed)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Reset styles
    document.documentElement.style.scrollBehavior = '';
    document.documentElement.style.scrollPaddingTop = '';
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    document.documentElement.style.scrollBehavior = '';
    document.documentElement.style.scrollPaddingTop = '';
  });

  describe('when motion is allowed', () => {
    it('should set smooth scroll behavior', () => {
      renderHook(() => useNativeScroll());

      expect(document.documentElement.style.scrollBehavior).toBe('smooth');
    });

    it('should set scroll-padding-top', () => {
      renderHook(() => useNativeScroll());

      expect(document.documentElement.style.scrollPaddingTop).toBe('2rem');
    });

    it('should clean up styles on unmount', () => {
      const { unmount } = renderHook(() => useNativeScroll());

      expect(document.documentElement.style.scrollBehavior).toBe('smooth');
      expect(document.documentElement.style.scrollPaddingTop).toBe('2rem');

      unmount();

      expect(document.documentElement.style.scrollBehavior).toBe('');
      expect(document.documentElement.style.scrollPaddingTop).toBe('');
    });
  });

  describe('when prefers-reduced-motion matches', () => {
    it('should NOT set styles when prefers-reduced-motion matches', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      renderHook(() => useNativeScroll());

      expect(document.documentElement.style.scrollBehavior).toBe('');
      expect(document.documentElement.style.scrollPaddingTop).toBe('');
    });
  });
});
