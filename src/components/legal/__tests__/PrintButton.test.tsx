import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import PrintButton from '../PrintButton';

// Mock Button component
vi.mock('@/components/common/Button', () => ({
  default: ({ children, onClick, type, ...props }: any) => (
    <button type={type} onClick={onClick} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

// Mock Lucide icon
vi.mock('lucide-react/dist/esm/icons/printer', () => ({
  default: ({ className, ...props }: any) => (
    <svg data-testid="printer-icon" className={className} {...props} aria-hidden="true">
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

    it('should have printer icon', () => {
      render(<PrintButton />);

      const icon = screen.getByTestId('printer-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
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

    it('should have icon marked as decorative', () => {
      render(<PrintButton />);
      expect(screen.getByTestId('printer-icon')).toHaveAttribute('aria-hidden', 'true');
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
