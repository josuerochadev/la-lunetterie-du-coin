import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { MotionProvider } from '../MotionProvider';
import { MotionCtx } from '../MotionContext';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Mock usePrefersReducedMotion hook
vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(),
}));

// Get the mocked function
const mockUsePrefersReducedMotion = vi.mocked(usePrefersReducedMotion);

// Test component that uses motion context
const TestChild = () => <div data-testid="test-child">Test Content</div>;

describe('MotionProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset document attributes
    document.documentElement.removeAttribute('data-prm');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute('data-prm');
  });

  describe('basic functionality', () => {
    it('should render children correctly', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      render(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should provide motion context to children', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      const { container } = render(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('motion preference handling', () => {
    it('should set data-prm to "no-preference" when motion is allowed', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      render(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');
    });

    it('should set data-prm to "reduce" when reduced motion is preferred', () => {
      mockUsePrefersReducedMotion.mockReturnValue(true);

      render(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(document.documentElement.getAttribute('data-prm')).toBe('reduce');
    });

    it('should update data-prm when motion preference changes', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      const { rerender } = render(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');

      // Change preference
      mockUsePrefersReducedMotion.mockReturnValue(true);

      rerender(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(document.documentElement.getAttribute('data-prm')).toBe('reduce');
    });
  });

  describe('context value', () => {
    it('should provide false when motion is allowed', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      const TestConsumer = () => {
        const prm = React.useContext(MotionCtx);
        return <div data-testid="context-value">{prm ? 'reduced' : 'normal'}</div>;
      };

      render(
        <MotionProvider>
          <TestConsumer />
        </MotionProvider>,
      );

      expect(screen.getByTestId('context-value')).toHaveTextContent('normal');
    });

    it('should provide true when reduced motion is preferred', () => {
      mockUsePrefersReducedMotion.mockReturnValue(true);

      const TestConsumer = () => {
        const prm = React.useContext(MotionCtx);
        return <div data-testid="context-value">{prm ? 'reduced' : 'normal'}</div>;
      };

      render(
        <MotionProvider>
          <TestConsumer />
        </MotionProvider>,
      );

      expect(screen.getByTestId('context-value')).toHaveTextContent('reduced');
    });
  });

  describe('multiple children', () => {
    it('should handle multiple child components', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      render(
        <MotionProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </MotionProvider>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');
    });

    it('should handle nested components', () => {
      mockUsePrefersReducedMotion.mockReturnValue(true);

      const NestedComponent = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="nested-wrapper">{children}</div>
      );

      render(
        <MotionProvider>
          <NestedComponent>
            <div data-testid="deeply-nested">Deeply nested content</div>
          </NestedComponent>
        </MotionProvider>,
      );

      expect(screen.getByTestId('nested-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('deeply-nested')).toBeInTheDocument();
      expect(document.documentElement.getAttribute('data-prm')).toBe('reduce');
    });
  });

  describe('edge cases', () => {
    it('should handle empty children', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      expect(() => {
        render(<MotionProvider>{null}</MotionProvider>);
      }).not.toThrow();

      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');
    });

    it('should handle undefined children', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      expect(() => {
        render(<MotionProvider>{undefined}</MotionProvider>);
      }).not.toThrow();

      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');
    });

    it('should handle false children', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      expect(() => {
        render(<MotionProvider>{false}</MotionProvider>);
      }).not.toThrow();

      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');
    });

    it('should handle mixed valid and invalid children', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      render(
        <MotionProvider>
          {null}
          <div data-testid="valid-child">Valid</div>
          {false}
          {undefined}
        </MotionProvider>,
      );

      expect(screen.getByTestId('valid-child')).toBeInTheDocument();
      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');
    });
  });

  describe('DOM attribute management', () => {
    it('should not interfere with existing data-prm attribute when component unmounts', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      const { unmount } = render(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');

      unmount();

      // Attribute should remain after unmount (last known state)
      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');
    });

    it('should handle rapid mount/unmount cycles', () => {
      mockUsePrefersReducedMotion.mockReturnValue(true);

      for (let i = 0; i < 5; i++) {
        const { unmount } = render(
          <MotionProvider>
            <TestChild />
          </MotionProvider>,
        );

        expect(document.documentElement.getAttribute('data-prm')).toBe('reduce');
        unmount();
      }
    });

    it('should handle multiple MotionProvider instances', () => {
      mockUsePrefersReducedMotion.mockReturnValue(true);

      render(
        <>
          <MotionProvider>
            <div data-testid="provider-1">Provider 1</div>
          </MotionProvider>
          <MotionProvider>
            <div data-testid="provider-2">Provider 2</div>
          </MotionProvider>
        </>,
      );

      expect(screen.getByTestId('provider-1')).toBeInTheDocument();
      expect(screen.getByTestId('provider-2')).toBeInTheDocument();
      expect(document.documentElement.getAttribute('data-prm')).toBe('reduce');
    });
  });

  describe('hook integration', () => {
    it('should call usePrefersReducedMotion hook', () => {
      mockUsePrefersReducedMotion.mockReturnValue(false);

      render(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(mockUsePrefersReducedMotion).toHaveBeenCalledTimes(1);
    });

    it('should react to hook changes', () => {
      let hookValue = false;
      mockUsePrefersReducedMotion.mockImplementation(() => hookValue);

      const { rerender } = render(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');

      // Change hook value
      hookValue = true;
      rerender(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(document.documentElement.getAttribute('data-prm')).toBe('reduce');
    });

    it('should handle hook returning undefined', () => {
      mockUsePrefersReducedMotion.mockReturnValue(undefined as any);

      render(
        <MotionProvider>
          <TestChild />
        </MotionProvider>,
      );

      expect(document.documentElement.getAttribute('data-prm')).toBe('no-preference');
    });

    it('should handle hook throwing an error', () => {
      mockUsePrefersReducedMotion.mockImplementation(() => {
        throw new Error('Hook error');
      });

      expect(() => {
        render(
          <MotionProvider>
            <TestChild />
          </MotionProvider>,
        );
      }).toThrow('Hook error');
    });
  });
});
