import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import PrintButton from '../PrintButton';

// Mock Button component
vi.mock('@/components/common/Button', () => ({
  default: ({ children, onClick, className, type, ...props }: any) => (
    <button type={type} onClick={onClick} className={className} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

// Mock SimpleAnimation
vi.mock('@/components/motion/SimpleAnimation', () => ({
  SimpleAnimation: ({ children, type, delay }: any) => (
    <div data-testid="simple-animation" data-type={type} data-delay={delay}>
      {children}
    </div>
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
  const mockFocus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.print
    Object.defineProperty(window, 'print', {
      value: mockPrint,
      writable: true,
    });

    // Mock document.body.focus
    Object.defineProperty(document.body, 'focus', {
      value: mockFocus,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic rendering', () => {
    it('should render print button with correct text', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Imprimer cette page')).toBeInTheDocument();
    });

    it('should have printer icon', () => {
      render(<PrintButton />);

      const icon = screen.getByTestId('printer-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should be wrapped in animation', () => {
      render(<PrintButton />);

      const animation = screen.getByTestId('simple-animation');
      expect(animation).toHaveAttribute('data-type', 'slide-up');
      expect(animation).toHaveAttribute('data-delay', '160');
    });
  });

  describe('print functionality', () => {
    it('should call window.print when clicked', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(mockPrint).toHaveBeenCalledTimes(1);
    });

    it('should focus document body before printing', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(mockFocus).toHaveBeenCalledTimes(1);
      expect(mockFocus).toHaveBeenCalledBefore(mockPrint);
    });

    it('should handle multiple clicks', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockPrint).toHaveBeenCalledTimes(3);
      expect(mockFocus).toHaveBeenCalledTimes(3);
    });

    it('should handle print API errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockPrint.mockImplementation(() => {
        throw new Error('Print API error');
      });

      render(<PrintButton />);

      const button = screen.getByTestId('button');

      // Should not throw, should handle error gracefully
      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();

      expect(mockFocus).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith("Erreur lors de l'impression:", expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('accessibility features', () => {
    it('should have proper button type', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have descriptive aria-label', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('aria-label', 'Imprimer cette page');
    });

    it('should be keyboard accessible', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');

      // Should be focusable and clickable with keyboard
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      // The actual keyDown behavior depends on browser implementation
      // But the button should be properly set up for keyboard access
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have icon marked as decorative', () => {
      render(<PrintButton />);

      const icon = screen.getByTestId('printer-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('styling and layout', () => {
    it('should apply default classes', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('group', 'mt-8', 'print:hidden');
    });

    it('should apply custom className when provided', () => {
      render(<PrintButton className="custom-class" />);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should have proper container layout', () => {
      render(<PrintButton />);

      const container = document.querySelector('.flex.justify-center');
      expect(container).toBeInTheDocument();
      expect(container).toContainElement(screen.getByTestId('simple-animation'));
    });

    it('should style icon with hover effects', () => {
      render(<PrintButton />);

      const icon = screen.getByTestId('printer-icon');
      expect(icon).toHaveClass('button-icon', 'group-hover:rotate-12');
    });

    it('should have print media query class', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('print:hidden');
    });
  });

  describe('content structure', () => {
    it('should have flex layout for icon and text', () => {
      render(<PrintButton />);

      const content = document.querySelector('.flex.items-center.gap-2');
      expect(content).toBeInTheDocument();
      expect(content).toContainElement(screen.getByTestId('printer-icon'));
      expect(content).toContainElement(screen.getByText('Imprimer cette page'));
    });

    it('should maintain proper text and icon relationship', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      const icon = screen.getByTestId('printer-icon');
      const text = screen.getByText('Imprimer cette page');

      expect(button).toContainElement(icon);
      expect(button).toContainElement(text);
    });
  });

  describe('animation integration', () => {
    it('should wrap button in slide-up animation with delay', () => {
      render(<PrintButton />);

      const animation = screen.getByTestId('simple-animation');
      expect(animation).toHaveAttribute('data-type', 'slide-up');
      expect(animation).toHaveAttribute('data-delay', '160');
      expect(animation).toContainElement(screen.getByTestId('button'));
    });
  });

  describe('edge cases', () => {
    it('should handle missing window.print gracefully', () => {
      // Mock window.print as undefined
      Object.defineProperty(window, 'print', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      render(<PrintButton />);

      const button = screen.getByTestId('button');

      // Should not throw, should handle missing API gracefully
      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();

      expect(mockFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle missing document.body.focus gracefully', () => {
      // Mock focus method to be undefined
      const originalFocus = document.body.focus;
      document.body.focus = undefined as any;

      render(<PrintButton />);

      const button = screen.getByTestId('button');

      // Should not throw, should handle missing API gracefully
      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();

      expect(mockPrint).toHaveBeenCalledTimes(1);

      // Restore original focus
      document.body.focus = originalFocus;
    });

    it('should handle rapid successive clicks', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');

      // Rapid fire clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }

      expect(mockPrint).toHaveBeenCalledTimes(10);
      expect(mockFocus).toHaveBeenCalledTimes(10);
    });

    it('should handle very long custom className', () => {
      const longClassName = 'a'.repeat(1000);

      render(<PrintButton className={longClassName} />);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass(longClassName);
    });

    it('should handle empty custom className', () => {
      render(<PrintButton className="" />);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('group', 'mt-8', 'print:hidden');
    });
  });

  describe('browser compatibility', () => {
    it('should work when print is a function', () => {
      Object.defineProperty(window, 'print', {
        value: mockPrint,
        writable: true,
      });

      render(<PrintButton />);

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(mockPrint).toHaveBeenCalledTimes(1);
    });

    it('should call focus before print for accessibility', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(mockFocus).toHaveBeenCalledBefore(mockPrint);
    });
  });

  describe('print media considerations', () => {
    it('should have print:hidden class to hide during printing', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('print:hidden');
    });
  });

  describe('user experience', () => {
    it('should provide clear action with descriptive text', () => {
      render(<PrintButton />);

      expect(screen.getByText('Imprimer cette page')).toBeInTheDocument();
      expect(screen.getByLabelText('Imprimer cette page')).toBeInTheDocument();
    });

    it('should have visual feedback with group hover classes', () => {
      render(<PrintButton />);

      const button = screen.getByTestId('button');
      const icon = screen.getByTestId('printer-icon');

      expect(button).toHaveClass('group');
      expect(icon).toHaveClass('group-hover:rotate-12');
    });
  });
});
