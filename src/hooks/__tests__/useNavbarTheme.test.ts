import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useNavbarTheme } from '../useNavbarTheme';

describe('useNavbarTheme', () => {
  let originalIO: typeof IntersectionObserver;

  beforeEach(() => {
    vi.useFakeTimers();

    originalIO = window.IntersectionObserver;

    // Minimal IntersectionObserver mock — never fires entries
    window.IntersectionObserver = class MockIO {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn().mockReturnValue([]);
      root = null;
      rootMargin = '';
      thresholds = [0];
      constructor() {}
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.IntersectionObserver = originalIO;
  });

  it('should render without crashing', () => {
    const { result } = renderHook(() => useNavbarTheme('/'));
    expect(result.current).toBeDefined();
  });

  it('should return default values: theme = dark, hiddenByFooter = false', () => {
    const { result } = renderHook(() => useNavbarTheme('/'));
    expect(result.current.theme).toBe('dark');
    expect(result.current.hiddenByFooter).toBe(false);
  });
});
