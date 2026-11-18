import { env } from './env.js';

const isProduction = env.NODE_ENV === 'production';
const clientUrl = env.CLIENT_URL || '';
const isHttps = clientUrl.startsWith('https://');

// For cross-origin HTTPS production (e.g. Vercel frontend calling Railway backend):
// Cookies require sameSite='none' and secure=true to be sent by browsers.
// On plain HTTP (e.g. http://localhost), sameSite='lax' and secure=false allows browsers to store and send cookies without rejection.
const isSecure = isProduction && isHttps;
const sameSitePolicy = isSecure ? 'none' : 'lax';

export const cookieOptions = {
  accessToken: {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSitePolicy,
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  },
  refreshToken: {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSitePolicy,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  },
  csrf: {
    httpOnly: false, // Accessible to JavaScript so client can read and send in header
    secure: isSecure,
    sameSite: sameSitePolicy,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  },
};

export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { path: '/', httpOnly: true, secure: isSecure, sameSite: sameSitePolicy });
  res.clearCookie('refreshToken', { path: '/', httpOnly: true, secure: isSecure, sameSite: sameSitePolicy });
  res.clearCookie('XSRF-TOKEN', { path: '/', httpOnly: false, secure: isSecure, sameSite: sameSitePolicy });
};
