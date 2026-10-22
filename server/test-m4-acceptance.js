import http from 'http';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import { User } from './src/models/User.js';
import { ResolverProfile } from './src/models/ResolverProfile.js';
import { Category } from './src/models/Category.js';

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

// 1x1 valid PNG file buffer for ID proof image testing
const validPngBuffer = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  'hex'
);

const runAcceptanceTests = async () => {
  console.log('====================================================');
  console.log('   M4 ACCEPTANCE CRITERIA VERIFICATION TEST SUITE   ');
  console.log('====================================================');

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
    // 1. Fetch CSRF token
    const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
    const csrfData = await csrfRes.json();
    const csrfCookies = parseCookies(
      csrfRes.headers.getSetCookie ? csrfRes.headers.getSetCookie() : csrfRes.headers.get('set-cookie')
    );
    const csrfToken = csrfData.data.csrfToken;
    assert(csrfToken && csrfCookies['XSRF-TOKEN'], '1. CSRF token and double-submit cookie retrieved');

    // 2. Setup Category
    const testCategory = await Category.findOneAndUpdate(
      { slug: 'road-pothole-repair-m4' },
      {
        name: 'Road & Pothole Repair M4',
        slug: 'road-pothole-repair-m4',
        description: 'Municipal road and asphalt maintenance',
        baseFeePaise: 50000,
        icon: 'wrench',
        isActive: true,
      },
      { upsert: true, new: true }
    );
    assert(testCategory && testCategory._id, '2. Civic service category established');

    // 3. Setup Administrator
    const adminEmail = `admin_m4_${Date.now()}@example.com`;
    const adminUser = await User.create({
      name: 'System Admin M4',
      email: adminEmail,
      phone: '9876543201',
      password: 'AdminPassword@123',
      role: 'Admin',
      address: {
        street: 'Municipal Office',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
      isEmailVerified: true,
    });

    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: JSON.stringify({
        email: adminEmail,
        password: 'AdminPassword@123',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.data.user.role === 'Admin', '3. Admin account logged in');
    const adminCookies = {
      ...csrfCookies,
      ...parseCookies(adminLoginRes.headers.getSetCookie ? adminLoginRes.headers.getSetCookie() : adminLoginRes.headers.get('set-cookie')),
    };

    // 4. Register Candidate Resolver 1 via Multipart Form
    const resolver1Email = `resolver1_m4_${Date.now()}@example.com`;
    const formData1 = new FormData();
    formData1.append('name', 'Sunil Kumar Sharma');
    formData1.append('email', resolver1Email);
    formData1.append('phone', '9812345678');
    formData1.append('password', 'ResolverPassword@123');
    formData1.append(
      'address',
      JSON.stringify({
        street: 'Shop 12, Main Bazar',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      })
    );
    formData1.append('skills', JSON.stringify([testCategory._id.toString()]));
    formData1.append('serviceAddress', 'Shop 12, Main Bazar, Connaught Place, New Delhi');
    formData1.append('lat', '28.6304');
    formData1.append('lng', '77.2177');
    formData1.append('serviceRadiusKm', '15');
    formData1.append('idProof', new Blob([validPngBuffer], { type: 'image/png' }), 'govt_id.png');

    const reg1Res = await fetch(`${baseUrl}/resolvers/register`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: formData1,
    });
    const reg1Data = await reg1Res.json();
    assert(reg1Res.status === 201 && reg1Data.success, '4. Candidate Resolver 1 registered successfully');
    const profileId1 = reg1Data.data.profileId;

    // Verify ResolverProfile in MongoDB has 2dsphere coordinates and Pending status
    const profileDoc1 = await ResolverProfile.findById(profileId1);
    assert(
      profileDoc1 &&
      profileDoc1.status === 'Pending' &&
      profileDoc1.serviceLocation.type === 'Point' &&
      profileDoc1.serviceLocation.coordinates[0] === 77.2177 &&
      profileDoc1.serviceLocation.coordinates[1] === 28.6304 &&
      profileDoc1.serviceRadiusKm === 15 &&
      profileDoc1.idProof.accessType === 'authenticated',
      '5. ResolverProfile document saved with GeoJSON Point, Pending status, and authenticated ID proof'
    );

    // 6. Login as Candidate Resolver 1
    const res1LoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: JSON.stringify({
        email: resolver1Email,
        password: 'ResolverPassword@123',
      }),
    });
    const res1LoginData = await res1LoginRes.json();
    assert(
      res1LoginRes.status === 200 &&
      res1LoginData.data.user.resolverStatus === 'Pending',
      '6. Resolver login returns user profile populated with resolverStatus: "Pending"'
    );
    const resolver1Cookies = {
      ...csrfCookies,
      ...parseCookies(res1LoginRes.headers.getSetCookie ? res1LoginRes.headers.getSetCookie() : res1LoginRes.headers.get('set-cookie')),
    };

    // 7. Check requireApprovedResolver guard blocks pending candidate
    const guardedPendingRes = await fetch(`${baseUrl}/resolvers/active-check`, {
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(resolver1Cookies),
      },
    });
    const guardedPendingData = await guardedPendingRes.json();
    assert(
      guardedPendingRes.status === 403 &&
      guardedPendingData.success === false &&
      guardedPendingData.data.status === 'Pending',
      '7. requireApprovedResolver middleware blocks pending candidate with 403 Forbidden'
    );

    // 8. Admin lists pending resolvers
    const adminListRes = await fetch(`${baseUrl}/admin/resolvers?status=Pending`, {
      headers: {
        Cookie: formatCookieHeader(adminCookies),
      },
    });
    const adminListData = await adminListRes.json();
    assert(
      adminListRes.status === 200 &&
      adminListData.data.some((r) => r._id === profileId1.toString()),
      '8. Admin verification queue lists pending resolver candidate'
    );

    // 9. Admin inspects application with 10-minute signed ID proof URL
    const adminInspectRes = await fetch(`${baseUrl}/admin/resolvers/${profileId1}`, {
      headers: {
        Cookie: formatCookieHeader(adminCookies),
      },
    });
    const adminInspectData = await adminInspectRes.json();
    assert(
      adminInspectRes.status === 200 &&
      adminInspectData.data.idProofSignedUrl &&
      adminInspectData.data.idProofSignedUrl.includes('image/upload'),
      '9. Admin inspection endpoint generates short-lived signed URL for government ID proof'
    );

    // 10. Admin approves candidate 1
    const approveRes = await fetch(`${baseUrl}/admin/resolvers/${profileId1}/approve`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(adminCookies),
      },
    });
    const approveData = await approveRes.json();
    assert(
      approveRes.status === 200 &&
      approveData.data.status === 'Approved',
      '10. Admin approves candidate: status transitions from Pending to Approved'
    );

    // 11. Check requireApprovedResolver guard permits approved candidate
    const guardedApprovedRes = await fetch(`${baseUrl}/resolvers/active-check`, {
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(resolver1Cookies),
      },
    });
    const guardedApprovedData = await guardedApprovedRes.json();
    assert(
      guardedApprovedRes.status === 200 &&
      guardedApprovedData.success === true &&
      guardedApprovedData.data.status === 'Approved',
      '11. requireApprovedResolver middleware allows approved contractor into active dispatch route'
    );

    // 12. Register Candidate Resolver 2 (to be rejected)
    const resolver2Email = `resolver2_m4_${Date.now()}@example.com`;
    const formData2 = new FormData();
    formData2.append('name', 'Ajay Verma');
    formData2.append('email', resolver2Email);
    formData2.append('phone', '9823456789');
    formData2.append('password', 'ResolverPassword@123');
    formData2.append(
      'address',
      JSON.stringify({
        street: 'Plot 4, Sector 15',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
      })
    );
    formData2.append('skills', JSON.stringify([testCategory._id.toString()]));
    formData2.append('serviceAddress', 'Sector 15 Market, Noida');
    formData2.append('lat', '28.5800');
    formData2.append('lng', '77.3100');
    formData2.append('serviceRadiusKm', '20');
    formData2.append('idProof', new Blob([validPngBuffer], { type: 'image/png' }), 'blurry_id.png');

    const reg2Res = await fetch(`${baseUrl}/resolvers/register`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: formData2,
    });
    const reg2Data = await reg2Res.json();
    assert(reg2Res.status === 201 && reg2Data.success, '12. Candidate Resolver 2 registered');
    const profileId2 = reg2Data.data.profileId;

    // 13. Admin rejects Candidate Resolver 2 with mandatory reason
    const rejectionReason = 'Uploaded ID proof document is blurry and the municipal trade certification is expired.';
    const rejectRes = await fetch(`${baseUrl}/admin/resolvers/${profileId2}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(adminCookies),
      },
      body: JSON.stringify({ reason: rejectionReason }),
    });
    const rejectData = await rejectRes.json();
    assert(
      rejectRes.status === 200 &&
      rejectData.data.status === 'Rejected' &&
      rejectData.data.rejectionReason === rejectionReason,
      '13. Admin rejects candidate: status becomes Rejected and rejection reason is recorded'
    );

    // 14. Login as Rejected Resolver 2 and test guard blocking with reason
    const res2LoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: JSON.stringify({
        email: resolver2Email,
        password: 'ResolverPassword@123',
      }),
    });
    const res2LoginData = await res2LoginRes.json();
    assert(
      res2LoginData.data.user.resolverStatus === 'Rejected' &&
      res2LoginData.data.user.rejectionReason === rejectionReason,
      '14. Rejected candidate login returns resolverStatus: "Rejected" with rejectionReason'
    );

    const resolver2Cookies = {
      ...csrfCookies,
      ...parseCookies(res2LoginRes.headers.getSetCookie ? res2LoginRes.headers.getSetCookie() : res2LoginRes.headers.get('set-cookie')),
    };
    const guardedRejectedRes = await fetch(`${baseUrl}/resolvers/active-check`, {
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(resolver2Cookies),
      },
    });
    assert(
      guardedRejectedRes.status === 403,
      '15. requireApprovedResolver blocks rejected candidate from active work routes'
    );

    // 16. Resolver 1 updates territory settings (radius & availability)
    const updateSettingsRes = await fetch(`${baseUrl}/resolvers/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(resolver1Cookies),
      },
      body: JSON.stringify({
        serviceRadiusKm: 30,
        isAvailable: false,
      }),
    });
    const updateSettingsData = await updateSettingsRes.json();
    assert(
      updateSettingsRes.status === 200 &&
      updateSettingsData.data.serviceRadiusKm === 30 &&
      updateSettingsData.data.isAvailable === false,
      '16. Resolver updates territory coverage radius and availability status'
    );

    // Cleanup test data
    await User.deleteMany({ email: { $in: [adminEmail, resolver1Email, resolver2Email] } });
    await ResolverProfile.deleteMany({ _id: { $in: [profileId1, profileId2] } });
    await Category.deleteOne({ _id: testCategory._id });

    console.log('====================================================');
    console.log(`🎉 ALL ${passedCount} ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!`);
    console.log('====================================================');
  } finally {
    server.close();
    await disconnectDB();
  }
};

runAcceptanceTests().catch((err) => {
  console.error('Acceptance test failed:', err);
  process.exit(1);
});
