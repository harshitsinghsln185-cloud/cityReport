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
import { Resolution } from './src/models/Resolution.js';

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

// 1x1 valid PNG buffer
const validPngBuffer = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

const runAcceptanceTests = async () => {
  console.log('====================================================');
  console.log('   M8 ACCEPTANCE CRITERIA VERIFICATION TEST SUITE   ');
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
    // 0. Clean prior M8 test artifacts
    await User.deleteMany({
      email: {
        $in: [
          'citizen-m8@example.com',
          'resolver-a-m8@example.com',
          'resolver-b-m8@example.com',
          'admin-m8@example.com',
        ],
      },
    });
    await Category.deleteMany({ slug: 'roads-infra-m8' });
    await Issue.deleteMany({ title: { $regex: /M8 Test/i } });

    // 1. Seed Category and FeeSettings
    const category = await Category.create({
      name: 'Roads & Infrastructure M8',
      slug: 'roads-infra-m8',
      description: 'Repair roads, curbs, and storm drains',
      baseFeePaise: 50000,
      estimatedHours: 4,
      priorityMultipliers: { Low: 1.0, Medium: 1.25, High: 1.5, Critical: 2.0 },
      isActive: true,
    });

    let feeSettings = await FeeSettings.findOne();
    if (!feeSettings) {
      feeSettings = await FeeSettings.create({
        platformFeePercent: 15,
        freeServiceRadiusKm: 5,
        perKmChargePaise: 1500,
        advancePaymentPercent: 30,
      });
    }

    // 2. Create Users: Admin, Citizen, Resolver A, Resolver B
    const adminUser = await User.create({
      name: 'Super Admin M8',
      email: 'admin-m8@example.com',
      password: 'AdminPassword@123',
      phone: '+919999988888',
      role: 'Admin',
      isEmailVerified: true,
      address: { street: 'Admin HQ Secretariat', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
    });

    const citizenUser = await User.create({
      name: 'Priya Sharma M8',
      email: 'citizen-m8@example.com',
      password: 'CitizenPassword@123',
      phone: '+919876543210',
      role: 'User',
      isEmailVerified: true,
      address: { street: '42 MG Road, Sector 3', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
    });

    const resolverAUser = await User.create({
      name: 'Contractor Amit M8',
      email: 'resolver-a-m8@example.com',
      password: 'ResolverPassword@123',
      phone: '+919811111111',
      role: 'Resolver',
      resolverStatus: 'Approved',
      isEmailVerified: true,
      address: { street: 'Shop 12 Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
    });

    const mockIdProof = {
      publicId: 'mock_proof_m8',
      url: 'https://example.com/mock_proof.jpg',
      resourceType: 'image',
      format: 'jpg',
      bytes: 1024,
      accessType: 'public',
    };

    const resolverAProfile = await ResolverProfile.create({
      user: resolverAUser._id,
      status: 'Approved',
      skills: [category._id],
      serviceAddress: 'Connaught Place, New Delhi',
      serviceLocation: { type: 'Point', coordinates: [77.2177, 28.6304] },
      serviceRadiusKm: 15,
      isAvailable: true,
      idProof: mockIdProof,
    });

    const resolverBUser = await User.create({
      name: 'Contractor Bharat M8',
      email: 'resolver-b-m8@example.com',
      password: 'ResolverPassword@123',
      phone: '+919822222222',
      role: 'Resolver',
      resolverStatus: 'Approved',
      isEmailVerified: true,
      address: { street: '45 Karol Bagh Market', city: 'New Delhi', state: 'Delhi', pincode: '110005' },
    });

    const resolverBProfile = await ResolverProfile.create({
      user: resolverBUser._id,
      status: 'Approved',
      skills: [category._id],
      serviceAddress: 'Karol Bagh, New Delhi',
      serviceLocation: { type: 'Point', coordinates: [77.1906, 28.6517] },
      serviceRadiusKm: 15,
      isAvailable: true,
      idProof: mockIdProof,
    });

    // 3. Authenticate Sessions with CSRF tokens
    const login = async (email, password) => {
      const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
      const csrfCookies = parseCookies(csrfRes.headers.get('set-cookie'));
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.data.csrfToken;

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          Cookie: formatCookieHeader(csrfCookies),
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      const loginCookies = parseCookies(res.headers.get('set-cookie'));
      const mergedCookies = { ...csrfCookies, ...loginCookies };
      return {
        data,
        csrfToken,
        cookies: mergedCookies,
        cookieHeader: formatCookieHeader(mergedCookies),
      };
    };

    const adminSession = await login('admin-m8@example.com', 'AdminPassword@123');
    const resolverASession = await login('resolver-a-m8@example.com', 'ResolverPassword@123');
    const resolverBSession = await login('resolver-b-m8@example.com', 'ResolverPassword@123');

    assert(adminSession.data.success, 'Admin authenticated');
    assert(resolverASession.data.success, 'Resolver A authenticated');
    assert(resolverBSession.data.success, 'Resolver B authenticated');

    // 4. Create Issue #1 and Assign to Resolver B
    const issue1 = await Issue.create({
      issueCode: 'CR-2026-M8TEST1',
      reporter: citizenUser._id,
      category: category._id,
      title: 'M8 Test: Dangerous asphalt cave-in on MG Road',
      description: 'Major cave-in blocking traffic near central divider.',
      suggestedPriority: 'High',
      location: { type: 'Point', coordinates: [77.2000, 28.6400] },
      address: {
        street: '42 MG Road, Sector 3',
        city: 'New Delhi',
        pincode: '110001',
      },
      contactNumber: '+919876543210',
      status: 'Assigned',
      assignedResolver: resolverBProfile._id,
      assignedAt: new Date(),
      fee: {
        categoryBaseFeePaise: 50000,
        severityMultiplier: 1.25,
        distanceKm: 3.5,
        freeKm: 5,
        perKmRatePaise: 1500,
        distanceFeePaise: 0,
        totalPaise: 65000,
        advancePaise: 19500,
        balancePaise: 45500,
        commissionPercent: 15,
        isManualQuote: false,
      },
      payments: {
        advancePayment: null,
      },
    });

    await IssueTimeline.create({
      issue: issue1._id,
      fromStatus: 'Triaged',
      toStatus: 'Assigned',
      action: 'RESOLVER_ASSIGNED',
      actor: adminUser._id,
      actorRole: 'Admin',
      remarks: 'Dispatched to Contractor Bharat',
    });

    console.log('\n--- 1. Testing Ownership Invariant (Resolver A accessing Resolver B task) ---');
    // Resolver A attempts to get task details of Issue 1
    const resAQuery = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}`, {
      headers: { Cookie: resolverASession.cookieHeader },
    });
    assert(resAQuery.status === 404, 'Resolver A querying Resolver B task returns 404 Not Found');

    // Resolver A attempts to accept Resolver B task
    const resAAccept = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/accept`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': resolverASession.csrfToken,
        Cookie: resolverASession.cookieHeader,
      },
    });
    assert(resAAccept.status === 404, 'Resolver A accepting Resolver B task returns 404 Not Found');

    // Resolver A attempts to start Resolver B task
    const resAStart = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/start`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': resolverASession.csrfToken,
        Cookie: resolverASession.cookieHeader,
      },
    });
    assert(resAStart.status === 404, 'Resolver A starting Resolver B task returns 404 Not Found');

    // Resolver A attempts to resolve Resolver B task
    const resAResolveForm = new FormData();
    resAResolveForm.append('remarks', 'Unauthorized attempt to resolve someone elses job');
    resAResolveForm.append('afterImages', new Blob([validPngBuffer], { type: 'image/png' }), 'after.png');
    const resAResolve = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/resolve`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': resolverASession.csrfToken,
        Cookie: resolverASession.cookieHeader,
      },
      body: resAResolveForm,
    });
    assert(resAResolve.status === 404, 'Resolver A submitting proof for Resolver B task returns 404 Not Found');

    console.log('\n--- 2. Testing Privacy Invariant (Citizen phone and street masked in Assigned status) ---');
    const resBQueryAssigned = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}`, {
      headers: { Cookie: resolverBSession.cookieHeader },
    });
    assert(resBQueryAssigned.status === 200, 'Resolver B can query their assigned task');
    const bQueryAssignedData = await resBQueryAssigned.json();
    const taskAssigned = bQueryAssignedData.data.task;

    assert(
      taskAssigned.contactNumber === undefined,
      'Citizen contactNumber is strictly omitted from API response when status is Assigned'
    );
    assert(
      !taskAssigned.reporter.phone,
      'Citizen reporter.phone is strictly omitted when status is Assigned'
    );
    assert(
      !taskAssigned.address || !taskAssigned.address.street,
      'Full street address is masked/omitted when status is Assigned'
    );
    assert(
      taskAssigned.address && taskAssigned.address.city === 'New Delhi',
      'City and general area remain available for contractor evaluation'
    );

    console.log('\n--- 3. Testing Task Acceptance & Privacy Unlocking ---');
    const resBAccept = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/accept`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': resolverBSession.csrfToken,
        Cookie: resolverBSession.cookieHeader,
      },
    });
    assert(resBAccept.status === 200, 'Resolver B accepts task successfully');
    const bAcceptData = await resBAccept.json();
    assert(bAcceptData.data.status === 'Accepted', 'Task status transitioned to Accepted');
    assert(bAcceptData.data.acceptedAt !== undefined, 'acceptedAt timestamp is recorded');

    // Query task details again after acceptance
    const resBQueryAccepted = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}`, {
      headers: { Cookie: resolverBSession.cookieHeader },
    });
    assert(resBQueryAccepted.status === 200, 'Resolver B queries task details in Accepted status');
    const bQueryAcceptedData = await resBQueryAccepted.json();
    const taskAccepted = bQueryAcceptedData.data.task;

    assert(
      taskAccepted.contactNumber === '+919876543210',
      'Citizen contactNumber is unlocked once contractor accepts task'
    );
    assert(
      taskAccepted.address.street === '42 MG Road, Sector 3',
      'Full street address is unlocked once contractor accepts task'
    );

    // Verify timeline recorded TASK_ACCEPTED
    const timelineAccepted = bQueryAcceptedData.data.timeline;
    const acceptedEvent = timelineAccepted.find((t) => t.action === 'TASK_ACCEPTED');
    assert(Boolean(acceptedEvent), 'Issue timeline recorded TASK_ACCEPTED event');

    console.log('\n--- 3b. Testing Task Rejection / Decline (Reason validation & status ReassignNeeded) ---');
    const issue2 = await Issue.create({
      issueCode: 'CR-2026-M8TEST2',
      reporter: citizenUser._id,
      category: category._id,
      title: 'M8 Test: Secondary water main leakage',
      description: 'Secondary leak requiring immediate attention.',
      suggestedPriority: 'Medium',
      location: { type: 'Point', coordinates: [77.2100, 28.6450] },
      address: {
        street: '88 Pusa Road',
        city: 'New Delhi',
        pincode: '110005',
      },
      contactNumber: '+919876543210',
      status: 'Assigned',
      assignedResolver: resolverBProfile._id,
      assignedAt: new Date(),
      fee: {
        categoryBaseFeePaise: 50000,
        severityMultiplier: 1.0,
        distanceKm: 2.0,
        freeKm: 5,
        perKmRatePaise: 1500,
        distanceFeePaise: 0,
        totalPaise: 40000,
        advancePaise: 12000,
        balancePaise: 28000,
        commissionPercent: 15,
        isManualQuote: false,
      },
    });

    // Short reason validation
    const resBRejectShort = await fetch(`${baseUrl}/resolver/tasks/${issue2._id}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': resolverBSession.csrfToken,
        Cookie: resolverBSession.cookieHeader,
      },
      body: JSON.stringify({ reason: 'no' }),
    });
    assert(resBRejectShort.status === 400, 'Rejection with reason under 5 characters returns 400 Bad Request');

    // Valid rejection
    const resBRejectValid = await fetch(`${baseUrl}/resolver/tasks/${issue2._id}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': resolverBSession.csrfToken,
        Cookie: resolverBSession.cookieHeader,
      },
      body: JSON.stringify({ reason: 'Emergency maintenance machinery broken, awaiting replacement parts' }),
    });
    assert(resBRejectValid.status === 200, 'Rejection with valid reason returns 200 OK');
    const bRejectData = await resBRejectValid.json();
    assert(bRejectData.data.status === 'ReassignNeeded', 'Issue status transitions to ReassignNeeded');
    assert(bRejectData.data.assignedResolver === null, 'assignedResolver is cleared to null');

    const issue2InDb = await Issue.findById(issue2._id);
    assert(issue2InDb.status === 'ReassignNeeded', 'Database confirms ReassignNeeded state');
    assert(issue2InDb.rejectionReason.includes('Emergency maintenance'), 'Rejection reason saved on issue');

    console.log('\n--- 4. Testing Workflow Sequencing & Resolution Proof Validations ---');
    // Cannot submit resolution proof before starting work (status is Accepted)
    const prematureResolveForm = new FormData();
    prematureResolveForm.append('remarks', 'Attempting premature resolution without starting');
    prematureResolveForm.append('afterImages', new Blob([validPngBuffer], { type: 'image/png' }), 'after.png');
    const resPremature = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/resolve`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': resolverBSession.csrfToken,
        Cookie: resolverBSession.cookieHeader,
      },
      body: prematureResolveForm,
    });
    assert(resPremature.status === 400, 'Resolving task while in Accepted (before InProgress) returns 400 Bad Request');

    // Start work
    const resBStart = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/start`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': resolverBSession.csrfToken,
        Cookie: resolverBSession.cookieHeader,
      },
    });
    assert(resBStart.status === 200, 'Resolver B starts work successfully');
    const bStartData = await resBStart.json();
    assert(bStartData.data.status === 'InProgress', 'Task status transitioned to InProgress');
    assert(bStartData.data.startedAt !== undefined, 'startedAt timestamp is set');

    // Attempt to resolve without after photos
    const noAfterForm = new FormData();
    noAfterForm.append('remarks', 'Repair completed successfully without photo');
    noAfterForm.append('beforeImages', new Blob([validPngBuffer], { type: 'image/png' }), 'before.png');
    const resNoAfter = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/resolve`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': resolverBSession.csrfToken,
        Cookie: resolverBSession.cookieHeader,
      },
      body: noAfterForm,
    });
    assert(resNoAfter.status === 400, 'Attempting to resolve without after-photo returns 400 Bad Request');

    // Attempt to resolve with remarks < 10 characters
    const shortRemarksForm = new FormData();
    shortRemarksForm.append('remarks', 'Fixed it'); // 8 chars
    shortRemarksForm.append('afterImages', new Blob([validPngBuffer], { type: 'image/png' }), 'after.png');
    const resShortRemarks = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/resolve`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': resolverBSession.csrfToken,
        Cookie: resolverBSession.cookieHeader,
      },
      body: shortRemarksForm,
    });
    assert(resShortRemarks.status === 400, 'Attempting to resolve with remarks under 10 chars returns 400 Bad Request');

    // Attempt to resolve with corrupted/spoofed image (magic number check)
    const spoofedForm = new FormData();
    spoofedForm.append('remarks', 'Pothole asphalt filled and steamrolled');
    spoofedForm.append(
      'afterImages',
      new Blob([Buffer.from('THIS IS NOT A VALID IMAGE BUFFER')], { type: 'image/png' }),
      'fake.png'
    );
    const resSpoofed = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/resolve`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': resolverBSession.csrfToken,
        Cookie: resolverBSession.cookieHeader,
      },
      body: spoofedForm,
    });
    assert(resSpoofed.status === 400, 'Submitting spoofed file with invalid binary magic numbers returns 400 Bad Request');

    console.log('\n--- 5. Testing Valid Resolution Proof Submission & Resolution Record ---');
    const validResolveForm = new FormData();
    validResolveForm.append(
      'remarks',
      'Excavated damaged road section, laid hot-mix bituminous base and compacted with roller to smooth finish.'
    );
    validResolveForm.append('beforeImages', new Blob([validPngBuffer], { type: 'image/png' }), 'before_work.png');
    validResolveForm.append('afterImages', new Blob([validPngBuffer], { type: 'image/png' }), 'after_work_angle1.png');
    validResolveForm.append('afterImages', new Blob([validPngBuffer], { type: 'image/png' }), 'after_work_angle2.png');

    const resValidResolve = await fetch(`${baseUrl}/resolver/tasks/${issue1._id}/resolve`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': resolverBSession.csrfToken,
        Cookie: resolverBSession.cookieHeader,
      },
      body: validResolveForm,
    });
    assert(resValidResolve.status === 200, 'Valid resolution proof submission returns 200 OK');
    const validResolveData = await resValidResolve.json();
    assert(validResolveData.data.issue.status === 'Resolved', 'Issue status transitioned to Resolved');
    assert(validResolveData.data.issue.resolvedAt !== undefined, 'resolvedAt timestamp recorded');
    assert(Boolean(validResolveData.data.issue.resolution), 'Issue resolution pointer is populated');

    // Verify Resolution in MongoDB
    const resolutionDoc = await Resolution.findOne({ issue: issue1._id });
    assert(Boolean(resolutionDoc), 'Resolution document exists in database');
    assert(
      resolutionDoc.resolver.toString() === resolverBProfile._id.toString(),
      'Resolution records correct resolver contractor ID'
    );
    assert(resolutionDoc.beforeImages.length === 1, 'Resolution contains 1 beforeImage');
    assert(resolutionDoc.afterImages.length === 2, 'Resolution contains 2 afterImages');
    assert(
      resolutionDoc.afterImages[0].publicId.includes(`resolutions/${issue1._id}`),
      'After-images stored under folder crowd-report/<env>/resolutions/<issueId>'
    );

    // Verify Timeline Event PROOF_SUBMITTED
    const timelineDocs = await IssueTimeline.find({ issue: issue1._id, action: 'PROOF_SUBMITTED' });
    assert(timelineDocs.length === 1, 'Timeline recorded PROOF_SUBMITTED audit entry');
    assert(timelineDocs[0].actorRole === 'Resolver', 'Timeline actor role is Resolver');

    console.log('\n--- 6. Testing Dashboard Summary & Completed History API ---');
    const resSummary = await fetch(`${baseUrl}/resolver/tasks/summary`, {
      headers: { Cookie: resolverBSession.cookieHeader },
    });
    assert(resSummary.status === 200, 'Resolver summary API returns 200 OK');
    const summaryData = await resSummary.json();
    assert(summaryData.data.metrics.completedTasksCount >= 1, 'Summary reflects completedTasksCount >= 1');
    assert(summaryData.data.metrics.activeTasksCount === 0, 'Active tasks count is 0 after resolution');

    const resHistory = await fetch(`${baseUrl}/resolver/tasks?status=Completed`, {
      headers: { Cookie: resolverBSession.cookieHeader },
    });
    assert(resHistory.status === 200, 'Resolver completed history API returns 200 OK');
    const historyData = await resHistory.json();
    const tasks = Array.isArray(historyData.data) ? historyData.data : historyData.data.tasks;
    const completedTaskInList = tasks.find((t) => t._id.toString() === issue1._id.toString());
    assert(Boolean(completedTaskInList), 'Issue #1 appears in completed tasks list');
    assert(Boolean(completedTaskInList.resolution), 'Resolution details populated in completed list');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passedCount} M8 ACCEPTANCE ASSERTIONS PASSED!`);
    console.log('====================================================');
  } catch (err) {
    console.error('Test suite execution failed:', err);
    process.exitCode = 1;
  } finally {
    try {
      await server.close();
      await disconnectDB();
    } catch {
      // ignore
    }
    process.exit(process.exitCode || 0);
  }
};

runAcceptanceTests();
