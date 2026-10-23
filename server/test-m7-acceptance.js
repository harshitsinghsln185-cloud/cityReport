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
import { Payment } from './src/models/Payment.js';
import { Invoice } from './src/models/Invoice.js';

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
  console.log('====================================================');
  console.log('   M7 ACCEPTANCE CRITERIA VERIFICATION TEST SUITE   ');
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
    // 0. Clean prior M7 test artifacts
    await User.deleteMany({
      email: {
        $in: [
          'citizen-m7@example.com',
          'admin1-m7@example.com',
          'admin2-m7@example.com',
          'resolver-a-m7@example.com',
          'resolver-b-m7@example.com',
          'resolver-c-m7@example.com',
          'resolver-d-m7@example.com',
          'blocked-user-m7@example.com',
        ],
      },
    });
    await Category.deleteMany({ slug: { $in: ['m7-roads-repair', 'm7-drainage-pipe'] } });
    await Issue.deleteMany({ title: { $regex: /M7 Test/i } });
    await Payment.deleteMany({ idempotencyKey: { $regex: /m7/i } });
    await Invoice.deleteMany({ 'customerSnapshot.email': { $regex: /m7/i } });

    // 1. Establish Categories
    const categoryRoads = await Category.create({
      name: 'M7 Roads & Pavements',
      slug: 'm7-roads-repair',
      description: 'Potholes, asphalt sinking, and pedestrian pathway hazards.',
      baseFeePaise: 50000, // ₹500
      icon: 'road',
      isActive: true,
    });

    const categoryDrainage = await Category.create({
      name: 'M7 Drainage & Pipelines',
      slug: 'm7-drainage-pipe',
      description: 'Sewage leaks and drainage overflow.',
      baseFeePaise: 60000, // ₹600
      icon: 'droplets',
      isActive: true,
    });

    // 2. Register Platform Users
    // Admin 1
    const admin1User = await User.create({
      name: 'Admin One M7',
      email: 'admin1-m7@example.com',
      password: 'Password123!',
      phone: '+919999900001',
      role: 'Admin',
      isEmailVerified: true,
      address: { street: 'Admin HQ', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    });

    // Admin 2 (for concurrency testing)
    const admin2User = await User.create({
      name: 'Admin Two M7',
      email: 'admin2-m7@example.com',
      password: 'Password123!',
      phone: '+919999900002',
      role: 'Admin',
      isEmailVerified: true,
      address: { street: 'Admin Sub HQ', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    });

    // Citizen
    const citizenUser = await User.create({
      name: 'Citizen Resident M7',
      email: 'citizen-m7@example.com',
      password: 'Password123!',
      phone: '+919876500007',
      role: 'User',
      isEmailVerified: true,
      address: { street: 'Marine Drive Block 4', city: 'Mumbai', state: 'Maharashtra', pincode: '400020' },
    });

    // Blocked candidate user
    const blockedUser = await User.create({
      name: 'Spam Resident M7',
      email: 'blocked-user-m7@example.com',
      password: 'Password123!',
      phone: '+919876500099',
      role: 'User',
      isEmailVerified: true,
      address: { street: 'Spam Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    });

    const mockIdProof = {
      publicId: 'm7_test_idproof',
      url: 'https://res.cloudinary.com/demo/image/upload/v1/m7_proof.jpg',
      resourceType: 'image',
      format: 'jpg',
      bytes: 102400,
      accessType: 'authenticated',
    };

    // Resolver Contractor A: Qualified for Roads, Located in South Mumbai (72.825, 18.932), Radius 15km, Approved, Available
    const resAUser = await User.create({
      name: 'Contractor Alpha M7',
      email: 'resolver-a-m7@example.com',
      password: 'Password123!',
      phone: '+919820011111',
      role: 'Resolver',
      isEmailVerified: true,
      address: { street: 'Churchgate Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400020' },
    });
    const profileA = await ResolverProfile.create({
      user: resAUser._id,
      skills: [categoryRoads._id],
      serviceLocation: { type: 'Point', coordinates: [72.825, 18.932] },
      serviceAddress: 'Churchgate Central, Mumbai',
      serviceRadiusKm: 15,
      status: 'Approved',
      idProof: mockIdProof,
      isAvailable: true,
    });

    // Resolver Contractor B: Qualified for Roads, Located in South Mumbai (72.830, 18.935), Radius 10km, Approved, Available
    const resBUser = await User.create({
      name: 'Contractor Beta M7',
      email: 'resolver-b-m7@example.com',
      password: 'Password123!',
      phone: '+919820022222',
      role: 'Resolver',
      isEmailVerified: true,
      address: { street: 'Colaba Depot', city: 'Mumbai', state: 'Maharashtra', pincode: '400005' },
    });
    const profileB = await ResolverProfile.create({
      user: resBUser._id,
      skills: [categoryRoads._id],
      serviceLocation: { type: 'Point', coordinates: [72.83, 18.935] },
      serviceAddress: 'Colaba Point, Mumbai',
      serviceRadiusKm: 10,
      status: 'Approved',
      idProof: mockIdProof,
      isAvailable: true,
    });

    // Resolver Contractor C: Qualified ONLY for Drainage, Located nearby (72.828, 18.933), Approved, Available
    const resCUser = await User.create({
      name: 'Contractor Gamma M7',
      email: 'resolver-c-m7@example.com',
      password: 'Password123!',
      phone: '+919820033333',
      role: 'Resolver',
      isEmailVerified: true,
      address: { street: 'Fort Market', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    });
    const profileC = await ResolverProfile.create({
      user: resCUser._id,
      skills: [categoryDrainage._id], // NOT Roads
      serviceLocation: { type: 'Point', coordinates: [72.828, 18.933] },
      serviceAddress: 'Fort Area, Mumbai',
      serviceRadiusKm: 12,
      status: 'Approved',
      idProof: mockIdProof,
      isAvailable: true,
    });

    // Resolver Contractor D: Far away in Pune (73.856, 18.520), Qualified for Roads, Radius 5km
    const resDUser = await User.create({
      name: 'Contractor Delta M7',
      email: 'resolver-d-m7@example.com',
      password: 'Password123!',
      phone: '+919820044444',
      role: 'Resolver',
      isEmailVerified: true,
      address: { street: 'FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411005' },
    });
    const profileD = await ResolverProfile.create({
      user: resDUser._id,
      skills: [categoryRoads._id],
      serviceLocation: { type: 'Point', coordinates: [73.856, 18.52] },
      serviceAddress: 'Shivajinagar, Pune',
      serviceRadiusKm: 5,
      status: 'Approved',
      idProof: mockIdProof,
      isAvailable: true,
    });

    // 3. Obtain CSRF Tokens and Auth Sessions
    // Helper to login and return cookies
    const loginUser = async (email, password) => {
      const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
      const csrfCookies = parseCookies(csrfRes.headers.get('set-cookie'));
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.data.csrfToken;

      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          Cookie: formatCookieHeader(csrfCookies),
        },
        body: JSON.stringify({ email, password }),
      });
      const loginCookies = parseCookies(loginRes.headers.get('set-cookie'));
      const mergedCookies = { ...csrfCookies, ...loginCookies };
      return { cookies: mergedCookies, csrfToken, status: loginRes.status };
    };

    const admin1Auth = await loginUser('admin1-m7@example.com', 'Password123!');
    assert(admin1Auth.status === 200, 'Admin 1 login successfully authenticated (200)');

    const admin2Auth = await loginUser('admin2-m7@example.com', 'Password123!');
    assert(admin2Auth.status === 200, 'Admin 2 login successfully authenticated (200)');

    const citizenAuth = await loginUser('citizen-m7@example.com', 'Password123!');
    assert(citizenAuth.status === 200, 'Citizen login successfully authenticated (200)');

    // 4. Role-based security validation: Citizen cannot access Admin routes
    const forbiddenRes = await fetch(`${baseUrl}/admin/overview`, {
      headers: {
        'X-CSRF-Token': citizenAuth.csrfToken,
        Cookie: formatCookieHeader(citizenAuth.cookies),
      },
    });
    assert(forbiddenRes.status === 403, 'Citizen request to /api/admin/overview blocked with 403 Forbidden');

    const unauthRes = await fetch(`${baseUrl}/admin/issues`);
    assert(unauthRes.status === 401, 'Unauthenticated request to /api/admin/issues blocked with 401 Unauthorized');

    // 5. Test Executive Overview Endpoint
    const overviewRes = await fetch(`${baseUrl}/admin/overview`, {
      headers: {
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
    });
    assert(overviewRes.status === 200, 'Admin successfully fetched /api/admin/overview (200)');
    const overviewData = await overviewRes.json();
    assert(overviewData.data.metrics.approvedResolvers >= 4, 'Executive metrics accurately tally approved resolvers');
    assert(overviewData.data.statusBreakdown !== undefined, 'Executive overview includes operational statusBreakdown matrix');

    // 6. Test Candidate Resolvers Query ($geoNear Proximity Aggregation)
    // Create an issue in Marine Drive, Mumbai (72.822, 18.930)
    const issue1 = await Issue.create({
      issueCode: 'CR-M7-001',
      reporter: citizenUser._id,
      category: categoryRoads._id,
      title: 'M7 Test: Severe asphalt pothole on Marine Drive',
      description: 'Deep road depression causing vehicle steering damage.',
      suggestedPriority: 'Medium',
      location: { type: 'Point', coordinates: [72.822, 18.93] },
      address: { street: 'Marine Drive Road', city: 'Mumbai', pincode: '400020' },
      contactNumber: '+919876500007',
      status: 'Submitted',
      source: 'form',
      fee: {
        categoryBaseFeePaise: 50000,
        severityMultiplier: 1.0,
        distanceKm: 2.1,
        freeKm: 5,
        perKmRatePaise: 1500,
        distanceFeePaise: 0,
        totalPaise: 50000,
        advancePaise: 25000,
        balancePaise: 25000,
        commissionPercent: 15,
        isManualQuote: false,
      },
    });

    const candidatesRes = await fetch(`${baseUrl}/admin/issues/${issue1._id}/candidates`, {
      headers: {
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
    });
    assert(candidatesRes.status === 200, 'Candidate search endpoint returns 200 OK');
    const candidatesData = await candidatesRes.json();
    const candidateList = candidatesData.data;

    // Must return Contractor Alpha and Beta (both qualify for Roads and are within radius in Mumbai)
    // Must NOT return Gamma (Drainage only) or Delta (in Pune, >100km away)
    const returnedIds = candidateList.map((c) => c.resolver._id.toString());
    assert(returnedIds.includes(profileA._id.toString()), 'Proximity aggregation returned nearby qualified Contractor Alpha');
    assert(returnedIds.includes(profileB._id.toString()), 'Proximity aggregation returned nearby qualified Contractor Beta');
    assert(!returnedIds.includes(profileC._id.toString()), 'Proximity aggregation correctly excluded Contractor Gamma (mismatched category skill)');
    assert(!returnedIds.includes(profileD._id.toString()), 'Proximity aggregation correctly excluded Contractor Delta (outside service radius in Pune)');
    assert(candidateList[0].distanceKm !== undefined, 'Candidate objects include calculated distanceKm');
    assert(candidateList[0].activeTasksCount === 0, 'Candidate active tasks count accurately calculated as 0');

    // 7. Concurrency Test: Two Admins Assigning Concurrently (Race Protection 409)
    console.log('Testing atomic concurrency protection on task assignment...');
    const assignReq1 = fetch(`${baseUrl}/admin/issues/${issue1._id}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
      body: JSON.stringify({ resolverId: profileA._id }),
    });

    const assignReq2 = fetch(`${baseUrl}/admin/issues/${issue1._id}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': admin2Auth.csrfToken,
        Cookie: formatCookieHeader(admin2Auth.cookies),
      },
      body: JSON.stringify({ resolverId: profileB._id }),
    });

    const [res1, res2] = await Promise.all([assignReq1, assignReq2]);
    const statuses = [res1.status, res2.status].sort();
    assert(statuses[0] === 200, 'Concurrent race condition: exactly one assignment request succeeded with 200 OK');
    assert(statuses[1] === 409, 'Concurrent race condition: second conflicting assignment was rejected with 409 Conflict');

    // Verify issue state in DB
    const freshIssue1 = await Issue.findById(issue1._id);
    assert(freshIssue1.status === 'Assigned', 'Issue status correctly moved to Assigned');
    assert(freshIssue1.assignedResolver !== null, 'Assigned resolver persisted in database');

    const timelineAssigned = await IssueTimeline.findOne({ issue: issue1._id, action: 'ASSIGNED' });
    assert(timelineAssigned !== null, 'IssueTimeline record created for ASSIGNED action');
    assert(timelineAssigned.actorRole === 'Admin', 'IssueTimeline actorRole recorded as Admin');

    // Verify active task count updates for assigned contractor
    const candidatesFreshRes = await fetch(`${baseUrl}/admin/issues/${issue1._id}/candidates`, {
      headers: {
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
    });
    const candidatesFreshData = await candidatesFreshRes.json();
    const assignedCand = candidatesFreshData.data.find((c) => c.resolver._id.toString() === freshIssue1.assignedResolver.toString());
    assert(assignedCand && assignedCand.activeTasksCount === 1, 'Contractor activeTasksCount live metric incremented to 1');

    // 8. Test Priority Override
    const priorityRes = await fetch(`${baseUrl}/admin/issues/${issue1._id}/priority`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
      body: JSON.stringify({ priority: 'Critical' }),
    });
    assert(priorityRes.status === 200, 'Admin priority override returned 200 OK');
    const priorityData = await priorityRes.json();
    assert(priorityData.data.finalPriority === 'Critical', 'finalPriority field updated to Critical');

    const timelinePriority = await IssueTimeline.findOne({ issue: issue1._id, action: 'PRIORITY_OVERRIDDEN' });
    assert(timelinePriority !== null, 'IssueTimeline recorded PRIORITY_OVERRIDDEN event');

    // 9. Test Manual Quote Setter (AwaitingQuote -> AwaitingAdvance)
    const issueOutCoverage = await Issue.create({
      issueCode: 'CR-M7-002',
      reporter: citizenUser._id,
      category: categoryRoads._id,
      title: 'M7 Test: Remote hill-road crack requiring quote',
      description: 'Mountain pass outside standard coverage.',
      suggestedPriority: 'High',
      location: { type: 'Point', coordinates: [73.5, 19.1] },
      address: { street: 'Ghat Pass Mile 12', city: 'Thane District', pincode: '421301' },
      contactNumber: '+919876500007',
      status: 'AwaitingQuote',
      source: 'form',
      fee: {
        categoryBaseFeePaise: 50000,
        severityMultiplier: 1.25,
        distanceKm: 42.0,
        freeKm: 5,
        perKmRatePaise: 1500,
        distanceFeePaise: 0,
        totalPaise: 0,
        advancePaise: 0,
        balancePaise: 0,
        commissionPercent: 15,
        isManualQuote: false,
      },
    });

    const quoteRes = await fetch(`${baseUrl}/admin/issues/${issueOutCoverage._id}/manual-quote`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
      body: JSON.stringify({ quotePaise: 240000 }), // ₹2,400
    });
    assert(quoteRes.status === 200, 'Manual fee quote endpoint returns 200 OK');
    const quoteData = await quoteRes.json();
    assert(quoteData.data.status === 'AwaitingAdvance', 'Issue transitioned from AwaitingQuote to AwaitingAdvance');
    assert(quoteData.data.fee.totalPaise === 240000, 'fee.totalPaise set to exact integer paise (240000)');
    assert(quoteData.data.fee.advancePaise === 120000, 'fee.advancePaise set to 50% split (120000)');
    assert(quoteData.data.fee.balancePaise === 120000, 'fee.balancePaise set to 50% split (120000)');
    assert(quoteData.data.fee.isManualQuote === true, 'fee.isManualQuote flagged true');

    const timelineQuote = await IssueTimeline.findOne({ issue: issueOutCoverage._id, action: 'MANUAL_QUOTE_SET' });
    assert(timelineQuote !== null, 'IssueTimeline recorded MANUAL_QUOTE_SET action');

    // 10. Test Issue Rejection with Automated Mock Refund
    // Create issue with Completed advance payment
    const issueToReject = await Issue.create({
      issueCode: 'CR-M7-003',
      reporter: citizenUser._id,
      category: categoryDrainage._id,
      title: 'M7 Test: Private boundary wall dispute',
      description: 'Private property drainage disagreement.',
      suggestedPriority: 'Low',
      location: { type: 'Point', coordinates: [72.822, 18.93] },
      address: { street: 'Private Enclave', city: 'Mumbai', pincode: '400020' },
      contactNumber: '+919876500007',
      status: 'Submitted',
      source: 'form',
      fee: {
        categoryBaseFeePaise: 60000,
        severityMultiplier: 1.0,
        distanceKm: 1.5,
        freeKm: 5,
        perKmRatePaise: 1500,
        distanceFeePaise: 0,
        totalPaise: 60000,
        advancePaise: 30000,
        balancePaise: 30000,
        commissionPercent: 15,
        isManualQuote: false,
      },
    });

    const advancePayment = await Payment.create({
      paymentId: 'pay_m7_adv_test_001',
      idempotencyKey: 'idemp_m7_adv_001',
      issue: issueToReject._id,
      user: citizenUser._id,
      type: 'Advance',
      amountPaise: 30000,
      status: 'Completed',
      completedAt: new Date(),
    });

    issueToReject.payments = { advancePayment: advancePayment._id };
    await issueToReject.save();

    await IssueTimeline.create({
      issue: issueToReject._id,
      fromStatus: 'None',
      toStatus: 'Submitted',
      action: 'CREATED',
      actor: citizenUser._id,
      actorRole: 'User',
      remarks: 'Initial civic report submitted by citizen',
    });

    const rejectRes = await fetch(`${baseUrl}/admin/issues/${issueToReject._id}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
      body: JSON.stringify({ reason: 'Issue pertains to private residential dispute outside public municipal jurisdiction.' }),
    });
    assert(rejectRes.status === 200, 'Admin issue rejection returned 200 OK');

    const freshRejectedIssue = await Issue.findById(issueToReject._id);
    assert(freshRejectedIssue.status === 'Rejected', 'Issue status updated to Rejected in database');
    assert(freshRejectedIssue.rejectionReason.includes('private residential'), 'rejectionReason stored on issue');

    // Check automated Refund payment creation
    const refundPayment = await Payment.findOne({ issue: issueToReject._id, type: 'Refund' });
    assert(refundPayment !== null, 'Automated Refund payment record created in database');
    assert(refundPayment.amountPaise === 30000, 'Refund payment matches advance amount in integer paise (30000)');
    assert(refundPayment.status === 'Completed', 'Refund payment marked as Completed');

    const updatedAdvance = await Payment.findById(advancePayment._id);
    assert(updatedAdvance.status === 'Refunded', 'Original Advance payment status updated to Refunded');

    const timelineReject = await IssueTimeline.findOne({ issue: issueToReject._id, action: 'REJECTED_BY_ADMIN' });
    assert(timelineReject !== null, 'IssueTimeline recorded REJECTED_BY_ADMIN action');

    // 11. Test User Directory Management & Account Suspension / Reinstatement
    // List users
    const usersListRes = await fetch(`${baseUrl}/admin/users?search=Spam`, {
      headers: {
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
    });
    assert(usersListRes.status === 200, 'Admin list users returned 200 OK');
    const usersListData = await usersListRes.json();
    assert(usersListData.data.length >= 1, 'Search query located targeted spam user');

    // Block User
    const blockRes = await fetch(`${baseUrl}/admin/users/${blockedUser._id}/block`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
      body: JSON.stringify({ isBlocked: true, reason: 'Repeated frivolous and abusive reports' }),
    });
    assert(blockRes.status === 200, 'Admin user account suspension returned 200 OK');
    const blockData = await blockRes.json();
    assert(blockData.data.isBlocked === true, 'User isBlocked set to true in DB');

    // Verify blocked user cannot log in
    const blockedLoginRes = await loginUser('blocked-user-m7@example.com', 'Password123!');
    assert(blockedLoginRes.status === 403, 'Blocked user login strictly forbidden with 403');

    // Admin safety checks: cannot block admin, cannot block self
    const blockAdminRes = await fetch(`${baseUrl}/admin/users/${admin2User._id}/block`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
      body: JSON.stringify({ isBlocked: true, reason: 'Attempted admin block' }),
    });
    assert(blockAdminRes.status === 400, 'Safeguard: Blocking an Administrator account rejected with 400');

    const blockSelfRes = await fetch(`${baseUrl}/admin/users/${admin1User._id}/block`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
      body: JSON.stringify({ isBlocked: true, reason: 'Attempted self block' }),
    });
    assert(blockSelfRes.status === 400, 'Safeguard: Administrator blocking self rejected with 400');

    // Unblock User
    const unblockRes = await fetch(`${baseUrl}/admin/users/${blockedUser._id}/block`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
      body: JSON.stringify({ isBlocked: false }),
    });
    assert(unblockRes.status === 200, 'Admin user account reinstatement returned 200 OK');

    // Verify reinstated user can log in again
    const unblockedLoginRes = await loginUser('blocked-user-m7@example.com', 'Password123!');
    assert(unblockedLoginRes.status === 200, 'Reinstated user successfully logged in with 200 OK');

    // 12. Test Issue Details API (with Timeline, Payments, Invoices)
    const detailsRes = await fetch(`${baseUrl}/admin/issues/${issueToReject._id}`, {
      headers: {
        'X-CSRF-Token': admin1Auth.csrfToken,
        Cookie: formatCookieHeader(admin1Auth.cookies),
      },
    });
    assert(detailsRes.status === 200, 'Administrative issue details fetched with 200 OK');
    const detailsData = await detailsRes.json();
    assert(detailsData.data.issue._id.toString() === issueToReject._id.toString(), 'Details contains accurate issue data');
    assert(detailsData.data.timeline.length >= 2, 'Details populates complete audit timeline array');
    assert(detailsData.data.payments.length >= 2, 'Details populates payments ledger (Advance + Refund)');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passedCount} M7 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exit(1);
  } finally {
    server.close();
    await disconnectDB();
  }
};

runAcceptanceTests();
