import { env } from './env.js';

const isProduction = env.NODE_ENV === 'production';

export const cookieOptions = {
  accessToken: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  },
  refreshToken: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  },
  csrf: {
    httpOnly: false, // Accessible to JavaScript so client can read and send in header
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  },
};

export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { path: '/', httpOnly: true, secure: isProduction, sameSite: 'lax' });
  res.clearCookie('refreshToken', { path: '/', httpOnly: true, secure: isProduction, sameSite: 'lax' });
};
