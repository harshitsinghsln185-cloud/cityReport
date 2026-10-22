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

  const headerToken = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
  const cookieToken = req.cookies?.['XSRF-TOKEN'] || req.cookies?.csrfToken;

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return next(new AppError('Invalid or missing CSRF token', 403));
  }

  next();
};

export default csrfProtection;
