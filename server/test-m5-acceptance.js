import http from 'http';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import { User } from './src/models/User.js';
import { Category } from './src/models/Category.js';
import { FeeSettings } from './src/models/FeeSettings.js';
import { ResolverProfile } from './src/models/ResolverProfile.js';
import { Issue } from './src/models/Issue.js';
import { IssueTimeline } from './src/models/IssueTimeline.js';
import { Counter } from './src/models/Counter.js';
import feeService from './src/services/feeService.js';
import aiService from './src/services/aiService.js';
import sequence from './src/utils/sequence.js';

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

const validPngBuffer = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  'hex'
);

const runAcceptanceTests = async () => {
  console.log('====================================================');
  console.log('   M5 ACCEPTANCE CRITERIA VERIFICATION TEST SUITE   ');
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

    // 2. Setup FeeSettings and Categories
    await FeeSettings.findOneAndUpdate(
      { singleton: true },
      {
        freeKm: 3,
        perKmRatePaise: 1500, // ₹15/km
        minFeePaise: 10000,   // ₹100
        maxFeePaise: 500000,  // ₹5,000
        commissionPercent: 10,
        multipliers: {
          minor: 1.0,
          moderate: 1.3,
          high: 1.6,
          critical: 2.0,
        },
      },
      { upsert: true, new: true }
    );

    const drainageCategory = await Category.findOneAndUpdate(
      { slug: 'drainage-m5-test' },
      {
        name: 'Drainage M5 Test',
        slug: 'drainage-m5-test',
        description: 'Storm water drain maintenance and unclogging',
        baseFeePaise: 50000, // ₹500
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const electricalCategory = await Category.findOneAndUpdate(
      { slug: 'electrical-m5-test' },
      {
        name: 'Electrical M5 Test',
        slug: 'electrical-m5-test',
        description: 'Streetlight and transformer issues',
        baseFeePaise: 35000, // ₹350
        isActive: true,
      },
      { upsert: true, new: true }
    );
    assert(drainageCategory && electricalCategory, '2. Global fee parameters and test categories set up');

    // 3. Setup Certified Resolver pinned at [77.2177, 28.6304]
    const resolverUser = await User.create({
      name: 'Prakash Drainage Specialist',
      email: `resolver_m5_${Date.now()}@example.com`,
      phone: '9811223344',
      password: 'Password@123',
      role: 'Resolver',
      address: { street: 'Main Road', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
      isEmailVerified: true,
    });

    const resolverProfile = await ResolverProfile.create({
      user: resolverUser._id,
      status: 'Approved',
      isAvailable: true,
      skills: [drainageCategory._id],
      serviceLocation: {
        type: 'Point',
        coordinates: [77.2177, 28.6304],
      },
      serviceAddress: 'Connaught Place Base, New Delhi',
      serviceRadiusKm: 25,
      idProof: {
        publicId: 'mock_id_proof',
        url: 'https://example.com/id.jpg',
        resourceType: 'image',
        format: 'png',
        bytes: 1000,
        accessType: 'authenticated',
      },
    });
    assert(resolverProfile && resolverProfile.status === 'Approved', '3. Certified local resolver pinned and approved');

    // 4. Test Vector 1: Drainage (₹500), High (1.6x), 7.0 km -> 86000 paise (₹860) with 43000 advance
    const quoteTest1 = await feeService.calculateQuote({
      categoryId: drainageCategory._id.toString(),
      coordinates: [77.2177, 28.6304],
      suggestedPriority: 'High',
      description: 'Major storm sewer overflow with severe blockage',
      overrideDistanceKm: 7.0,
      overrideSeverityMultiplier: 1.6,
    });
    assert(
      quoteTest1.hasEligibleResolver === true &&
      quoteTest1.fee.totalPaise === 86000 &&
      quoteTest1.fee.advancePaise === 43000 &&
      quoteTest1.fee.balancePaise === 43000,
      '4. Test Vector 1: Drainage, High, 7km produces exact quote of 86000 paise (₹860) with 43000 advance'
    );

    // 5. Test Atomic Sequential Issue Code Generation
    const code1 = await sequence.generateIssueCode();
    const code2 = await sequence.generateIssueCode();
    const currentYear = new Date().getFullYear();
    const pattern = new RegExp(`^CR-${currentYear}-\\d{6}$`);
    assert(
      pattern.test(code1) && pattern.test(code2) && code1 !== code2,
      `5. Atomic issue codes generated matching CR-YYYY-XXXXXX (${code1}, ${code2})`
    );

    // 6. Setup Citizen A and Citizen B
    const citizenA = await User.create({
      name: 'Rohan Citizen A',
      email: `citizen_a_m5_${Date.now()}@example.com`,
      phone: '9876543210',
      password: 'CitizenPassword@123',
      role: 'User',
      address: { street: 'Block C, Rohini', city: 'New Delhi', state: 'Delhi', pincode: '110085' },
      isEmailVerified: true,
    });

    const citizenB = await User.create({
      name: 'Sneha Citizen B',
      email: `citizen_b_m5_${Date.now()}@example.com`,
      phone: '9876543211',
      password: 'CitizenPassword@123',
      role: 'User',
      address: { street: 'Pocket 2, Dwarka', city: 'New Delhi', state: 'Delhi', pincode: '110075' },
      isEmailVerified: true,
    });

    // Login as Citizen A
    const loginARes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: JSON.stringify({
        email: citizenA.email,
        password: 'CitizenPassword@123',
      }),
    });
    const citizenACookies = {
      ...csrfCookies,
      ...parseCookies(loginARes.headers.getSetCookie ? loginARes.headers.getSetCookie() : loginARes.headers.get('set-cookie')),
    };
    assert(loginARes.status === 200, '6. Citizen A authenticated with session cookies');

    // 7. Citizen A reports an issue via HTTP POST /api/issues with photos and malicious fee injection
    // Lat: 28.6934, Lng: 77.2177 is exactly ~7.0 km north of resolver at 28.6304
    const issueFormData = new FormData();
    issueFormData.append('title', 'Dangerous open manhole and sewer overflow');
    issueFormData.append('description', 'Sewage is flooding the pedestrian walkway causing severe disruption.');
    issueFormData.append('category', drainageCategory._id.toString());
    issueFormData.append('suggestedPriority', 'High');
    issueFormData.append('contactNumber', '9876543210');
    issueFormData.append('lat', '28.6934');
    issueFormData.append('lng', '77.2177');
    issueFormData.append(
      'address',
      JSON.stringify({
        street: 'Metro Pillar 104, Outer Ring Road',
        city: 'New Delhi',
        pincode: '110085',
      })
    );
    issueFormData.append('images', new Blob([validPngBuffer], { type: 'image/png' }), 'sewer_overflow.png');

    // Malicious fee injection attempt in request body: should be completely ignored by server!
    issueFormData.append('fee', JSON.stringify({ totalPaise: 100, advancePaise: 50 }));
    issueFormData.append('totalPaise', '100');

    const createIssueRes = await fetch(`${baseUrl}/issues`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(citizenACookies),
      },
      body: issueFormData,
    });
    const createIssueData = await createIssueRes.json();
    assert(
      createIssueRes.status === 201 &&
      createIssueData.success === true &&
      pattern.test(createIssueData.data.issue.issueCode),
      '7. Citizen reported issue successfully; atomic issueCode assigned'
    );
    const createdIssue = createIssueData.data.issue;

    // 8. Server-side Pricing Guarantee Check: Client-injected fee parameters were ignored
    assert(
      createdIssue.fee.totalPaise === 86000 &&
      createdIssue.fee.advancePaise === 43000 &&
      createdIssue.status === 'AwaitingAdvance',
      '8. Server-side pricing guarantee: client fee tampering discarded, calculated 86000 totalPaise with 43000 advance'
    );

    // 9. Photo storage verification
    assert(
      createdIssue.images &&
      createdIssue.images.length === 1 &&
      createdIssue.images[0].publicId.includes(`issues/${createdIssue._id}`),
      '9. Uploaded photo stored in Cloudinary folder crowd-report/<env>/issues/<issueId>'
    );

    // 10. Audit Timeline Created
    const timelineEvents = await IssueTimeline.find({ issue: createdIssue._id });
    assert(
      timelineEvents.length >= 1 &&
      timelineEvents[0].action === 'CREATED' &&
      timelineEvents[0].toStatus === 'AwaitingAdvance',
      '10. IssueTimeline records CREATED event with transition from (new) to AwaitingAdvance'
    );

    // 11. AI Key Missing Fallback Check
    const aiFallbackResult = await aiService.assessSeverity({
      categoryName: 'General Hazard',
      description: 'Litter on side of road cosmetic only',
      suggestedPriority: 'Low',
    });
    assert(
      aiFallbackResult.source === 'rules' &&
      aiFallbackResult.severity >= 1 &&
      aiFallbackResult.severity <= 4,
      '11. Missing/omitted AI key falls back cleanly to deterministic ruleSeverity without error'
    );

    // 12. Privacy & Ownership Security Enforcement: Citizen A can view, Citizen B receives 404
    const getIssueCitizenARes = await fetch(`${baseUrl}/issues/${createdIssue._id}`, {
      headers: {
        Cookie: formatCookieHeader(citizenACookies),
      },
    });
    const getIssueCitizenAData = await getIssueCitizenARes.json();
    assert(
      getIssueCitizenARes.status === 200 &&
      getIssueCitizenAData.data.issue._id === createdIssue._id,
      '12a. Citizen A successfully retrieves own issue and timeline'
    );

    // Login as Citizen B
    const loginBRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: JSON.stringify({
        email: citizenB.email,
        password: 'CitizenPassword@123',
      }),
    });
    const citizenBCookies = {
      ...csrfCookies,
      ...parseCookies(loginBRes.headers.getSetCookie ? loginBRes.headers.getSetCookie() : loginBRes.headers.get('set-cookie')),
    };

    const getIssueCitizenBRes = await fetch(`${baseUrl}/issues/${createdIssue._id}`, {
      headers: {
        Cookie: formatCookieHeader(citizenBCookies),
      },
    });
    assert(
      getIssueCitizenBRes.status === 404,
      "12b. Citizen B attempting to view Citizen A's issue receives 404 Not Found"
    );

    // 13. Citizen list and search query
    const listIssuesRes = await fetch(`${baseUrl}/issues?search=manhole`, {
      headers: {
        Cookie: formatCookieHeader(citizenACookies),
      },
    });
    const listIssuesData = await listIssuesRes.json();
    assert(
      listIssuesRes.status === 200 &&
      listIssuesData.data.some((i) => i._id === createdIssue._id),
      '13. Citizen issues list returns paginated issues matching keyword search'
    );

    // 14. Issue Cancellation
    const cancelRes = await fetch(`${baseUrl}/issues/${createdIssue._id}/cancel`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(citizenACookies),
      },
    });
    const cancelData = await cancelRes.json();
    assert(
      cancelRes.status === 200 &&
      cancelData.data.status === 'Cancelled',
      '14. Citizen cancels unpaid issue awaiting advance: status transitions to Cancelled'
    );

    const cancelledTimeline = await IssueTimeline.findOne({
      issue: createdIssue._id,
      action: 'CANCELLED',
    });
    assert(
      cancelledTimeline && cancelledTimeline.toStatus === 'Cancelled',
      '15. Cancellation logged in IssueTimeline audit ledger'
    );

    // 16. No Eligible Resolver Discovery -> AwaitingQuote Status
    const noResolverFormData = new FormData();
    noResolverFormData.append('title', 'Sparking transformer on power pole');
    noResolverFormData.append('description', 'High voltage sparking near public park.');
    noResolverFormData.append('category', electricalCategory._id.toString()); // No electrical resolver seeded
    noResolverFormData.append('suggestedPriority', 'Critical');
    noResolverFormData.append('contactNumber', '9876543210');
    noResolverFormData.append('lat', '28.6139');
    noResolverFormData.append('lng', '77.2090');
    noResolverFormData.append(
      'address',
      JSON.stringify({ street: 'Central Park', city: 'New Delhi', pincode: '110001' })
    );

    const noResolverRes = await fetch(`${baseUrl}/issues`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(citizenACookies),
      },
      body: noResolverFormData,
    });
    const noResolverData = await noResolverRes.json();
    assert(
      noResolverRes.status === 201 &&
      noResolverData.data.issue.status === 'AwaitingQuote',
      '16. If no eligible resolver is in coverage radius, status routes to AwaitingQuote for manual admin triage'
    );

    // Cleanup
    await User.deleteMany({ _id: { $in: [citizenA._id, citizenB._id, resolverUser._id] } });
    await ResolverProfile.deleteOne({ _id: resolverProfile._id });
    await Category.deleteMany({ _id: { $in: [drainageCategory._id, electricalCategory._id] } });
    await Issue.deleteMany({ _id: { $in: [createdIssue._id, noResolverData.data.issue._id] } });
    await IssueTimeline.deleteMany({ issue: { $in: [createdIssue._id, noResolverData.data.issue._id] } });

    console.log('====================================================');
    console.log(`🎉 ALL ${passedCount} M5 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!`);
    console.log('====================================================');
  } finally {
    server.close();
    await disconnectDB();
  }
};

runAcceptanceTests().catch((err) => {
  console.error('M5 Acceptance test failed:', err);
  process.exit(1);
});
