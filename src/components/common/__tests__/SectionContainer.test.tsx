import type React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import SectionContainer from '../SectionContainer';

// Mock the cn utility
vi.mock('@/lib/cn', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('SectionContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render children correctly', () => {
      render(
        <SectionContainer>
          <div data-testid="test-content">Test content</div>
        </SectionContainer>,
      );

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should render as section element by default', () => {
      render(
        <SectionContainer>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render with custom element type', () => {
      render(
        <SectionContainer as="div">
          <div data-testid="content">Content</div>
        </SectionContainer>,
      );

      const divElement = document.querySelector('div[class*="relative"]');
      expect(divElement).toBeInTheDocument();
      expect(divElement?.tagName).toBe('DIV');
    });

    it('should render with custom element type as article', () => {
      render(
        <SectionContainer as="article">
          <div>Content</div>
        </SectionContainer>,
      );

      const article = document.querySelector('article');
      expect(article).toBeInTheDocument();
    });
  });

  describe('props handling', () => {
    it('should apply custom id', () => {
      render(
        <SectionContainer id="custom-section">
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('#custom-section');
      expect(section).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <SectionContainer className="custom-class">
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toHaveClass('custom-class');
    });

    it('should apply default classes', () => {
      render(
        <SectionContainer>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toHaveClass('relative', 'z-base', 'w-full');
    });

    it('should apply section-shell class when noSpacing is false', () => {
      render(
        <SectionContainer noSpacing={false}>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toHaveClass('section-shell');
    });

    it('should not apply section-shell class when noSpacing is true', () => {
      render(
        <SectionContainer noSpacing={true}>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).not.toHaveClass('section-shell');
    });
  });

  describe('background image functionality', () => {
    it('should apply background image styles when backgroundImage is provided', () => {
      const backgroundImageUrl = '/test-background.jpg';

      render(
        <SectionContainer backgroundImage={backgroundImageUrl}>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toHaveStyle({
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      });
    });

    it('should apply background CSS classes when backgroundImage is provided', () => {
      render(
        <SectionContainer backgroundImage="/test-bg.jpg">
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toHaveClass('bg-cover', 'bg-center', 'bg-no-repeat');
    });

    it('should not apply background styles when backgroundImage is not provided', () => {
      render(
        <SectionContainer>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section?.style.backgroundImage).toBe('');
    });

    it('should create overlay when backgroundImage is provided', () => {
      render(
        <SectionContainer backgroundImage="/test-bg.jpg">
          <div data-testid="content">Content</div>
        </SectionContainer>,
      );

      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('absolute', 'inset-0', '-z-base');
    });

    it('should apply default overlay classes', () => {
      render(
        <SectionContainer backgroundImage="/test-bg.jpg">
          <div>Content</div>
        </SectionContainer>,
      );

      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toHaveClass('bg-white/40', 'backdrop-blur-sm');
    });

    it('should apply custom overlay classes', () => {
      render(
        <SectionContainer
          backgroundImage="/test-bg.jpg"
          overlayClassName="bg-black/50 backdrop-blur-lg"
        >
          <div>Content</div>
        </SectionContainer>,
      );

      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toHaveClass('bg-black/50', 'backdrop-blur-lg');
    });

    it('should not create overlay when backgroundImage is not provided', () => {
      render(
        <SectionContainer>
          <div>Content</div>
        </SectionContainer>,
      );

      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).not.toBeInTheDocument();
    });
  });

  describe('content wrapper', () => {
    it('should wrap children in relative container', () => {
      render(
        <SectionContainer>
          <div data-testid="test-content">Content</div>
        </SectionContainer>,
      );

      const contentWrapper = document.querySelector('.relative.mx-auto.w-full');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toContainElement(screen.getByTestId('test-content'));
    });

    it('should have proper z-index layering with background', () => {
      render(
        <SectionContainer backgroundImage="/test-bg.jpg">
          <div data-testid="content">Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      const overlay = document.querySelector('[aria-hidden="true"]');
      const contentWrapper = document.querySelector('.relative.mx-auto.w-full');

      expect(section).toHaveClass('relative');
      expect(overlay).toHaveClass('-z-base');
      expect(contentWrapper).toHaveClass('relative');
    });
  });

  describe('accessibility', () => {
    it('should hide overlay from screen readers', () => {
      render(
        <SectionContainer backgroundImage="/test-bg.jpg">
          <div>Content</div>
        </SectionContainer>,
      );

      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
    });

    it('should maintain semantic meaning with proper element types', () => {
      render(
        <SectionContainer as="main" id="main-content">
          <h1>Main Content</h1>
        </SectionContainer>,
      );

      const mainElement = document.querySelector('main#main-content');
      expect(mainElement).toBeInTheDocument();
    });

    it('should support landmark roles through element type', () => {
      render(
        <SectionContainer as="aside">
          <div>Sidebar content</div>
        </SectionContainer>,
      );

      const aside = document.querySelector('aside');
      expect(aside).toBeInTheDocument();
    });
  });

  describe('complex content scenarios', () => {
    it('should handle multiple child elements', () => {
      render(
        <SectionContainer>
          <h2 data-testid="title">Section Title</h2>
          <p data-testid="description">Section description</p>
          <div data-testid="actions">
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        </SectionContainer>,
      );

      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('description')).toBeInTheDocument();
      expect(screen.getByTestId('actions')).toBeInTheDocument();
    });

    it('should handle nested components', () => {
      const NestedComponent = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="nested-component">{children}</div>
      );

      render(
        <SectionContainer>
          <NestedComponent>
            <span data-testid="deeply-nested">Deeply nested content</span>
          </NestedComponent>
        </SectionContainer>,
      );

      expect(screen.getByTestId('nested-component')).toBeInTheDocument();
      expect(screen.getByTestId('deeply-nested')).toBeInTheDocument();
    });

    it('should handle empty children gracefully', () => {
      expect(() => {
        render(<SectionContainer>{null}</SectionContainer>);
      }).not.toThrow();

      expect(() => {
        render(<SectionContainer>{undefined}</SectionContainer>);
      }).not.toThrow();

      expect(() => {
        render(<SectionContainer></SectionContainer>);
      }).not.toThrow();
    });
  });

  describe('prop combinations', () => {
    it('should handle all props together', () => {
      render(
        <SectionContainer
          id="complex-section"
          className="custom-styling"
          backgroundImage="/complex-bg.jpg"
          overlayClassName="custom-overlay"
          noSpacing={true}
          as="article"
        >
          <div data-testid="complex-content">Complex content</div>
        </SectionContainer>,
      );

      const article = document.querySelector('article');
      expect(article).toBeInTheDocument();
      expect(article).toHaveAttribute('id', 'complex-section');
      expect(article).toHaveClass('custom-styling');
      expect(article).not.toHaveClass('section-shell');

      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toHaveClass('custom-overlay');

      expect(screen.getByTestId('complex-content')).toBeInTheDocument();
    });

    it('should override default overlay with custom overlay', () => {
      render(
        <SectionContainer backgroundImage="/test-bg.jpg" overlayClassName="bg-red-500/30">
          <div>Content</div>
        </SectionContainer>,
      );

      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toHaveClass('bg-red-500/30');
      expect(overlay).not.toHaveClass('bg-white/40', 'backdrop-blur-sm');
    });
  });

  describe('edge cases', () => {
    it('should handle very long background image URLs', () => {
      const longUrl =
        'https://example.com/very/long/path/to/background/image/that/might/cause/issues.jpg';

      render(
        <SectionContainer backgroundImage={longUrl}>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toHaveStyle({
        backgroundImage: `url('${longUrl}')`,
      });
    });

    it('should handle special characters in background image URLs', () => {
      const specialUrl = '/images/background with spaces & special-chars.jpg';

      render(
        <SectionContainer backgroundImage={specialUrl}>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toHaveStyle({
        backgroundImage: `url('${specialUrl}')`,
      });
    });

    it('should handle empty string values gracefully', () => {
      render(
        <SectionContainer id={undefined} className="" backgroundImage="" overlayClassName="">
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section?.style.backgroundImage).toBe('');
    });

    it('should handle undefined values gracefully', () => {
      render(
        <SectionContainer
          id={undefined}
          className={undefined}
          backgroundImage={undefined}
          overlayClassName={undefined}
          noSpacing={undefined}
        >
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('section-shell'); // Should apply default spacing
    });
  });
});
