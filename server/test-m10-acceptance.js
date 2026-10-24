import http from 'http';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import { User } from './src/models/User.js';
import { Notification } from './src/models/Notification.js';
import { EmailLog } from './src/models/EmailLog.js';
import emailService, { setSimulateFailure } from './src/services/emailService.js';
import emailQueue, { setRetryDelays, resetRetryDelays, drainQueue, clearQueue } from './src/services/emailQueue.js';
import notificationService from './src/services/notificationService.js';

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
  console.log('   M10 ACCEPTANCE CRITERIA VERIFICATION TEST SUITE  ');
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
    await Notification.deleteMany({});
    await EmailLog.deleteMany({});
    clearQueue();

    // Setup speeded-up retry delays for testing (20ms, 40ms, 60ms)
    setRetryDelays([20, 40, 60]);

    // Create 2 test users (User A and User B)
    const stamp = Date.now();
    const userA = await User.create({
      name: 'Citizen Alice',
      email: `alice-${stamp}@example.com`,
      phone: '9876543210',
      password: 'Password123!',
      role: 'User',
      isEmailVerified: true,
      address: { street: '12 Rose Lane', city: 'Metropolis', state: 'Delhi', pincode: '110001' },
    });

    const userB = await User.create({
      name: 'Citizen Bob',
      email: `bob-${stamp}@example.com`,
      phone: '9876543211',
      password: 'Password123!',
      role: 'User',
      isEmailVerified: true,
      address: { street: '45 Oak Ave', city: 'Metropolis', state: 'Delhi', pincode: '110001' },
    });

    // Helper to log in a user and obtain CSRF + session cookies
    const loginUser = async (email, password) => {
      // 1. Fetch CSRF token
      const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
      const csrfData = await csrfRes.json();
      const initialCookies = parseCookies(csrfRes.headers.get('set-cookie'));
      const csrfToken = csrfData.data.csrfToken;

      // 2. Perform Login
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
        cookieHeader: formatCookieHeader(combinedCookies),
      };
    };

    const sessionA = await loginUser(userA.email, 'Password123!');
    const sessionB = await loginUser(userB.email, 'Password123!');

    console.log('\n--- 1. In-App Notification & Email Queueing Integration ---');

    // Dispatch a notification with emailOptions to User A
    const notif1 = await notificationService.notify({
      recipientId: userA._id,
      title: 'Water Leak Inspection Assigned',
      message: 'A certified contractor has been dispatched to investigate your reported leak.',
      type: 'ASSIGNMENT',
      link: '/user/issues/issue-123',
      emailOptions: {
        to: userA.email,
        template: 'taskAssigned',
        subject: 'Contractor Assigned to Water Leak',
        html: '<p>A contractor has been assigned.</p>',
      },
    });

    assert(notif1 && notif1._id, 'Notification created and returned by service');
    assert(notif1.recipient.toString() === userA._id.toString(), 'Notification recipient matches User A');
    assert(notif1.isRead === false, 'Notification defaults to isRead: false');
    assert(notif1.type === 'ASSIGNMENT', 'Notification type is ASSIGNMENT');

    // Wait for queue processing
    await drainQueue();

    // Check EmailLog entry
    const emailLog1 = await EmailLog.findOne({ to: userA.email, subject: 'Contractor Assigned to Water Leak' });
    assert(emailLog1 !== null, 'EmailLog record exists for dispatched notification');
    assert(emailLog1.status === 'Sent', 'EmailLog status marked Sent after successful delivery');
    assert(emailLog1.attempts === 1, 'Email delivered on first attempt (attempts === 1)');
    assert(emailLog1.sentAt !== null, 'sentAt timestamp recorded in EmailLog');

    console.log('\n--- 2. Unread Count & Querying In-App Notifications ---');

    // Create second notification for User A (type PAYMENT)
    const notif2 = await notificationService.notify({
      recipientId: userA._id,
      title: 'Advance Payment Received',
      message: 'Your advance payment has been confirmed.',
      type: 'PAYMENT',
      link: '/user/payments',
    });

    // Check unread count endpoint for User A
    const countResA1 = await fetch(`${baseUrl}/notifications/unread-count`, {
      headers: { Cookie: sessionA.cookieHeader },
    });
    const countDataA1 = await countResA1.json();
    assert(countResA1.status === 200, 'GET /notifications/unread-count returns HTTP 200');
    assert(countDataA1.data.unreadCount === 2, 'User A unread count is exactly 2');

    // Check unread count for User B (must be 0)
    const countResB = await fetch(`${baseUrl}/notifications/unread-count`, {
      headers: { Cookie: sessionB.cookieHeader },
    });
    const countDataB = await countResB.json();
    assert(countDataB.data.unreadCount === 0, 'User B has 0 unread notifications');

    // List notifications for User A
    const listResA = await fetch(`${baseUrl}/notifications?page=1&limit=10`, {
      headers: { Cookie: sessionA.cookieHeader },
    });
    const listDataA = await listResA.json();
    assert(listResA.status === 200, 'GET /notifications returns HTTP 200');
    assert(Array.isArray(listDataA.data), 'Notifications response data is an array');
    assert(listDataA.data.length === 2, 'Notifications list contains 2 alerts');
    assert(listDataA.meta.total === 2, 'Metadata total is 2');
    assert(listDataA.data[0]._id === notif2._id.toString(), 'Most recent notification is first in list');

    // Filter by type=PAYMENT
    const filterTypeRes = await fetch(`${baseUrl}/notifications?type=PAYMENT`, {
      headers: { Cookie: sessionA.cookieHeader },
    });
    const filterTypeData = await filterTypeRes.json();
    assert(filterTypeData.data.length === 1, 'Filter by type=PAYMENT returns 1 notification');
    assert(filterTypeData.data[0].type === 'PAYMENT', 'Notification type is PAYMENT');

    console.log('\n--- 3. Mark Single as Read & Isolation Authorization ---');

    // User B attempts to mark User A's notification as read (Strictly 404 Forbidden/Not Found)
    const illicitReadRes = await fetch(`${baseUrl}/notifications/${notif1._id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': sessionB.csrfToken,
        Cookie: sessionB.cookieHeader,
      },
    });
    assert(illicitReadRes.status === 404, 'User B marking User A notification as read rejected with HTTP 404');

    // User A marks notif1 as read
    const legitReadRes = await fetch(`${baseUrl}/notifications/${notif1._id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': sessionA.csrfToken,
        Cookie: sessionA.cookieHeader,
      },
    });
    const legitReadData = await legitReadRes.json();
    assert(legitReadRes.status === 200, 'User A marking own notification returns HTTP 200');
    assert(legitReadData.data.isRead === true, 'Updated notification has isRead: true');

    // Verify unread count decremented to 1
    const countResA2 = await fetch(`${baseUrl}/notifications/unread-count`, {
      headers: { Cookie: sessionA.cookieHeader },
    });
    const countDataA2 = await countResA2.json();
    assert(countDataA2.data.unreadCount === 1, 'User A unread count decremented to 1');

    console.log('\n--- 4. Mark All as Read Endpoint ---');

    const markAllRes = await fetch(`${baseUrl}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': sessionA.csrfToken,
        Cookie: sessionA.cookieHeader,
      },
    });
    const markAllData = await markAllRes.json();
    assert(markAllRes.status === 200, 'PATCH /notifications/read-all returns HTTP 200');
    assert(markAllData.data.modifiedCount === 1, 'Modified count reflects remaining unread alert');

    // Verify unread count is now 0
    const countResA3 = await fetch(`${baseUrl}/notifications/unread-count`, {
      headers: { Cookie: sessionA.cookieHeader },
    });
    const countDataA3 = await countResA3.json();
    assert(countDataA3.data.unreadCount === 0, 'User A unread count is now 0');

    console.log('\n--- 5. Non-Blocking Non-Failing Email & Exponential Backoff Retries ---');

    // 5A. Enable simulated SMTP failure
    setSimulateFailure(true, 'Connection refused to smtp.mailserver.local:587');

    // Trigger notification during SMTP failure - caller operation must NOT throw or fail
    const failureNotif = await notificationService.notify({
      recipientId: userA._id,
      title: 'Simulated Outage Alert',
      message: 'This notification tests that SMTP failure does not fail the API response.',
      type: 'SYSTEM',
      emailOptions: {
        to: userA.email,
        template: 'outageTest',
        subject: 'Delivery Outage Simulation',
        html: '<p>Testing outage</p>',
      },
    });

    assert(failureNotif && failureNotif._id, 'In-app notification created even when SMTP transport fails');

    // Drain queue with simulated failure active -> will attempt 3 times and fail
    await drainQueue();

    // Check EmailLog status
    const failedLog = await EmailLog.findOne({
      to: userA.email,
      subject: 'Delivery Outage Simulation',
    });

    assert(failedLog !== null, 'EmailLog entry exists for simulated failure test');
    assert(failedLog.attempts === 3, 'Email attempted exactly 3 times before permanent failure (attempts === 3)');
    assert(failedLog.status === 'Failed', 'EmailLog status marked "Failed" after 3 failed attempts');
    assert(failedLog.lastError.includes('Connection refused'), 'lastError captured simulated network error message');
    assert(failedLog.failedAt !== null, 'failedAt timestamp stamped on EmailLog');

    // Reset failure simulation
    setSimulateFailure(false);
    resetRetryDelays();

    console.log('\n--- 6. Clean Queue and State ---');
    assert(emailQueue.getQueueLength() === 0, 'Email queue is completely clear and empty');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passedCount} M10 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test run failed with error:', err);
    process.exitCode = 1;
  } finally {
    setSimulateFailure(false);
    resetRetryDelays();
    if (server) server.close();
    await disconnectDB();
  }
};

runAcceptanceTests();
