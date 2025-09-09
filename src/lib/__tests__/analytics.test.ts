import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { initPlausible, trackEvent } from '../analytics';

// Mock import.meta.env
const mockEnv = { DEV: false };
vi.stubGlobal('import.meta', { env: mockEnv });

// Mock DOM methods
Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => ({
    defer: false,
    src: '',
    setAttribute: vi.fn(),
  })),
  writable: true,
});

Object.defineProperty(document, 'addEventListener', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(document.head, 'appendChild', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(document, 'readyState', {
  value: 'complete',
  writable: true,
  configurable: true,
});

describe.skip('analytics', () => {
  const mockConsoleLog = vi.spyOn(console, 'log');
  const mockCreateElement = vi.mocked(document.createElement);
  const mockAppendChild = vi.mocked(document.head.appendChild);
  const mockAddEventListener = vi.mocked(document.addEventListener);

  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.DEV = false; // Reset to production mode

    // Reset document.readyState
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
      configurable: true,
    });

    // Reset window.plausible
    delete (window as any).plausible;

    // Mock createElement to return a proper script element mock
    mockCreateElement.mockReturnValue({
      defer: false,
      src: '',
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initPlausible', () => {
    describe('development mode behavior', () => {
      it('should skip initialization in development mode', () => {
        mockEnv.DEV = true;

        initPlausible({ domain: 'example.com' });

        expect(mockConsoleLog).toHaveBeenCalledWith(
          '📊 Plausible Analytics: Skipped in development',
        );
        expect(mockCreateElement).not.toHaveBeenCalled();
        expect(mockAppendChild).not.toHaveBeenCalled();
      });
    });

    describe('production mode behavior', () => {
      beforeEach(() => {
        mockEnv.DEV = false;
      });

      it('should create and configure script element with required options', () => {
        const options = { domain: 'example.com' };
        const mockScript = {
          defer: false,
          src: '',
          setAttribute: vi.fn(),
        };

        mockCreateElement.mockReturnValue(mockScript as any);

        initPlausible(options);

        expect(mockCreateElement).toHaveBeenCalledWith('script');
        expect(mockScript.defer).toBe(true);
        expect(mockScript.src).toBe('https://plausible.io/js/script.js');
        expect(mockScript.setAttribute).toHaveBeenCalledWith('data-domain', 'example.com');
      });

      it('should use custom API host when provided', () => {
        const options = {
          domain: 'example.com',
          apiHost: 'https://custom-plausible.example.com',
        };
        const mockScript = {
          defer: false,
          src: '',
          setAttribute: vi.fn(),
        };

        mockCreateElement.mockReturnValue(mockScript as any);

        initPlausible(options);

        expect(mockScript.src).toBe('https://custom-plausible.example.com/js/script.js');
      });

      it('should append script to head when document is ready', () => {
        Object.defineProperty(document, 'readyState', {
          value: 'complete',
          configurable: true,
          writable: true,
        });

        const mockScript = {
          defer: true,
          src: 'https://plausible.io/js/script.js',
          setAttribute: vi.fn(),
        };

        mockCreateElement.mockReturnValue(mockScript as any);

        initPlausible({ domain: 'example.com' });

        expect(mockAppendChild).toHaveBeenCalledWith(mockScript);
      });

      it('should wait for DOMContentLoaded when document is loading', () => {
        Object.defineProperty(document, 'readyState', {
          value: 'loading',
          configurable: true,
          writable: true,
        });

        const mockScript = {
          defer: true,
          src: 'https://plausible.io/js/script.js',
          setAttribute: vi.fn(),
        };

        mockCreateElement.mockReturnValue(mockScript as any);

        initPlausible({ domain: 'example.com' });

        // Should add event listener for DOMContentLoaded
        expect(mockAddEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

        // Script should not be appended immediately
        expect(mockAppendChild).not.toHaveBeenCalled();

        // Simulate DOMContentLoaded event
        const eventCallback = mockAddEventListener.mock.calls[0][1];
        eventCallback();

        expect(mockAppendChild).toHaveBeenCalledWith(mockScript);
      });

      it('should handle different document ready states', () => {
        const testStates = ['loading', 'interactive', 'complete'];

        testStates.forEach((state) => {
          vi.clearAllMocks();

          Object.defineProperty(document, 'readyState', {
            value: state,
            configurable: true,
            writable: true,
          });

          const mockScript = { defer: true, src: '', setAttribute: vi.fn() };
          mockCreateElement.mockReturnValue(mockScript as any);

          initPlausible({ domain: 'test.com' });

          if (state === 'loading') {
            expect(mockAddEventListener).toHaveBeenCalledWith(
              'DOMContentLoaded',
              expect.any(Function),
            );
            expect(mockAppendChild).not.toHaveBeenCalled();
          } else {
            expect(mockAddEventListener).not.toHaveBeenCalled();
            expect(mockAppendChild).toHaveBeenCalledWith(mockScript);
          }
        });
      });
    });

    describe('edge cases', () => {
      it('should handle domain with special characters', () => {
        const mockScript = {
          defer: true,
          src: '',
          setAttribute: vi.fn(),
        };

        mockCreateElement.mockReturnValue(mockScript as any);

        initPlausible({ domain: 'sub-domain.example-site.co.uk' });

        expect(mockScript.setAttribute).toHaveBeenCalledWith(
          'data-domain',
          'sub-domain.example-site.co.uk',
        );
      });

      it('should handle empty domain', () => {
        const mockScript = {
          defer: true,
          src: '',
          setAttribute: vi.fn(),
        };

        mockCreateElement.mockReturnValue(mockScript as any);

        initPlausible({ domain: '' });

        expect(mockScript.setAttribute).toHaveBeenCalledWith('data-domain', '');
      });

      it('should handle very long API host URLs', () => {
        const longApiHost =
          'https://very-long-subdomain-name.analytics-provider.example-domain.com';
        const mockScript = {
          defer: true,
          src: '',
          setAttribute: vi.fn(),
        };

        mockCreateElement.mockReturnValue(mockScript as any);

        initPlausible({ domain: 'example.com', apiHost: longApiHost });

        expect(mockScript.src).toBe(`${longApiHost}/js/script.js`);
      });
    });
  });

  describe('trackEvent', () => {
    describe('development mode behavior', () => {
      it('should not track events in development mode', () => {
        mockEnv.DEV = true;
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        trackEvent('test-event');

        expect(mockPlausible).not.toHaveBeenCalled();
      });
    });

    describe('production mode behavior', () => {
      beforeEach(() => {
        mockEnv.DEV = false;
      });

      it('should track event when plausible is available', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        trackEvent('button-click');

        expect(mockPlausible).toHaveBeenCalledWith('button-click', undefined);
      });

      it('should track event with properties', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        const options = {
          props: {
            section: 'header',
            button_text: 'Get Started',
            user_type: 'anonymous',
          },
        };

        trackEvent('cta-click', options);

        expect(mockPlausible).toHaveBeenCalledWith('cta-click', options);
      });

      it('should track event with mixed property types', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        const options = {
          props: {
            page_id: 'home',
            scroll_depth: 75,
            is_authenticated: 'true',
            session_duration: 120,
          },
        };

        trackEvent('scroll-milestone', options);

        expect(mockPlausible).toHaveBeenCalledWith('scroll-milestone', options);
      });

      it('should not crash when plausible is not available', () => {
        // Ensure plausible is undefined
        delete (window as any).plausible;

        expect(() => {
          trackEvent('test-event');
        }).not.toThrow();
      });

      it('should handle plausible being null', () => {
        (window as any).plausible = null;

        expect(() => {
          trackEvent('test-event');
        }).not.toThrow();
      });

      it('should handle plausible being a non-function', () => {
        (window as any).plausible = 'not-a-function';

        expect(() => {
          trackEvent('test-event');
        }).not.toThrow();
      });
    });

    describe('event name validation', () => {
      beforeEach(() => {
        mockEnv.DEV = false;
      });

      it('should handle various event name formats', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        const eventNames = [
          'simple-event',
          'CamelCaseEvent',
          'snake_case_event',
          'Event With Spaces',
          'event.with.dots',
          '123-numeric-start',
          'special!@#$%^&*()chars',
        ];

        eventNames.forEach((eventName) => {
          trackEvent(eventName);
          expect(mockPlausible).toHaveBeenCalledWith(eventName, undefined);
        });

        expect(mockPlausible).toHaveBeenCalledTimes(eventNames.length);
      });

      it('should handle empty event name', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        trackEvent('');

        expect(mockPlausible).toHaveBeenCalledWith('', undefined);
      });

      it('should handle very long event names', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        const longEventName =
          'very-long-event-name-that-might-exceed-normal-limits-and-could-potentially-cause-issues';

        trackEvent(longEventName);

        expect(mockPlausible).toHaveBeenCalledWith(longEventName, undefined);
      });
    });

    describe('properties validation', () => {
      beforeEach(() => {
        mockEnv.DEV = false;
      });

      it('should handle empty properties object', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        trackEvent('test-event', { props: {} });

        expect(mockPlausible).toHaveBeenCalledWith('test-event', { props: {} });
      });

      it('should handle undefined properties', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        trackEvent('test-event', { props: undefined });

        expect(mockPlausible).toHaveBeenCalledWith('test-event', { props: undefined });
      });

      it('should handle properties with special characters', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        const options = {
          props: {
            'property-with-dashes': 'value',
            property_with_underscores: 'value',
            'property.with.dots': 123,
            'property with spaces': 'value',
            'property!@#$%': 'value',
          },
        };

        trackEvent('special-props-event', options);

        expect(mockPlausible).toHaveBeenCalledWith('special-props-event', options);
      });
    });

    describe('error handling', () => {
      beforeEach(() => {
        mockEnv.DEV = false;
      });

      it('should handle plausible function throwing an error', () => {
        const mockPlausible = vi.fn().mockImplementation(() => {
          throw new Error('Plausible error');
        });
        (window as any).plausible = mockPlausible;

        expect(() => {
          trackEvent('error-test');
        }).toThrow('Plausible error');
      });

      it('should handle malformed options object', () => {
        const mockPlausible = vi.fn();
        (window as any).plausible = mockPlausible;

        // Test with circular reference (would cause JSON.stringify to fail)
        const circularRef: any = { prop: 'value' };
        circularRef.self = circularRef;

        expect(() => {
          trackEvent('circular-ref-test', { props: circularRef });
        }).not.toThrow();

        expect(mockPlausible).toHaveBeenCalledWith('circular-ref-test', { props: circularRef });
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work with typical analytics workflow', () => {
      mockEnv.DEV = false;

      // Initialize analytics
      initPlausible({ domain: 'mysite.com' });

      // Simulate plausible being loaded
      const mockPlausible = vi.fn();
      (window as any).plausible = mockPlausible;

      // Track various events
      trackEvent('page-view');
      trackEvent('button-click', { props: { button: 'cta' } });
      trackEvent('form-submit', { props: { form: 'contact', success: 1 } });

      expect(mockPlausible).toHaveBeenCalledTimes(3);
      expect(mockPlausible).toHaveBeenNthCalledWith(1, 'page-view', undefined);
      expect(mockPlausible).toHaveBeenNthCalledWith(2, 'button-click', {
        props: { button: 'cta' },
      });
      expect(mockPlausible).toHaveBeenNthCalledWith(3, 'form-submit', {
        props: { form: 'contact', success: 1 },
      });
    });

    it('should handle race conditions between init and track', () => {
      mockEnv.DEV = false;

      // Try to track before init
      trackEvent('early-event');

      // Initialize
      initPlausible({ domain: 'example.com' });

      // Simulate plausible loading after some events
      const mockPlausible = vi.fn();
      (window as any).plausible = mockPlausible;

      // Track after plausible is available
      trackEvent('late-event');

      expect(mockPlausible).toHaveBeenCalledTimes(1);
      expect(mockPlausible).toHaveBeenCalledWith('late-event', undefined);
    });
  });
});
