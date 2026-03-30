import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { ToastProvider } from '../Toast';

import { useToast } from '@/hooks/useToast';

/** Helper component that exposes toast() via buttons for testing. */
function TestConsumer() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast('Info message')}>Show Info</button>
      <button onClick={() => toast('Success message', 'success')}>Show Success</button>
      <button onClick={() => toast('Error message', 'error')}>Show Error</button>
    </div>
  );
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render children', () => {
    render(
      <ToastProvider>
        <div data-testid="child">Hello</div>
      </ToastProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should provide toast context so useToast works inside provider', () => {
    expect(() => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>,
      );
    }).not.toThrow();
  });

  it('should throw when useToast is used outside provider', () => {
    // Suppress React error boundary console noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useToast must be used within ToastProvider');

    spy.mockRestore();
  });

  it('should show toast message when toast() is called', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Show Info'));
    });

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should show success icon for success type', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Show Success'));
    });

    const statusElements = screen.getAllByRole('status');
    const successToast = statusElements.find((el) => el.textContent?.includes('Success message'));
    expect(successToast).toBeDefined();

    // The Check icon (success) renders an SVG inside the toast
    const svg = successToast!.querySelector('svg.text-secondary-green');
    expect(svg).toBeInTheDocument();
  });

  it('should show error icon for error type', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Show Error'));
    });

    const statusElements = screen.getAllByRole('status');
    const errorToast = statusElements.find((el) => el.textContent?.includes('Error message'));
    expect(errorToast).toBeDefined();

    // The X icon (error) renders an SVG with text-red-600
    const svg = errorToast!.querySelector('svg.text-red-600');
    expect(svg).toBeInTheDocument();
  });

  it('should dismiss toast when dismiss button is clicked', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Show Info'));
    });

    expect(screen.getByText('Info message')).toBeInTheDocument();

    const dismissButton = screen.getByLabelText('Fermer');
    act(() => {
      fireEvent.click(dismissButton);
    });

    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
  });

  it('should auto-remove toast after TOAST_DURATION (3500ms)', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Show Info'));
    });

    expect(screen.getByText('Info message')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
  });

  it('should not remove toast before duration elapses', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Show Info'));
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should show multiple toasts at the same time', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Show Info'));
      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));
    });

    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();

    const statusElements = screen.getAllByRole('status');
    expect(statusElements).toHaveLength(3);
  });
});
