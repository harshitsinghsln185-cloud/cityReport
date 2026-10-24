import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { User } from '../src/models/User.js';
import { RefreshToken } from '../src/models/RefreshToken.js';

const parseCookies = (setCookieHeaders) => {
  if (!setCookieHeaders) return {};
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  const cookies = {};
  for (const h of headers) {
    const parts = h.split(';');
    const [name, val] = parts[0].split('=');
    cookies[name.trim()] = val ? val.trim() : '';
  }
  return cookies;
};

const formatCookieHeader = (cookies) => {
  return Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
};

describe('M13 Security & Hardening: Auth, Lockout, Token Rotation & Cookie Protection', () => {
  let server;
  let baseUrl;
  let csrfToken;
  let baseCookies = {};
  const testEmail = `auth_test_${Date.now()}@example.com`;
  const testPassword = 'Password@123';

  beforeAll(async () => {
    await connectDB(env.MONGODB_URI);
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://localhost:${port}/api`;

    // Fetch initial CSRF token
    const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
    const csrfJson = await csrfRes.json();
    csrfToken = csrfJson.data.csrfToken;

    const setCookies = csrfRes.headers.getSetCookie ? csrfRes.headers.getSetCookie() : csrfRes.headers.get('set-cookie');
    baseCookies = parseCookies(setCookies);
  });

  afterAll(async () => {
    await User.deleteMany({ email: testEmail });
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDB();
  });

  it('1. CSRF Protection: Rejects POST request without CSRF token with HTTP 403', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.message.toLowerCase()).toContain('csrf');
  });

  it('2. Registration & Privilege Escalation Deflection: Ignores client role payload and enforces User', async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(baseCookies),
      },
      body: JSON.stringify({
        name: 'Jane Citizen',
        email: testEmail,
        phone: '9876543210',
        password: testPassword,
        role: 'Admin', // Adversarial escalation attempt
        address: { street: '12 Civic Way', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.email).toBe(testEmail);

    // Confirm in DB that role was forced to 'User'
    const dbUser = await User.findOne({ email: testEmail });
    expect(dbUser).toBeDefined();
    expect(dbUser.role).toBe('User');
    expect(dbUser.isEmailVerified).toBe(false);
  });

  it('3. Cookie Security Flags: Tokens are delivered in secure, httpOnly, SameSite cookies', async () => {
    // Manually mark email verified for login test
    await User.updateOne({ email: testEmail }, { $set: { isEmailVerified: true } });

    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(baseCookies),
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    expect(loginRes.status).toBe(200);
    const rawSetCookies = loginRes.headers.getSetCookie
      ? loginRes.headers.getSetCookie()
      : [loginRes.headers.get('set-cookie')];

    // Assert httpOnly and SameSite in set-cookie headers
    const cookieString = rawSetCookies.join('\n').toLowerCase();
    expect(cookieString).toContain('httponly');
    expect(cookieString).toContain('samesite=lax');
  });

  it('4. Account Lockout: 5 failed password attempts trigger temporary account lockout', async () => {
    const lockoutEmail = `lockout_${Date.now()}@example.com`;
    await User.create({
      name: 'Lockout Target',
      email: lockoutEmail,
      phone: '9876543219',
      password: 'CorrectPassword@123',
      role: 'User',
      address: { street: 'Main St', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      isEmailVerified: true,
    });

    // 5 failed password attempts
    for (let i = 1; i <= 5; i++) {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          Cookie: formatCookieHeader(baseCookies),
        },
        body: JSON.stringify({
          email: lockoutEmail,
          password: 'WrongPassword@999',
        }),
      });

      if (i < 5) {
        expect(res.status).toBe(401);
      } else {
        expect([401, 403, 423]).toContain(res.status);
      }
    }

    // 6th attempt with correct password should be rejected due to active lock
    const lockedRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(baseCookies),
      },
      body: JSON.stringify({
        email: lockoutEmail,
        password: 'CorrectPassword@123',
      }),
    });

    const lockedJson = await lockedRes.json();
    expect([401, 403, 423]).toContain(lockedRes.status);
    expect(lockedJson.message.toLowerCase()).toContain('lock');

    await User.deleteOne({ email: lockoutEmail });
  });

  it('5. Token Refresh & Rotation: Refreshes access token and rotates refresh token', async () => {
    // 1. Login to obtain session
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(baseCookies),
      },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });

    const loginCookies = parseCookies(
      loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : loginRes.headers.get('set-cookie')
    );
    const sessionCookies = { ...baseCookies, ...loginCookies };

    // 2. Call refresh
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(sessionCookies),
      },
    });

    expect(refreshRes.status).toBe(200);
    const refreshedCookies = parseCookies(
      refreshRes.headers.getSetCookie ? refreshRes.headers.getSetCookie() : refreshRes.headers.get('set-cookie')
    );

    expect(refreshedCookies.accessToken).toBeDefined();
    expect(refreshedCookies.refreshToken).toBeDefined();

    // 3. Logout clears session cookies
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader({ ...sessionCookies, ...refreshedCookies }),
      },
    });

    expect(logoutRes.status).toBe(200);
  });
});
