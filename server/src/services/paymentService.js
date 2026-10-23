import mongoose from 'mongoose';
import { Payment } from '../models/Payment.js';
import { Issue } from '../models/Issue.js';
import { Invoice } from '../models/Invoice.js';
import { IssueTimeline } from '../models/IssueTimeline.js';
import { User } from '../models/User.js';
import { Payout } from '../models/Payout.js';
import { ResolverProfile } from '../models/ResolverProfile.js';
import issueService from './issueService.js';
import invoiceService from './invoiceService.js';
import emailService from './emailService.js';
import advanceReceiptTemplate from '../templates/email/advanceReceipt.js';
import adminNewIssueTemplate from '../templates/email/adminNewIssue.js';
import finalReceiptTemplate from '../templates/email/finalReceipt.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

/**
 * Creates an advance payment order for an issue in 'AwaitingAdvance' status.
 *
 * @param {string} issueId
 * @param {string} userId
 * @returns {Promise<Payment>}
 */
export const createAdvanceOrder = async (issueId, userId) => {
  const issue = await Issue.findById(issueId).populate('category');
  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  // Security check: Only the reporter can initiate advance payment
  if (issue.reporter.toString() !== userId.toString()) {
    throw new AppError('Civic issue not found', 404); // 404 to prevent resource existence enumeration
  }

  if (issue.status !== 'AwaitingAdvance') {
    throw new AppError(`Cannot create advance payment: Issue is currently in status "${issue.status}"`, 400);
  }

  const advancePaise = issue.fee?.advancePaise;
  if (!advancePaise || advancePaise <= 0) {
    throw new AppError('Invalid fee calculation: Advance amount is zero or not set', 400);
  }

  // If a pending order already exists for this issue, we can reuse it
  const existingPending = await Payment.findOne({
    issue: issue._id,
    user: userId,
    type: 'Advance',
    status: 'Pending',
  });

  if (existingPending) {
    logger.info(`Reusing existing pending advance payment order ${existingPending.paymentId} for Issue ${issue.issueCode}`);
    return existingPending;
  }

  const paymentId = `PAY-ADV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const payment = await Payment.create({
    paymentId,
    idempotencyKey: `order_${paymentId}`,
    issue: issue._id,
    user: userId,
    type: 'Advance',
    amountPaise: advancePaise,
    status: 'Pending',
  });

  logger.info(`Created Advance Payment order ${payment.paymentId} for Issue ${issue.issueCode} (Amount: ₹${advancePaise / 100})`);
  return payment;
};

/**
 * Creates a balance payment order for an issue in 'BalanceDue' status.
 *
 * @param {string} issueId
 * @param {string} userId
 * @returns {Promise<Payment>}
 */
export const createBalanceOrder = async (issueId, userId) => {
  const issue = await Issue.findById(issueId).populate('category');
  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  // Security check: Only the reporter can initiate balance payment
  if (issue.reporter.toString() !== userId.toString()) {
    throw new AppError('Civic issue not found', 404);
  }

  if (issue.status !== 'BalanceDue') {
    throw new AppError(`Cannot create balance payment: Issue is currently in status "${issue.status}". Expected status "BalanceDue".`, 400);
  }

  const balancePaise = issue.fee?.balancePaise;
  if (!balancePaise || balancePaise <= 0) {
    throw new AppError('Invalid fee calculation: Balance amount is zero or not set', 400);
  }

  // If a pending balance order already exists, reuse it
  const existingPending = await Payment.findOne({
    issue: issue._id,
    user: userId,
    type: 'Balance',
    status: 'Pending',
  });

  if (existingPending) {
    logger.info(`Reusing existing pending balance payment order ${existingPending.paymentId} for Issue ${issue.issueCode}`);
    return existingPending;
  }

  const paymentId = `PAY-BAL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const payment = await Payment.create({
    paymentId,
    idempotencyKey: `order_${paymentId}`,
    issue: issue._id,
    user: userId,
    type: 'Balance',
    amountPaise: balancePaise,
    status: 'Pending',
  });

  logger.info(`Created Balance Payment order ${payment.paymentId} for Issue ${issue.issueCode} (Amount: ₹${balancePaise / 100})`);
  return payment;
};

const supportsTransactions = async () => {
  try {
    const hello = await mongoose.connection.db.admin().command({ hello: 1 });
    return Boolean(hello.setName || hello.msg === 'isdbgrid');
  } catch {
    return false;
  }
};

/**
 * Confirms an advance payment order with strict idempotency and ACID multi-document transaction.
 *
 * @param {string} paymentId
 * @param {string} idempotencyKey - UUIDv4 from request header
 * @param {string} userId - Authenticated citizen
 * @param {import('mongoose').ClientSession | null} [externalSession=null]
 * @returns {Promise<{ payment: Payment, invoice: Invoice, issue: Issue, isReplay: boolean }>}
 */
export const confirmPayment = async (paymentId, idempotencyKey, userId, externalSession = null) => {
  if (!idempotencyKey) {
    throw new AppError('Idempotency-Key header is required', 400);
  }

  // 1. Idempotency Check: Look for existing completed payment with this idempotencyKey
  const existingCompleted = await Payment.findOne({
    idempotencyKey,
    status: 'Completed',
  });

  if (existingCompleted) {
    logger.info(`Idempotent replay detected for key ${idempotencyKey}. Returning existing payment ${existingCompleted.paymentId}`);
    const invoiceType = existingCompleted.type === 'Balance' ? 'Final' : 'Advance';
    const invoice = await Invoice.findOne({ issue: existingCompleted.issue, type: invoiceType });
    const issue = await Issue.findById(existingCompleted.issue);
    const payout = existingCompleted.type === 'Balance' ? await Payout.findOne({ issue: existingCompleted.issue }) : null;
    return {
      payment: existingCompleted,
      invoice,
      payout,
      issue,
      isReplay: true,
    };
  }

  // Check if this payment was already completed under another key or earlier
  const currentPayment = await Payment.findOne({ paymentId });
  if (!currentPayment) {
    throw new AppError('Payment order not found', 404);
  }

  if (currentPayment.user.toString() !== userId.toString()) {
    throw new AppError('Access denied: You do not own this payment order', 404);
  }

  if (currentPayment.status === 'Completed') {
    const invoiceType = currentPayment.type === 'Balance' ? 'Final' : 'Advance';
    const invoice = await Invoice.findOne({ issue: currentPayment.issue, type: invoiceType });
    const issue = await Issue.findById(currentPayment.issue);
    const payout = currentPayment.type === 'Balance' ? await Payout.findOne({ issue: currentPayment.issue }) : null;
    return {
      payment: currentPayment,
      invoice,
      payout,
      issue,
      isReplay: true,
    };
  }

  // 2. Transaction Execution
  const canUseTransactions = externalSession ? true : await supportsTransactions();
  const session = externalSession || (canUseTransactions ? await mongoose.startSession() : null);
  const isInternalSession = !externalSession && session !== null;

  if (isInternalSession) {
    session.startTransaction();
  }

  try {
    // Re-verify payment within session
    const paymentQuery = Payment.findOne({ paymentId });
    if (session) paymentQuery.session(session);
    const payment = await paymentQuery;
    if (!payment) {
      throw new AppError('Payment order not found', 404);
    }

    if (payment.status === 'Completed') {
      if (isInternalSession) {
        await session.commitTransaction();
        session.endSession();
      }
      const invoiceType = payment.type === 'Balance' ? 'Final' : 'Advance';
      const invoice = await Invoice.findOne({ issue: payment.issue, type: invoiceType });
      const issue = await Issue.findById(payment.issue);
      const payout = payment.type === 'Balance' ? await Payout.findOne({ issue: payment.issue }) : null;
      return { payment, invoice, payout, issue, isReplay: true };
    }

    if (payment.type === 'Balance') {
      // --- BALANCE PAYMENT CONFIRMATION BRANCH ---
      const issueQuery = Issue.findById(payment.issue).populate('category');
      if (session) issueQuery.session(session);
      const issue = await issueQuery;
      if (!issue) {
        throw new AppError('Issue not found', 404);
      }
      if (issue.status !== 'BalanceDue') {
        throw new AppError(
          `Cannot confirm balance payment: Issue is currently in status "${issue.status}". Expected status "BalanceDue".`,
          400
        );
      }

      // Update payment record
      payment.status = 'Completed';
      payment.idempotencyKey = idempotencyKey;
      payment.completedAt = new Date();
      payment.gatewayResponse = {
        provider: 'MockGateway',
        status: 'SUCCESS',
        authorizedAt: new Date().toISOString(),
      };
      await payment.save(session ? { session } : {});

      // Mark issue closed
      issue.status = 'Closed';
      issue.closedAt = new Date();
      issue.payoutStatus = 'Pending';
      issue.payments.balancePayment = payment._id;

      // Generate Invoice 2 (Final)
      const invoice = await invoiceService.createFinalInvoice(issue, payment, session);
      issue.payments.finalInvoice = invoice._id;
      await issue.save(session ? { session } : {});

      // Calculate commission & payout: Worked Vector 1 (₹860 / 86000 paise) produces commission of 8600 paise (₹86) and net payout of 77400 paise (₹774).
      const commissionPercent = issue.fee?.commissionPercent ?? 10;
      const totalPaise = issue.fee?.totalPaise || payment.amountPaise * 2;
      const commissionPaise = Math.round(totalPaise * (commissionPercent / 100));
      const netPayoutPaise = totalPaise - commissionPaise;

      const payoutData = {
        issue: issue._id,
        resolver: issue.assignedResolver,
        grossAmountPaise: totalPaise,
        commissionPercent,
        commissionPaise,
        netAmountPaise: netPayoutPaise,
        status: 'Pending',
      };
      const [payout] = await Payout.create([payoutData], session ? { session } : {});

      // Increment resolver pending payout & completed tasks count
      if (issue.assignedResolver) {
        await ResolverProfile.findByIdAndUpdate(
          issue.assignedResolver,
          {
            $inc: {
              pendingPayoutPaise: netPayoutPaise,
              completedTasksCount: 1,
            },
          },
          session ? { session } : {}
        );
      }

      // Audit Timeline logging
      const timelineOptions = session ? { session } : {};
      await IssueTimeline.create(
        [
          {
            issue: issue._id,
            fromStatus: 'BalanceDue',
            toStatus: 'Closed',
            action: 'ISSUE_CLOSED',
            actor: userId,
            actorRole: 'User',
            remarks: `Balance payment of ₹${(payment.amountPaise / 100).toFixed(2)} confirmed. Final invoice ${invoice.invoiceNumber} generated. Payout pending.`,
          },
        ],
        timelineOptions
      );

      if (isInternalSession) {
        await session.commitTransaction();
        session.endSession();
      }

      logger.info(`Successfully confirmed balance payment ${payment.paymentId} for Issue ${issue.issueCode}. Status updated to "Closed".`);

      // Post-transaction background notifications
      (async () => {
        try {
          const citizenUser = await User.findById(userId);
          const citizenEmail = citizenUser?.email || invoice.customerSnapshot?.email;

          if (citizenEmail) {
            const pdfBuffer = await invoiceService.generateInvoicePdfBuffer(invoice, issue);
            const trackingUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/user/issues/${issue._id}`;

            await emailService.sendMail({
              to: citizenEmail,
              subject: `Final Settlement & Invoice - ${issue.issueCode}`,
              html: finalReceiptTemplate({
                citizenName: citizenUser?.name || invoice.customerSnapshot?.name || 'Citizen',
                issueCode: issue.issueCode,
                issueTitle: issue.title,
                invoiceNumber: invoice.invoiceNumber,
                totalAmountFormatted: (totalPaise / 100).toFixed(2),
                issueUrl: trackingUrl,
              }),
              attachments: [
                {
                  filename: `Invoice-${invoice.invoiceNumber}.pdf`,
                  content: pdfBuffer,
                  contentType: 'application/pdf',
                },
              ],
            });
          }
        } catch (notifyErr) {
          logger.error(`Error sending balance payment confirmation email: ${notifyErr.message}`, { error: notifyErr });
        }
      })();

      return { payment, invoice, payout, issue, isReplay: false };
    }

    // --- ADVANCE PAYMENT CONFIRMATION BRANCH ---
    // Atomic conditional update on Issue: must be in 'AwaitingAdvance'
    const issue = await issueService.markAdvancePaid(payment.issue, payment._id, session);

    // Update payment record
    payment.status = 'Completed';
    payment.idempotencyKey = idempotencyKey;
    payment.completedAt = new Date();
    payment.gatewayResponse = {
      provider: 'MockGateway',
      status: 'SUCCESS',
      authorizedAt: new Date().toISOString(),
    };
    await payment.save(session ? { session } : {});

    // Generate Invoice 1 (Advance)
    const invoice = await invoiceService.createAdvanceInvoice(issue, payment, session);

    // Link advance invoice back to issue
    issue.payments.advanceInvoice = invoice._id;
    await issue.save(session ? { session } : {});

    // Audit Timeline logging
    const timelineOptions = session ? { session } : {};
    await IssueTimeline.create(
      [
        {
          issue: issue._id,
          fromStatus: 'AwaitingAdvance',
          toStatus: 'Submitted',
          action: 'ADVANCE_PAYMENT_CONFIRMED',
          actor: userId,
          actorRole: 'User',
          remarks: `Advance payment of ₹${(payment.amountPaise / 100).toFixed(2)} confirmed. Invoice generated: ${invoice.invoiceNumber}.`,
        },
      ],
      timelineOptions
    );

    if (isInternalSession) {
      await session.commitTransaction();
      session.endSession();
    }

    logger.info(`Successfully confirmed advance payment ${payment.paymentId} for Issue ${issue.issueCode}. Status updated to "Submitted".`);

    // 3. Post-transaction background notifications (non-blocking)
    (async () => {
      try {
        const citizenUser = await User.findById(userId);
        const citizenEmail = citizenUser?.email || invoice.customerSnapshot?.email;

        if (citizenEmail) {
          const pdfBuffer = await invoiceService.generateInvoicePdfBuffer(invoice, issue);
          const trackingUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/user/issues/${issue._id}`;

          await emailService.sendMail({
            to: citizenEmail,
            subject: `Advance Payment Confirmed - ${issue.issueCode}`,
            html: advanceReceiptTemplate({
              name: citizenUser?.name || invoice.customerSnapshot?.name || 'Citizen',
              issueCode: issue.issueCode,
              issueTitle: issue.title,
              invoiceNumber: invoice.invoiceNumber,
              amountPaidFormatted: (payment.amountPaise / 100).toFixed(2),
              balanceDueFormatted: ((issue.fee?.balancePaise || 0) / 100).toFixed(2),
              trackingUrl,
            }),
            attachments: [
              {
                filename: `Invoice-${invoice.invoiceNumber}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
              },
            ],
          });
        }

        // Notify Admins
        const admins = await User.find({ role: 'Admin' });
        const adminIssueUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/issues`;

        for (const admin of admins) {
          await emailService.sendMail({
            to: admin.email,
            subject: `New Civic Issue Submitted: ${issue.issueCode}`,
            html: adminNewIssueTemplate({
              adminName: admin.name || 'Admin',
              issueCode: issue.issueCode,
              issueTitle: issue.title,
              categoryName: issue.category?.name || 'Civic Issue',
              priority: issue.suggestedPriority,
              address: `${issue.address?.street}, ${issue.address?.city}`,
              totalFeeFormatted: ((issue.fee?.totalPaise || 0) / 100).toFixed(2),
              adminIssueUrl,
            }),
          });
        }
      } catch (notifyErr) {
        logger.error(`Error sending background payment confirmation emails: ${notifyErr.message}`, { error: notifyErr });
      }
    })();

    return {
      payment,
      invoice,
      issue,
      isReplay: false,
    };
  } catch (err) {
    if (isInternalSession) {
      await session.abortTransaction();
      session.endSession();
    }
    throw err;
  }
};

/**
 * Simulates a payment failure. The issue remains in 'AwaitingAdvance'.
 *
 * @param {string} paymentId
 * @param {string} reason
 * @param {string} userId
 * @returns {Promise<Payment>}
 */
export const failPayment = async (paymentId, reason, userId) => {
  const payment = await Payment.findOne({ paymentId });
  if (!payment) {
    throw new AppError('Payment order not found', 404);
  }

  if (payment.user.toString() !== userId.toString()) {
    throw new AppError('Access denied: You do not own this payment order', 404);
  }

  payment.status = 'Failed';
  payment.failureReason = reason || 'Payment was declined or failed in mock gateway';
  await payment.save();

  logger.warn(`Payment ${payment.paymentId} marked Failed. Reason: ${payment.failureReason}`);
  return payment;
};

/**
 * Records a payment refund.
 *
 * @param {string} paymentId
 * @param {string} reason
 * @param {import('mongoose').ClientSession | null} [session=null]
 * @returns {Promise<Payment>}
 */
export const refundPayment = async (paymentId, reason, session = null) => {
  const query = Payment.findOne({ paymentId });
  if (session) query.session(session);
  const payment = await query;

  if (!payment) {
    throw new AppError('Payment order not found', 404);
  }

  payment.status = 'Refunded';
  payment.failureReason = reason || 'Payment refunded';
  const options = session ? { session } : {};
  await payment.save(options);

  logger.info(`Payment ${payment.paymentId} has been refunded.`);
  return payment;
};

/**
 * Lists paginated payments for a citizen.
 *
 * @param {string} userId
 * @param {Object} options
 * @returns {Promise<{ payments: Array, meta: Object }>}
 */
export const listCitizenPayments = async (userId, { page = 1, limit = 10, status } = {}) => {
  const query = { user: userId };
  if (status && status !== 'All') {
    query.status = status;
  }

  const skip = (page - 1) * limit;
  const [payments, total] = await Promise.all([
    Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('issue', 'issueCode title fee status'),
    Payment.countDocuments(query),
  ]);

  return {
    payments,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Gets a payment order by paymentId for an authorized user.
 *
 * @param {string} paymentId
 * @param {string} userId
 * @returns {Promise<Payment>}
 */
export const getPaymentById = async (paymentId, userId) => {
  const payment = await Payment.findOne({ paymentId }).populate('issue', 'issueCode title fee status address');
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (payment.user.toString() !== userId.toString()) {
    throw new AppError('Payment not found', 404);
  }

  return payment;
};

export default {
  createAdvanceOrder,
  createBalanceOrder,
  confirmPayment,
  failPayment,
  refundPayment,
  listCitizenPayments,
  getPaymentById,
};

