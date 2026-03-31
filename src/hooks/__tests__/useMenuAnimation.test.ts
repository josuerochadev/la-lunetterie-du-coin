import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useMenuAnimation } from '../useMenuAnimation';

describe('useMenuAnimation', () => {
  const mockOnClose = vi.fn();
  let mockElement: HTMLElement;
  let menuRef: { current: HTMLElement };

  beforeEach(() => {
    vi.clearAllMocks();

    mockElement = document.createElement('div');
    mockElement.focus = vi.fn();
    mockElement.setAttribute('tabindex', '-1');
    menuRef = { current: mockElement };

    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('when menu is closed', () => {
    it('should do nothing when menu is closed', () => {
      renderHook(() => useMenuAnimation(false, mockOnClose, menuRef));

      expect(document.body.style.overflow).toBe('');
      expect(mockElement.focus).not.toHaveBeenCalled();
    });
  });

  describe('when menu is open', () => {
    it('should block body scroll when open', () => {
      renderHook(() => useMenuAnimation(true, mockOnClose, menuRef));

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should focus the menu element when opened', () => {
      renderHook(() => useMenuAnimation(true, mockOnClose, menuRef));

      expect(mockElement.focus).toHaveBeenCalled();
    });

    it('should restore body scroll on unmount', () => {
      const { unmount } = renderHook(() => useMenuAnimation(true, mockOnClose, menuRef));

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
    });

    it('should restore body scroll when isOpen changes to false', () => {
      let isOpen = true;
      const { rerender } = renderHook(() => useMenuAnimation(isOpen, mockOnClose, menuRef));

      expect(document.body.style.overflow).toBe('hidden');

      isOpen = false;
      rerender();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('keyboard events', () => {
    it('should call onClose when Escape is pressed', () => {
      renderHook(() => useMenuAnimation(true, mockOnClose, menuRef));

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should ignore non-Escape keys', () => {
      renderHook(() => useMenuAnimation(true, mockOnClose, menuRef));

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(tabEvent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should clean up keydown listener on unmount', () => {
      const { unmount } = renderHook(() => useMenuAnimation(true, mockOnClose, menuRef));

      unmount();

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
