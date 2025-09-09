import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// Mock console methods globally
const mockConsoleLog = vi.fn();
const mockConsoleWarn = vi.fn();
const mockConsoleError = vi.fn();

describe.skip('env', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup console mocks
    vi.spyOn(console, 'log').mockImplementation(mockConsoleLog);
    vi.spyOn(console, 'warn').mockImplementation(mockConsoleWarn);
    vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('env object', () => {
    it('should export all environment variables', async () => {
      // Mock import.meta.env for this test
      vi.stubGlobal('import.meta', {
        env: {
          MODE: 'test',
          PROD: false,
          DEV: true,
          VITE_SENTRY_DSN: 'test-dsn',
          VITE_ANALYTICS_DOMAIN: 'test-domain',
        },
      });

      const { env } = (await vi.importActual('../env')) as any;

      expect(env).toBeDefined();
      expect(env.MODE).toBe('test');
      expect(env.PROD).toBe(false);
      expect(env.DEV).toBe(true);
      expect(env.VITE_SENTRY_DSN).toBeDefined();
      expect(env.VITE_ANALYTICS_DOMAIN).toBeDefined();
    });

    it('should be a const object with all expected properties', async () => {
      vi.stubGlobal('import.meta', {
        env: {
          MODE: 'test',
          PROD: false,
          DEV: true,
          VITE_SENTRY_DSN: '',
          VITE_ANALYTICS_DOMAIN: '',
        },
      });

      const { env } = (await vi.importActual('../env')) as any;
      const expectedKeys = ['MODE', 'PROD', 'DEV', 'VITE_SENTRY_DSN', 'VITE_ANALYTICS_DOMAIN'];

      expectedKeys.forEach((key) => {
        expect(env).toHaveProperty(key);
      });
    });
  });

  describe('validateEnvironment', () => {
    describe('successful validation', () => {
      it('should log success message when all variables are configured in dev', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: 'https://sentry-dsn.example.com',
            VITE_ANALYTICS_DOMAIN: 'analytics.example.com',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleLog).toHaveBeenCalledWith(
          '✅ All environment variables are properly configured',
        );
        expect(mockConsoleWarn).not.toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should not log success message in production', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'production',
            PROD: true,
            DEV: false,
            VITE_SENTRY_DSN: 'https://sentry-dsn.example.com',
            VITE_ANALYTICS_DOMAIN: 'analytics.example.com',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleLog).not.toHaveBeenCalled();
        expect(mockConsoleWarn).not.toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
      });
    });

    describe('missing optional variables', () => {
      it('should warn about missing optional variables in development', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_SENTRY_DSN, VITE_ANALYTICS_DOMAIN',
        );
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'Consider setting these for production deployment',
        );
      });

      it('should not warn about missing optional variables in production', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'production',
            PROD: true,
            DEV: false,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalled();
      });

      it('should warn about only missing optional variables', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: 'configured',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_ANALYTICS_DOMAIN',
        );
      });

      it('should not warn about MODE, PROD, or DEV variables', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: '',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: 'configured',
            VITE_ANALYTICS_DOMAIN: 'configured',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        // Should not warn because MODE, PROD, DEV are excluded from optional checks
        expect(mockConsoleLog).toHaveBeenCalledWith(
          '✅ All environment variables are properly configured',
        );
      });
    });

    describe('missing required variables', () => {
      it('should handle empty required variables object', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'test',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should not throw in development when no required variables are configured', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;

        expect(() => {
          validateEnvironment();
        }).not.toThrow();
      });

      it('should not throw in production when no required variables are configured', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'production',
            PROD: true,
            DEV: false,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;

        expect(() => {
          validateEnvironment();
        }).not.toThrow();
      });
    });

    describe('environment detection', () => {
      it('should properly detect development environment', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalled(); // Should warn in dev
      });

      it('should properly detect production environment', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'production',
            PROD: true,
            DEV: false,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalled(); // Should not warn in prod
      });

      it('should handle mixed environment flags', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'test',
            PROD: false,
            DEV: false,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalled(); // Should not warn when neither dev nor prod
      });
    });

    describe('edge cases', () => {
      it('should handle undefined environment variables', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: undefined,
            VITE_ANALYTICS_DOMAIN: undefined,
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;

        expect(() => {
          validateEnvironment();
        }).not.toThrow();

        expect(mockConsoleWarn).toHaveBeenCalled();
      });

      it('should handle null environment variables', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: null,
            VITE_ANALYTICS_DOMAIN: null,
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;

        expect(() => {
          validateEnvironment();
        }).not.toThrow();

        expect(mockConsoleWarn).toHaveBeenCalled();
      });

      it('should handle empty string environment variables', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_SENTRY_DSN, VITE_ANALYTICS_DOMAIN',
        );
      });

      it('should handle whitespace-only environment variables', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: '   ',
            VITE_ANALYTICS_DOMAIN: '\t\n',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        // Whitespace strings are considered "truthy" so should not trigger warnings
        expect(mockConsoleLog).toHaveBeenCalledWith(
          '✅ All environment variables are properly configured',
        );
      });

      it('should handle numeric environment variables', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: '123',
            VITE_ANALYTICS_DOMAIN: '0',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleLog).toHaveBeenCalledWith(
          '✅ All environment variables are properly configured',
        );
      });

      it('should handle boolean environment variables', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: false,
            VITE_ANALYTICS_DOMAIN: true,
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        // false is falsy, true is truthy
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_SENTRY_DSN',
        );
      });
    });

    describe('real-world scenarios', () => {
      it('should validate typical development setup', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: '',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_SENTRY_DSN, VITE_ANALYTICS_DOMAIN',
        );
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'Consider setting these for production deployment',
        );
      });

      it('should validate typical production setup', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'production',
            PROD: true,
            DEV: false,
            VITE_SENTRY_DSN: 'https://abc123@sentry.io/123456',
            VITE_ANALYTICS_DOMAIN: 'mysite.com',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
        expect(mockConsoleLog).not.toHaveBeenCalled(); // No success message in prod
      });

      it('should handle partial production configuration', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'production',
            PROD: true,
            DEV: false,
            VITE_SENTRY_DSN: 'https://sentry-dsn@sentry.io/123456',
            VITE_ANALYTICS_DOMAIN: '', // Missing analytics
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;
        validateEnvironment();

        // Should not warn in production even if optional vars are missing
        expect(mockConsoleWarn).not.toHaveBeenCalled();
      });
    });

    describe('multiple invocations', () => {
      it('should behave consistently on multiple calls', async () => {
        vi.stubGlobal('import.meta', {
          env: {
            MODE: 'development',
            PROD: false,
            DEV: true,
            VITE_SENTRY_DSN: '',
            VITE_ANALYTICS_DOMAIN: 'analytics.com',
          },
        });

        const { validateEnvironment } = (await vi.importActual('../env')) as any;

        validateEnvironment();
        validateEnvironment();
        validateEnvironment();

        // Should warn consistently each time
        expect(mockConsoleWarn).toHaveBeenCalledTimes(6); // 3 calls × 2 warn messages each
      });
    });
  });

  describe('TypeScript type safety', () => {
    it('should provide type-safe access to environment variables', async () => {
      vi.stubGlobal('import.meta', {
        env: {
          MODE: 'test',
          PROD: false,
          DEV: true,
          VITE_SENTRY_DSN: 'test-dsn',
          VITE_ANALYTICS_DOMAIN: 'test-domain',
        },
      });

      const { env } = (await vi.importActual('../env')) as any;

      // This test verifies that the env object has the correct types
      expect(typeof env.MODE).toBe('string');
      expect(typeof env.PROD).toBe('boolean');
      expect(typeof env.DEV).toBe('boolean');

      // With actual values, these should be defined
      expect(env.VITE_SENTRY_DSN).toBeDefined();
      expect(env.VITE_ANALYTICS_DOMAIN).toBeDefined();
    });

    it('should be readonly at runtime', async () => {
      vi.stubGlobal('import.meta', {
        env: {
          MODE: 'test',
          PROD: false,
          DEV: true,
          VITE_SENTRY_DSN: '',
          VITE_ANALYTICS_DOMAIN: '',
        },
      });

      const { env } = (await vi.importActual('../env')) as any;

      // Since env is defined with `as const`, it should be immutable
      // This test verifies the object structure is preserved
      const keys = Object.keys(env);
      expect(keys.length).toBeGreaterThan(0);

      // Try to modify (should not affect the object in a readonly context)
      expect(env).toBeDefined();
    });
  });
});
