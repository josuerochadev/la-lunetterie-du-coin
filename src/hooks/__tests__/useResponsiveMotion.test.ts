import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useResponsiveMotion } from '../useResponsiveMotion';

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(),
}));

vi.mock('@/hooks/useIsLg', () => ({
  useIsLg: vi.fn(),
}));

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';

const mockUsePrefersReducedMotion = vi.mocked(usePrefersReducedMotion);
const mockUseIsLg = vi.mocked(useIsLg);

describe('useResponsiveMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return "static" when reduced motion is preferred', () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    mockUseIsLg.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMotion());

    expect(result.current).toBe('static');
  });

  it('should return "static" when reduced motion is preferred on small viewport', () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    mockUseIsLg.mockReturnValue(false);

    const { result } = renderHook(() => useResponsiveMotion());

    expect(result.current).toBe('static');
  });

  it('should return "desktop-animated" on large viewport with motion', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);
    mockUseIsLg.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMotion());

    expect(result.current).toBe('desktop-animated');
  });

  it('should return "mobile-animated" on small viewport with motion', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);
    mockUseIsLg.mockReturnValue(false);

    const { result } = renderHook(() => useResponsiveMotion());

    expect(result.current).toBe('mobile-animated');
  });
});
