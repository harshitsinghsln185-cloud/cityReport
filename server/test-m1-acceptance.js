import http from 'http';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import { User } from './src/models/User.js';
import { RefreshToken } from './src/models/RefreshToken.js';
import tokenService from './src/services/tokenService.js';

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

const runAcceptanceTests = async () => {
  console.log('--- Starting M1 Acceptance Criteria Verification ---');
  await connectDB(env.MONGODB_URI);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  let passedCount = 0;
  const assert = (condition, name) => {
    if (!condition) {
      console.error(`❌ FAILED: ${name}`);
      throw new Error(`Assertion failed: ${name}`);
    }
    console.log(`✅ PASSED: ${name}`);
    passedCount++;
  };

  try {
    // 1. Verify Admin Seed Account
    const adminUser = await User.findOne({ email: env.ADMIN_EMAIL || 'admin@crowdreport.local' });
    assert(adminUser !== null && adminUser.role === 'Admin', '1. Admin seed account exists with role: Admin');

    // 2. Verify CSRF Protection: POST without X-CSRF-Token header fails with 403
    const testEmail = `citizen_${Date.now()}@example.com`;
    const noCsrfRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Citizen Jane',
        email: testEmail,
        phone: '9876543210',
        password: 'Password@123',
        address: { street: '123 Main St', city: 'Metro', state: 'State', pincode: '110001' },
      }),
    });
    const noCsrfBody = await noCsrfRes.json();
    assert(
      noCsrfRes.status === 403 && noCsrfBody.message.includes('CSRF'),
      '2. POST request without CSRF token fails with 403'
    );

    // 3. Fetch CSRF token
    const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
    const csrfData = await csrfRes.json();
    const csrfCookies = parseCookies(csrfRes.headers.getSetCookie ? csrfRes.headers.getSetCookie() : csrfRes.headers.get('set-cookie'));
    const xsrfCookieToken = csrfCookies['XSRF-TOKEN'];
    const csrfHeaderToken = csrfData.data.csrfToken;
    assert(
      csrfRes.status === 200 && csrfHeaderToken && xsrfCookieToken === csrfHeaderToken,
      '3. GET /api/auth/csrf-token provides matching cookie and token'
    );

    let sessionCookies = { ...csrfCookies };

    // 4. Citizen Registration
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfHeaderToken,
        Cookie: formatCookieHeader(sessionCookies),
      },
      body: JSON.stringify({
        name: 'Citizen Jane',
        email: testEmail,
        phone: '9876543210',
        password: 'Password@123',
        role: 'Admin', // Attempting privilege escalation - server must ignore and enforce 'User'
        address: { street: '123 Main St', city: 'Metro', state: 'State', pincode: '110001' },
      }),
    });
    const regData = await regRes.json();
    const registeredUser = await User.findOne({ email: testEmail }).select('+emailVerificationToken');
    assert(
      regRes.status === 201 &&
        regData.success === true &&
        regData.data.accessToken === undefined &&
        regData.data.refreshToken === undefined &&
        registeredUser.role === 'User' &&
        registeredUser.isEmailVerified === false &&
        registeredUser.emailVerificationToken !== null,
      '4. Registration enforces role: User, isEmailVerified: false, dispatches verify token, and returns zero tokens in body'
    );

    // 5. Email Verification
    // Retrieve the user from DB to simulate clicking the email link
    // We recreate the raw token test by updating the user with known token hash
    const rawVerifyToken = 'test-verification-token-xyz-1234567890';
    registeredUser.emailVerificationToken = tokenService.hashToken(rawVerifyToken);
    registeredUser.emailVerificationExpires = new Date(Date.now() + 3600000);
    await registeredUser.save();

    const verifyRes = await fetch(`${baseUrl}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfHeaderToken,
        Cookie: formatCookieHeader(sessionCookies),
      },
      body: JSON.stringify({ token: rawVerifyToken }),
    });
    const verifyData = await verifyRes.json();
    const verifiedUser = await User.findOne({ email: testEmail });
    assert(
      verifyRes.status === 200 &&
        verifyData.success === true &&
        verifiedUser.isEmailVerified === true,
      '5. Email verification token successfully marks isEmailVerified: true'
    );

    // 6. Login: Sets httpOnly cookies and response contains zero tokens in body
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfHeaderToken,
        Cookie: formatCookieHeader(sessionCookies),
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password@123',
      }),
    });
    const loginData = await loginRes.json();
    const loginSetCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [loginRes.headers.get('set-cookie')];
    const loginParsedCookies = parseCookies(loginSetCookies);
    sessionCookies = { ...sessionCookies, ...loginParsedCookies };

    assert(
      loginRes.status === 200 &&
        loginData.success === true &&
        loginData.data.user.email === testEmail &&
        loginData.data.accessToken === undefined &&
        loginData.data.refreshToken === undefined &&
        Boolean(sessionCookies['accessToken']) &&
        Boolean(sessionCookies['refreshToken']),
      '6. Login sets httpOnly accessToken and refreshToken cookies and returns zero tokens in JSON body'
    );

    // 7. Brute Force Lockout: 5 failed attempts locks account for 15 minutes
    const lockoutEmail = `lockout_${Date.now()}@example.com`;
    await User.create({
      name: 'Lockout Target',
      email: lockoutEmail,
      phone: '9876543211',
      password: 'Password@123',
      role: 'User',
      isEmailVerified: true,
      address: {
        street: '456 Lockout St',
        city: 'Metro',
        state: 'State',
        pincode: '110002',
      },
    });

    let lockoutTriggered = false;
    for (let i = 1; i <= 6; i++) {
      const failRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfHeaderToken,
          Cookie: formatCookieHeader(sessionCookies),
        },
        body: JSON.stringify({
          email: lockoutEmail,
          password: 'WrongPassword!',
        }),
      });
      const failData = await failRes.json();
      if (failRes.status === 403 && failData.message.includes('locked')) {
        lockoutTriggered = true;
        break;
      }
    }
    const lockedUser = await User.findOne({ email: lockoutEmail });
    assert(
      lockoutTriggered && lockedUser.isLocked === true && lockedUser.failedLoginAttempts >= 5,
      '7. 5 failed login attempts triggers 15-minute account lockout (403 Forbidden)'
    );

    // 8. Refresh Token Rotation
    const oldRefreshToken = sessionCookies['refreshToken'];
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfHeaderToken,
        Cookie: formatCookieHeader(sessionCookies),
      },
    });
    const refreshData = await refreshRes.json();
    const refreshSetCookies = refreshRes.headers.getSetCookie ? refreshRes.headers.getSetCookie() : [refreshRes.headers.get('set-cookie')];
    const refreshedParsedCookies = parseCookies(refreshSetCookies);
    const newRefreshToken = refreshedParsedCookies['refreshToken'];

    const oldHash = tokenService.hashToken(oldRefreshToken);
    const oldDbToken = await RefreshToken.findOne({ tokenHash: oldHash });
    const newHash = tokenService.hashToken(newRefreshToken);
    const newDbToken = await RefreshToken.findOne({ tokenHash: newHash });

    assert(
      refreshRes.status === 200 &&
        refreshData.success === true &&
        newRefreshToken !== oldRefreshToken &&
        oldDbToken.isRevoked === true &&
        newDbToken !== null &&
        newDbToken.isRevoked === false,
      '8. POST /api/auth/refresh rotates refresh token and marks previous token revoked in MongoDB'
    );

    sessionCookies = { ...sessionCookies, ...refreshedParsedCookies };

    // 9. RBAC: Authenticated citizen attempting to access Admin route receives 403 Forbidden
    const adminAccessAsCitizenRes = await fetch(`${baseUrl}/admin/status`, {
      method: 'GET',
      headers: {
        Cookie: formatCookieHeader(sessionCookies),
      },
    });
    const adminAccessBody = await adminAccessAsCitizenRes.json();
    assert(
      adminAccessAsCitizenRes.status === 403 &&
        adminAccessBody.message.includes('not authorized'),
      '9. Authenticated Citizen (role: User) accessing Admin route receives 403 Forbidden'
    );

    // 10. RBAC: Authenticated Admin accessing Admin route succeeds with 200 OK
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfHeaderToken,
        Cookie: formatCookieHeader(sessionCookies),
      },
      body: JSON.stringify({
        email: env.ADMIN_EMAIL || 'admin@crowdreport.local',
        password: env.ADMIN_PASSWORD || 'Admin@123456',
      }),
    });
    const adminLoginSetCookies = adminLoginRes.headers.getSetCookie ? adminLoginRes.headers.getSetCookie() : [adminLoginRes.headers.get('set-cookie')];
    const adminCookies = { ...sessionCookies, ...parseCookies(adminLoginSetCookies) };

    const adminStatusRes = await fetch(`${baseUrl}/admin/status`, {
      method: 'GET',
      headers: {
        Cookie: formatCookieHeader(adminCookies),
      },
    });
    const adminStatusData = await adminStatusRes.json();
    assert(
      adminStatusRes.status === 200 &&
        adminStatusData.success === true &&
        adminStatusData.data.role === 'Admin',
      '10. Authenticated Admin accessing Admin route succeeds with 200 OK'
    );

    // Clean up test data
    await User.deleteMany({ email: { $in: [testEmail, lockoutEmail] } });
    await RefreshToken.deleteMany({ user: registeredUser._id });

    console.log(`\n🎉 ALL ${passedCount} ACCEPTANCE TESTS PASSED SUCCESSFULLY!`);
  } finally {
    server.close();
    await disconnectDB();
  }
};

runAcceptanceTests().catch((err) => {
  console.error('\n❌ Acceptance test run encountered error:\n', err);
  process.exit(1);
});
