import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import crypto from 'crypto';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { Issue } from '../src/models/Issue.js';
import { Payment } from '../src/models/Payment.js';
import { Invoice } from '../src/models/Invoice.js';
import { User } from '../src/models/User.js';
import { Category } from '../src/models/Category.js';
import { createAdvanceOrder, confirmPayment } from '../src/services/paymentService.js';
import { clearQueue } from '../src/services/emailQueue.js';

describe('M13 Concurrency & Idempotency Hardening: Payment Replay & ACID Guarantees', () => {
  let testUser;
  let testCategory;
  let testIssue;

  beforeAll(async () => {
    await connectDB(env.MONGODB_URI);

    testCategory = await Category.findOne({ slug: 'drainage-block' });
    if (!testCategory) {
      testCategory = await Category.create({
        name: 'Drainage and sewage overflow',
        slug: 'drainage-block',
        description: 'Sewage overflow, pipeline blockages, drainage cleaning',
        baseFeePaise: 50000,
        isActive: true,
        icon: 'Droplets',
      });
    }

    testUser = await User.create({
      name: 'Rohan Sharma Citizen',
      email: `rohan.idempotency.${Date.now()}@example.com`,
      phone: '9876543299',
      password: 'Password@123',
      address: { street: '42 Civic Colony', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      role: 'User',
      isEmailVerified: true,
    });
  });

  afterAll(async () => {
    if (testUser) await User.deleteOne({ _id: testUser._id });
    if (testIssue) {
      await Issue.deleteOne({ _id: testIssue._id });
      await Payment.deleteMany({ issue: testIssue._id });
      await Invoice.deleteMany({ issue: testIssue._id });
    }
    clearQueue();
    await disconnectDB();
  });

  it('Concurrent payment replay with identical idempotencyKey results in zero duplicate payments or invoices', async () => {
    // 1. Create test issue in AwaitingAdvance
    testIssue = await Issue.create({
      issueCode: `CR-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      reporter: testUser._id,
      category: testCategory._id,
      title: 'Severe Sewage Overflow',
      description: 'Backing up into neighborhood alleyway',
      status: 'AwaitingAdvance',
      location: { type: 'Point', coordinates: [77.209, 28.6139] },
      address: { street: '42 Civic Colony', city: 'New Delhi', pincode: '110001' },
      contactNumber: '9876543299',
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

    // 2. Create advance payment order
    const paymentOrder = await createAdvanceOrder(testIssue._id, testUser._id);
    expect(paymentOrder.status).toBe('Pending');
    expect(paymentOrder.amountPaise).toBe(43000);

    const idempotencyKey = crypto.randomUUID();

    // 3. Fire dual concurrent confirmation calls
    const [call1, call2] = await Promise.all([
      confirmPayment(paymentOrder.paymentId, idempotencyKey, testUser._id),
      confirmPayment(paymentOrder.paymentId, idempotencyKey, testUser._id),
    ]);

    // Both calls return successfully
    expect(call1).toBeDefined();
    expect(call2).toBeDefined();

    // Exactly one call executed the transaction, the other recognized the replay
    const replays = [call1.isReplay, call2.isReplay].filter(Boolean);
    const executions = [call1.isReplay, call2.isReplay].filter((r) => !r);

    expect(executions).toHaveLength(1);
    expect(replays).toHaveLength(1);

    // 4. Assert zero duplicate records in database
    const paymentDocs = await Payment.find({ issue: testIssue._id });
    expect(paymentDocs).toHaveLength(1);
    expect(paymentDocs[0].status).toBe('Completed');
    expect(paymentDocs[0].amountPaise).toBe(43000);

    const invoiceDocs = await Invoice.find({ issue: testIssue._id, type: 'Advance' });
    expect(invoiceDocs).toHaveLength(1);
    expect(invoiceDocs[0].amountPaidPaise).toBe(43000);
    expect(invoiceDocs[0].balanceDuePaise).toBe(43000);

    // 5. Assert issue status transitioned to Submitted
    const updatedIssue = await Issue.findById(testIssue._id);
    expect(updatedIssue.status).toBe('Submitted');

    // 6. Sequential 3rd replay call
    const call3 = await confirmPayment(paymentOrder.paymentId, idempotencyKey, testUser._id);
    expect(call3.isReplay).toBe(true);
    expect(call3.payment.status).toBe('Completed');

    // Still exactly 1 payment and 1 invoice
    const finalPaymentCount = await Payment.countDocuments({ issue: testIssue._id });
    const finalInvoiceCount = await Invoice.countDocuments({ issue: testIssue._id });
    expect(finalPaymentCount).toBe(1);
    expect(finalInvoiceCount).toBe(1);
  });
});
