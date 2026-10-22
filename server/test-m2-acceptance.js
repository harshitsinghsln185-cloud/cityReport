import http from 'http';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import { User } from './src/models/User.js';
import { Category } from './src/models/Category.js';
import { FeeSettings } from './src/models/FeeSettings.js';

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
  console.log('--- Starting M2 Acceptance Criteria Verification ---');
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
    // 1. Acceptance Criterion 1: Seeded Categories and Singleton FeeSettings exist
    const defaultSlugs = ['road-damage', 'water-supply', 'drainage', 'streetlight-electricity', 'garbage', 'other'];
    const seededCategories = await Category.find({ slug: { $in: defaultSlugs } });
    const feeSettings = await FeeSettings.findOne({ singleton: true });

    assert(
      seededCategories.length === 6 &&
        feeSettings !== null &&
        feeSettings.freeKm === 3 &&
        feeSettings.perKmRatePaise === 1500 &&
        feeSettings.minFeePaise === 10000 &&
        feeSettings.maxFeePaise === 500000 &&
        feeSettings.commissionPercent === 10,
      '1. npm run seed:defaults populates the 6 civic categories and singleton fee settings'
    );

    // 2. Fetch CSRF token for subsequent authenticated state-changing requests
    const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
    const csrfData = await csrfRes.json();
    const csrfCookies = parseCookies(csrfRes.headers.getSetCookie ? csrfRes.headers.getSetCookie() : csrfRes.headers.get('set-cookie'));
    const csrfToken = csrfData.data.csrfToken;

    // Login as Admin
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: JSON.stringify({
        email: env.ADMIN_EMAIL || 'admin@crowdreport.local',
        password: env.ADMIN_PASSWORD || 'Admin@123456',
      }),
    });
    const adminLoginCookies = parseCookies(
      adminLoginRes.headers.getSetCookie ? adminLoginRes.headers.getSetCookie() : [adminLoginRes.headers.get('set-cookie')]
    );
    const adminCookies = { ...csrfCookies, ...adminLoginCookies };
    assert(adminLoginRes.status === 200, 'Admin successfully authenticated');

    // Create a regular citizen user for RBAC isolation test
    const citizenEmail = `citizen_test_${Date.now()}@example.com`;
    const citizenUser = await User.create({
      name: 'Citizen Regular',
      email: citizenEmail,
      phone: '9876543299',
      password: 'Password@123',
      role: 'User',
      isEmailVerified: true,
      address: {
        street: 'Civic Lane',
        city: 'Metro',
        state: 'State',
        pincode: '110001',
      },
    });

    const citizenLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: JSON.stringify({
        email: citizenEmail,
        password: 'Password@123',
      }),
    });
    const citizenLoginCookies = parseCookies(
      citizenLoginRes.headers.getSetCookie ? citizenLoginRes.headers.getSetCookie() : [citizenLoginRes.headers.get('set-cookie')]
    );
    const citizenCookies = { ...csrfCookies, ...citizenLoginCookies };

    // 3. Acceptance Criterion 2: Public GET /api/categories returns only active categories
    const publicCatRes = await fetch(`${baseUrl}/categories`);
    const publicCatData = await publicCatRes.json();
    assert(
      publicCatRes.status === 200 &&
        publicCatData.success === true &&
        Array.isArray(publicCatData.data) &&
        publicCatData.data.every((c) => c.isActive !== false),
      '2. GET /api/categories returns only active categories'
    );

    // 4. Acceptance Criterion 3: Admin can create a new category and disable an existing one
    const testCategorySlug = `traffic-signal-${Date.now()}`;
    const createCatRes = await fetch(`${baseUrl}/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(adminCookies),
      },
      body: JSON.stringify({
        name: `Traffic Signals ${Date.now()}`,
        slug: testCategorySlug,
        description: 'Broken timers or knocked down signal poles',
        baseFeePaise: 45000,
        icon: 'alert-triangle',
      }),
    });
    const createCatData = await createCatRes.json();
    const createdCategoryId = createCatData.data?._id;

    assert(
      createCatRes.status === 201 &&
        createCatData.success === true &&
        createCatData.data.slug === testCategorySlug &&
        createCatData.data.baseFeePaise === 45000,
      '3a. Admin can create a new civic category'
    );

    // Admin disables the newly created category (soft delete / toggle active status)
    const toggleRes = await fetch(`${baseUrl}/admin/categories/${createdCategoryId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(adminCookies),
      },
      body: JSON.stringify({ isActive: false }),
    });
    const toggleData = await toggleRes.json();

    const publicAfterToggleRes = await fetch(`${baseUrl}/categories`);
    const publicAfterToggleData = await publicAfterToggleRes.json();
    const disabledCatInPublic = publicAfterToggleData.data.some((c) => c._id === createdCategoryId);

    assert(
      toggleRes.status === 200 &&
        toggleData.success === true &&
        toggleData.data.isActive === false &&
        disabledCatInPublic === false,
      '3b. Admin can disable an existing category and it disappears from public view'
    );

    // 5. Acceptance Criterion 4: Submitting minFeePaise > maxFeePaise fails with 400 Bad Request
    const invalidFeeRes = await fetch(`${baseUrl}/admin/fee-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(adminCookies),
      },
      body: JSON.stringify({
        freeKm: 3,
        perKmRatePaise: 1500,
        minFeePaise: 700000, // ₹7000 > max ₹5000
        maxFeePaise: 500000,
        commissionPercent: 10,
        multipliers: {
          minor: 1.0,
          moderate: 1.3,
          high: 1.6,
          critical: 2.0,
        },
      }),
    });
    const invalidFeeData = await invalidFeeRes.json();

    assert(
      invalidFeeRes.status === 400 &&
        (invalidFeeData.message?.includes('minFeePaise cannot exceed maxFeePaise') ||
          JSON.stringify(invalidFeeData.errors).includes('minFeePaise cannot exceed maxFeePaise')),
      '4. Submitting minFeePaise > maxFeePaise to PUT /api/admin/fee-settings fails with 400 Bad Request'
    );

    // Valid fee settings update
    const validFeeRes = await fetch(`${baseUrl}/admin/fee-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(adminCookies),
      },
      body: JSON.stringify({
        freeKm: 4,
        perKmRatePaise: 1800,
        minFeePaise: 12000,
        maxFeePaise: 600000,
        commissionPercent: 12,
        multipliers: {
          minor: 1.05,
          moderate: 1.35,
          high: 1.65,
          critical: 2.1,
        },
      }),
    });
    const validFeeData = await validFeeRes.json();
    assert(
      validFeeRes.status === 200 &&
        validFeeData.success === true &&
        validFeeData.data.freeKm === 4 &&
        validFeeData.data.commissionPercent === 12,
      'Valid fee settings update succeeds and saves parameters'
    );

    // Reset fee settings back to baseline
    await fetch(`${baseUrl}/admin/fee-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(adminCookies),
      },
      body: JSON.stringify({
        freeKm: 3,
        perKmRatePaise: 1500,
        minFeePaise: 10000,
        maxFeePaise: 500000,
        commissionPercent: 10,
        multipliers: {
          minor: 1.0,
          moderate: 1.3,
          high: 1.6,
          critical: 2.0,
        },
      }),
    });

    // 6. Acceptance Criterion 5: A non-admin user receives 403 Forbidden on admin category and fee routes
    const citizenAdminCatRes = await fetch(`${baseUrl}/admin/categories`, {
      method: 'GET',
      headers: { Cookie: formatCookieHeader(citizenCookies) },
    });
    const citizenCreateCatRes = await fetch(`${baseUrl}/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(citizenCookies),
      },
      body: JSON.stringify({
        name: 'Unauthorized Cat',
        slug: 'unauthorized-cat',
        description: 'Should fail',
        baseFeePaise: 10000,
      }),
    });
    const citizenGetFeeRes = await fetch(`${baseUrl}/admin/fee-settings`, {
      method: 'GET',
      headers: { Cookie: formatCookieHeader(citizenCookies) },
    });
    const citizenPutFeeRes = await fetch(`${baseUrl}/admin/fee-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(citizenCookies),
      },
      body: JSON.stringify({ freeKm: 5 }),
    });

    assert(
      citizenAdminCatRes.status === 403 &&
        citizenCreateCatRes.status === 403 &&
        citizenGetFeeRes.status === 403 &&
        citizenPutFeeRes.status === 403,
      '5. A non-admin user receives 403 Forbidden on all admin category and fee routes'
    );

    // Clean up temporary test data
    await Category.deleteOne({ _id: createdCategoryId });
    await User.deleteOne({ _id: citizenUser._id });

    console.log(`\n🎉 ALL ${passedCount} ACCEPTANCE TESTS PASSED SUCCESSFULLY!`);
  } finally {
    server.close();
    await disconnectDB();
  }
};

runAcceptanceTests().catch((err) => {
  console.error('\n❌ M2 Acceptance test run encountered error:\n', err);
  process.exit(1);
});
