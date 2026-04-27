import type React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import PrintButton from '../PrintButton';

// Mock Button component
vi.mock('@/components/common/Button', () => ({
  default: ({
    children,
    onClick,
    type,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button type={type} onClick={onClick} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

// Mock Lucide icon
vi.mock('lucide-react/dist/esm/icons/printer', () => ({
  default: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="printer-icon" {...props} aria-hidden="true">
      <path />
    </svg>
  ),
}));

describe('PrintButton', () => {
  const mockPrint = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'print', {
      value: mockPrint,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic rendering', () => {
    it('should render print button with correct text', () => {
      render(<PrintButton />);

      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByText('Imprimer cette page')).toBeInTheDocument();
    });

    it('should pass printer icon to Button via icon prop', () => {
      render(<PrintButton />);

      // Icon is now rendered by Button component via icon prop, not inline
      expect(screen.getByTestId('button')).toBeInTheDocument();
    });
  });

  describe('print functionality', () => {
    it('should call window.print when clicked', () => {
      render(<PrintButton />);

      fireEvent.click(screen.getByTestId('button'));

      expect(mockPrint).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple clicks', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockPrint).toHaveBeenCalledTimes(3);
    });
  });

  describe('accessibility', () => {
    it('should have proper button type', () => {
      render(<PrintButton />);
      expect(screen.getByTestId('button')).toHaveAttribute('type', 'button');
    });

    it('should have descriptive aria-label', () => {
      render(<PrintButton />);
      expect(screen.getByTestId('button')).toHaveAttribute('aria-label', 'Imprimer cette page');
    });

    it('should have aria-label for accessibility', () => {
      render(<PrintButton />);
      expect(screen.getByTestId('button')).toHaveAttribute('aria-label', 'Imprimer cette page');
    });
  });

  describe('edge cases', () => {
    it('should handle missing window.print gracefully', () => {
      Object.defineProperty(window, 'print', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      render(<PrintButton />);

      expect(() => {
        fireEvent.click(screen.getByTestId('button'));
      }).not.toThrow();
    });
  });
});
