import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  validateHoneypot,
  createFormRequest,
  handleResponse,
  handleError,
} from '../formSubmissionHelpers';

describe('formSubmissionHelpers', () => {
  describe('validateHoneypot', () => {
    it('should return true if honeypot field is filled', () => {
      const formData = new FormData();
      formData.append('_gotcha', 'bot-value');

      expect(validateHoneypot(formData)).toBe(true);
    });

    it('should return false if honeypot field is empty', () => {
      const formData = new FormData();

      expect(validateHoneypot(formData)).toBe(false);
    });

    it('should return false if honeypot field is empty string', () => {
      const formData = new FormData();
      formData.append('_gotcha', '');

      expect(validateHoneypot(formData)).toBe(false);
    });
  });

  describe('createFormRequest', () => {
    it('should create a POST request with correct configuration', () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      const controller = new AbortController();

      const request = createFormRequest(formData, controller.signal);

      expect(request.method).toBe('POST');
      expect(request.body).toBe(formData);
      expect(request.headers).toEqual({ Accept: 'application/json' });
      expect(request.signal).toBe(controller.signal);
    });

    it('should add _subject field if not present', () => {
      const formData = new FormData();
      const controller = new AbortController();

      createFormRequest(formData, controller.signal);

      expect(formData.get('_subject')).toBe('Nouveau message - La Lunetterie du Coin');
    });

    it('should not override existing _subject field', () => {
      const formData = new FormData();
      formData.append('_subject', 'Custom subject');
      const controller = new AbortController();

      createFormRequest(formData, controller.signal);

      expect(formData.get('_subject')).toBe('Custom subject');
    });
  });

  describe('handleResponse', () => {
    beforeEach(() => {
      vi.stubGlobal('navigator', { vibrate: vi.fn(), onLine: true });
    });

    it('should return success for ok response', async () => {
      const response = new Response(null, { status: 200 });

      const result = await handleResponse(response, 0);

      expect(result.success).toBe(true);
      expect(navigator.vibrate).toHaveBeenCalledWith([100, 50, 100]);
    });

    it('should handle error response with generic error', async () => {
      const response = new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await handleResponse(response, 2);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.networkError).toBeDefined();
      expect(result.retryCount).toBe(2);
    });

    it('should handle validation errors with field-specific errors', async () => {
      const errorData = {
        errors: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'name', message: 'Name is required' },
        ],
      };

      const response = new Response(JSON.stringify(errorData), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await handleResponse(response, 0);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Veuillez corriger les erreurs dans le formulaire.');
      expect(result.fieldErrors).toEqual({
        email: 'Invalid email format',
        name: 'Name is required',
      });
    });

    it('should handle malformed validation error response', async () => {
      const response = new Response('Invalid JSON', {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await handleResponse(response, 0);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should not vibrate if navigator.vibrate is not available', async () => {
      vi.stubGlobal('navigator', {});
      const response = new Response(null, { status: 200 });

      const result = await handleResponse(response, 0);

      expect(result.success).toBe(true);
    });
  });

  describe('handleError', () => {
    beforeEach(() => {
      vi.stubGlobal('navigator', { vibrate: vi.fn(), onLine: true });
    });

    it('should handle generic errors', () => {
      const error = new Error('Network failure');

      const result = handleError(error, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.networkError).toBeDefined();
      expect(result.retryCount).toBe(1);
      expect(navigator.vibrate).toHaveBeenCalled();
    });

    it('should handle abort errors', () => {
      const error = new DOMException('Aborted', 'AbortError');

      const result = handleError(error, 0);

      expect(result.success).toBe(false);
      expect(result.networkError).toBeDefined();
    });

    it('should handle unknown error types', () => {
      const error = 'String error';

      const result = handleError(error, 0);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
