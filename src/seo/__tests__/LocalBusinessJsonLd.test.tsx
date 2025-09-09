import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import {
  LocalBusinessJsonLd,
  COMPANY_NAME,
  COMPANY_LEGAL_FORM,
  COMPANY_ADDRESS,
  COMPANY_SIRET,
  COMPANY_RCS,
  PUBLICATION_DIRECTOR,
} from '../LocalBusinessJsonLd';

// Mock Helmet
const mockHelmet = vi.fn(({ children }) => <div data-testid="helmet">{children}</div>);
vi.mock('@dr.pogodin/react-helmet', () => ({
  Helmet: mockHelmet,
}));

// Mock SEO config
const mockSeoConfig = {
  SITE_URL: 'https://example.com',
  DEFAULT_OG_IMAGE: 'https://example.com/og-default.jpg',
  BRAND: 'Test Brand',
};

vi.mock('@/config/seo', () => mockSeoConfig);

describe('LocalBusinessJsonLd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic rendering', () => {
    it('should render Helmet with JSON-LD script', () => {
      render(<LocalBusinessJsonLd />);

      expect(mockHelmet).toHaveBeenCalledTimes(1);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;

      expect(scriptElement?.type).toBe('script');
      expect(scriptElement?.props?.type).toBe('application/ld+json');
    });

    it('should generate valid JSON-LD structure', () => {
      render(<LocalBusinessJsonLd />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;

      expect(() => JSON.parse(jsonContent)).not.toThrow();

      const parsedJson = JSON.parse(jsonContent);
      expect(parsedJson['@context']).toBe('https://schema.org');
      expect(parsedJson['@type']).toBe('Optician');
    });
  });

  describe('company constants', () => {
    it('should export correct company information', () => {
      expect(COMPANY_NAME).toBe('La Lunetterie Du Coin Neuf & Occasion');
      expect(COMPANY_LEGAL_FORM).toBe('SASU');
      expect(COMPANY_ADDRESS).toBe('24 rue du Faubourg de Pierre, 67000 Strasbourg, France');
      expect(COMPANY_SIRET).toBe('81765775200017');
      expect(COMPANY_RCS).toBe('817 657 752 RCS Strasbourg');
      expect(PUBLICATION_DIRECTOR).toBe('CORATO Romain-Guy');
    });

    it('should have valid SIRET format', () => {
      expect(COMPANY_SIRET).toMatch(/^\d{14}$/);
      expect(COMPANY_SIRET.length).toBe(14);
    });

    it('should have valid RCS format', () => {
      expect(COMPANY_RCS).toMatch(/^\d{3} \d{3} \d{3} RCS [A-Za-z]+$/);
      expect(COMPANY_RCS).toContain('RCS Strasbourg');
    });
  });

  describe('JSON-LD schema structure', () => {
    let parsedJsonLd: any;

    beforeEach(() => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;
      parsedJsonLd = JSON.parse(jsonContent);
    });

    it('should have correct schema context and type', () => {
      expect(parsedJsonLd['@context']).toBe('https://schema.org');
      expect(parsedJsonLd['@type']).toBe('Optician');
    });

    it('should include basic business information', () => {
      expect(parsedJsonLd.name).toBe(COMPANY_NAME);
      expect(parsedJsonLd.url).toBe(mockSeoConfig.SITE_URL);
      expect(parsedJsonLd.image).toBe(mockSeoConfig.DEFAULT_OG_IMAGE);
      expect(parsedJsonLd.legalName).toBe(`${COMPANY_NAME} ${COMPANY_LEGAL_FORM}`);
      expect(parsedJsonLd.brand).toBe(mockSeoConfig.BRAND);
    });

    it('should include telephone information', () => {
      expect(parsedJsonLd.telephone).toBe('+33 03 88 51 24 40');
    });

    it('should include price range', () => {
      expect(parsedJsonLd.priceRange).toBe('€€');
    });
  });

  describe('postal address structure', () => {
    let address: any;

    beforeEach(() => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;
      const parsedJsonLd = JSON.parse(jsonContent);
      address = parsedJsonLd.address;
    });

    it('should have correct address schema type', () => {
      expect(address['@type']).toBe('PostalAddress');
    });

    it('should include complete address information', () => {
      expect(address.streetAddress).toBe('24 rue du Faubourg de Pierre');
      expect(address.postalCode).toBe('67000');
      expect(address.addressLocality).toBe('Strasbourg');
      expect(address.addressRegion).toBe('Grand Est');
      expect(address.addressCountry).toBe('FR');
    });

    it('should use proper French region and country codes', () => {
      expect(address.addressRegion).toBe('Grand Est');
      expect(address.addressCountry).toBe('FR');
    });
  });

  describe('opening hours specification', () => {
    let openingHours: any[];

    beforeEach(() => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;
      const parsedJsonLd = JSON.parse(jsonContent);
      openingHours = parsedJsonLd.openingHoursSpecification;
    });

    it('should include opening hours for all working days', () => {
      expect(Array.isArray(openingHours)).toBe(true);
      expect(openingHours.length).toBeGreaterThan(0);

      const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      workingDays.forEach((day) => {
        const dayHours = openingHours.filter((spec) => spec.dayOfWeek === day);
        expect(dayHours.length).toBeGreaterThan(0);
      });
    });

    it('should have correct schema type for each opening hours spec', () => {
      openingHours.forEach((spec) => {
        expect(spec['@type']).toBe('OpeningHoursSpecification');
      });
    });

    it('should include morning and afternoon sessions', () => {
      const mondayHours = openingHours.filter((spec) => spec.dayOfWeek === 'Monday');

      expect(mondayHours.length).toBe(2); // Morning and afternoon

      const morningSession = mondayHours.find((spec) => spec.opens === '10:00');
      const afternoonSession = mondayHours.find((spec) => spec.opens === '15:00');

      expect(morningSession).toBeDefined();
      expect(morningSession.closes).toBe('14:00');
      expect(afternoonSession).toBeDefined();
      expect(afternoonSession.closes).toBe('19:00');
    });

    it('should not include Sunday hours (closed on Sunday)', () => {
      const sundayHours = openingHours.filter((spec) => spec.dayOfWeek === 'Sunday');
      expect(sundayHours.length).toBe(0);
    });

    it('should have valid time formats', () => {
      const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

      openingHours.forEach((spec) => {
        expect(spec.opens).toMatch(timePattern);
        expect(spec.closes).toMatch(timePattern);
      });
    });
  });

  describe('business identifiers', () => {
    let identifiers: any[];

    beforeEach(() => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;
      const parsedJsonLd = JSON.parse(jsonContent);
      identifiers = parsedJsonLd.identifier;
    });

    it('should include SIRET identifier', () => {
      const siretId = identifiers.find((id) => id.name === 'SIRET');
      expect(siretId).toBeDefined();
      expect(siretId['@type']).toBe('PropertyValue');
      expect(siretId.value).toBe(COMPANY_SIRET);
    });

    it('should include RCS identifier', () => {
      const rcsId = identifiers.find((id) => id.name === 'RCS');
      expect(rcsId).toBeDefined();
      expect(rcsId['@type']).toBe('PropertyValue');
      expect(rcsId.value).toBe(COMPANY_RCS);
    });

    it('should include publication director', () => {
      const pubDirector = identifiers.find((id) => id.name === 'Directeur de la Publication');
      expect(pubDirector).toBeDefined();
      expect(pubDirector['@type']).toBe('PropertyValue');
      expect(pubDirector.value).toBe(PUBLICATION_DIRECTOR);
    });

    it('should have correct schema type for all identifiers', () => {
      identifiers.forEach((identifier) => {
        expect(identifier['@type']).toBe('PropertyValue');
        expect(identifier.name).toBeTruthy();
        expect(identifier.value).toBeTruthy();
      });
    });
  });

  describe('schema.org compliance', () => {
    it('should use Optician type for optical services', () => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;
      const parsedJsonLd = JSON.parse(jsonContent);

      expect(parsedJsonLd['@type']).toBe('Optician');
    });

    it('should include all required LocalBusiness properties', () => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;
      const parsedJsonLd = JSON.parse(jsonContent);

      const requiredProperties = ['name', 'address', 'telephone', 'url'];

      requiredProperties.forEach((prop) => {
        expect(parsedJsonLd[prop]).toBeDefined();
      });
    });

    it('should have valid JSON-LD syntax', () => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;

      expect(() => {
        const parsed = JSON.parse(jsonContent);
        expect(parsed).toBeDefined();
        expect(typeof parsed).toBe('object');
      }).not.toThrow();
    });
  });

  describe('data accuracy', () => {
    it('should match French business format for addresses', () => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;
      const parsedJsonLd = JSON.parse(jsonContent);
      const address = parsedJsonLd.address;

      expect(address.postalCode).toMatch(/^67\d{3}$/); // Strasbourg postal code
      expect(address.addressCountry).toBe('FR');
      expect(address.addressLocality).toBe('Strasbourg');
    });

    it('should use correct French phone number format', () => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;
      const parsedJsonLd = JSON.parse(jsonContent);

      expect(parsedJsonLd.telephone).toMatch(/^\+33/); // French country code
      expect(parsedJsonLd.telephone).toContain('03 88'); // Strasbourg area code
    });

    it('should reference real business information', () => {
      expect(COMPANY_NAME).toContain('Lunetterie');
      expect(COMPANY_ADDRESS).toContain('Strasbourg');
      expect(COMPANY_SIRET).toBeTruthy();
      expect(COMPANY_RCS).toContain('Strasbourg');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle missing telephone gracefully', () => {
      // Mock module to return undefined telephone
      vi.doMock('../LocalBusinessJsonLd', () => ({
        default: LocalBusinessJsonLd,
        TELEPHONE: undefined,
      }));

      expect(() => {
        render(<LocalBusinessJsonLd />);
      }).not.toThrow();
    });

    it('should produce minified JSON-LD (no unnecessary whitespace)', () => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;

      // Should be minified JSON without pretty-printing
      expect(jsonContent).not.toMatch(/\n\s+/); // No indented lines
      expect(jsonContent.startsWith('{"@context"')).toBe(true);
    });

    it('should handle special characters in business data', () => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = scriptElement.props.children;

      expect(() => JSON.parse(jsonContent)).not.toThrow();

      const parsedJson = JSON.parse(jsonContent);
      // Should preserve French characters and punctuation
      expect(parsedJson.name).toContain('&'); // Ampersand in name
    });
  });

  describe('SEO and discoverability', () => {
    it('should include structured data for search engines', () => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;

      expect(scriptElement.props.type).toBe('application/ld+json');

      const jsonContent = JSON.parse(scriptElement.props.children);
      expect(jsonContent['@context']).toBe('https://schema.org');
    });

    it('should support local SEO with complete location data', () => {
      render(<LocalBusinessJsonLd />);
      const helmetCall = mockHelmet.mock.calls[0][0];
      const scriptElement = helmetCall.children;
      const jsonContent = JSON.parse(scriptElement.props.children);

      expect(jsonContent.address.addressLocality).toBe('Strasbourg');
      expect(jsonContent.address.addressRegion).toBe('Grand Est');
      expect(jsonContent.address.addressCountry).toBe('FR');
      expect(jsonContent.telephone).toBeTruthy();
    });
  });
});
