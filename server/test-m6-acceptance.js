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
  console.log('   M6 ACCEPTANCE CRITERIA VERIFICATION TEST SUITE   ');
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
    // 0. Clean prior M6 test artifacts
    await User.deleteMany({ email: { $in: ['citizen-a-m6@example.com', 'citizen-b-m6@example.com', 'admin-m6@example.com'] } });
    await Category.deleteMany({ slug: 'm6-drainage-test' });
    await FeeSettings.deleteMany({});
    await Payment.deleteMany({ idempotencyKey: { $regex: /m6/i } });
    await Issue.deleteMany({ title: { $regex: /M6 Test/i } });

    // Seed FeeSettings
    await FeeSettings.create({
      freeKm: 3,
      perKmRatePaise: 1500,
      minFeePaise: 10000,
      maxFeePaise: 500000,
      platformCommissionPercent: 10,
    });

    // Seed Category
    const category = await Category.create({
      name: 'M6 Drainage Test',
      slug: 'm6-drainage-test',
      description: 'Drainage repairs for M6 acceptance test',
      baseFeePaise: 50000,
      isActive: true,
    });

    // Create Admin User
    const adminUser = await User.create({
      name: 'M6 Admin',
      email: 'admin-m6@example.com',
      password: 'Password123!',
      role: 'Admin',
      isEmailVerified: true,
      phone: '9876543200',
      address: {
        street: 'Admin Blvd',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
    });

    // Create Citizen A
    const citizenA = await User.create({
      name: 'Citizen A M6',
      email: 'citizen-a-m6@example.com',
      password: 'Password123!',
      role: 'User',
      isEmailVerified: true,
      phone: '9876543210',
      address: {
        street: '123 Test Avenue',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
    });

    // Create Citizen B
    const citizenB = await User.create({
      name: 'Citizen B M6',
      email: 'citizen-b-m6@example.com',
      password: 'Password123!',
      role: 'User',
      isEmailVerified: true,
      phone: '9876543211',
      address: {
        street: '456 Other St',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
    });

    // Helper: Login and obtain cookies + CSRF
    const loginUser = async (email, password) => {
      const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
      const csrfData = await csrfRes.json();
      const cookies = parseCookies(csrfRes.headers.get('set-cookie'));
      const csrfToken = csrfData.data.csrfToken;

      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          Cookie: formatCookieHeader(cookies),
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(`Login failed for ${email}: ${loginData.message}`);
      }

      const loginCookies = { ...cookies, ...parseCookies(loginRes.headers.get('set-cookie')) };
      return { user: loginData.data.user, cookies: loginCookies, csrfToken };
    };

    const sessionA = await loginUser('citizen-a-m6@example.com', 'Password123!');
    const sessionB = await loginUser('citizen-b-m6@example.com', 'Password123!');
    const sessionAdmin = await loginUser('admin-m6@example.com', 'Password123!');

    // Create Issue 1 for Citizen A in AwaitingAdvance status (total: 86000, advance: 43000, balance: 43000)
    const issueA = await Issue.create({
      issueCode: 'CR-2026-M60001',
      reporter: citizenA._id,
      category: category._id,
      title: 'M6 Test Broken Sewer Pipe',
      description: 'Severe sewage overflow blocking the neighborhood street.',
      suggestedPriority: 'High',
      location: {
        type: 'Point',
        coordinates: [77.209, 28.6139],
      },
      address: {
        street: '123 Test Avenue',
        city: 'New Delhi',
        pincode: '110001',
      },
      contactNumber: '9876543210',
      status: 'AwaitingAdvance',
      fee: {
        categoryBaseFeePaise: 50000,
        severityMultiplier: 1.6,
        distanceKm: 7.0,
        freeKm: 3,
        perKmRatePaise: 1500,
        distanceFeePaise: 6000,
        totalPaise: 86000,
        advancePaise: 43000,
        balancePaise: 43000,
        commissionPercent: 10,
        isManualQuote: false,
      },
    });

    // Create Issue 2 in Cancelled status for negative testing
    const issueCancelled = await Issue.create({
      issueCode: 'CR-2026-M60002',
      reporter: citizenA._id,
      category: category._id,
      title: 'M6 Test Cancelled Issue',
      description: 'Cancelled issue should reject advance payment order.',
      suggestedPriority: 'Low',
      location: {
        type: 'Point',
        coordinates: [77.209, 28.6139],
      },
      address: {
        street: '124 Test Avenue',
        city: 'New Delhi',
        pincode: '110001',
      },
      contactNumber: '9876543210',
      status: 'Cancelled',
      fee: {
        categoryBaseFeePaise: 50000,
        severityMultiplier: 1.0,
        distanceKm: 2.0,
        freeKm: 3,
        perKmRatePaise: 1500,
        distanceFeePaise: 0,
        totalPaise: 50000,
        advancePaise: 25000,
        balancePaise: 25000,
        commissionPercent: 10,
        isManualQuote: false,
      },
    });

    console.log('\n--- 1. ADVANCE PAYMENT ORDER CREATION ---');

    // Test 1: POST /api/payments/advance/:issueId/order (Citizen A)
    const orderRes = await fetch(`${baseUrl}/payments/advance/${issueA._id}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': sessionA.csrfToken,
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 201, 'POST /payments/advance/:issueId/order returns 201 Created');
    assert(orderData.success === true, 'Response success is true');
    assert(orderData.data.paymentId.startsWith('PAY-ADV-'), 'Returns structured paymentId starting with PAY-ADV-');
    assert(orderData.data.amountPaise === 43000, 'Payment amount strictly derived from server-side Issue.fee.advancePaise (43000)');
    assert(orderData.data.status === 'Pending', 'Payment order initially has status Pending');

    const paymentId = orderData.data.paymentId;

    // Test 2: Negative test - Citizen B cannot initiate advance order for Citizen A's issue
    const forbiddenOrderRes = await fetch(`${baseUrl}/payments/advance/${issueA._id}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': sessionB.csrfToken,
        Cookie: formatCookieHeader(sessionB.cookies),
      },
    });
    assert(forbiddenOrderRes.status === 404, 'Citizen B cannot initiate advance order for Citizen A issue (returns 404)');

    // Test 3: Negative test - Attempting order on non-AwaitingAdvance issue returns 400
    const invalidStatusOrderRes = await fetch(`${baseUrl}/payments/advance/${issueCancelled._id}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': sessionA.csrfToken,
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    assert(invalidStatusOrderRes.status === 400, 'Attempting order on Cancelled issue returns 400 Bad Request');

    console.log('\n--- 2. PAYMENT FAILURE SIMULATION ---');

    // Test 4: POST /api/payments/:paymentId/fail keeps issue in AwaitingAdvance
    const failRes = await fetch(`${baseUrl}/payments/${paymentId}/fail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': sessionA.csrfToken,
        Cookie: formatCookieHeader(sessionA.cookies),
      },
      body: JSON.stringify({ reason: 'Simulated card test decline' }),
    });
    const failData = await failRes.json();
    assert(failRes.status === 200, 'Simulate failure endpoint returns 200 OK');
    assert(failData.data.status === 'Failed', 'Payment order status marked as Failed');

    // Verify issue status remains AwaitingAdvance
    const refreshedIssueA = await Issue.findById(issueA._id);
    assert(refreshedIssueA.status === 'AwaitingAdvance', 'Issue status remains strictly in "AwaitingAdvance" after payment failure');

    console.log('\n--- 3. ADVANCE PAYMENT CONFIRMATION & IDEMPOTENCY ---');

    // Create a fresh pending order for confirmation
    const freshOrderRes = await fetch(`${baseUrl}/payments/advance/${issueA._id}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': sessionA.csrfToken,
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    const freshOrderData = await freshOrderRes.json();
    const activePaymentId = freshOrderData.data.paymentId;
    assert(freshOrderRes.status === 201, 'Fresh pending order created for confirmation');

    // Test 5: Missing Idempotency-Key header returns 400
    const missingKeyRes = await fetch(`${baseUrl}/payments/${activePaymentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': sessionA.csrfToken,
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    assert(missingKeyRes.status === 400, 'Missing Idempotency-Key header rejected with 400 Bad Request');

    // Test 6: Successful confirmation with Idempotency-Key
    const idempotencyKey = 'm6-test-key-550e8400-e29b-41d4-a716-446655440000';
    const confirmRes = await fetch(`${baseUrl}/payments/${activePaymentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        'X-CSRF-Token': sessionA.csrfToken,
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    const confirmData = await confirmRes.json();
    assert(confirmRes.status === 200, 'POST /payments/:paymentId/confirm returns 200 OK');
    assert(confirmData.data.status === 'Submitted', 'Confirming advance payment moves issue status to "Submitted"');
    assert(confirmData.data.invoiceId != null, 'Invoice document created and returned in confirmation response');
    assert(confirmData.data.invoiceNumber.startsWith('INV-'), 'Invoice number follows atomic sequential format INV-YYYY-XXXXXX');

    const createdInvoiceId = confirmData.data.invoiceId;

    // Verify DB state
    const submittedIssue = await Issue.findById(issueA._id);
    assert(submittedIssue.status === 'Submitted', 'Database Issue document status is Submitted');
    assert(submittedIssue.payments?.advancePayment != null, 'Issue.payments.advancePayment is populated');
    assert(submittedIssue.payments?.advanceInvoice != null, 'Issue.payments.advanceInvoice is linked');

    const completedPayment = await Payment.findOne({ paymentId: activePaymentId });
    assert(completedPayment.status === 'Completed', 'Payment document status is Completed');
    assert(completedPayment.idempotencyKey === idempotencyKey, 'Payment document stored the supplied Idempotency-Key');

    const timelineEvent = await IssueTimeline.findOne({
      issue: issueA._id,
      action: 'ADVANCE_PAYMENT_CONFIRMED',
    });
    assert(timelineEvent != null, 'IssueTimeline record created for ADVANCE_PAYMENT_CONFIRMED');

    // Test 7: Idempotency replay test - submitting the same Idempotency-Key twice
    const replayRes = await fetch(`${baseUrl}/payments/${activePaymentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        'X-CSRF-Token': sessionA.csrfToken,
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    const replayData = await replayRes.json();
    assert(replayRes.status === 200, 'Replay with same Idempotency-Key returns 200 OK');
    assert(replayData.data.isReplay === true, 'Response flags isReplay: true');
    assert(replayData.data.invoiceNumber === confirmData.data.invoiceNumber, 'Replay returns identical invoiceNumber');

    const invoiceCount = await Invoice.countDocuments({ issue: issueA._id });
    assert(invoiceCount === 1, 'Exactly one invoice exists in database (zero duplicate documents created on replay)');

    console.log('\n--- 4. INVOICE METADATA & PDF STREAMING ---');

    // Test 8: GET /api/invoices/:id (Metadata check)
    const invoiceRes = await fetch(`${baseUrl}/invoices/${createdInvoiceId}`, {
      headers: {
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    const invoiceData = await invoiceRes.json();
    assert(invoiceRes.status === 200, 'GET /api/invoices/:id returns 200 OK');
    assert(invoiceData.data.amountPaidPaise === 43000, 'Invoice records exact advance amount paid (43000 paise)');
    assert(invoiceData.data.balanceDuePaise === 43000, 'Invoice records remaining balance due (43000 paise)');
    assert(invoiceData.data.customerSnapshot.name === citizenA.name, 'Customer snapshot preserved citizen name');

    // Test 9: Streaming GET /api/invoices/:id/pdf renders valid PDF containing required disclaimer
    const pdfRes = await fetch(`${baseUrl}/invoices/${createdInvoiceId}/pdf`, {
      headers: {
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    assert(pdfRes.status === 200, 'GET /api/invoices/:id/pdf returns 200 OK');
    assert(pdfRes.headers.get('content-type') === 'application/pdf', 'Response Content-Type is application/pdf');

    const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
    assert(pdfBuffer.slice(0, 4).toString() === '%PDF', 'PDF buffer starts with %PDF magic bytes');

    const extractPdfText = (buffer) => {
      const content = buffer.toString('utf-8');
      let decoded = '';
      const hexMatches = content.match(/<([0-9a-fA-F]+)>/g) || [];
      for (const m of hexMatches) {
        const hex = m.slice(1, -1);
        decoded += Buffer.from(hex, 'hex').toString('utf-8');
      }
      const literalMatches = content.match(/\(([^)]+)\)/g) || [];
      for (const l of literalMatches) {
        decoded += ' ' + l.slice(1, -1);
      }
      return decoded;
    };

    const pdfText = extractPdfText(pdfBuffer);
    assert(
      pdfText.includes('MOCK PAYMENT - not a tax invoice'),
      'PDF text content contains required legal disclaimer: "MOCK PAYMENT - not a tax invoice"'
    );

    // Test 10: Privacy Boundary - Citizen B cannot access Citizen A invoice metadata
    const unauthorizedInvoiceRes = await fetch(`${baseUrl}/invoices/${createdInvoiceId}`, {
      headers: {
        Cookie: formatCookieHeader(sessionB.cookies),
      },
    });
    assert(
      unauthorizedInvoiceRes.status === 404,
      'Citizen B cannot access Citizen A invoice metadata (returns 404)'
    );

    // Test 11: Privacy Boundary - Citizen B cannot stream Citizen A invoice PDF
    const unauthorizedPdfRes = await fetch(`${baseUrl}/invoices/${createdInvoiceId}/pdf`, {
      headers: {
        Cookie: formatCookieHeader(sessionB.cookies),
      },
    });
    assert(
      unauthorizedPdfRes.status === 404,
      'Citizen B cannot stream Citizen A invoice PDF (returns 404)'
    );

    // Test 12: Admin CAN access citizen invoice metadata and stream PDF
    const adminInvoiceRes = await fetch(`${baseUrl}/invoices/${createdInvoiceId}`, {
      headers: {
        Cookie: formatCookieHeader(sessionAdmin.cookies),
      },
    });
    assert(adminInvoiceRes.status === 200, 'Administrator can access citizen invoice metadata');

    const adminPdfRes = await fetch(`${baseUrl}/invoices/${createdInvoiceId}/pdf`, {
      headers: {
        Cookie: formatCookieHeader(sessionAdmin.cookies),
      },
    });
    assert(adminPdfRes.status === 200, 'Administrator can stream citizen invoice PDF');

    console.log('\n--- 5. CITIZEN LISTINGS ---');

    // Test 13: GET /api/payments/mine
    const myPaymentsRes = await fetch(`${baseUrl}/payments/mine`, {
      headers: {
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    const myPaymentsData = await myPaymentsRes.json();
    assert(myPaymentsRes.status === 200, 'GET /api/payments/mine returns 200 OK');
    assert(Array.isArray(myPaymentsData.data), 'Returns payments array');
    assert(myPaymentsData.data.length >= 1, 'Citizen has payment records in list');

    // Test 14: GET /api/invoices/mine
    const myInvoicesRes = await fetch(`${baseUrl}/invoices/mine`, {
      headers: {
        Cookie: formatCookieHeader(sessionA.cookies),
      },
    });
    const myInvoicesData = await myInvoicesRes.json();
    assert(myInvoicesRes.status === 200, 'GET /api/invoices/mine returns 200 OK');
    assert(Array.isArray(myInvoicesData.data), 'Returns invoices array');
    assert(myInvoicesData.data.length === 1, 'Citizen has exactly 1 invoice in list');
    assert(myInvoicesData.data[0].invoiceNumber.startsWith('INV-'), 'Listed invoice has valid invoiceNumber');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passedCount} ACCEPTANCE TESTS PASSED SUCCESSFULLY!`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED WITH ERROR:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    await disconnectDB();
  }
};

runAcceptanceTests();
