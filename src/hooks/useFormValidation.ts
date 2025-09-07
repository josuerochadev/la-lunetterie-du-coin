import type React from 'react';

import type { FormErrors } from './useFormSubmission';

interface ValidationMessages {
  name: string;
  email: string;
  message: string;
}

interface UseFormValidationReturn {
  getValidationMessages: () => ValidationMessages;
  // eslint-disable-next-line no-unused-vars
  handleInvalidInput: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInputChange: (
    // eslint-disable-next-line no-unused-vars
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    // eslint-disable-next-line no-unused-vars
    fieldName: keyof FormErrors,
    // eslint-disable-next-line no-unused-vars
    clearFieldError: (field: keyof FormErrors) => void,
  ) => void;
}

export function useFormValidation(): UseFormValidationReturn {
  const getValidationMessages = (): ValidationMessages => ({
    name: 'Veuillez entrer votre nom (2 caractères minimum).',
    email: 'Veuillez entrer une adresse email valide.',
    message: 'Votre message doit contenir au moins 10 caractères.',
  });

  const handleInvalidInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const messages = getValidationMessages();

    if (target.name === 'name') {
      target.setCustomValidity(messages.name);
    } else if (target.name === 'email') {
      target.setCustomValidity(messages.email);
    } else if (target.name === 'message') {
      target.setCustomValidity(messages.message);
    }
  };

  const handleInputChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,

    fieldName: keyof FormErrors,
    // eslint-disable-next-line no-unused-vars
    clearFieldError: (field: keyof FormErrors) => void,
  ) => {
    const target = e.currentTarget;

    // Clear custom validation message
    target.setCustomValidity('');

    // Clear field error if it exists
    clearFieldError(fieldName);
  };

  return {
    getValidationMessages,
    handleInvalidInput,
    handleInputChange,
  };
}

export type { ValidationMessages };
