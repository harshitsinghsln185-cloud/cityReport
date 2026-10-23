import http from 'http';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import { User } from './src/models/User.js';
import { Category } from './src/models/Category.js';
import { ResolverProfile } from './src/models/ResolverProfile.js';
import { Issue } from './src/models/Issue.js';
import { IssueTimeline } from './src/models/IssueTimeline.js';
import { Resolution } from './src/models/Resolution.js';
import { Payment } from './src/models/Payment.js';
import { Invoice } from './src/models/Invoice.js';
import { Payout } from './src/models/Payout.js';
import { Feedback } from './src/models/Feedback.js';

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
  console.log('   M9 ACCEPTANCE CRITERIA VERIFICATION TEST SUITE   ');
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
    // 0. Clean prior M9 test artifacts
    await User.deleteMany({
      email: {
        $in: [
          'citizen-m9@example.com',
          'resolver-m9@example.com',
          'admin-m9@example.com',
        ],
      },
    });
    await Payout.deleteMany({});
    await Payment.deleteMany({ paymentId: { $regex: /^PAY-(ADV|BAL)/ } });
    await Invoice.deleteMany({});
    await Feedback.deleteMany({});
    await Issue.deleteMany({ issueCode: { $regex: /^CR-M9-/ } });
    await Resolution.deleteMany({});

    // 1. Create Test Users: Citizen, Resolver, Admin
    const citizen = await User.create({
      name: 'M9 Citizen User',
      email: 'citizen-m9@example.com',
      password: 'Password123!',
      role: 'User',
      isEmailVerified: true,
      phone: '+919876543210',
      address: { street: 'Citizen Block 1', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    });

    const resolverUser = await User.create({
      name: 'M9 Resolver Contractor',
      email: 'resolver-m9@example.com',
      password: 'Password123!',
      role: 'Resolver',
      isEmailVerified: true,
      phone: '+919876543211',
      address: { street: 'Contractor Depot 2', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    });

    const adminUser = await User.create({
      name: 'M9 Admin Officer',
      email: 'admin-m9@example.com',
      password: 'Password123!',
      role: 'Admin',
      isEmailVerified: true,
      phone: '+919876543212',
      address: { street: 'Admin Secretariat', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    });

    // Find or create category
    let category = await Category.findOne({ slug: 'roads-potholes' });
    if (!category) {
      category = await Category.create({
        name: 'Roads & Potholes',
        slug: 'roads-potholes',
        description: 'Road infrastructure and asphalt potholes',
        icon: 'road',
        baseFeePaise: 50000,
        isActive: true,
      });
    }

    // Create Resolver Profile
    const resolverProfile = await ResolverProfile.create({
      user: resolverUser._id,
      status: 'Approved',
      skills: [category._id],
      serviceLocation: { type: 'Point', coordinates: [77.5946, 12.9716] },
      serviceAddress: 'Bangalore Central Operations HQ',
      serviceRadiusKm: 25,
      isAvailable: true,
      idProof: {
        publicId: 'proof_mock_123',
        url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        bytes: 1024,
        format: 'jpg',
      },
      totalEarningsPaise: 0,
      pendingPayoutPaise: 0,
      completedTasksCount: 0,
    });

    // Login helpers to get JWT cookies and CSRF tokens
    const login = async (email, password) => {
      const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
      const csrfCookies = parseCookies(csrfRes.headers.getSetCookie ? csrfRes.headers.getSetCookie() : csrfRes.headers.get('set-cookie'));
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
      const loginCookies = parseCookies(res.headers.getSetCookie ? res.headers.getSetCookie() : res.headers.get('set-cookie'));
      const mergedCookies = { ...csrfCookies, ...loginCookies };
      return {
        data,
        csrfToken,
        cookies: mergedCookies,
        cookieHeader: formatCookieHeader(mergedCookies),
      };
    };

    const citizenSession = await login('citizen-m9@example.com', 'Password123!');
    const resolverSession = await login('resolver-m9@example.com', 'Password123!');
    const adminSession = await login('admin-m9@example.com', 'Password123!');

    console.log('\n--- 1. Verification & Rework Request Flow ---');

    // Create an Issue in 'Resolved' status with resolution proof
    const issueCode1 = `CR-M9-${Date.now()}-001`;
    // Worked Vector 1: Total = 86000 paise (₹860.00), Advance = 43000 paise (₹430.00), Balance = 43000 paise (₹430.00), Commission 10%
    const issue1 = await Issue.create({
      issueCode: issueCode1,
      reporter: citizen._id,
      category: category._id,
      title: 'Deep crater on Outer Ring Road',
      description: 'Severe pothole damaging axles near central bus terminal.',
      suggestedPriority: 'High',
      finalPriority: 'High',
      location: { type: 'Point', coordinates: [77.595, 12.972] },
      address: { street: 'Outer Ring Road 4B', city: 'Bangalore', pincode: '560001' },
      contactNumber: '+919876543210',
      status: 'Resolved',
      assignedResolver: resolverProfile._id,
      assignedAt: new Date(Date.now() - 86400000),
      acceptedAt: new Date(Date.now() - 80000000),
      startedAt: new Date(Date.now() - 70000000),
      resolvedAt: new Date(),
      fee: {
        categoryBaseFeePaise: 50000,
        severityMultiplier: 1.2,
        distanceKm: 4,
        freeKm: 5,
        perKmRatePaise: 1500,
        distanceFeePaise: 0,
        totalPaise: 86000, // ₹860.00
        advancePaise: 43000, // ₹430.00
        balancePaise: 43000, // ₹430.00
        commissionPercent: 10,
      },
    });

    const resolution1 = await Resolution.create({
      issue: issue1._id,
      resolver: resolverProfile._id,
      beforeImages: [
        {
          publicId: 'before_1',
          url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          bytes: 1000,
          format: 'jpg',
        },
      ],
      afterImages: [
        {
          publicId: 'after_1',
          url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          bytes: 1200,
          format: 'jpg',
        },
      ],
      remarks: 'Filled crater with industrial asphalt mix and steam-rolled flat.',
      submittedAt: new Date(),
      reworkHistory: [],
    });

    issue1.resolution = resolution1._id;
    await issue1.save();

    // 1A. Admin requests rework
    const reworkRes = await fetch(`${baseUrl}/admin/issues/${issue1._id}/request-rework`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': adminSession.csrfToken,
        Cookie: adminSession.cookieHeader,
      },
      body: JSON.stringify({
        remarks: 'Asphalt edge is uneven, please smooth curb joints properly.',
      }),
    });
    const reworkData = await reworkRes.json();
    assert(reworkRes.status === 200, 'Admin request-rework endpoint returns HTTP 200');
    assert(reworkData.data.status === 'InProgress', 'Issue status transitioned from Resolved back to InProgress');

    // Check resolution rework history
    const updatedResolution = await Resolution.findById(resolution1._id);
    assert(updatedResolution.reworkHistory.length === 1, 'Resolution reworkHistory recorded 1 entry');
    assert(
      updatedResolution.reworkHistory[0].reason === 'Asphalt edge is uneven, please smooth curb joints properly.',
      'Rework reason captured in reworkHistory'
    );

    // Resolver re-submits proof -> moves back to 'Resolved'
    await Issue.findByIdAndUpdate(issue1._id, { $set: { status: 'Resolved' } });

    // 1B. Admin verifies resolution proof
    const verifyRes = await fetch(`${baseUrl}/admin/issues/${issue1._id}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': adminSession.csrfToken,
        Cookie: adminSession.cookieHeader,
      },
    });
    const verifyData = await verifyRes.json();
    assert(verifyRes.status === 200, 'Admin verify proof endpoint returns HTTP 200');
    assert(verifyData.data.status === 'BalanceDue', 'Issue status transitioned from Resolved to BalanceDue');

    // Verify IssueTimeline entry
    const timelineEntry = await IssueTimeline.findOne({
      issue: issue1._id,
      action: 'PROOF_VERIFIED_BY_ADMIN',
    });
    assert(timelineEntry !== null, 'IssueTimeline recorded PROOF_VERIFIED_BY_ADMIN event');

    console.log('\n--- 2. Balance Checkout Order & Atomic Confirmation (Invoice 2 + Payout) ---');

    // 2A. Citizen initiates balance order
    const balanceOrderRes = await fetch(`${baseUrl}/payments/balance/${issue1._id}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': citizenSession.csrfToken,
        Cookie: citizenSession.cookieHeader,
      },
    });
    const balanceOrderData = await balanceOrderRes.json();
    assert(balanceOrderRes.status === 201, 'Citizen balance order endpoint returns HTTP 201');
    assert(balanceOrderData.data.amountPaise === 43000, 'Balance payment order amount is exactly 43000 paise (₹430.00)');
    assert(balanceOrderData.data.status === 'Pending', 'Payment order created in Pending status');

    const paymentId = balanceOrderData.data.paymentId;
    const idempotencyKey = `M9-KEY-${Date.now()}`;

    // 2B. Citizen confirms balance payment with Idempotency-Key
    const confirmRes = await fetch(`${baseUrl}/payments/${paymentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        'X-CSRF-Token': citizenSession.csrfToken,
        Cookie: citizenSession.cookieHeader,
      },
      body: JSON.stringify({
        gatewayPaymentId: 'pay_mock_balance_123',
        gatewayOrderId: 'order_mock_balance_123',
        gatewaySignature: 'sig_mock_balance_123',
      }),
    });
    const confirmData = await confirmRes.json();
    assert(confirmRes.status === 200, 'Balance payment confirmation returns HTTP 200');
    assert(confirmData.data.issueStatus === 'Closed', 'Issue status transitioned from BalanceDue to Closed');
    assert(confirmData.data.payoutId !== undefined, 'Confirmation returned created Payout ID');

    // Verify Issue in DB
    const closedIssue = await Issue.findById(issue1._id);
    assert(closedIssue.status === 'Closed', 'Issue in database has status Closed');
    assert(closedIssue.payoutStatus === 'Pending', 'Issue payoutStatus is Pending');
    assert(closedIssue.payments.balancePayment !== null, 'Issue balancePayment is linked');
    assert(closedIssue.payments.finalInvoice !== null, 'Issue finalInvoice is linked');

    // Verify Final Invoice (Invoice 2)
    const finalInvoice = await Invoice.findById(closedIssue.payments.finalInvoice);
    assert(finalInvoice !== null, 'Final Invoice record exists');
    assert(finalInvoice.type === 'Final', 'Invoice type is Final');
    assert(finalInvoice.invoiceNumber.startsWith('INV-'), 'Final Invoice number starts with INV-');
    assert(finalInvoice.feeBreakdown.totalPaise === 86000, 'Final invoice feeBreakdown total is 86000 paise');
    assert(finalInvoice.advancePaidPaise === 43000, 'Final invoice records Advance Settled 43000 paise');
    assert(finalInvoice.amountPaidPaise === 43000, 'Final invoice records Balance Paid 43000 paise');
    assert(finalInvoice.balanceDuePaise === 0, 'Final invoice records Remaining Balance Due 0 paise');

    // Verify Payout (Worked Vector 1: Total ₹860 (86000 paise), 10% commission = 8600 paise, Net Payout = 77400 paise)
    const payout = await Payout.findOne({ issue: issue1._id });
    assert(payout !== null, 'Payout record created');
    assert(payout.status === 'Pending', 'Payout status is Pending');
    assert(payout.grossAmountPaise === 86000, 'Payout grossAmountPaise is exactly 86000 paise');
    assert(payout.commissionPercent === 10, 'Payout commissionPercent is 10%');
    assert(payout.commissionPaise === 8600, 'Payout commissionPaise is exactly 8600 paise (₹86.00)');
    assert(payout.netAmountPaise === 77400, 'Payout netAmountPaise is exactly 77400 paise (₹774.00)');

    // Verify ResolverProfile balances
    const updatedResolver = await ResolverProfile.findById(resolverProfile._id);
    assert(
      updatedResolver.pendingPayoutPaise === 77400,
      'ResolverProfile.pendingPayoutPaise incremented by 77400 paise'
    );
    assert(
      updatedResolver.completedTasksCount === 1,
      'ResolverProfile.completedTasksCount incremented by 1'
    );

    // 2C. Idempotency replay check
    const replayRes = await fetch(`${baseUrl}/payments/${paymentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        'X-CSRF-Token': citizenSession.csrfToken,
        Cookie: citizenSession.cookieHeader,
      },
      body: JSON.stringify({
        gatewayPaymentId: 'pay_mock_balance_123',
      }),
    });
    const replayData = await replayRes.json();
    assert(replayRes.status === 200, 'Replay with same Idempotency-Key returns HTTP 200');
    assert(replayData.data.isReplay === true, 'Response indicates idempotent replay');

    console.log('\n--- 3. Controlled Issue Reopening Invariant ---');

    // 3A. Issue 1 has Payout in 'Pending' -> Reopening MUST SUCCEED
    const reopenPendingRes = await fetch(`${baseUrl}/issues/${issue1._id}/reopen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': citizenSession.csrfToken,
        Cookie: citizenSession.cookieHeader,
      },
      body: JSON.stringify({
        reason: 'The repaired patch is cracking under heavy transit buses.',
      }),
    });
    const reopenPendingData = await reopenPendingRes.json();
    assert(reopenPendingRes.status === 200, 'Citizen can reopen issue while Payout is Pending');
    assert(reopenPendingData.data.status === 'Reopened', 'Issue status transitioned to Reopened');
    assert(reopenPendingData.data.reopenCount === 1, 'Issue reopenCount is 1');

    // Transition back to Closed for payout disbursement test
    await Issue.findByIdAndUpdate(issue1._id, { $set: { status: 'Closed' } });

    console.log('\n--- 4. Resolver Payout Execution (Admin Mark-Paid) ---');

    // 4A. Admin marks payout as Paid
    const markPaidRes = await fetch(`${baseUrl}/admin/payouts/${payout._id}/mark-paid`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': adminSession.csrfToken,
        Cookie: adminSession.cookieHeader,
      },
    });
    const markPaidData = await markPaidRes.json();
    assert(markPaidRes.status === 200, 'Admin mark-paid endpoint returns HTTP 200');
    assert(markPaidData.data.status === 'Paid', 'Payout status transitioned to Paid');
    assert(markPaidData.data.paidAt !== null, 'Payout paidAt timestamp is recorded');

    // Verify ResolverProfile financial transition
    const paidResolver = await ResolverProfile.findById(resolverProfile._id);
    assert(paidResolver.pendingPayoutPaise === 0, 'pendingPayoutPaise decremented back to 0');
    assert(paidResolver.totalEarningsPaise === 77400, 'totalEarningsPaise incremented to 77400 paise (₹774.00)');

    // 4B. Attempting to mark already paid payout returns 400
    const secondMarkRes = await fetch(`${baseUrl}/admin/payouts/${payout._id}/mark-paid`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': adminSession.csrfToken,
        Cookie: adminSession.cookieHeader,
      },
    });
    assert(secondMarkRes.status === 400, 'Marking an already paid payout returns HTTP 400 Bad Request');

    // 4C. Reopen Invariant check: Issue 1 now has Payout 'Paid' -> Reopening MUST BE REJECTED
    const reopenPaidRes = await fetch(`${baseUrl}/issues/${issue1._id}/reopen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': citizenSession.csrfToken,
        Cookie: citizenSession.cookieHeader,
      },
      body: JSON.stringify({
        reason: 'Trying to reopen after payout disbursed.',
      }),
    });
    assert(
      reopenPaidRes.status === 400,
      'Reopening issue after payout is Paid is strictly rejected with HTTP 400 Bad Request'
    );

    console.log('\n--- 5. Citizen Feedback Rating ---');

    // 5A. Citizen submits 5-star rating with remarks
    const feedbackRes = await fetch(`${baseUrl}/issues/${issue1._id}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': citizenSession.csrfToken,
        Cookie: citizenSession.cookieHeader,
      },
      body: JSON.stringify({
        rating: 5,
        comments: 'Prompt road repair and very neat job.',
      }),
    });
    const feedbackData = await feedbackRes.json();
    assert(feedbackRes.status === 201, 'Citizen feedback submission returns HTTP 201');
    assert(feedbackData.data.rating === 5, 'Feedback rating is 5 stars');
    assert(feedbackData.data.comments === 'Prompt road repair and very neat job.', 'Feedback comments captured');

    // 5B. Duplicate feedback attempt rejected
    const dupFeedbackRes = await fetch(`${baseUrl}/issues/${issue1._id}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': citizenSession.csrfToken,
        Cookie: citizenSession.cookieHeader,
      },
      body: JSON.stringify({ rating: 4 }),
    });
    assert(dupFeedbackRes.status === 400, 'Duplicate feedback submission returns HTTP 400 Bad Request');

    console.log('\n--- 6. Financial Analytics & CSV Export & Resolver Ledger ---');

    // 6A. Admin Financial Overview
    const overviewRes = await fetch(`${baseUrl}/admin/finance/overview`, {
      headers: { Cookie: adminSession.cookieHeader },
    });
    const overviewData = await overviewRes.json();
    assert(overviewRes.status === 200, 'Admin finance overview returns HTTP 200');
    assert(overviewData.data.metrics.commissionEarnedPaise === 8600, 'Commission revenue is 8600 paise (₹86.00)');
    assert(overviewData.data.metrics.paidPayoutsPaise === 77400, 'Paid payouts metric is 77400 paise');

    // 6B. Admin Finance CSV Export Stream
    const csvRes = await fetch(`${baseUrl}/admin/finance/export.csv`, {
      headers: { Cookie: adminSession.cookieHeader },
    });
    assert(csvRes.status === 200, 'Finance CSV export returns HTTP 200');
    assert(
      csvRes.headers.get('content-type')?.includes('text/csv'),
      'Content-Type header is text/csv'
    );
    const csvContent = await csvRes.text();
    const csvLines = csvContent.trim().split('\n');
    assert(
      csvLines[0] === 'IssueCode,Category,GrossFeeINR,AdvanceINR,BalanceINR,CommissionINR,NetPayoutINR,Date',
      'CSV header matches required specification exactly'
    );
    assert(csvLines.length >= 2, 'CSV contains at least 1 data row');
    assert(csvLines[1].includes(issueCode1), 'CSV row contains issue code');
    assert(csvLines[1].includes('860.00'), 'CSV row contains GrossFeeINR 860.00');
    assert(csvLines[1].includes('86.00'), 'CSV row contains CommissionINR 86.00');
    assert(csvLines[1].includes('774.00'), 'CSV row contains NetPayoutINR 774.00');

    // 6C. Resolver Earnings Ledger
    const earningsRes = await fetch(`${baseUrl}/resolver/earnings`, {
      headers: { Cookie: resolverSession.cookieHeader },
    });
    const earningsData = await earningsRes.json();
    assert(earningsRes.status === 200, 'Resolver earnings ledger returns HTTP 200');
    assert(earningsData.data.totalEarningsPaise === 77400, 'Resolver total earnings is 77400 paise (₹774.00)');
    assert(earningsData.data.completedTasksCount === 1, 'Resolver completed tasks count is 1');
    assert(earningsData.payouts.length === 1, 'Resolver payouts list contains 1 payout record');
    assert(earningsData.payouts[0].status === 'Paid', 'Payout record in ledger is Paid');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passedCount} ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test run failed with error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    await disconnectDB();
  }
};

runAcceptanceTests();
