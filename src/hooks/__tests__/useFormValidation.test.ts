import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useFormValidation } from '../useFormValidation';

import type { FormErrors } from '../useFormSubmission';

describe('useFormValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should return all required functions', () => {
      const { result } = renderHook(() => useFormValidation());

      expect(typeof result.current.getValidationMessages).toBe('function');
      expect(typeof result.current.handleInvalidInput).toBe('function');
      expect(typeof result.current.handleInputChange).toBe('function');
    });
  });

  describe('getValidationMessages', () => {
    it('should return all validation messages in French', () => {
      const { result } = renderHook(() => useFormValidation());

      const messages = result.current.getValidationMessages();

      expect(messages).toEqual({
        name: 'Veuillez entrer votre nom (2 caractères minimum).',
        email: 'Veuillez entrer une adresse email valide.',
        message: 'Votre message doit contenir au moins 10 caractères.',
      });
    });

    it('should return consistent messages on multiple calls', () => {
      const { result } = renderHook(() => useFormValidation());

      const messages1 = result.current.getValidationMessages();
      const messages2 = result.current.getValidationMessages();

      expect(messages1).toEqual(messages2);
    });
  });

  describe('handleInvalidInput', () => {
    let mockSetCustomValidity: ReturnType<typeof vi.fn>;
    let mockEvent: Partial<React.FormEvent<HTMLInputElement>>;

    beforeEach(() => {
      mockSetCustomValidity = vi.fn();
      
      mockEvent = {
        currentTarget: {
          name: 'name',
          setCustomValidity: mockSetCustomValidity,
        } as unknown as HTMLInputElement,
      };
    });

    it('should set custom validity message for name field', () => {
      const { result } = renderHook(() => useFormValidation());

      mockEvent.currentTarget!.name = 'name';

      act(() => {
        result.current.handleInvalidInput(mockEvent as React.FormEvent<HTMLInputElement>);
      });

      expect(mockSetCustomValidity).toHaveBeenCalledWith('Veuillez entrer votre nom (2 caractères minimum).');
    });

    it('should set custom validity message for email field', () => {
      const { result } = renderHook(() => useFormValidation());

      mockEvent.currentTarget!.name = 'email';

      act(() => {
        result.current.handleInvalidInput(mockEvent as React.FormEvent<HTMLInputElement>);
      });

      expect(mockSetCustomValidity).toHaveBeenCalledWith('Veuillez entrer une adresse email valide.');
    });

    it('should set custom validity message for message field', () => {
      const { result } = renderHook(() => useFormValidation());

      mockEvent.currentTarget!.name = 'message';

      act(() => {
        result.current.handleInvalidInput(mockEvent as React.FormEvent<HTMLTextAreaElement>);
      });

      expect(mockSetCustomValidity).toHaveBeenCalledWith('Votre message doit contenir au moins 10 caractères.');
    });

    it('should not set custom validity for unknown field', () => {
      const { result } = renderHook(() => useFormValidation());

      mockEvent.currentTarget!.name = 'unknown';

      act(() => {
        result.current.handleInvalidInput(mockEvent as React.FormEvent<HTMLInputElement>);
      });

      expect(mockSetCustomValidity).not.toHaveBeenCalled();
    });

    it('should work with textarea elements', () => {
      const { result } = renderHook(() => useFormValidation());

      const mockTextareaEvent = {
        currentTarget: {
          name: 'message',
          setCustomValidity: mockSetCustomValidity,
        } as unknown as HTMLTextAreaElement,
      };

      act(() => {
        result.current.handleInvalidInput(mockTextareaEvent as React.FormEvent<HTMLTextAreaElement>);
      });

      expect(mockSetCustomValidity).toHaveBeenCalledWith('Votre message doit contenir au moins 10 caractères.');
    });
  });

  describe('handleInputChange', () => {
    let mockSetCustomValidity: ReturnType<typeof vi.fn>;
    let mockClearFieldError: ReturnType<typeof vi.fn>;
    let mockEvent: Partial<React.FormEvent<HTMLInputElement>>;

    beforeEach(() => {
      mockSetCustomValidity = vi.fn();
      mockClearFieldError = vi.fn();
      
      mockEvent = {
        currentTarget: {
          name: 'name',
          setCustomValidity: mockSetCustomValidity,
        } as unknown as HTMLInputElement,
      };
    });

    it('should clear custom validity message', () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleInputChange(
          mockEvent as React.FormEvent<HTMLInputElement>,
          'name',
          mockClearFieldError
        );
      });

      expect(mockSetCustomValidity).toHaveBeenCalledWith('');
    });

    it('should clear field error for name field', () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleInputChange(
          mockEvent as React.FormEvent<HTMLInputElement>,
          'name',
          mockClearFieldError
        );
      });

      expect(mockClearFieldError).toHaveBeenCalledWith('name');
    });

    it('should clear field error for email field', () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleInputChange(
          mockEvent as React.FormEvent<HTMLInputElement>,
          'email',
          mockClearFieldError
        );
      });

      expect(mockClearFieldError).toHaveBeenCalledWith('email');
    });

    it('should clear field error for message field', () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleInputChange(
          mockEvent as React.FormEvent<HTMLInputElement>,
          'message',
          mockClearFieldError
        );
      });

      expect(mockClearFieldError).toHaveBeenCalledWith('message');
    });

    it('should work with textarea elements', () => {
      const { result } = renderHook(() => useFormValidation());

      const mockTextareaEvent = {
        currentTarget: {
          name: 'message',
          setCustomValidity: mockSetCustomValidity,
        } as unknown as HTMLTextAreaElement,
      };

      act(() => {
        result.current.handleInputChange(
          mockTextareaEvent as React.FormEvent<HTMLTextAreaElement>,
          'message',
          mockClearFieldError
        );
      });

      expect(mockSetCustomValidity).toHaveBeenCalledWith('');
      expect(mockClearFieldError).toHaveBeenCalledWith('message');
    });

    it('should handle multiple field changes independently', () => {
      const { result } = renderHook(() => useFormValidation());

      // Change name field
      act(() => {
        result.current.handleInputChange(
          mockEvent as React.FormEvent<HTMLInputElement>,
          'name',
          mockClearFieldError
        );
      });

      expect(mockClearFieldError).toHaveBeenCalledWith('name');

      mockClearFieldError.mockClear();

      // Change email field
      mockEvent.currentTarget!.name = 'email';
      act(() => {
        result.current.handleInputChange(
          mockEvent as React.FormEvent<HTMLInputElement>,
          'email',
          mockClearFieldError
        );
      });

      expect(mockClearFieldError).toHaveBeenCalledWith('email');
    });
  });

  describe('integration behavior', () => {
    it('should work together for complete validation flow', () => {
      const { result } = renderHook(() => useFormValidation());

      const mockSetCustomValidity = vi.fn();
      const mockClearFieldError = vi.fn();

      const mockElement = {
        name: 'name',
        setCustomValidity: mockSetCustomValidity,
      } as unknown as HTMLInputElement;

      const mockInvalidEvent = {
        currentTarget: mockElement,
      };

      const mockChangeEvent = {
        currentTarget: mockElement,
      };

      // Simulate invalid input first
      act(() => {
        result.current.handleInvalidInput(mockInvalidEvent as React.FormEvent<HTMLInputElement>);
      });

      expect(mockSetCustomValidity).toHaveBeenCalledWith('Veuillez entrer votre nom (2 caractères minimum).');

      mockSetCustomValidity.mockClear();

      // Then simulate input change to clear the error
      act(() => {
        result.current.handleInputChange(
          mockChangeEvent as React.FormEvent<HTMLInputElement>,
          'name',
          mockClearFieldError
        );
      });

      expect(mockSetCustomValidity).toHaveBeenCalledWith('');
      expect(mockClearFieldError).toHaveBeenCalledWith('name');
    });

    it('should maintain validation messages consistency', () => {
      const { result } = renderHook(() => useFormValidation());

      const initialMessages = result.current.getValidationMessages();

      // Simulate some interactions
      const mockSetCustomValidity = vi.fn();
      const mockClearFieldError = vi.fn();

      const mockEvent = {
        currentTarget: {
          name: 'name',
          setCustomValidity: mockSetCustomValidity,
        } as unknown as HTMLInputElement,
      };

      act(() => {
        result.current.handleInvalidInput(mockEvent as React.FormEvent<HTMLInputElement>);
        result.current.handleInputChange(
          mockEvent as React.FormEvent<HTMLInputElement>,
          'name',
          mockClearFieldError
        );
      });

      // Messages should remain the same
      const finalMessages = result.current.getValidationMessages();
      expect(initialMessages).toEqual(finalMessages);
    });
  });
});