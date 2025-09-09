import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import ContactForm from '../ContactForm';

import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useFormStatus } from '@/hooks/useFormStatus';
import { useFormValidation } from '@/hooks/useFormValidation';
import type { SubmissionResult } from '@/hooks/useFormSubmission';

// Mock the hooks
vi.mock('@/hooks/useFormSubmission', () => ({
  useFormSubmission: vi.fn(),
}));

vi.mock('@/hooks/useFormStatus', () => ({
  useFormStatus: vi.fn(),
}));

vi.mock('@/hooks/useFormValidation', () => ({
  useFormValidation: vi.fn(),
}));

// Mock the child components to focus on ContactForm logic
vi.mock('../FormField', () => ({
  default: ({ name, onInput, onInvalid, hasError, errorMessage, ...props }: any) => (
    <div data-testid={`form-field-${name}`}>
      <label htmlFor={name}>{props.label}</label>
      <input
        id={name}
        name={name}
        type={props.type === 'textarea' ? 'text' : props.type}
        placeholder={props.placeholder}
        required={props.required}
        minLength={props.minLength}
        maxLength={props.maxLength}
        onInput={onInput}
        onInvalid={onInvalid}
        data-error={hasError}
        data-error-message={errorMessage}
        {...(props.type === 'textarea' && { rows: props.rows })}
      />
    </div>
  ),
}));

vi.mock('../FormStatusMessage', () => ({
  default: ({ status, error, networkError, retryCount }: any) => (
    <div data-testid="form-status-message">
      <span data-status={status}>{status}</span>
      {error && <span data-error={error}>{error}</span>}
      {networkError && (
        <span data-network-error={networkError.message}>{networkError.message}</span>
      )}
      {retryCount > 0 && <span data-retry-count={retryCount}>{retryCount}</span>}
    </div>
  ),
}));

vi.mock('../FormSubmitButton', () => ({
  default: ({ status }: any) => (
    <button type="submit" data-status={status} data-testid="submit-button">
      {status === 'sending' ? 'Envoi...' : 'Envoyer'}
    </button>
  ),
}));

describe('ContactForm', () => {
  // Mock hook implementations
  const mockSubmitForm = vi.fn();
  const mockHandleSubmissionStart = vi.fn();
  const mockHandleSubmissionResult = vi.fn();
  const mockClearFieldError = vi.fn();
  const mockHandleInvalidInput = vi.fn();
  const mockHandleInputChange = vi.fn();

  const mockFormStatus = {
    status: 'idle' as const,
    error: '',
    fieldErrors: {},
    networkError: null,
    retryCount: 0,
    messageRef: { current: null },
    handleSubmissionStart: mockHandleSubmissionStart,
    handleSubmissionResult: mockHandleSubmissionResult,
    clearFieldError: mockClearFieldError,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up hook mocks
    vi.mocked(useFormSubmission).mockReturnValue({
      submitForm: mockSubmitForm,
    });

    vi.mocked(useFormStatus).mockReturnValue(mockFormStatus);

    vi.mocked(useFormValidation).mockReturnValue({
      getValidationMessages: vi.fn(),
      handleInvalidInput: mockHandleInvalidInput,
      handleInputChange: mockHandleInputChange,
    });
  });

  describe('rendering', () => {
    it('should render form with all fields', () => {
      render(<ContactForm />);

      expect(screen.getByTestId('form-field-name')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-email')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-message')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      expect(screen.getByTestId('form-status-message')).toBeInTheDocument();
    });

    it('should render honeypot field for spam protection', () => {
      render(<ContactForm />);

      const honeypotInput = document.querySelector('input[name="_gotcha"]') as HTMLInputElement;

      expect(honeypotInput).toBeInTheDocument();
      expect(honeypotInput).toHaveAttribute('name', '_gotcha');
      expect(honeypotInput).toHaveAttribute('tabIndex', '-1');
      expect(honeypotInput).toHaveAttribute('autoComplete', 'off');
    });

    it('should set form aria-busy attribute based on status', () => {
      const { rerender } = render(<ContactForm />);

      // Default state
      const form = document.querySelector('form')!;
      expect(form).toHaveAttribute('aria-busy', 'false');

      // Sending state
      vi.mocked(useFormStatus).mockReturnValue({
        ...mockFormStatus,
        status: 'sending',
      });

      rerender(<ContactForm />);
      expect(form).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('form fields configuration', () => {
    it('should configure name field correctly', () => {
      render(<ContactForm />);

      const nameField = screen.getByTestId('form-field-name');
      const input = nameField.querySelector('input');

      expect(input).toHaveAttribute('name', 'name');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'Votre nom');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('minLength', '2');
      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('should configure email field correctly', () => {
      render(<ContactForm />);

      const emailField = screen.getByTestId('form-field-email');
      const input = emailField.querySelector('input');

      expect(input).toHaveAttribute('name', 'email');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'Votre email');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('maxLength', '64');
    });

    it('should configure message field correctly', () => {
      render(<ContactForm />);

      const messageField = screen.getByTestId('form-field-message');
      const input = messageField.querySelector('input');

      expect(input).toHaveAttribute('name', 'message');
      expect(input).toHaveAttribute('placeholder', 'Votre message...');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('minLength', '10');
      expect(input).toHaveAttribute('maxLength', '1000');
      expect(input).toHaveAttribute('rows', '5');
    });
  });

  describe('form submission', () => {
    it('should handle form submission correctly', async () => {
      const mockResult: SubmissionResult = { success: true };
      mockSubmitForm.mockResolvedValue(mockResult);

      render(<ContactForm />);

      const form = document.querySelector('form')!;
      fireEvent.submit(form);

      expect(mockHandleSubmissionStart).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(mockSubmitForm).toHaveBeenCalledTimes(1);
        expect(mockHandleSubmissionResult).toHaveBeenCalledWith(mockResult);
      });
    });

    it('should handle submission errors', async () => {
      const mockResult: SubmissionResult = {
        success: false,
        error: 'Network error',
        fieldErrors: { email: 'Invalid email' },
      };
      mockSubmitForm.mockResolvedValue(mockResult);

      render(<ContactForm />);

      const form = document.querySelector('form')!;
      fireEvent.submit(form);

      expect(mockHandleSubmissionStart).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(mockSubmitForm).toHaveBeenCalledTimes(1);
        expect(mockHandleSubmissionResult).toHaveBeenCalledWith(mockResult);
      });
    });

    it('should pass form event to submitForm', async () => {
      const mockResult: SubmissionResult = { success: true };
      mockSubmitForm.mockResolvedValue(mockResult);

      render(<ContactForm />);

      const form = document.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockSubmitForm).toHaveBeenCalledWith(expect.any(Object));
        // Verify it's called with the form event
        const calledEvent = mockSubmitForm.mock.calls[0][0];
        expect(calledEvent.target).toBe(form);
      });
    });
  });

  describe('field validation integration', () => {
    it('should call validation handlers on field input', () => {
      render(<ContactForm />);

      const nameField = screen.getByTestId('form-field-name');
      const nameInput = nameField.querySelector('input')!;

      fireEvent.input(nameInput, { target: { value: 'John' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith(
        expect.any(Object),
        'name',
        mockClearFieldError,
      );
    });

    it('should call validation handlers on field invalid', () => {
      render(<ContactForm />);

      const nameField = screen.getByTestId('form-field-name');
      const nameInput = nameField.querySelector('input')!;

      fireEvent.invalid(nameInput);

      expect(mockHandleInvalidInput).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should handle input change for different fields', () => {
      render(<ContactForm />);

      // Test name field
      const nameInput = screen.getByTestId('form-field-name').querySelector('input')!;
      fireEvent.input(nameInput);
      expect(mockHandleInputChange).toHaveBeenCalledWith(
        expect.any(Object),
        'name',
        mockClearFieldError,
      );

      // Test email field
      const emailInput = screen.getByTestId('form-field-email').querySelector('input')!;
      fireEvent.input(emailInput);
      expect(mockHandleInputChange).toHaveBeenCalledWith(
        expect.any(Object),
        'email',
        mockClearFieldError,
      );

      // Test message field
      const messageInput = screen.getByTestId('form-field-message').querySelector('input')!;
      fireEvent.input(messageInput);
      expect(mockHandleInputChange).toHaveBeenCalledWith(
        expect.any(Object),
        'message',
        mockClearFieldError,
      );
    });
  });

  describe('error state display', () => {
    it('should display field errors', () => {
      vi.mocked(useFormStatus).mockReturnValue({
        ...mockFormStatus,
        fieldErrors: {
          name: 'Name is required',
          email: 'Invalid email format',
        },
      });

      render(<ContactForm />);

      const nameField = screen.getByTestId('form-field-name');
      const emailField = screen.getByTestId('form-field-email');

      expect(nameField.querySelector('input')).toHaveAttribute('data-error', 'true');
      expect(nameField.querySelector('input')).toHaveAttribute(
        'data-error-message',
        'Name is required',
      );

      expect(emailField.querySelector('input')).toHaveAttribute('data-error', 'true');
      expect(emailField.querySelector('input')).toHaveAttribute(
        'data-error-message',
        'Invalid email format',
      );
    });

    it('should not show errors when fields are valid', () => {
      vi.mocked(useFormStatus).mockReturnValue({
        ...mockFormStatus,
        fieldErrors: {},
      });

      render(<ContactForm />);

      const nameField = screen.getByTestId('form-field-name');
      expect(nameField.querySelector('input')).toHaveAttribute('data-error', 'false');
    });
  });

  describe('status integration', () => {
    it('should pass status to child components', () => {
      vi.mocked(useFormStatus).mockReturnValue({
        ...mockFormStatus,
        status: 'sending',
        error: 'Network error',
        retryCount: 2,
      });

      render(<ContactForm />);

      // Check status message component receives props
      const statusMessage = screen.getByTestId('form-status-message');
      expect(statusMessage.querySelector('[data-status="sending"]')).toBeInTheDocument();
      expect(statusMessage.querySelector('[data-error="Network error"]')).toBeInTheDocument();
      expect(statusMessage.querySelector('[data-retry-count="2"]')).toBeInTheDocument();

      // Check submit button receives status
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toHaveAttribute('data-status', 'sending');
    });

    it('should display different statuses correctly', () => {
      const statuses = ['idle', 'sending', 'success', 'error'] as const;

      statuses.forEach((status) => {
        vi.mocked(useFormStatus).mockReturnValue({
          ...mockFormStatus,
          status,
        });

        const { rerender } = render(<ContactForm />);

        expect(
          screen.getByTestId('form-status-message').querySelector(`[data-status="${status}"]`),
        ).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toHaveAttribute('data-status', status);

        rerender(<div />); // Clear between tests
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper form structure', () => {
      render(<ContactForm />);

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();

      // Should have labels for form fields
      expect(screen.getByLabelText('Nom')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
    });

    it('should hide honeypot field from screen readers', () => {
      render(<ContactForm />);

      const honeypotInput = document.querySelector('input[name="_gotcha"]') as HTMLInputElement;
      const honeypotContainer = honeypotInput.closest('div');
      expect(honeypotContainer).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
