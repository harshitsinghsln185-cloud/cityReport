/**
 * Site Configuration
 * Centralized domain and site metadata driven by environment variables.
 */

const getFallbackOrigin = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:5173';
};

/**
 * Site base URL configured in .env via VITE_SITE_URL (e.g. https://yourdomain.com)
 * Falls back to current window.location.origin in the browser, or localhost during dev.
 */
export const SITE_URL: string = (
  import.meta.env.VITE_SITE_URL || getFallbackOrigin()
).replace(/\/+$/, '');

export const SITE_NAME = 'Crowd Report';
