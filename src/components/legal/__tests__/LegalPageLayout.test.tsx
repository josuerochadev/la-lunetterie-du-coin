import type React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import LegalPageLayout from '../LegalPageLayout';

// Mock components
vi.mock('@/components/common/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock('@/components/common/StickySection', () => ({
  default: ({ children, zIndex }: { children: React.ReactNode; zIndex: number }) => (
    <div data-testid="sticky-section" data-z-index={zIndex}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/common/EyePattern', () => ({
  default: () => <div data-testid="eye-pattern" />,
}));

vi.mock('@/components/motion/SimpleAnimation', () => ({
  SimpleAnimation: ({ children, type, delay }: any) => (
    <div data-testid="simple-animation" data-type={type} data-delay={delay}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/motion/TextReveal', () => ({
  default: ({ children, as: Tag = 'div', className, style }: any) => (
    <Tag data-testid="text-reveal" className={className} style={style}>
      {children}
    </Tag>
  ),
}));

vi.mock('@/assets/logo/Logo_LLDC_NO_Noir.svg?react', () => ({
  default: (props: any) => <svg data-testid="logo-noir" {...props} />,
}));

vi.mock('@/seo/Seo', () => ({
  Seo: ({ title, description, canonicalPath }: any) => (
    <div
      data-testid="seo"
      data-title={title}
      data-description={description}
      data-canonical={canonicalPath}
    ></div>
  ),
}));

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('LegalPageLayout', () => {
  const defaultProps = {
    title: 'Test Legal Page',
    seoDescription: 'Test SEO description',
    canonicalPath: '/test-legal',
    children: <div data-testid="test-content">Test content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic rendering', () => {
    it('should render all main components', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      expect(screen.getByTestId('seo')).toBeInTheDocument();
      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getAllByTestId('sticky-section')).toHaveLength(2);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      renderWithRouter(
        <LegalPageLayout {...defaultProps}>
          <div data-testid="custom-child-1">Child 1</div>
          <div data-testid="custom-child-2">Child 2</div>
        </LegalPageLayout>,
      );

      expect(screen.getByTestId('custom-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-child-2')).toBeInTheDocument();
    });
  });

  describe('SEO integration', () => {
    it('should pass correct SEO props', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      const seoComponent = screen.getByTestId('seo');
      expect(seoComponent).toHaveAttribute('data-title', defaultProps.title);
      expect(seoComponent).toHaveAttribute('data-description', defaultProps.seoDescription);
      expect(seoComponent).toHaveAttribute('data-canonical', defaultProps.canonicalPath);
    });

    it('should handle different canonical paths', () => {
      const paths = ['/mentions-legales', '/privacy-policy', '/terms-conditions'];

      paths.forEach((path) => {
        const { unmount } = renderWithRouter(
          <LegalPageLayout {...defaultProps} canonicalPath={path} />,
        );

        const seoComponent = screen.getByTestId('seo');
        expect(seoComponent).toHaveAttribute('data-canonical', path);

        unmount();
      });
    });
  });

  describe('page header integration', () => {
    it('should render title as h1', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(defaultProps.title.toUpperCase());
    });

    it('should have a breadcrumb link back to home', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      const link = screen.getByRole('link', { name: /accueil/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('should handle different title formats', () => {
      const titles = [
        'Mentions Légales',
        'Politique de Confidentialité',
        'Conditions Générales de Vente',
      ];

      titles.forEach((title) => {
        const { unmount } = renderWithRouter(<LegalPageLayout {...defaultProps} title={title} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent(title.toUpperCase());

        unmount();
      });
    });
  });

  describe('last updated feature', () => {
    it('should show last updated date when provided', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} lastUpdated="Décembre 2024" />);

      expect(screen.getByText(/Mise à jour/)).toBeInTheDocument();
      expect(screen.getByText(/Décembre 2024/)).toBeInTheDocument();
    });

    it('should not show last updated when not provided', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      expect(screen.queryByText(/Mise à jour/)).not.toBeInTheDocument();
    });

    it('should handle different date formats', () => {
      const dateFormats = ['01/12/2024', 'Décembre 2024'];

      dateFormats.forEach((date) => {
        const { unmount } = renderWithRouter(
          <LegalPageLayout {...defaultProps} lastUpdated={date} />,
        );

        expect(screen.getByText(/Mise à jour/)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('layout structure', () => {
    it('should have two sticky sections (hero + content)', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      const stickySections = screen.getAllByTestId('sticky-section');
      expect(stickySections).toHaveLength(2);
    });

    it('should have semantic article structure', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      const article = document.querySelector('article');
      expect(article).toBeInTheDocument();
      expect(article).toHaveClass('mx-auto', 'max-w-content-readable', 'space-y-16');
    });

    it('should have correct z-index ordering', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      const stickySections = screen.getAllByTestId('sticky-section');
      expect(stickySections[0]).toHaveAttribute('data-z-index', '11');
      expect(stickySections[1]).toHaveAttribute('data-z-index', '12');
    });
  });

  describe('animations setup', () => {
    it('should animate title with TextReveal', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      const reveals = screen.getAllByTestId('text-reveal');
      const titleReveal = reveals.find((el) =>
        el.textContent?.includes(defaultProps.title.toUpperCase()),
      );

      expect(titleReveal).toBeInTheDocument();
      expect(titleReveal?.tagName).toBe('H1');
    });
  });

  describe('content flexibility', () => {
    it('should handle complex nested content', () => {
      renderWithRouter(
        <LegalPageLayout {...defaultProps}>
          <section data-testid="section-1">
            <h2>Section 1</h2>
            <p>Content 1</p>
          </section>
          <section data-testid="section-2">
            <h2>Section 2</h2>
            <div>
              <p>Nested content</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </section>
        </LegalPageLayout>,
      );

      expect(screen.getByTestId('section-1')).toBeInTheDocument();
      expect(screen.getByTestId('section-2')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should handle string content', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps}>Simple text content</LegalPageLayout>);

      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });
  });

  describe('accessibility features', () => {
    it('should have proper document structure', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      expect(document.querySelector('article')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should display last updated when provided', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} lastUpdated="Test Date" />);

      expect(screen.getByText(/Mise à jour/)).toBeInTheDocument();
      expect(screen.getByText(/Test Date/)).toBeInTheDocument();
    });

    it('should have data-navbar-theme attributes', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      const sections = document.querySelectorAll('[data-navbar-theme]');
      expect(sections.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('responsive design', () => {
    it('should apply responsive classes correctly', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} />);

      const article = document.querySelector('article');
      expect(article).toHaveClass('mx-auto', 'max-w-content-readable');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined lastUpdated gracefully', () => {
      expect(() => {
        renderWithRouter(<LegalPageLayout {...defaultProps} lastUpdated={undefined} />);
      }).not.toThrow();

      expect(screen.queryByText(/Mise à jour/)).not.toBeInTheDocument();
    });

    it('should handle empty string lastUpdated', () => {
      renderWithRouter(<LegalPageLayout {...defaultProps} lastUpdated="" />);

      expect(screen.queryByText(/Mise à jour/)).not.toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(100);

      renderWithRouter(<LegalPageLayout {...defaultProps} title={longTitle} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(longTitle.toUpperCase());
    });
  });
});
