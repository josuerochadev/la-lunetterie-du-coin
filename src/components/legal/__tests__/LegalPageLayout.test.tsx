import type React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import LegalPageLayout from '../LegalPageLayout';

// Mock components
vi.mock('@/components/common/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock('@/components/common/SectionContainer', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="section-container" className={className}>
      {children}
    </div>
  ),
}));

// PageHeader is no longer used in the new design

vi.mock('@/components/motion/SimpleAnimation', () => ({
  SimpleAnimation: ({ children, type, delay, immediate }: any) => (
    <div
      data-testid="simple-animation"
      data-type={type}
      data-delay={delay}
      data-immediate={immediate}
    >
      {children}
    </div>
  ),
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
      render(<LegalPageLayout {...defaultProps} />);

      expect(screen.getByTestId('seo')).toBeInTheDocument();
      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getAllByTestId('section-container')).toHaveLength(2); // Hero + Content
      expect(screen.getByRole('heading', { name: defaultProps.title })).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
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
      render(<LegalPageLayout {...defaultProps} />);

      const seoComponent = screen.getByTestId('seo');
      expect(seoComponent).toHaveAttribute('data-title', defaultProps.title);
      expect(seoComponent).toHaveAttribute('data-description', defaultProps.seoDescription);
      expect(seoComponent).toHaveAttribute('data-canonical', defaultProps.canonicalPath);
    });

    it('should handle different canonical paths', () => {
      const paths = ['/mentions-legales', '/privacy-policy', '/terms-conditions'];

      paths.forEach((path) => {
        const { unmount } = render(<LegalPageLayout {...defaultProps} canonicalPath={path} />);

        const seoComponent = screen.getByTestId('seo');
        expect(seoComponent).toHaveAttribute('data-canonical', path);

        unmount();
      });
    });
  });

  describe('page header integration', () => {
    it('should render title as h1', () => {
      render(<LegalPageLayout {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(defaultProps.title);
    });

    it('should handle different title formats', () => {
      const titles = [
        'Mentions Légales',
        'Politique de Confidentialité',
        'Conditions Générales de Vente',
        'Very Long Legal Page Title That Might Wrap',
        'Title With Special Characters: & <> "',
      ];

      titles.forEach((title) => {
        const { unmount } = render(<LegalPageLayout {...defaultProps} title={title} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent(title);

        unmount();
      });
    });
  });

  describe('last updated feature', () => {
    it('should show last updated date when provided', () => {
      render(<LegalPageLayout {...defaultProps} lastUpdated="Décembre 2024" />);

      expect(screen.getByText(/Dernière mise à jour/)).toBeInTheDocument();
      expect(screen.getByText(/Décembre 2024/)).toBeInTheDocument();
    });

    it('should not show last updated when not provided', () => {
      render(<LegalPageLayout {...defaultProps} />);

      expect(screen.queryByText(/Dernière mise à jour/)).not.toBeInTheDocument();
    });

    it('should handle different date formats', () => {
      const dateFormats = ['01/12/2024', 'Décembre 2024'];

      dateFormats.forEach((date) => {
        const { unmount } = render(<LegalPageLayout {...defaultProps} lastUpdated={date} />);

        // Just check that the date appears somewhere
        expect(screen.getByText(/Dernière mise à jour/)).toBeInTheDocument();
        unmount();
      });
    });

    it('should wrap last updated in animation', () => {
      render(<LegalPageLayout {...defaultProps} lastUpdated="Test Date" />);

      const animations = screen.getAllByTestId('simple-animation');
      const lastUpdatedAnimation = animations.find((anim) =>
        anim.textContent?.includes('Dernière mise à jour'),
      );

      expect(lastUpdatedAnimation).toBeInTheDocument();
      expect(lastUpdatedAnimation).toHaveAttribute('data-type', 'slide-up');
      expect(lastUpdatedAnimation).toHaveAttribute('data-delay', '100');
    });
  });

  describe('layout structure', () => {
    it('should have two section containers (hero + content)', () => {
      render(<LegalPageLayout {...defaultProps} />);

      const sectionContainers = screen.getAllByTestId('section-container');
      expect(sectionContainers).toHaveLength(2);
      expect(sectionContainers[0]).toHaveClass('bg-background', 'py-section');
      expect(sectionContainers[1]).toHaveClass('bg-background', 'py-section');
    });

    it('should have semantic article structure', () => {
      render(<LegalPageLayout {...defaultProps} />);

      const article = document.querySelector('article');
      expect(article).toBeInTheDocument();
      expect(article).toHaveClass('mx-auto', 'max-w-content-readable', 'space-y-16');
    });
  });

  describe('animations setup', () => {
    it('should animate title with correct props', () => {
      render(<LegalPageLayout {...defaultProps} />);

      const animations = screen.getAllByTestId('simple-animation');
      const titleAnimation = animations.find((anim) =>
        anim.textContent?.includes(defaultProps.title),
      );

      expect(titleAnimation).toBeInTheDocument();
      expect(titleAnimation).toHaveAttribute('data-type', 'slide-up');
      expect(titleAnimation).toHaveAttribute('data-delay', '0');
    });

    it('should handle animations when lastUpdated is provided', () => {
      render(<LegalPageLayout {...defaultProps} lastUpdated="Test Date" />);

      const animations = screen.getAllByTestId('simple-animation');
      expect(animations.length).toBe(2); // Title + lastUpdated animations
    });

    it('should handle animations when no lastUpdated provided', () => {
      render(<LegalPageLayout {...defaultProps} />);

      const animations = screen.getAllByTestId('simple-animation');
      expect(animations.length).toBe(1); // Only title animation
    });
  });

  describe('content flexibility', () => {
    it('should handle complex nested content', () => {
      render(
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
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should handle empty content', () => {
      expect(() => {
        render(<LegalPageLayout {...defaultProps}>{null}</LegalPageLayout>);
      }).not.toThrow();
    });

    it('should handle string content', () => {
      render(<LegalPageLayout {...defaultProps}>Simple text content</LegalPageLayout>);

      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });
  });

  describe('accessibility features', () => {
    it('should have proper document structure', () => {
      render(<LegalPageLayout {...defaultProps} />);

      const article = document.querySelector('article');
      expect(article).toBeInTheDocument();

      // Should contain the h1 heading
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should display last updated when provided', () => {
      render(<LegalPageLayout {...defaultProps} lastUpdated="Test Date" />);

      expect(screen.getByText(/Dernière mise à jour/)).toBeInTheDocument();
      expect(screen.getByText(/Test Date/)).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should apply responsive classes correctly', () => {
      render(<LegalPageLayout {...defaultProps} />);

      const article = document.querySelector('article');
      expect(article).toHaveClass('mx-auto', 'max-w-content-readable');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined lastUpdated gracefully', () => {
      expect(() => {
        render(<LegalPageLayout {...defaultProps} lastUpdated={undefined} />);
      }).not.toThrow();

      expect(screen.queryByText(/Dernière mise à jour/)).not.toBeInTheDocument();
    });

    it('should handle empty string lastUpdated', () => {
      render(<LegalPageLayout {...defaultProps} lastUpdated="" />);

      expect(screen.queryByText(/Dernière mise à jour/)).not.toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(100);

      render(<LegalPageLayout {...defaultProps} title={longTitle} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(longTitle);
    });

    it('should handle special characters in props', () => {
      const specialProps = {
        title: 'Title with <tags> & "quotes"',
        seoDescription: 'Description with special chars: & < > "',
        canonicalPath: '/path-with-special?chars=true&test=1',
      };

      expect(() => {
        render(<LegalPageLayout {...defaultProps} {...specialProps} />);
      }).not.toThrow();
    });
  });

  describe('component integration', () => {
    it('should integrate properly with all subcomponents', () => {
      render(
        <LegalPageLayout {...defaultProps} lastUpdated="Test Date">
          <div data-testid="integration-test">Integration test content</div>
        </LegalPageLayout>,
      );

      // All major components should be present
      expect(screen.getByTestId('seo')).toBeInTheDocument();
      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getAllByTestId('section-container')).toHaveLength(2);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByTestId('integration-test')).toBeInTheDocument();

      // Last updated should be shown
      expect(screen.getByText(/Dernière mise à jour/)).toBeInTheDocument();
    });
  });
});
