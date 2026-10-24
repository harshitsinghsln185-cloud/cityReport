import http from 'http';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import { User } from './src/models/User.js';
import { Category } from './src/models/Category.js';
import { Issue } from './src/models/Issue.js';
import { IssueTimeline } from './src/models/IssueTimeline.js';
import { Query } from './src/models/Query.js';
import { EmailLog } from './src/models/EmailLog.js';
import emailQueue, { clearQueue, drainQueue } from './src/services/emailQueue.js';

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
  console.log('   M12 ACCEPTANCE CRITERIA VERIFICATION TEST SUITE  ');
  console.log('====================================================');

  await connectDB(env.MONGODB_URI);

  let server;
  let baseUrl;
  let passedCount = 0;

  const assert = (condition, name) => {
    if (!condition) {
      console.error(`❌ FAILED: ${name}`);
      throw new Error(`Assertion failed: ${name}`);
    }
    passedCount += 1;
    console.log(`✅ PASSED: ${name}`);
  };

  try {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://localhost:${port}/api`;

    // Clear test collections
    await Query.deleteMany({});
    await EmailLog.deleteMany({});
    clearQueue();

    const stamp = Date.now();

    // Helper to get CSRF token and cookies
    const getCsrfContext = async () => {
      const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
      const csrfData = await csrfRes.json();
      const cookies = parseCookies(csrfRes.headers.get('set-cookie'));
      return {
        csrfToken: csrfData.data.csrfToken,
        cookies,
      };
    };

    // Helper to log in a user and obtain CSRF + session cookies
    const loginUser = async (email, password) => {
      const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
      const csrfData = await csrfRes.json();
      const initialCookies = parseCookies(csrfRes.headers.get('set-cookie'));
      const csrfToken = csrfData.data.csrfToken;

      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          Cookie: formatCookieHeader(initialCookies),
        },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      const loginCookies = parseCookies(loginRes.headers.get('set-cookie'));
      const combinedCookies = { ...initialCookies, ...loginCookies };

      return {
        user: loginData.data?.user,
        csrfToken,
        cookies: combinedCookies,
      };
    };

    // Setup Admin user
    const adminEmail = `admin-m12-${stamp}@example.com`;
    await User.create({
      name: 'System Admin M12',
      email: adminEmail,
      phone: '9876543290',
      password: 'Password123!',
      role: 'Admin',
      isEmailVerified: true,
      address: { street: 'HQ Ave', city: 'Metropolis', state: 'Delhi', pincode: '110001' },
    });
    const adminSession = await loginUser(adminEmail, 'Password123!');

    // Setup Citizen user
    const citizenEmail = `citizen-m12-${stamp}@example.com`;
    const citizen = await User.create({
      name: 'Citizen Confidential',
      email: citizenEmail,
      phone: '9876543291',
      password: 'Password123!',
      role: 'User',
      isEmailVerified: true,
      address: { street: 'Secret House 404, Privacy Lane', city: 'Metropolis', state: 'Delhi', pincode: '110001' },
    });

    let category = await Category.findOne({ name: 'Pothole Repair' });
    if (!category) {
      category = await Category.create({
        name: 'Pothole Repair',
        slug: `pothole-repair-${stamp}`,
        description: 'Road damage repair',
        baseFeePaise: 50000,
        freeRadiusKm: 5,
        perKmRatePaise: 2000,
        estimatedResolutionHours: 48,
        isActive: true,
      });
    }

    // Create an Issue with timeline for anonymous tracking test
    const testIssueCode = `CR-2026-${stamp.toString().slice(-6)}`;
    const issueDoc = await Issue.create({
      issueCode: testIssueCode,
      reporter: citizen._id,
      category: category._id,
      title: 'Dangerous Road Crater on Ring Road',
      description: 'Deep road depression posing risk to two-wheelers and buses.',
      suggestedPriority: 'High',
      location: {
        type: 'Point',
        coordinates: [77.209, 28.6139],
      },
      address: {
        street: 'Secret House 404, Privacy Lane',
        city: 'Metropolis',
        pincode: '110001',
      },
      contactNumber: '9876543291',
      status: 'InProgress',
      source: 'form',
      fee: {
        categoryBaseFeePaise: 50000,
        severityMultiplier: 1.0,
        distanceKm: 0,
        freeKm: 5,
        perKmRatePaise: 2000,
        distanceFeePaise: 0,
        totalPaise: 50000,
        advancePaise: 25000,
        balancePaise: 25000,
        commissionPercent: 10,
        isManualQuote: false,
      },
    });

    await IssueTimeline.create([
      {
        issue: issueDoc._id,
        fromStatus: '(new)',
        toStatus: 'AwaitingAdvance',
        action: 'CREATED',
        actor: citizen._id,
        actorRole: 'User',
        remarks: 'Report filed by citizen',
      },
      {
        issue: issueDoc._id,
        fromStatus: 'AwaitingAdvance',
        toStatus: 'Submitted',
        action: 'ADVANCE_PAID',
        remarks: 'Advance payment of ₹250.00 confirmed',
      },
      {
        issue: issueDoc._id,
        fromStatus: 'Submitted',
        toStatus: 'InProgress',
        action: 'TASK_ACCEPTED',
        remarks: 'Certified contractor on site for remediation',
      },
    ]);

    console.log('\n--- 1. Anonymous Public Issue Status Tracking & Zero-PII Invariant ---');
    const trackRes = await fetch(`${baseUrl}/track/${testIssueCode}`);
    assert(trackRes.status === 200, 'Unauthenticated visitor can track issue status with HTTP 200');
    const trackData = (await trackRes.json()).data;

    assert(trackData.issueCode === testIssueCode, 'Returned tracking code matches');
    assert(trackData.status === 'InProgress', 'Current issue status is InProgress');
    assert(trackData.title === 'Dangerous Road Crater on Ring Road', 'Issue title returned');
    assert(trackData.category.name === 'Pothole Repair', 'Service category name included');
    assert(Array.isArray(trackData.timeline) && trackData.timeline.length === 3, 'Full 3-step audit timeline returned');
    assert(trackData.timeline[0].action === 'CREATED', 'Timeline starts with CREATED event');

    // Strict Zero-PII Invariant checks
    assert(trackData.reporter === undefined, 'Payload strictly omits reporter ID reference');
    assert(trackData.reporterName === undefined, 'Payload strictly omits reporter name');
    assert(trackData.phone === undefined && trackData.contactNumber === undefined, 'Payload strictly omits citizen phone number');
    assert(trackData.email === undefined, 'Payload strictly omits citizen email address');
    assert(trackData.street === undefined, 'Payload strictly omits exact street address');
    assert(!JSON.stringify(trackData).includes('Secret House 404'), 'Full JSON response contains zero residential address strings');
    assert(!JSON.stringify(trackData).includes('Citizen Confidential'), 'Full JSON response contains zero citizen names');
    assert(!JSON.stringify(trackData).includes('9876543291'), 'Full JSON response contains zero phone numbers');

    // Non-existent tracking code test
    const notFoundTrackRes = await fetch(`${baseUrl}/track/CR-9999-000000`);
    assert(notFoundTrackRes.status === 404, 'Nonexistent issue code returns HTTP 404 Not Found');

    console.log('\n--- 2. Public Citizen Contact Inquiry Submission (Write a Query) ---');
    const visitorCsrf = await getCsrfContext();

    const queryPayload = {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      subject: 'Inquiry regarding streetlight repair timelines',
      message: 'Hello, how many days does it usually take for streetlights to be fixed once advance payment is made?',
    };

    const submitQueryRes = await fetch(`${baseUrl}/queries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': visitorCsrf.csrfToken,
        Cookie: formatCookieHeader(visitorCsrf.cookies),
      },
      body: JSON.stringify(queryPayload),
    });
    assert(submitQueryRes.status === 201, 'Public query submission returns HTTP 201 Created');
    const submitQueryData = await submitQueryRes.json();
    const queryId = submitQueryData.data.queryId;
    assert(Boolean(queryId), 'Submission response returns created queryId');

    // Verify in MongoDB
    const queryInDb = await Query.findById(queryId);
    assert(queryInDb !== null, 'Query document created in MongoDB');
    assert(queryInDb.status === 'Pending', 'Query defaults to status "Pending"');
    assert(queryInDb.email === 'rohan.sharma@example.com', 'Query email saved correctly');

    // Validation rejection test
    const invalidQueryRes = await fetch(`${baseUrl}/queries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': visitorCsrf.csrfToken,
        Cookie: formatCookieHeader(visitorCsrf.cookies),
      },
      body: JSON.stringify({ name: 'A', email: 'not-an-email', subject: 'Hi', message: 'Too short' }),
    });
    assert(invalidQueryRes.status === 400, 'Invalid query payload rejected with HTTP 400 Bad Request');

    console.log('\n--- 3. Administrator Query Inbox & Email Reply Dispatch ---');
    // Admin lists inquiries
    const listQueriesRes = await fetch(`${baseUrl}/admin/queries?status=Pending`, {
      headers: {
        Cookie: formatCookieHeader(adminSession.cookies),
      },
    });
    assert(listQueriesRes.status === 200, 'Admin can list queries with HTTP 200');
    const queriesList = (await listQueriesRes.json()).data;
    assert(Array.isArray(queriesList) && queriesList.length >= 1, 'Inquiries list contains newly submitted query');

    // Unauthorized non-admin cannot access queries
    const unauthQueryListRes = await fetch(`${baseUrl}/admin/queries`);
    assert(unauthQueryListRes.status === 401, 'Unauthenticated access to /admin/queries rejected with HTTP 401');

    // Admin replies to query
    const adminReplyText = 'Streetlight repairs are typically inspected and remediated within 24 to 48 hours of advance settlement by certified electrical resolvers.';

    const replyRes = await fetch(`${baseUrl}/admin/queries/${queryId}/reply`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': adminSession.csrfToken,
        Cookie: formatCookieHeader(adminSession.cookies),
      },
      body: JSON.stringify({ reply: adminReplyText }),
    });
    assert(replyRes.status === 200, 'Admin reply returns HTTP 200');

    // Verify Query status updated to Replied
    const updatedQuery = await Query.findById(queryId);
    assert(updatedQuery.status === 'Replied', 'Query status transitioned from "Pending" to "Replied"');
    assert(updatedQuery.reply === adminReplyText, 'Reply message stored in document');
    assert(updatedQuery.repliedBy !== null, 'repliedBy administrator reference stored');
    assert(updatedQuery.repliedAt !== null, 'repliedAt timestamp recorded');

    // Verify Email Queue dispatched response email to citizen
    await drainQueue(6000);
    const emailLog = await EmailLog.findOne({ to: 'rohan.sharma@example.com', template: 'queryReply' });
    assert(emailLog !== null, 'EmailLog record exists for queryReply email dispatch');
    assert(emailLog.status === 'Sent', 'queryReply email status marked Sent');
    assert(emailLog.subject.includes('streetlight repair timelines'), 'Email subject references original inquiry subject');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passedCount} M12 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ Acceptance test suite failed with error:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDB();
  }
};

runAcceptanceTests();
