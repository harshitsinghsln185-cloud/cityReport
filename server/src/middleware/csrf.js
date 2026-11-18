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

  // Exempt unauthenticated public onboarding/auth and conversational AI chat endpoints from CSRF double-submit deadlock
  const cleanPath = (req.originalUrl || req.path || '').split('?')[0];
  const isPublicAuthRoute =
    cleanPath.endsWith('/auth/login') ||
    cleanPath.endsWith('/auth/register') ||
    cleanPath.endsWith('/auth/forgot-password') ||
    cleanPath.endsWith('/auth/reset-password') ||
    cleanPath.endsWith('/auth/verify-email') ||
    cleanPath.endsWith('/auth/refresh');

  // Public AI Chatbot conversation endpoints (for both anonymous residents and authenticated citizens)
  // These create drafts and send AI prompts; final issue dispatch (/chat/sessions/:id/submit) requires strict authentication
  const isPublicChatRoute =
    (cleanPath.endsWith('/chat/sessions') && req.method === 'POST') ||
    (cleanPath.includes('/chat/sessions/') && cleanPath.endsWith('/messages') && req.method === 'POST') ||
    (cleanPath.includes('/chat/sessions/') && cleanPath.endsWith('/images') && req.method === 'POST');

  if (isPublicAuthRoute || isPublicChatRoute) {
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
