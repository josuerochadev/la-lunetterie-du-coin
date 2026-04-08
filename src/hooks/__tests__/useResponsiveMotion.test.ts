import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useResponsiveMotion } from '../useResponsiveMotion';

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(),
}));

vi.mock('@/hooks/useIsXl', () => ({
  useIsXl: vi.fn(),
}));

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsXl } from '@/hooks/useIsXl';

const mockUsePrefersReducedMotion = vi.mocked(usePrefersReducedMotion);
const mockUseIsXl = vi.mocked(useIsXl);

describe('useResponsiveMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return "static" when reduced motion is preferred', () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    mockUseIsXl.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMotion());

    expect(result.current).toBe('static');
  });

  it('should return "static" when reduced motion is preferred on small viewport', () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    mockUseIsXl.mockReturnValue(false);

    const { result } = renderHook(() => useResponsiveMotion());

    expect(result.current).toBe('static');
  });

  it('should return "desktop-animated" on xl viewport with motion', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);
    mockUseIsXl.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMotion());

    expect(result.current).toBe('desktop-animated');
  });

  it('should return "mobile-animated" below xl viewport with motion', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);
    mockUseIsXl.mockReturnValue(false);

    const { result } = renderHook(() => useResponsiveMotion());

    expect(result.current).toBe('mobile-animated');
  });
});
