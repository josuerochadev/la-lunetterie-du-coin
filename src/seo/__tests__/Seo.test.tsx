import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Helmet } from '@dr.pogodin/react-helmet';

import { Seo } from '../Seo';

// Mock Helmet
vi.mock('@dr.pogodin/react-helmet', () => ({
  Helmet: vi.fn(({ children }) => <div data-testid="helmet">{children}</div>),
}));

const mockHelmet = vi.mocked(Helmet);

// Mock SEO config
vi.mock('@/config/seo', () => ({
  DEFAULT_DESCRIPTION: 'Test default description',
  DEFAULT_OG_IMAGE: 'https://example.com/og-default.jpg',
  DEFAULT_TITLE: 'Test Default Title',
  OG_LOCALE: 'fr_FR',
  SITE_URL: 'https://example.com',
  TITLE_TEMPLATE: '%s · Test Brand',
}));

describe('Seo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic rendering', () => {
    it('should render Helmet component', () => {
      render(<Seo />);

      expect(mockHelmet).toHaveBeenCalledTimes(1);
    });

    it('should render with default props', () => {
      render(<Seo />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      expect(helmetCall).toBeDefined();
    });
  });

  describe('title handling', () => {
    it('should use default title when no title provided', () => {
      render(<Seo />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const titleElement = helmetCall.children.find((child: any) => child?.type === 'title');

      expect(titleElement?.props?.children).toBe("Test Default Title");
    });

    it('should use template when custom title provided', () => {
      render(<Seo title="Custom Page" />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const titleElement = helmetCall.children.find((child: any) => child?.type === 'title');

      expect(titleElement?.props?.children).toBe('Custom Page · Test Brand');
    });

    it('should not use template when title matches default', () => {
      render(<Seo title={"Test Default Title"} />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const titleElement = helmetCall.children.find((child: any) => child?.type === 'title');

      expect(titleElement?.props?.children).toBe("Test Default Title");
    });

    it('should handle empty title', () => {
      render(<Seo title="" />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const titleElement = helmetCall.children.find((child: any) => child?.type === 'title');

      expect(titleElement?.props?.children).toBe("Test Default Title");
    });
  });

  describe('meta descriptions', () => {
    it('should use default description when none provided', () => {
      render(<Seo />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const descriptionMeta = metaElements.find((meta: any) => meta.props.name === 'description');

      expect(descriptionMeta?.props?.content).toBe("Test default description");
    });

    it('should use custom description when provided', () => {
      const customDescription = 'Custom description for this page';
      render(<Seo description={customDescription} />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const descriptionMeta = metaElements.find((meta: any) => meta.props.name === 'description');

      expect(descriptionMeta?.props?.content).toBe(customDescription);
    });

    it('should handle empty description', () => {
      render(<Seo description="" />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const descriptionMeta = metaElements.find((meta: any) => meta.props.name === 'description');

      expect(descriptionMeta?.props?.content).toBe('');
    });
  });

  describe('canonical URLs', () => {
    it('should use site URL as canonical when no path provided', () => {
      render(<Seo />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const linkElements = helmetCall.children.filter((child: any) => child?.type === 'link');

      const canonicalLink = linkElements.find((link: any) => link.props.rel === 'canonical');

      expect(canonicalLink?.props?.href).toBe("https://example.com");
    });

    it('should construct proper canonical URL with path', () => {
      render(<Seo canonicalPath="/about" />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const linkElements = helmetCall.children.filter((child: any) => child?.type === 'link');

      const canonicalLink = linkElements.find((link: any) => link.props.rel === 'canonical');

      expect(canonicalLink?.props?.href).toBe('https://example.com/about');
    });

    it('should handle trailing slash in site URL', () => {
      const configWithTrailingSlash = {
        DEFAULT_DESCRIPTION: "Test default description", 
        DEFAULT_OG_IMAGE: "https://example.com/og-default.jpg", 
        DEFAULT_TITLE: "Test Default Title", 
        OG_LOCALE: "fr_FR", 
        SITE_URL: 'https://example.com/',
        TITLE_TEMPLATE: "%s · Test Brand",
      };

      vi.mocked(vi.importActual('@/config/seo')).mockReturnValue(configWithTrailingSlash);

      render(<Seo canonicalPath="/contact" />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const linkElements = helmetCall.children.filter((child: any) => child?.type === 'link');

      const canonicalLink = linkElements.find((link: any) => link.props.rel === 'canonical');

      expect(canonicalLink?.props?.href).toBe('https://example.com/contact');
    });

    it('should handle root path correctly', () => {
      render(<Seo canonicalPath="/" />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const linkElements = helmetCall.children.filter((child: any) => child?.type === 'link');

      const canonicalLink = linkElements.find((link: any) => link.props.rel === 'canonical');

      expect(canonicalLink?.props?.href).toBe('https://example.com/');
    });
  });

  describe('robots meta tag', () => {
    it('should not include robots meta by default', () => {
      render(<Seo />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const robotsMeta = metaElements.find((meta: any) => meta.props.name === 'robots');

      expect(robotsMeta).toBeUndefined();
    });

    it('should include noindex robots meta when noIndex is true', () => {
      render(<Seo noIndex={true} />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const robotsMeta = metaElements.find((meta: any) => meta.props.name === 'robots');

      expect(robotsMeta?.props?.content).toBe('noindex,nofollow');
    });

    it('should not include robots meta when noIndex is false', () => {
      render(<Seo noIndex={false} />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const robotsMeta = metaElements.find((meta: any) => meta.props.name === 'robots');

      expect(robotsMeta).toBeUndefined();
    });
  });

  describe('Open Graph tags', () => {
    it('should include all required OG meta tags', () => {
      render(<Seo />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const ogElements = metaElements.filter((meta: any) => meta.props.property?.startsWith('og:'));

      const expectedOgProperties = [
        'og:type',
        'og:locale',
        'og:site_name',
        'og:title',
        'og:description',
        'og:url',
        'og:image',
        'og:image:alt',
      ];

      expectedOgProperties.forEach((property) => {
        const ogElement = ogElements.find((meta: any) => meta.props.property === property);
        expect(ogElement).toBeDefined();
      });
    });

    it('should use custom OG image when provided', () => {
      const customImage = 'https://example.com/custom-og.jpg';
      render(<Seo ogImage={customImage} />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const ogImage = metaElements.find((meta: any) => meta.props.property === 'og:image');

      expect(ogImage?.props?.content).toBe(customImage);
    });

    it('should use correct OG title fallback', () => {
      render(<Seo />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const ogTitle = metaElements.find((meta: any) => meta.props.property === 'og:title');

      expect(ogTitle?.props?.content).toBe("Test Default Title");
    });

    it('should use custom title in OG tags', () => {
      render(<Seo title="Custom Title" />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const ogTitle = metaElements.find((meta: any) => meta.props.property === 'og:title');

      expect(ogTitle?.props?.content).toBe('Custom Title');
    });
  });

  describe('Twitter Card tags', () => {
    it('should include all required Twitter meta tags', () => {
      render(<Seo />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const twitterElements = metaElements.filter((meta: any) =>
        meta.props.name?.startsWith('twitter:'),
      );

      const expectedTwitterProperties = [
        'twitter:card',
        'twitter:title',
        'twitter:description',
        'twitter:image',
      ];

      expectedTwitterProperties.forEach((property) => {
        const twitterElement = twitterElements.find((meta: any) => meta.props.name === property);
        expect(twitterElement).toBeDefined();
      });
    });

    it('should use correct Twitter card type', () => {
      render(<Seo />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const twitterCard = metaElements.find((meta: any) => meta.props.name === 'twitter:card');

      expect(twitterCard?.props?.content).toBe('summary_large_image');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined title gracefully', () => {
      render(<Seo title={undefined} />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const titleElement = helmetCall.children.find((child: any) => child?.type === 'title');

      expect(titleElement?.props?.children).toBe("Test Default Title");
    });

    it('should handle null values gracefully', () => {
      expect(() => {
        render(<Seo title={null as any} description={null as any} />);
      }).not.toThrow();
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(200);
      render(<Seo title={longTitle} />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const titleElement = helmetCall.children.find((child: any) => child?.type === 'title');

      expect(titleElement?.props?.children).toBe(`${longTitle} · Test Brand`);
    });

    it('should handle special characters in meta content', () => {
      const specialDescription = 'Description with "quotes" & ampersands <tags>';
      render(<Seo description={specialDescription} />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const descriptionMeta = metaElements.find((meta: any) => meta.props.name === 'description');

      expect(descriptionMeta?.props?.content).toBe(specialDescription);
    });

    it('should handle empty canonicalPath', () => {
      render(<Seo canonicalPath="" />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const linkElements = helmetCall.children.filter((child: any) => child?.type === 'link');

      const canonicalLink = linkElements.find((link: any) => link.props.rel === 'canonical');

      expect(canonicalLink?.props?.href).toBe('https://example.com');
    });
  });

  describe('prop combinations', () => {
    it('should handle all props together', () => {
      const props = {
        title: 'Test Page',
        description: 'Test description',
        canonicalPath: '/test',
        ogImage: 'https://example.com/test.jpg',
        noIndex: true,
      };

      expect(() => {
        render(<Seo {...props} />);
      }).not.toThrow();

      expect(mockHelmet).toHaveBeenCalledTimes(1);
    });

    it('should prioritize custom values over defaults', () => {
      const customProps = {
        description: 'Custom description',
        ogImage: 'https://example.com/custom.jpg',
      };

      render(<Seo {...customProps} />);

      const helmetCall = mockHelmet.mock.calls[0][0];
      const metaElements = helmetCall.children.filter((child: any) => child?.type === 'meta');

      const descriptionMeta = metaElements.find((meta: any) => meta.props.name === 'description');
      const ogImageMeta = metaElements.find((meta: any) => meta.props.property === 'og:image');

      expect(descriptionMeta?.props?.content).toBe(customProps.description);
      expect(ogImageMeta?.props?.content).toBe(customProps.ogImage);
    });
  });
});
