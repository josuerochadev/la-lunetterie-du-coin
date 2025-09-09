import { describe, expect, it } from 'vitest';

import {
  BRAND,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  OG_LOCALE,
  SITE_URL,
  TITLE_TEMPLATE,
} from '../seo';

describe('SEO config', () => {
  describe('basic constants', () => {
    it('should have correct site URL', () => {
      expect(SITE_URL).toBe('https://www.lalunetterieducoin.fr');
      expect(SITE_URL).toMatch(/^https:\/\//);
      expect(SITE_URL).not.toMatch(/\/$/); //Should not end with trailing slash
    });

    it('should have correct brand name', () => {
      expect(BRAND).toBe('La Lunetterie Du Coin Neuf & Occasion');
      expect(BRAND).toBeTruthy();
      expect(typeof BRAND).toBe('string');
    });

    it('should have matching default title and brand', () => {
      expect(DEFAULT_TITLE).toBe(BRAND);
      expect(DEFAULT_TITLE).toBeTruthy();
    });

    it('should have correct title template format', () => {
      expect(TITLE_TEMPLATE).toBe(`%s · ${BRAND}`);
      expect(TITLE_TEMPLATE).toContain('%s');
      expect(TITLE_TEMPLATE).toContain(BRAND);
    });
  });

  describe('meta descriptions', () => {
    it('should have comprehensive default description', () => {
      expect(DEFAULT_DESCRIPTION).toBe(
        "Opticien à Strasbourg — montures neuves & d'occasion, conseils personnalisés, ajustage et services atelier.",
      );
      expect(DEFAULT_DESCRIPTION.length).toBeGreaterThan(50);
      expect(DEFAULT_DESCRIPTION.length).toBeLessThan(160); // Good SEO practice
      expect(DEFAULT_DESCRIPTION).toContain('Strasbourg');
      expect(DEFAULT_DESCRIPTION.toLowerCase()).toContain('opticien');
    });

    it('should have French locale', () => {
      expect(OG_LOCALE).toBe('fr_FR');
      expect(OG_LOCALE).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    });
  });

  describe('Open Graph image', () => {
    it('should have correct OG image URL', () => {
      expect(DEFAULT_OG_IMAGE).toBe(`${SITE_URL}/og-default.jpg`);
      expect(DEFAULT_OG_IMAGE).toMatch(/^https:\/\//);
      expect(DEFAULT_OG_IMAGE).toContain(SITE_URL);
      expect(DEFAULT_OG_IMAGE).toMatch(/\.jpg$/);
    });

    it('should construct proper image path', () => {
      const expectedUrl = 'https://www.lalunetterieducoin.fr/og-default.jpg';
      expect(DEFAULT_OG_IMAGE).toBe(expectedUrl);
    });
  });

  describe('URL construction', () => {
    it('should handle site URL without trailing slash', () => {
      // This validates that SITE_URL doesn't end with slash for proper URL construction
      expect(SITE_URL.endsWith('/')).toBe(false);
    });

    it('should allow proper concatenation with paths', () => {
      const testPaths = ['/', '/mentions-legales', '/contact'];

      testPaths.forEach((path) => {
        const fullUrl = `${SITE_URL}${path}`;
        const doubleSlashes = fullUrl.match(/\/\//g);
        expect(doubleSlashes?.length).toBe(1); // Only one double slash (after https:)
      });
    });
  });

  describe('template functionality', () => {
    it('should allow proper title template replacement', () => {
      const testTitle = 'Test Page';
      const expectedResult = `${testTitle} · ${BRAND}`;
      const actualResult = TITLE_TEMPLATE.replace('%s', testTitle);

      expect(actualResult).toBe(expectedResult);
      expect(actualResult).toContain(testTitle);
      expect(actualResult).toContain(BRAND);
      expect(actualResult).toContain(' · ');
    });

    it('should handle edge cases in title replacement', () => {
      const edgeCases = ['', '  ', 'Very Long Page Title That Might Exceed Limits'];

      edgeCases.forEach((title) => {
        const result = TITLE_TEMPLATE.replace('%s', title);
        expect(result).toContain(BRAND);
        expect(result).not.toContain('%s'); // Should be replaced
      });
    });
  });

  describe('SEO best practices compliance', () => {
    it('should have appropriate title length', () => {
      expect(DEFAULT_TITLE.length).toBeGreaterThan(10);
      expect(DEFAULT_TITLE.length).toBeLessThan(60); // Good SEO practice for titles
    });

    it('should have appropriate description length', () => {
      expect(DEFAULT_DESCRIPTION.length).toBeGreaterThan(50);
      expect(DEFAULT_DESCRIPTION.length).toBeLessThan(160); // Optimal for search snippets
    });

    it('should have brand consistency', () => {
      // All brand references should be consistent
      expect(DEFAULT_TITLE).toContain('Lunetterie');
      expect(BRAND).toContain('Lunetterie');
      expect(TITLE_TEMPLATE).toContain(BRAND);
    });

    it('should have proper French language indicators', () => {
      expect(DEFAULT_DESCRIPTION).toContain('à'); // French preposition
      expect(OG_LOCALE).toBe('fr_FR');
    });
  });

  describe('business information accuracy', () => {
    it('should reference Strasbourg location', () => {
      expect(DEFAULT_DESCRIPTION).toContain('Strasbourg');
    });

    it('should mention both new and used frames', () => {
      expect(BRAND.toLowerCase()).toContain('neuf');
      expect(BRAND.toLowerCase()).toContain('occasion');
    });

    it('should include key services in description', () => {
      const description = DEFAULT_DESCRIPTION.toLowerCase();
      expect(description).toContain('conseil');
      expect(description).toContain('ajustage');
      expect(description).toContain('atelier');
    });
  });

  describe('technical URL structure', () => {
    it('should use HTTPS protocol', () => {
      expect(SITE_URL).toMatch(/^https:\/\//);
    });

    it('should use www subdomain', () => {
      expect(SITE_URL).toContain('www.');
    });

    it('should use .fr TLD for French business', () => {
      expect(SITE_URL).toMatch(/\.fr$/);
    });

    it('should have valid domain format', () => {
      const urlPattern = /^https:\/\/www\.[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
      expect(SITE_URL).toMatch(urlPattern);
    });
  });

  describe('constant immutability', () => {
    it('should export read-only constants', () => {
      // These should be string primitives, not mutable objects
      expect(typeof SITE_URL).toBe('string');
      expect(typeof BRAND).toBe('string');
      expect(typeof DEFAULT_TITLE).toBe('string');
      expect(typeof TITLE_TEMPLATE).toBe('string');
      expect(typeof DEFAULT_DESCRIPTION).toBe('string');
      expect(typeof DEFAULT_OG_IMAGE).toBe('string');
      expect(typeof OG_LOCALE).toBe('string');
    });

    it('should have non-empty values', () => {
      const constants = [
        SITE_URL,
        BRAND,
        DEFAULT_TITLE,
        TITLE_TEMPLATE,
        DEFAULT_DESCRIPTION,
        DEFAULT_OG_IMAGE,
        OG_LOCALE,
      ];

      constants.forEach((constant) => {
        expect(constant).toBeTruthy();
        expect(constant.trim()).not.toBe('');
      });
    });
  });
});
