import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/components/motion/motionFeatures', () => ({
  default: { mockFeature: true },
}));

import { loadFeatures } from '@/lib/loadMotionFeatures';

describe('loadMotionFeatures', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a promise', () => {
    const result = loadFeatures();
    expect(result).toBeInstanceOf(Promise);
    return result;
  });

  it('resolves to the default export of motionFeatures', async () => {
    const features = await loadFeatures();
    expect(features).toEqual({ mockFeature: true });
  });

  it('works when reduced motion is preferred', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    const features = await loadFeatures();
    expect(features).toEqual({ mockFeature: true });

    window.matchMedia = originalMatchMedia;
  });

  it('works when reduced motion is not preferred', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    const features = await loadFeatures();
    expect(features).toEqual({ mockFeature: true });

    window.matchMedia = originalMatchMedia;
  });
});
