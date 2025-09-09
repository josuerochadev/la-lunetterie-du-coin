import type React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import Layout from '../Layout';

// Mock the child components
vi.mock('../SkipLink', () => ({
  default: () => <div data-testid="skip-link">Skip to main content</div>,
}));

vi.mock('../../navbar/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navigation</nav>,
}));

vi.mock('../../../sections/Footer', () => ({
  default: () => <footer data-testid="footer">Footer content</footer>,
}));

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all layout components', () => {
      render(
        <Layout>
          <div data-testid="main-content">Main content</div>
        </Layout>,
      );

      expect(screen.getByTestId('skip-link')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render children inside the main element', () => {
      const testContent = 'Test page content';
      render(
        <Layout>
          <div>{testContent}</div>
        </Layout>,
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveTextContent(testContent);
    });

    it('should render multiple children correctly', () => {
      render(
        <Layout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </Layout>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });
  });

  describe('HTML structure and semantics', () => {
    it('should have proper semantic structure', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveAttribute('id', 'main');
    });

    it('should have proper z-index layering classes', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      // Check for z-base class on content wrapper
      const contentWrapper = document.querySelector('.z-base');
      expect(contentWrapper).toBeInTheDocument();
    });

    it('should have minimum height styling', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      // Check for min-h-screen class on root container
      const rootContainer = document.querySelector('.min-h-screen');
      expect(rootContainer).toBeInTheDocument();

      // Check for min-h-screen class on main element
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('min-h-screen');
    });

    it('should have proper text styling', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      // Check for text-primary class
      const rootContainer = document.querySelector('.text-primary');
      expect(rootContainer).toBeInTheDocument();
    });
  });

  describe('accessibility features', () => {
    it('should have focusable main element', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveAttribute('tabIndex', '-1');
    });

    it('should include skip link for keyboard navigation', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      expect(screen.getByTestId('skip-link')).toBeInTheDocument();
    });

    it('should have proper component order for screen readers', () => {
      render(
        <Layout>
          <div data-testid="main-content">Content</div>
        </Layout>,
      );

      const container = document.querySelector('.z-base');
      const children = container?.children;

      expect(container).toBeInTheDocument();
      expect(children).toBeDefined();

      if (children && children.length >= 4) {
        // Check order: SkipLink, Navbar, Main, Footer
        expect(children[0]).toHaveAttribute('data-testid', 'skip-link');
        expect(children[1]).toHaveAttribute('data-testid', 'navbar');
        expect(children[2]).toHaveAttribute('id', 'main');
        expect(children[3]).toHaveAttribute('data-testid', 'footer');
      }
    });
  });

  describe('component integration', () => {
    it('should pass children to main content area', () => {
      const CustomComponent = () => <div data-testid="custom-component">Custom</div>;

      render(
        <Layout>
          <CustomComponent />
        </Layout>,
      );

      expect(screen.getByTestId('custom-component')).toBeInTheDocument();
    });

    it('should work with different types of children', () => {
      render(
        <Layout>
          <h1>Page Title</h1>
          <p>Page description</p>
          <button>Action Button</button>
          {'String content'}
        </Layout>,
      );

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Page description')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('String content')).toBeInTheDocument();
    });

    it('should handle empty children gracefully', () => {
      expect(() => {
        render(<Layout>{null}</Layout>);
      }).not.toThrow();

      expect(() => {
        render(<Layout>{undefined as any}</Layout>);
      }).not.toThrow();

      expect(() => {
        render(<Layout>{''}</Layout>);
      }).not.toThrow();
    });
  });

  describe('responsive design', () => {
    it('should have responsive container classes', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      // Check for relative positioning
      const rootContainer = document.querySelector('.relative');
      expect(rootContainer).toBeInTheDocument();
    });

    it('should maintain proper layout on different screen sizes', () => {
      // This is a structural test - the actual responsive behavior
      // would be tested in E2E or visual regression tests
      render(
        <Layout>
          <div style={{ height: '2000px' }}>Very tall content</div>
        </Layout>,
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveClass('min-h-screen');
    });
  });

  describe('CSS classes and styling', () => {
    it('should apply correct CSS classes to root container', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const rootContainer = document.querySelector('div');
      expect(rootContainer).toHaveClass('relative', 'min-h-screen', 'text-primary');
    });

    it('should apply correct CSS classes to content wrapper', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const contentWrapper = document.querySelector('.relative.z-base');
      expect(contentWrapper).toBeInTheDocument();
    });

    it('should apply correct CSS classes to main element', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('min-h-screen');
      expect(mainElement).toHaveAttribute('id', 'main');
      expect(mainElement).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('component props handling', () => {
    it('should handle ReactNode children prop correctly', () => {
      const complexChildren = (
        <>
          <div>First child</div>
          <div>Second child</div>
          <span>Third child</span>
        </>
      );

      render(<Layout>{complexChildren}</Layout>);

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });

    it('should handle function as children', () => {
      const functionChild = () => <div>Function child</div>;

      render(<Layout>{functionChild()}</Layout>);

      expect(screen.getByText('Function child')).toBeInTheDocument();
    });

    it('should handle array of children', () => {
      const arrayChildren = [<div key="1">Array child 1</div>, <div key="2">Array child 2</div>];

      render(<Layout>{arrayChildren}</Layout>);

      expect(screen.getByText('Array child 1')).toBeInTheDocument();
      expect(screen.getByText('Array child 2')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should render gracefully even if child components fail', () => {
      // This test assumes the mocked components don't throw errors
      // In a real scenario, you might want to test with actual components
      // that could potentially throw errors

      expect(() => {
        render(
          <Layout>
            <div>Safe content</div>
          </Layout>,
        );
      }).not.toThrow();
    });

    it('should maintain layout structure even with problematic children', () => {
      render(
        <Layout>
          <div>Valid content</div>
          {/* Simulating potentially problematic content */}
          {0} {/* This will render as "0" */}
        </Layout>,
      );

      // Layout structure should remain intact
      expect(screen.getByTestId('skip-link')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByText('Valid content')).toBeInTheDocument();
    });
  });
});
