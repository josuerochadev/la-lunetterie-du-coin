// src/components/common/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Button from './Button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should apply default type button', () => {
    render(<Button>Test</Button>);

    const button = screen.getByText('Test');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should apply light theme text color by default', () => {
    render(<Button>Test</Button>);

    const button = screen.getByText('Test');
    expect(button.className).toContain('text-black');
  });

  it('should apply dark theme text color', () => {
    render(<Button theme="dark">Test</Button>);

    const button = screen.getByText('Test');
    expect(button.className).toContain('text-white');
  });

  it('should merge custom className', () => {
    render(<Button className="custom-class">Test</Button>);

    const button = screen.getByText('Test');
    expect(button.className).toContain('custom-class');
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByText('Click me');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should support submit type', () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('should render underline element', () => {
    const { container } = render(<Button>Test</Button>);

    const underline = container.querySelector('[aria-hidden="true"]');
    expect(underline).toBeInTheDocument();
  });

  it('should forward all HTML button attributes', () => {
    render(
      <Button data-testid="test-button" aria-label="Test button" tabIndex={0}>
        Test
      </Button>,
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('aria-label', 'Test button');
    expect(button).toHaveAttribute('tabIndex', '0');
  });
});
