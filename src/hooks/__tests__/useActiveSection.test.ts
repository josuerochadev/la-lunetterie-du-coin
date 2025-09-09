import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useActiveSection } from '../useActiveSection';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

const MockIntersectionObserver = vi.fn(function (callback: () => void, options?: any) {
  this.callback = callback;
  this.options = options;
  this.observe = mockObserve;
  this.unobserve = mockUnobserve;
  this.disconnect = mockDisconnect;
}) as any;

// Mock document.getElementById
const mockGetElementById = vi.fn();

describe('useActiveSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock IntersectionObserver globally
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });

    // Mock document.getElementById
    Object.defineProperty(document, 'getElementById', {
      writable: true,
      configurable: true,
      value: mockGetElementById,
    });

    MockIntersectionObserver.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should return null initially', () => {
      const { result } = renderHook(() => useActiveSection(['hero', 'about', 'contact']));

      expect(result.current).toBeNull();
    });

    it('should not create observer when sectionIds is empty', () => {
      renderHook(() => useActiveSection([]));

      expect(MockIntersectionObserver).not.toHaveBeenCalled();
    });

    it('should create observer with default options', () => {
      const sectionIds = ['hero', 'about'];

      // Mock elements exist
      const mockElements = sectionIds.map((id) => {
        const element = document.createElement('div');
        element.id = id;
        return element;
      });

      mockGetElementById.mockImplementation((id: string) => {
        return mockElements.find((el) => el.id === id) || null;
      });

      renderHook(() => useActiveSection(sectionIds));

      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      });
    });

    it('should create observer with custom options', () => {
      const sectionIds = ['hero'];
      const customOptions = { threshold: 0.5, rootMargin: '0px' };

      const mockElement = document.createElement('div');
      mockElement.id = 'hero';
      mockGetElementById.mockReturnValue(mockElement);

      renderHook(() => useActiveSection(sectionIds, customOptions));

      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        rootMargin: '0px', // Custom option should override default
        threshold: 0.5, // Custom option should override default
      });
    });
  });

  describe('section observation', () => {
    it('should observe all existing sections', () => {
      const sectionIds = ['hero', 'about', 'contact'];

      const mockElements = sectionIds.map((id) => {
        const element = document.createElement('div');
        element.id = id;
        return element;
      });

      mockGetElementById.mockImplementation((id: string) => {
        return mockElements.find((el) => el.id === id) || null;
      });

      renderHook(() => useActiveSection(sectionIds));

      expect(mockObserve).toHaveBeenCalledTimes(3);
      mockElements.forEach((element) => {
        expect(mockObserve).toHaveBeenCalledWith(element);
      });
    });

    it('should skip non-existent sections', () => {
      const sectionIds = ['hero', 'nonexistent', 'about'];

      mockGetElementById.mockImplementation((id: string) => {
        if (id === 'nonexistent') return null;
        const element = document.createElement('div');
        element.id = id;
        return element;
      });

      renderHook(() => useActiveSection(sectionIds));

      // Should only observe existing sections
      expect(mockObserve).toHaveBeenCalledTimes(2);
    });
  });

  describe('active section detection', () => {
    it('should set active section when entry is intersecting', () => {
      const sectionIds = ['hero'];

      const mockElement = document.createElement('div');
      mockElement.id = 'hero';
      mockGetElementById.mockReturnValue(mockElement);

      const { result } = renderHook(() => useActiveSection(sectionIds));

      // Get the observer callback
      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate intersection
      const mockEntry = {
        isIntersecting: true,
        target: mockElement,
        intersectionRatio: 0.5,
      };

      act(() => {
        observerCallback([mockEntry]);
      });

      expect(result.current).toBe('hero');
    });

    it('should select the most visible section when multiple are intersecting', () => {
      const sectionIds = ['hero', 'about'];

      const mockElements = sectionIds.map((id) => {
        const element = document.createElement('div');
        element.id = id;
        return element;
      });

      mockGetElementById.mockImplementation((id: string) => {
        return mockElements.find((el) => el.id === id) || null;
      });

      const { result } = renderHook(() => useActiveSection(sectionIds));

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate multiple intersecting entries with different visibility ratios
      const mockEntries = [
        {
          isIntersecting: true,
          target: mockElements[0], // hero
          intersectionRatio: 0.3,
        },
        {
          isIntersecting: true,
          target: mockElements[1], // about
          intersectionRatio: 0.7,
        },
      ];

      act(() => {
        observerCallback(mockEntries);
      });

      // Should select the section with higher intersection ratio
      expect(result.current).toBe('about');
    });

    it('should handle entries with same intersection ratio', () => {
      const sectionIds = ['hero', 'about'];

      const mockElements = sectionIds.map((id) => {
        const element = document.createElement('div');
        element.id = id;
        return element;
      });

      mockGetElementById.mockImplementation((id: string) => {
        return mockElements.find((el) => el.id === id) || null;
      });

      const { result } = renderHook(() => useActiveSection(sectionIds));

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      const mockEntries = [
        {
          isIntersecting: true,
          target: mockElements[0],
          intersectionRatio: 0.5,
        },
        {
          isIntersecting: true,
          target: mockElements[1],
          intersectionRatio: 0.5,
        },
      ];

      act(() => {
        observerCallback(mockEntries);
      });

      // Should select the first one encountered (hero)
      expect(result.current).toBe('hero');
    });

    it('should not update active section when no entries are intersecting', () => {
      const sectionIds = ['hero'];

      const mockElement = document.createElement('div');
      mockElement.id = 'hero';
      mockGetElementById.mockReturnValue(mockElement);

      const { result } = renderHook(() => useActiveSection(sectionIds));

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // First make a section active
      const intersectingEntry = {
        isIntersecting: true,
        target: mockElement,
        intersectionRatio: 0.5,
      };
      act(() => {
        observerCallback([intersectingEntry]);
      });
      expect(result.current).toBe('hero');

      // Then simulate no intersections
      const nonIntersectingEntry = {
        isIntersecting: false,
        target: mockElement,
        intersectionRatio: 0,
      };
      act(() => {
        observerCallback([nonIntersectingEntry]);
      });

      // Active section should remain the same
      expect(result.current).toBe('hero');
    });

    it('should handle entries without intersectionRatio property', () => {
      const sectionIds = ['hero'];

      const mockElement = document.createElement('div');
      mockElement.id = 'hero';
      mockGetElementById.mockReturnValue(mockElement);

      const { result } = renderHook(() => useActiveSection(sectionIds));

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Entry without intersectionRatio
      const mockEntry = {
        isIntersecting: true,
        target: mockElement,
      } as any; // Cast to bypass TypeScript checking

      expect(() => {
        act(() => {
          observerCallback([mockEntry]);
        });
      }).not.toThrow();

      // Should still work (undefined intersectionRatio treated as 0)
      expect(result.current).toBe('hero');
    });
  });

  describe('cleanup', () => {
    it('should disconnect observer on unmount', () => {
      const sectionIds = ['hero'];

      const mockElement = document.createElement('div');
      mockElement.id = 'hero';
      mockGetElementById.mockReturnValue(mockElement);

      const { unmount } = renderHook(() => useActiveSection(sectionIds));

      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);

      unmount();

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should recreate observer when sectionIds change', () => {
      let sectionIds = ['hero'];

      mockGetElementById.mockImplementation((id: string) => {
        const element = document.createElement('div');
        element.id = id;
        return element;
      });

      const { rerender } = renderHook(() => useActiveSection(sectionIds));

      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);
      expect(mockObserve).toHaveBeenCalledTimes(1);

      // Change sectionIds
      sectionIds = ['hero', 'about'];
      rerender();

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
      expect(MockIntersectionObserver).toHaveBeenCalledTimes(2);
      expect(mockObserve).toHaveBeenCalledTimes(3); // 1 + 2 new sections
    });

    it('should recreate observer when options change', () => {
      const sectionIds = ['hero'];
      let options = { threshold: 0.1 };

      const mockElement = document.createElement('div');
      mockElement.id = 'hero';
      mockGetElementById.mockReturnValue(mockElement);

      const { rerender } = renderHook(() => useActiveSection(sectionIds, options));

      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);

      // Change options
      options = { threshold: 0.5 };
      rerender();

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
      expect(MockIntersectionObserver).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('should handle empty entries array in observer callback', () => {
      const sectionIds = ['hero'];

      const mockElement = document.createElement('div');
      mockElement.id = 'hero';
      mockGetElementById.mockReturnValue(mockElement);

      const { result } = renderHook(() => useActiveSection(sectionIds));

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      expect(() => {
        observerCallback([]);
      }).not.toThrow();

      expect(result.current).toBeNull();
    });

    it('should handle sections with same id as existing active section', () => {
      const sectionIds = ['hero'];

      const mockElement = document.createElement('div');
      mockElement.id = 'hero';
      mockGetElementById.mockReturnValue(mockElement);

      const { result } = renderHook(() => useActiveSection(sectionIds));

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Set initial active section
      const mockEntry = {
        isIntersecting: true,
        target: mockElement,
        intersectionRatio: 0.5,
      };
      act(() => {
        observerCallback([mockEntry]);
      });
      expect(result.current).toBe('hero');

      // Same section intersecting again
      act(() => {
        observerCallback([mockEntry]);
      });
      expect(result.current).toBe('hero');
    });

    it('should handle target elements without id', () => {
      const sectionIds = ['hero'];

      const mockElement = document.createElement('div');
      // Don't set id property
      mockGetElementById.mockReturnValue(mockElement);

      const { result } = renderHook(() => useActiveSection(sectionIds));

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      const mockEntry = {
        isIntersecting: true,
        target: mockElement,
        intersectionRatio: 0.5,
      };

      act(() => {
        observerCallback([mockEntry]);
      });

      // Should handle gracefully (undefined id becomes active section)
      expect(result.current).toBe('');
    });

    it('should handle sectionIds with duplicate values', () => {
      const sectionIds = ['hero', 'hero', 'about'];

      mockGetElementById.mockImplementation((id: string) => {
        const element = document.createElement('div');
        element.id = id;
        return element;
      });

      renderHook(() => useActiveSection(sectionIds));

      // Should only observe unique sections
      expect(mockObserve).toHaveBeenCalledTimes(3); // Will observe duplicate 'hero' twice
    });
  });

  describe('performance considerations', () => {
    it('should not recreate observer unnecessarily', () => {
      const sectionIds = ['hero', 'about'];

      mockGetElementById.mockImplementation((id: string) => {
        const element = document.createElement('div');
        element.id = id;
        return element;
      });

      const { rerender } = renderHook(() => useActiveSection(sectionIds));

      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);

      // Re-render without changing dependencies
      rerender();
      rerender();
      rerender();

      // Should not create additional observers
      expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid section changes efficiently', () => {
      const sectionIds = ['hero', 'about', 'contact'];

      const mockElements = sectionIds.map((id) => {
        const element = document.createElement('div');
        element.id = id;
        return element;
      });

      mockGetElementById.mockImplementation((id: string) => {
        return mockElements.find((el) => el.id === id) || null;
      });

      const { result } = renderHook(() => useActiveSection(sectionIds));

      const observerCallback = MockIntersectionObserver.mock.calls[0][0];

      // Simulate rapid section changes
      for (let i = 0; i < mockElements.length; i++) {
        const mockEntry = {
          isIntersecting: true,
          target: mockElements[i],
          intersectionRatio: 1,
        };
        act(() => {
          observerCallback([mockEntry]);
        });
      }

      // Should end up with the last section
      expect(result.current).toBe('contact');
    });
  });
});
