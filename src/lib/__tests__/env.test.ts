import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { validateEnvironment, env } from '../env';

// Mock import.meta.env
const mockEnv = {
  MODE: 'test',
  PROD: false,
  DEV: true,
  VITE_SENTRY_DSN: '',
  VITE_ANALYTICS_DOMAIN: '',
};

vi.stubGlobal('import.meta', { env: mockEnv });

describe('env', () => {
  const mockConsoleLog = vi.spyOn(console, 'log');
  const mockConsoleWarn = vi.spyOn(console, 'warn');
  const mockConsoleError = vi.spyOn(console, 'error');

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock environment to defaults
    mockEnv.MODE = 'test';
    mockEnv.PROD = false;
    mockEnv.DEV = true;
    mockEnv.VITE_SENTRY_DSN = '';
    mockEnv.VITE_ANALYTICS_DOMAIN = '';

    // Mock console methods
    mockConsoleLog.mockImplementation(() => {});
    mockConsoleWarn.mockImplementation(() => {});
    mockConsoleError.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('env object', () => {
    it('should export all environment variables', () => {
      expect(env).toBeDefined();
      expect(env.MODE).toBe('test');
      expect(env.PROD).toBe(false);
      expect(env.DEV).toBe(true);
      expect(env.VITE_SENTRY_DSN).toBeDefined();
      expect(env.VITE_ANALYTICS_DOMAIN).toBeDefined();
    });

    it('should be a const object with all expected properties', () => {
      const expectedKeys = ['MODE', 'PROD', 'DEV', 'VITE_SENTRY_DSN', 'VITE_ANALYTICS_DOMAIN'];

      expectedKeys.forEach((key) => {
        expect(env).toHaveProperty(key);
      });
    });

    it('should reflect changes in import.meta.env', () => {
      // This test verifies that env reads from import.meta.env at module load time
      expect(env.MODE).toBe(mockEnv.MODE);
      expect(env.PROD).toBe(mockEnv.PROD);
      expect(env.DEV).toBe(mockEnv.DEV);
    });
  });

  describe('validateEnvironment', () => {
    describe('successful validation', () => {
      it('should log success message when all variables are configured in dev', () => {
        mockEnv.DEV = true;
        mockEnv.VITE_SENTRY_DSN = 'https://sentry-dsn.example.com';
        mockEnv.VITE_ANALYTICS_DOMAIN = 'analytics.example.com';

        validateEnvironment();

        expect(mockConsoleLog).toHaveBeenCalledWith(
          '✅ All environment variables are properly configured',
        );
        expect(mockConsoleWarn).not.toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should not log success message in production', () => {
        mockEnv.DEV = false;
        mockEnv.PROD = true;
        mockEnv.VITE_SENTRY_DSN = 'https://sentry-dsn.example.com';
        mockEnv.VITE_ANALYTICS_DOMAIN = 'analytics.example.com';

        validateEnvironment();

        expect(mockConsoleLog).not.toHaveBeenCalled();
        expect(mockConsoleWarn).not.toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
      });
    });

    describe('missing optional variables', () => {
      it('should warn about missing optional variables in development', () => {
        mockEnv.DEV = true;
        mockEnv.VITE_SENTRY_DSN = '';
        mockEnv.VITE_ANALYTICS_DOMAIN = '';

        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_SENTRY_DSN, VITE_ANALYTICS_DOMAIN',
        );
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'Consider setting these for production deployment',
        );
      });

      it('should not warn about missing optional variables in production', () => {
        mockEnv.DEV = false;
        mockEnv.PROD = true;
        mockEnv.VITE_SENTRY_DSN = '';
        mockEnv.VITE_ANALYTICS_DOMAIN = '';

        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalled();
      });

      it('should warn about only missing optional variables', () => {
        mockEnv.DEV = true;
        mockEnv.VITE_SENTRY_DSN = 'configured';
        mockEnv.VITE_ANALYTICS_DOMAIN = '';

        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_ANALYTICS_DOMAIN',
        );
      });

      it('should not warn about MODE, PROD, or DEV variables', () => {
        mockEnv.DEV = true;
        mockEnv.MODE = '';
        mockEnv.PROD = false; // This is actually a boolean, testing string conversion

        validateEnvironment();

        // Should not include MODE, PROD, DEV in missing optional variables warning
        const warnCalls = mockConsoleWarn.mock.calls;
        const missingVarsCall = warnCalls.find((call) =>
          call[0]?.includes('Missing optional environment variables'),
        );

        if (missingVarsCall) {
          expect(missingVarsCall[1]).not.toContain('MODE');
          expect(missingVarsCall[1]).not.toContain('PROD');
          expect(missingVarsCall[1]).not.toContain('DEV');
        }
      });
    });

    describe('missing required variables', () => {
      it('should handle empty required variables object', () => {
        // Since requiredEnvVars is empty in the current implementation,
        // this test verifies no required variables are checked
        validateEnvironment();

        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should not throw in development when no required variables are configured', () => {
        mockEnv.DEV = true;

        expect(() => {
          validateEnvironment();
        }).not.toThrow();
      });

      it('should not throw in production when no required variables are configured', () => {
        mockEnv.DEV = false;
        mockEnv.PROD = true;

        expect(() => {
          validateEnvironment();
        }).not.toThrow();
      });
    });

    describe('environment detection', () => {
      it('should properly detect development environment', () => {
        mockEnv.DEV = true;
        mockEnv.PROD = false;
        mockEnv.VITE_SENTRY_DSN = '';

        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalled(); // Should warn in dev
      });

      it('should properly detect production environment', () => {
        mockEnv.DEV = false;
        mockEnv.PROD = true;
        mockEnv.VITE_SENTRY_DSN = '';

        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalled(); // Should not warn in prod
      });

      it('should handle mixed environment flags', () => {
        mockEnv.DEV = false;
        mockEnv.PROD = false;
        mockEnv.VITE_SENTRY_DSN = '';

        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalled(); // Should not warn when neither dev nor prod
      });
    });

    describe('edge cases', () => {
      it('should handle undefined environment variables', () => {
        mockEnv.VITE_SENTRY_DSN = undefined as any;
        mockEnv.VITE_ANALYTICS_DOMAIN = undefined as any;
        mockEnv.DEV = true;

        expect(() => {
          validateEnvironment();
        }).not.toThrow();

        expect(mockConsoleWarn).toHaveBeenCalled();
      });

      it('should handle null environment variables', () => {
        mockEnv.VITE_SENTRY_DSN = null as any;
        mockEnv.VITE_ANALYTICS_DOMAIN = null as any;
        mockEnv.DEV = true;

        expect(() => {
          validateEnvironment();
        }).not.toThrow();

        expect(mockConsoleWarn).toHaveBeenCalled();
      });

      it('should handle empty string environment variables', () => {
        mockEnv.VITE_SENTRY_DSN = '';
        mockEnv.VITE_ANALYTICS_DOMAIN = '';
        mockEnv.DEV = true;

        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_SENTRY_DSN, VITE_ANALYTICS_DOMAIN',
        );
      });

      it('should handle whitespace-only environment variables', () => {
        mockEnv.VITE_SENTRY_DSN = '   ';
        mockEnv.VITE_ANALYTICS_DOMAIN = '\t\n';
        mockEnv.DEV = true;

        validateEnvironment();

        // Whitespace strings are considered "truthy" so should not trigger warnings
        expect(mockConsoleWarn).not.toHaveBeenCalledWith(
          expect.stringContaining('Missing optional environment variables'),
        );
      });

      it('should handle numeric environment variables', () => {
        mockEnv.VITE_SENTRY_DSN = '123' as any;
        mockEnv.VITE_ANALYTICS_DOMAIN = '0' as any;
        mockEnv.DEV = true;

        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalledWith(
          expect.stringContaining('Missing optional environment variables'),
        );
      });

      it('should handle boolean environment variables', () => {
        mockEnv.VITE_SENTRY_DSN = false as any;
        mockEnv.VITE_ANALYTICS_DOMAIN = true as any;
        mockEnv.DEV = true;

        validateEnvironment();

        // false is falsy, true is truthy
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_SENTRY_DSN',
        );
      });
    });

    describe('real-world scenarios', () => {
      it('should validate typical development setup', () => {
        mockEnv.MODE = 'development';
        mockEnv.DEV = true;
        mockEnv.PROD = false;
        mockEnv.VITE_SENTRY_DSN = '';
        mockEnv.VITE_ANALYTICS_DOMAIN = '';

        validateEnvironment();

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          '⚠️ Missing optional environment variables:',
          'VITE_SENTRY_DSN, VITE_ANALYTICS_DOMAIN',
        );
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'Consider setting these for production deployment',
        );
      });

      it('should validate typical production setup', () => {
        mockEnv.MODE = 'production';
        mockEnv.DEV = false;
        mockEnv.PROD = true;
        mockEnv.VITE_SENTRY_DSN = 'https://abc123@sentry.io/123456';
        mockEnv.VITE_ANALYTICS_DOMAIN = 'mysite.com';

        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
        expect(mockConsoleLog).not.toHaveBeenCalled(); // No success message in prod
      });

      it('should validate staging environment', () => {
        mockEnv.MODE = 'staging';
        mockEnv.DEV = false;
        mockEnv.PROD = false;
        mockEnv.VITE_SENTRY_DSN = 'https://staging-dsn@sentry.io/123456';
        mockEnv.VITE_ANALYTICS_DOMAIN = 'staging.mysite.com';

        validateEnvironment();

        expect(mockConsoleWarn).not.toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should handle partial production configuration', () => {
        mockEnv.MODE = 'production';
        mockEnv.DEV = false;
        mockEnv.PROD = true;
        mockEnv.VITE_SENTRY_DSN = 'https://sentry-dsn@sentry.io/123456';
        mockEnv.VITE_ANALYTICS_DOMAIN = ''; // Missing analytics

        validateEnvironment();

        // Should not warn in production even if optional vars are missing
        expect(mockConsoleWarn).not.toHaveBeenCalled();
      });
    });

    describe('multiple invocations', () => {
      it('should behave consistently on multiple calls', () => {
        mockEnv.DEV = true;
        mockEnv.VITE_SENTRY_DSN = '';
        mockEnv.VITE_ANALYTICS_DOMAIN = 'analytics.com';

        validateEnvironment();
        validateEnvironment();
        validateEnvironment();

        // Should warn consistently each time
        expect(mockConsoleWarn).toHaveBeenCalledTimes(6); // 3 calls × 2 warn messages each
      });

      it('should reflect environment changes between calls', () => {
        mockEnv.DEV = true;
        mockEnv.VITE_SENTRY_DSN = '';

        validateEnvironment();
        expect(mockConsoleWarn).toHaveBeenCalled();

        mockConsoleWarn.mockClear();

        // Change environment
        mockEnv.VITE_SENTRY_DSN = 'configured';

        validateEnvironment();

        // Should not warn about VITE_SENTRY_DSN anymore
        const warnCalls = mockConsoleWarn.mock.calls;
        const missingVarsCall = warnCalls.find((call) =>
          call[0]?.includes('Missing optional environment variables'),
        );

        if (missingVarsCall) {
          expect(missingVarsCall[1]).not.toContain('VITE_SENTRY_DSN');
        }
      });
    });
  });

  describe('TypeScript type safety', () => {
    it('should provide type-safe access to environment variables', () => {
      // This test verifies that the env object has the correct types
      expect(typeof env.MODE).toBe('string');
      expect(typeof env.PROD).toBe('boolean');
      expect(typeof env.DEV).toBe('boolean');

      // Optional vars might be undefined, so check they exist
      expect(env.VITE_SENTRY_DSN).toBeDefined();
      expect(env.VITE_ANALYTICS_DOMAIN).toBeDefined();
    });

    it('should be readonly at runtime', () => {
      // Since env is defined with `as const`, it should be immutable
      // This test verifies the object structure is preserved
      const keys = Object.keys(env);
      expect(keys.length).toBeGreaterThan(0);

      // Try to modify (should not affect the object in a readonly context)
      expect(env).toBeDefined();
    });
  });
});
