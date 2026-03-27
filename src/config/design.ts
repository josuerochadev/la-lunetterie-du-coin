/**
 * Design tokens used in JS/TS that mirror CSS custom properties.
 *
 * Prefer CSS variables in Tailwind classes. Use these constants only
 * when a hex value is needed in JS (e.g. inline gradient strings).
 */
export const ACCENT_HEX = '#FEEB09';

/**
 * z-index scale for the HomePage sticky section stack.
 * Each section must sit above the previous one.
 */
export const Z_INDEX = {
  story: 12,
  offers: 13,
  services: 14,
  testimonials: 15,
  contact: 16,
} as const;

/**
 * Named timeouts (ms) used across the app.
 */
export const TIMING = {
  /** Sentry lazy init delay */
  sentryInit: 1000,
  sentryInitFallback: 2000,
  /** Navbar re-show after route change */
  navbarReshow: 1500,
  /** Form submission network timeout */
  formTimeout: 10_000,
  /** Success message visibility */
  formSuccessReset: 5000,
  /** Error message visibility */
  formErrorReset: 8000,
  /** Focus delay after form submission */
  formFocusDelay: 100,
} as const;
