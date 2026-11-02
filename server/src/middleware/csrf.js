import crypto from 'crypto';
import { AppError } from '../utils/AppError.js';

export const generateCsrfToken = () => {
  return crypto.randomBytes(24).toString('hex');
};

export const csrfProtection = (req, res, next) => {
  // Safe HTTP methods do not modify server state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Requests authenticated via Authorization Bearer header are immune to CSRF
  // because browsers never attach custom headers automatically across origins
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return next();
  }

  // Exempt unauthenticated public onboarding/auth endpoints from CSRF double-submit deadlock
  // (Prevents cross-domain login failure where client cannot read cross-site cookie before session exists)
  const cleanPath = (req.originalUrl || req.path || '').split('?')[0];
  const isPublicAuthRoute =
    cleanPath.endsWith('/auth/login') ||
    cleanPath.endsWith('/auth/register') ||
    cleanPath.endsWith('/auth/forgot-password') ||
    cleanPath.endsWith('/auth/reset-password') ||
    cleanPath.endsWith('/auth/verify-email') ||
    cleanPath.endsWith('/auth/refresh');

  if (isPublicAuthRoute) {
    return next();
  }

  const headerToken = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
  const cookieToken = req.cookies?.['XSRF-TOKEN'] || req.cookies?.csrfToken;

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return next(new AppError('Invalid or missing CSRF token', 403));
  }

  next();
};

export default csrfProtection;
