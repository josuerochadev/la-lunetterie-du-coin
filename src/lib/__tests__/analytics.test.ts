import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { initPlausible, trackEvent } from '../analytics';

describe('analytics', () => {
  let appendChildSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => null as any);
    delete (window as any).plausible;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initPlausible', () => {
    // Note: in test env, import.meta.env.DEV === true, so initPlausible will
    // log and return early. We test that dev-mode behavior.

    it('should skip initialization in development mode', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      initPlausible({ domain: 'example.com' });

      expect(consoleSpy).toHaveBeenCalledWith('📊 Plausible Analytics: Skipped in development');
      expect(appendChildSpy).not.toHaveBeenCalled();
    });
  });

  describe('trackEvent', () => {
    // In test env (DEV=true), trackEvent returns early before checking window.plausible.

    it('should not track events in development mode', () => {
      const mockPlausible = vi.fn();
      (window as any).plausible = mockPlausible;

      trackEvent('test-event');

      expect(mockPlausible).not.toHaveBeenCalled();
    });

    it('should not crash when plausible is not available', () => {
      delete (window as any).plausible;

      expect(() => {
        trackEvent('test-event');
      }).not.toThrow();
    });
  });
});
