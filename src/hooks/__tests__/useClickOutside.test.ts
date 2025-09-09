import type React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useClickOutside } from '../useClickOutside';

const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

describe('useClickOutside', () => {
  const mockHandler = vi.fn();
  let mockRef: React.RefObject<HTMLDivElement>;
  let mockElement: HTMLDivElement;

  // Helper function to get mousedown event handler
  const getMousedownHandler = () => {
    const mousedownCall = mockAddEventListener.mock.calls.find(call => call[0] === 'mousedown');
    return mousedownCall?.[1];
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock DOM methods
    Object.defineProperty(document, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    });

    Object.defineProperty(document, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    });

    // Create mock element and ref
    mockElement = document.createElement('div');
    mockRef = { current: mockElement };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('event listener management', () => {
    it('should add mousedown event listener when active is true', () => {
      renderHook(() => useClickOutside(mockRef, mockHandler, true));

      // Filter for mousedown events only
      const mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(1);
      expect(mockAddEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    it('should not add event listener when active is false', () => {
      renderHook(() => useClickOutside(mockRef, mockHandler, false));

      // Filter for mousedown events only
      const mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(0);
    });

    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useClickOutside(mockRef, mockHandler, true));

      // Find the mousedown handler
      const addedHandler = getMousedownHandler()!;

      unmount();

      const mousedownRemoveCalls = mockRemoveEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownRemoveCalls).toHaveLength(1);
      expect(mockRemoveEventListener).toHaveBeenCalledWith('mousedown', addedHandler);
    });

    it('should add/remove listener when active changes', () => {
      let active = false;
      const { rerender } = renderHook(() => useClickOutside(mockRef, mockHandler, active));

      // Initially inactive - no mousedown listeners
      let mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(0);

      // Activate
      active = true;
      rerender();

      mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(1);

      // Deactivate
      active = false;
      rerender();

      const mousedownRemoveCalls = mockRemoveEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownRemoveCalls).toHaveLength(1);
    });
  });

  describe('click detection', () => {
    it('should call handler when clicking outside the element', () => {
      renderHook(() => useClickOutside(mockRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      // Create a click event on a different element
      const outsideElement = document.createElement('div');
      const mockEvent = {
        target: outsideElement,
      } as unknown as MouseEvent;

      eventHandler(mockEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should not call handler when clicking inside the element', () => {
      renderHook(() => useClickOutside(mockRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      // Create a click event on the tracked element
      const mockEvent = {
        target: mockElement,
      } as unknown as MouseEvent;

      eventHandler(mockEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should not call handler when clicking on a child element', () => {
      // Create child element
      const childElement = document.createElement('span');
      mockElement.appendChild(childElement);

      renderHook(() => useClickOutside(mockRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      // Click on child element
      const mockEvent = {
        target: childElement,
      } as unknown as MouseEvent;

      eventHandler(mockEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should call handler when clicking on a sibling element', () => {
      // Create sibling element
      const siblingElement = document.createElement('div');

      renderHook(() => useClickOutside(mockRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      // Click on sibling element
      const mockEvent = {
        target: siblingElement,
      } as unknown as MouseEvent;

      eventHandler(mockEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should handle null ref gracefully', () => {
      const nullRef: React.RefObject<HTMLDivElement | null> = { current: null };

      expect(() => {
        renderHook(() => useClickOutside(nullRef, mockHandler, true));
      }).not.toThrow();

      const mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(1);
    });

    it('should call handler when ref.current is null', () => {
      const nullRef: React.RefObject<HTMLDivElement | null> = { current: null };

      renderHook(() => useClickOutside(nullRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      const mockEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;

      eventHandler(mockEvent);

      // When ref.current is null, all clicks should be considered "outside"
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should handle event with null target', () => {
      renderHook(() => useClickOutside(mockRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      const mockEvent = {
        target: null,
      } as unknown as MouseEvent;

      expect(() => {
        eventHandler(mockEvent);
      }).not.toThrow();

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should handle event with non-Node target', () => {
      renderHook(() => useClickOutside(mockRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      const mockEvent = {
        target: 'not a node',
      } as unknown as MouseEvent;

      expect(() => {
        eventHandler(mockEvent);
      }).not.toThrow();

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('dependency updates', () => {
    it('should use updated handler function', () => {
      const firstHandler = vi.fn();
      let currentHandler = firstHandler;

      const { rerender } = renderHook(() => useClickOutside(mockRef, currentHandler, true));

      const eventHandler = getMousedownHandler()!;

      // Test first handler
      const outsideElement = document.createElement('div');
      const mockEvent = { target: outsideElement } as unknown as MouseEvent;

      eventHandler(mockEvent);
      expect(firstHandler).toHaveBeenCalledTimes(1);

      // Update handler
      const secondHandler = vi.fn();
      currentHandler = secondHandler;
      rerender();

      // The event handler should now use the updated handler
      eventHandler(mockEvent);
      expect(secondHandler).toHaveBeenCalledTimes(1);
      expect(firstHandler).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should use updated ref element', () => {
      let currentRef = mockRef;

      const { rerender } = renderHook(() => useClickOutside(currentRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      // Click on current element (should not trigger)
      let mockEvent = { target: mockElement } as unknown as MouseEvent;
      eventHandler(mockEvent);
      expect(mockHandler).not.toHaveBeenCalled();

      // Update ref to different element
      const newElement = document.createElement('div');
      const newRef = { current: newElement };
      currentRef = newRef;
      rerender();

      // Click on old element (should now trigger since it's no longer tracked)
      mockEvent = { target: mockElement } as unknown as MouseEvent;
      eventHandler(mockEvent);
      expect(mockHandler).toHaveBeenCalledTimes(1);

      // Click on new element (should not trigger)
      mockHandler.mockClear();
      mockEvent = { target: newElement } as unknown as MouseEvent;
      eventHandler(mockEvent);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should handle ref changing to null', () => {
      let currentRef: React.RefObject<HTMLDivElement | null> = mockRef;

      const { rerender } = renderHook(() => useClickOutside(currentRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      // Change ref to null
      currentRef = { current: null };
      rerender();

      // Any click should trigger handler when ref is null
      const mockEvent = { target: document.createElement('div') } as unknown as MouseEvent;
      eventHandler(mockEvent);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('performance considerations', () => {
    it('should not recreate event listener unnecessarily', () => {
      const { rerender } = renderHook(() => useClickOutside(mockRef, mockHandler, true));

      let mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(1);

      // Re-render without changing dependencies
      rerender();

      // Should not add another event listener
      mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(1);
      
      const mousedownRemoveCalls = mockRemoveEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownRemoveCalls).toHaveLength(0);
    });

    it('should handle rapid active state changes', () => {
      let active = true;
      const { rerender } = renderHook(() => useClickOutside(mockRef, mockHandler, active));

      let mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(1);

      // Rapidly toggle active state
      for (let i = 0; i < 5; i++) {
        active = !active;
        rerender();
      }

      // Should end up with listener active (active = false after loop)
      mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(3); // 1 + 2 toggles back to true
      
      const mousedownRemoveCalls = mockRemoveEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownRemoveCalls).toHaveLength(3); // 3 toggles to false
    });
  });

  describe('multiple instances', () => {
    it('should handle multiple useClickOutside hooks independently', () => {
      const secondHandler = vi.fn();
      const secondRef = { current: document.createElement('div') };

      // First hook
      renderHook(() => useClickOutside(mockRef, mockHandler, true));

      // Second hook
      renderHook(() => useClickOutside(secondRef, secondHandler, true));

      // Verify we have 2 mousedown listeners and get both event handlers
      const mousedownCalls = mockAddEventListener.mock.calls.filter(call => call[0] === 'mousedown');
      expect(mousedownCalls).toHaveLength(2);
      
      const firstEventHandler = mousedownCalls[0][1];
      const secondEventHandler = mousedownCalls[1][1];

      // Create click outside both elements
      const outsideElement = document.createElement('div');
      const mockEvent = { target: outsideElement } as unknown as MouseEvent;

      // Both handlers should be called
      firstEventHandler(mockEvent);
      secondEventHandler(mockEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility considerations', () => {
    it('should work with keyboard navigation elements', () => {
      const button = document.createElement('button');
      const buttonRef = { current: button };

      renderHook(() => useClickOutside(buttonRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      // Click on button should not trigger handler
      let mockEvent = { target: button } as unknown as MouseEvent;
      eventHandler(mockEvent);
      expect(mockHandler).not.toHaveBeenCalled();

      // Click outside should trigger
      const outsideElement = document.createElement('div');
      mockEvent = { target: outsideElement } as unknown as MouseEvent;
      eventHandler(mockEvent);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should work with form elements', () => {
      const input = document.createElement('input');
      const form = document.createElement('form');
      form.appendChild(input);

      const formRef = { current: form };

      renderHook(() => useClickOutside(formRef, mockHandler, true));

      const eventHandler = getMousedownHandler()!;

      // Click on input (child of form) should not trigger
      const mockEvent = { target: input } as unknown as MouseEvent;
      eventHandler(mockEvent);
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
});
