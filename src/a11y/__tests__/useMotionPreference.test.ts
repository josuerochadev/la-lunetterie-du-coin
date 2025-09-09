import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useMotionPreference } from '../useMotionPreference';
import { MotionCtx } from '../MotionContext';

// Mock React context
const mockUseContext = vi.fn();
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useContext: mockUseContext,
  };
});

describe('useMotionPreference', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('context consumption', () => {
    it('should return value from MotionCtx context', () => {
      mockUseContext.mockReturnValue(false);

      const { result } = renderHook(() => useMotionPreference());

      expect(result.current).toBe(false);
      expect(mockUseContext).toHaveBeenCalledWith(MotionCtx);
    });

    it('should return true when context provides reduced motion preference', () => {
      mockUseContext.mockReturnValue(true);

      const { result } = renderHook(() => useMotionPreference());

      expect(result.current).toBe(true);
      expect(mockUseContext).toHaveBeenCalledWith(MotionCtx);
    });

    it('should return false when context provides no motion preference', () => {
      mockUseContext.mockReturnValue(false);

      const { result } = renderHook(() => useMotionPreference());

      expect(result.current).toBe(false);
      expect(mockUseContext).toHaveBeenCalledWith(MotionCtx);
    });
  });

  describe('context updates', () => {
    it('should reflect context value changes', () => {
      let contextValue = false;
      mockUseContext.mockImplementation(() => contextValue);

      const { result, rerender } = renderHook(() => useMotionPreference());

      expect(result.current).toBe(false);

      // Change context value
      contextValue = true;
      rerender();

      expect(result.current).toBe(true);
    });

    it('should handle rapid context changes', () => {
      const values = [false, true, false, true, false];
      let callCount = 0;

      mockUseContext.mockImplementation(() => values[callCount++ % values.length]);

      const { result, rerender } = renderHook(() => useMotionPreference());

      expect(result.current).toBe(false); // First call

      rerender();
      expect(result.current).toBe(true); // Second call

      rerender();
      expect(result.current).toBe(false); // Third call

      rerender();
      expect(result.current).toBe(true); // Fourth call
    });
  });

  describe('edge cases', () => {
    it('should handle undefined context value', () => {
      mockUseContext.mockReturnValue(undefined);

      const { result } = renderHook(() => useMotionPreference());

      expect(result.current).toBeUndefined();
    });

    it('should handle null context value', () => {
      mockUseContext.mockReturnValue(null);

      const { result } = renderHook(() => useMotionPreference());

      expect(result.current).toBeNull();
    });

    it('should handle non-boolean context values', () => {
      mockUseContext.mockReturnValue('reduce' as any);

      const { result } = renderHook(() => useMotionPreference());

      expect(result.current).toBe('reduce');
    });

    it('should handle context throwing an error', () => {
      mockUseContext.mockImplementation(() => {
        throw new Error('Context error');
      });

      expect(() => {
        renderHook(() => useMotionPreference());
      }).toThrow('Context error');
    });
  });

  describe('multiple hook instances', () => {
    it('should all return the same context value', () => {
      mockUseContext.mockReturnValue(true);

      const hook1 = renderHook(() => useMotionPreference());
      const hook2 = renderHook(() => useMotionPreference());
      const hook3 = renderHook(() => useMotionPreference());

      expect(hook1.result.current).toBe(true);
      expect(hook2.result.current).toBe(true);
      expect(hook3.result.current).toBe(true);

      expect(mockUseContext).toHaveBeenCalledTimes(3);
    });

    it('should all update when context changes', () => {
      let contextValue = false;
      mockUseContext.mockImplementation(() => contextValue);

      const hook1 = renderHook(() => useMotionPreference());
      const hook2 = renderHook(() => useMotionPreference());

      expect(hook1.result.current).toBe(false);
      expect(hook2.result.current).toBe(false);

      // Change context
      contextValue = true;
      hook1.rerender();
      hook2.rerender();

      expect(hook1.result.current).toBe(true);
      expect(hook2.result.current).toBe(true);
    });
  });

  describe('performance', () => {
    it('should not cause unnecessary re-renders', () => {
      mockUseContext.mockReturnValue(false);

      const { result, rerender } = renderHook(() => useMotionPreference());

      expect(result.current).toBe(false);

      // Multiple rerenders with same context value
      rerender();
      rerender();
      rerender();

      expect(result.current).toBe(false);
    });

    it('should handle frequent context reads efficiently', () => {
      mockUseContext.mockReturnValue(true);

      // Create many hook instances
      const hooks = Array.from({ length: 10 }, () => renderHook(() => useMotionPreference()));

      hooks.forEach((hook) => {
        expect(hook.result.current).toBe(true);
      });

      expect(mockUseContext).toHaveBeenCalledTimes(10);
    });
  });

  describe('context integration', () => {
    it('should use the correct context object', () => {
      mockUseContext.mockReturnValue(false);

      renderHook(() => useMotionPreference());

      expect(mockUseContext).toHaveBeenCalledWith(MotionCtx);
      expect(mockUseContext).toHaveBeenCalledTimes(1);
    });

    it('should be compatible with React context lifecycle', () => {
      mockUseContext.mockReturnValue(true);

      const { unmount } = renderHook(() => useMotionPreference());

      expect(mockUseContext).toHaveBeenCalledWith(MotionCtx);

      unmount();

      // Should not cause additional context calls after unmount
      expect(mockUseContext).toHaveBeenCalledTimes(1);
    });
  });

  describe('type safety', () => {
    it('should return boolean when context provides boolean', () => {
      mockUseContext.mockReturnValue(true);

      const { result } = renderHook(() => useMotionPreference());

      expect(typeof result.current).toBe('boolean');
      expect(result.current).toBe(true);
    });

    it('should preserve context value type', () => {
      const testValue = { custom: 'value' };
      mockUseContext.mockReturnValue(testValue);

      const { result } = renderHook(() => useMotionPreference());

      expect(result.current).toBe(testValue);
    });
  });
});
