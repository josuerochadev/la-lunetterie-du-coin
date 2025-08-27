/**
 * Environment variable validation and type safety
 */

const requiredEnvVars = {
  // Sentry configuration (optional but recommended for production)
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
} as const;

const optionalEnvVars = {
  // Mode and environment detection
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
} as const;

/**
 * Validates environment variables at runtime
 * Logs warnings for missing optional variables
 * Throws errors for missing required variables in production
 */
export function validateEnvironment() {
  const missingRequired: string[] = [];
  const missingOptional: string[] = [];

  // Check required environment variables
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      if (key === 'VITE_SENTRY_DSN') {
        // Sentry is optional in development but recommended in production
        if (import.meta.env.PROD) {
          missingRequired.push(key);
        } else {
          missingOptional.push(key);
        }
      } else {
        missingRequired.push(key);
      }
    }
  });

  // Log warnings for missing optional variables
  if (missingOptional.length > 0) {
    console.warn('⚠️ Missing optional environment variables:', missingOptional.join(', '));
    console.warn('Consider setting these for production deployment');
  }

  // Error for missing required variables in production
  if (missingRequired.length > 0) {
    const message = `❌ Missing required environment variables: ${missingRequired.join(', ')}`;
    console.error(message);

    if (import.meta.env.PROD) {
      throw new Error(message);
    }
  }

  // Success message
  if (missingRequired.length === 0 && missingOptional.length === 0) {
    console.log('✅ All environment variables are properly configured');
  }
}

/**
 * Type-safe environment variables export
 */
export const env = {
  ...requiredEnvVars,
  ...optionalEnvVars,
} as const;
