import { describe, it, expect, vi, beforeEach } from 'vitest';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';

import { socialIconRegistry, getSocialIcon } from '@/lib/iconRegistry';

describe('iconRegistry', () => {
  describe('socialIconRegistry', () => {
    it('has facebook and instagram keys', () => {
      expect(Object.keys(socialIconRegistry)).toEqual(
        expect.arrayContaining(['facebook', 'instagram']),
      );
    });

    it('maps facebook to the Facebook icon component', () => {
      expect(socialIconRegistry.facebook).toBe(Facebook);
    });

    it('maps instagram to the Instagram icon component', () => {
      expect(socialIconRegistry.instagram).toBe(Instagram);
    });
  });

  describe('getSocialIcon', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('returns Facebook icon for "facebook"', () => {
      expect(getSocialIcon('facebook')).toBe(Facebook);
    });

    it('returns Instagram icon for "instagram"', () => {
      expect(getSocialIcon('instagram')).toBe(Instagram);
    });

    it('returns fallback HelpCircle icon for unknown icon name', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const icon = getSocialIcon('nonexistent');
      expect(icon).toBe(HelpCircle);
      warnSpy.mockRestore();
    });

    it('logs a warning in dev mode for unknown icon name', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      getSocialIcon('unknown-icon');

      // import.meta.env.DEV is true in vitest by default
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('"unknown-icon" not found'),
        expect.any(String),
        expect.any(Array),
      );

      warnSpy.mockRestore();
    });

    it('does not log a warning for known icon names', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      getSocialIcon('facebook');

      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
