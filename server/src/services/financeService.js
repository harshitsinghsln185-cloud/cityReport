import mongoose from 'mongoose';
import { Issue } from '../models/Issue.js';
import { Resolution } from '../models/Resolution.js';
import { Payment } from '../models/Payment.js';
import { Payout } from '../models/Payout.js';
import { Feedback } from '../models/Feedback.js';
import { ResolverProfile } from '../models/ResolverProfile.js';
import { IssueTimeline } from '../models/IssueTimeline.js';
import { User } from '../models/User.js';
import emailService from './emailService.js';
import balanceDueTemplate from '../templates/email/balanceDue.js';
import payoutPaidTemplate from '../templates/email/payoutPaid.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Administrative verification of resolution proof.
 * Moves issue from 'Resolved' to 'BalanceDue' and triggers citizen balance email.
 *
 * @param {string} issueId
 * @param {string} adminId
 * @returns {Promise<Issue>}
 */
export const verifyResolutionProof = async (issueId, adminId) => {
  const issue = await Issue.findById(issueId)
    .populate('category')
    .populate('reporter', 'name email phone');

  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  if (issue.status !== 'Resolved') {
    throw new AppError(`Cannot verify proof: Issue is in status "${issue.status}". Only Resolved issues can be verified.`, 400);
  }

  // Update status to BalanceDue
  issue.status = 'BalanceDue';
  await issue.save();

  // Create audit timeline log
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'Resolved',
    toStatus: 'BalanceDue',
    action: 'PROOF_VERIFIED_BY_ADMIN',
    actor: adminId,
    actorRole: 'Admin',
    remarks: 'Municipal administration verified completion proof and approved balance invoicing',
  });

  // Asynchronously dispatch Balance Due email to citizen
  (async () => {
    try {
      if (issue.reporter?.email) {
        const balanceFormatted = issue.fee?.balancePaise
          ? (issue.fee.balancePaise / 100).toFixed(2)
          : '0.00';
        const issueUrl = `${env.CLIENT_URL || 'http://localhost:5173'}/user/issues/${issue._id}`;

        await emailService.sendMail({
          to: issue.reporter.email,
          subject: `Balance Payment Due: ${issue.issueCode}`,
          html: balanceDueTemplate({
            citizenName: issue.reporter.name,
            issueCode: issue.issueCode,
            issueTitle: issue.title,
            balanceAmountFormatted: balanceFormatted,
            issueUrl,
          }),
        });
      }
    } catch (err) {
      logger.error(`Failed to send balance due notification for ${issue.issueCode}: ${err.message}`);
    }
  })();

  return issue;
};

/**
 * Administrative rework request on resolution proof.
 * Moves issue from 'Resolved' back to 'InProgress' and records rework history.
 *
 * @param {string} issueId
 * @param {string} remarks
 * @param {string} adminId
 * @returns {Promise<Issue>}
 */
export const requestTaskRework = async (issueId, remarks, adminId) => {
  if (!remarks || remarks.trim().length < 5) {
    throw new AppError('Rework remarks must be at least 5 characters long explaining why proof was rejected.', 400);
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  if (issue.status !== 'Resolved') {
    throw new AppError(`Cannot request rework: Issue is in status "${issue.status}". Only Resolved issues can have rework requested.`, 400);
  }

  const resolution = await Resolution.findOne({ issue: issue._id });
  if (!resolution) {
    throw new AppError('Resolution record not found for this issue.', 404);
  }

  // Push into rework history
  resolution.reworkHistory.push({
    requestedAt: new Date(),
    reason: remarks.trim(),
    requestedBy: adminId,
  });
  await resolution.save();

  // Transition issue back to InProgress
  issue.status = 'InProgress';
  await issue.save();

  // Create audit timeline log
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'Resolved',
    toStatus: 'InProgress',
    action: 'REWORK_REQUESTED',
    actor: adminId,
    actorRole: 'Admin',
    remarks: remarks.trim(),
  });

  return issue;
};

/**
 * Marks contractor payout as Paid, updating balances and sending confirmation email.
 *
 * @param {string} payoutId
 * @param {string} adminId
 * @returns {Promise<Payout>}
 */
export const markPayoutPaid = async (payoutId, adminId) => {
  const existingPayout = await Payout.findById(payoutId);
  if (!existingPayout) {
    throw new AppError('Payout record not found', 404);
  }

  if (existingPayout.status === 'Paid') {
    throw new AppError('Payout has already been marked as Paid and disbursed', 400);
  }

  // Atomic conditional update
  const payout = await Payout.findOneAndUpdate(
    { _id: payoutId, status: 'Pending' },
    {
      $set: {
        status: 'Paid',
        paidAt: new Date(),
        paidBy: adminId,
      },
    },
    { new: true }
  ).populate('issue');

  if (!payout) {
    throw new AppError('Failed to mark payout as Paid: concurrent update detected', 409);
  }

  // Update resolver profile financial aggregates atomically
  await ResolverProfile.findByIdAndUpdate(payout.resolver, {
    $inc: {
      pendingPayoutPaise: -payout.netAmountPaise,
      totalEarningsPaise: payout.netAmountPaise,
    },
  });

  // Update Issue payoutStatus
  if (payout.issue) {
    await Issue.findByIdAndUpdate(payout.issue._id || payout.issue, {
      $set: { payoutStatus: 'Paid' },
    });

    // Create audit timeline log
    await IssueTimeline.create({
      issue: payout.issue._id || payout.issue,
      fromStatus: 'Closed',
      toStatus: 'Closed',
      action: 'PAYOUT_DISBURSED',
      actor: adminId,
      actorRole: 'Admin',
      remarks: `Contractor payout of ₹${(payout.netAmountPaise / 100).toFixed(2)} disbursed by admin`,
    });
  }

  // Asynchronously send notification to resolver contractor
  (async () => {
    try {
      const resolver = await ResolverProfile.findById(payout.resolver).populate('user', 'name email');
      if (resolver?.user?.email) {
        const issue = payout.issue?.issueCode ? payout.issue : await Issue.findById(payout.issue);
        const earningsUrl = `${env.CLIENT_URL || 'http://localhost:5173'}/resolver/earnings`;

        await emailService.sendMail({
          to: resolver.user.email,
          subject: `Payout Disbursed: ₹${(payout.netAmountPaise / 100).toFixed(2)} for ${issue?.issueCode || 'Civic Issue'}`,
          html: payoutPaidTemplate({
            resolverName: resolver.user.name,
            issueCode: issue?.issueCode || 'N/A',
            grossAmountFormatted: (payout.grossAmountPaise / 100).toFixed(2),
            commissionFormatted: (payout.commissionPaise / 100).toFixed(2),
            netAmountFormatted: (payout.netAmountPaise / 100).toFixed(2),
            payoutId: payout._id.toString(),
            earningsUrl,
          }),
        });
      }
    } catch (err) {
      logger.error(`Failed to dispatch payout disbursed email: ${err.message}`);
    }
  })();

  return payout;
};

/**
 * Submits citizen feedback for a Closed civic issue.
 *
 * @param {Object} params
 * @param {string} params.issueId
 * @param {string} params.userId
 * @param {number} params.rating (1-5)
 * @param {string} [params.comments]
 * @returns {Promise<Feedback>}
 */
export const submitCitizenFeedback = async ({ issueId, userId, rating, comments }) => {
  const parsedRating = parseInt(rating, 10);
  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    throw new AppError('Rating must be an integer between 1 and 5 stars.', 400);
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  // Verify reporter ownership
  if (issue.reporter.toString() !== userId.toString()) {
    throw new AppError('Civic issue not found', 404);
  }

  if (issue.status !== 'Closed') {
    throw new AppError(`Feedback can only be submitted for Closed issues. Current status: "${issue.status}"`, 400);
  }

  if (issue.feedback) {
    throw new AppError('Feedback has already been submitted for this issue.', 400);
  }

  if (!issue.assignedResolver) {
    throw new AppError('Cannot submit feedback: Issue has no assigned contractor.', 400);
  }

  const feedback = await Feedback.create({
    issue: issue._id,
    resolver: issue.assignedResolver,
    citizen: userId,
    rating: parsedRating,
    comments: (comments || '').trim(),
  });

  issue.feedback = feedback._id;
  await issue.save();

  // Append timeline
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'Closed',
    toStatus: 'Closed',
    action: 'FEEDBACK_SUBMITTED',
    actor: userId,
    actorRole: 'User',
    remarks: `Citizen rated resolution ${parsedRating}/5 stars. ${comments ? `"${comments}"` : ''}`,
  });

  return feedback;
};

/**
 * Reopens a Closed civic issue under strict invariant:
 * Allowed ONLY if Payout is 'Pending'. Blocked with 400 Bad Request once Payout is 'Paid'.
 *
 * @param {string} issueId
 * @param {string} userId
 * @param {string} reason
 * @returns {Promise<Issue>}
 */
export const reopenClosedIssue = async (issueId, userId, reason) => {
  if (!reason || reason.trim().length < 5) {
    throw new AppError('Reopen reason must be at least 5 characters long.', 400);
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  // Reporter or Admin
  const isReporter = issue.reporter.toString() === userId.toString();
  const user = await User.findById(userId);
  const isAdmin = user?.role === 'Admin';

  if (!isReporter && !isAdmin) {
    throw new AppError('Civic issue not found', 404);
  }

  if (issue.status !== 'Closed') {
    throw new AppError(`Only Closed issues can be reopened. Current status: "${issue.status}"`, 400);
  }

  // Check Payout status invariant
  const payout = await Payout.findOne({ issue: issue._id });
  if (payout && payout.status === 'Paid') {
    throw new AppError('Issue cannot be reopened because contractor payout has already been disbursed.', 400);
  }

  // Allowed to reopen
  issue.status = 'Reopened';
  issue.reopenReason = reason.trim();
  issue.reopenCount = (issue.reopenCount || 0) + 1;
  await issue.save();

  // Append timeline
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'Closed',
    toStatus: 'Reopened',
    action: 'ISSUE_REOPENED',
    actor: userId,
    actorRole: isAdmin ? 'Admin' : 'User',
    remarks: `Issue reopened: ${reason.trim()}`,
  });

  return issue;
};

/**
 * Aggregates high-level financial overview metrics for administrators.
 *
 * @param {Object} [filters]
 * @param {Date|string} [filters.startDate]
 * @param {Date|string} [filters.endDate]
 * @returns {Promise<Object>}
 */
export const getFinancialAnalytics = async ({ startDate, endDate } = {}) => {
  const dateQuery = {};
  if (startDate) dateQuery.$gte = new Date(startDate);
  if (endDate) dateQuery.$lte = new Date(endDate);

  const paymentMatch = { status: 'Success' };
  const payoutMatch = {};
  if (Object.keys(dateQuery).length > 0) {
    paymentMatch.createdAt = dateQuery;
    payoutMatch.createdAt = dateQuery;
  }

  // 1. Total payments collected (Gross Revenue / GMV)
  const paymentStats = await Payment.aggregate([
    { $match: paymentMatch },
    {
      $group: {
        _id: '$type',
        totalPaise: { $sum: '$amountPaise' },
        count: { $sum: 1 },
      },
    },
  ]);

  let advanceCollectedPaise = 0;
  let balanceCollectedPaise = 0;
  let totalPaymentsCount = 0;

  paymentStats.forEach((stat) => {
    totalPaymentsCount += stat.count;
    if (stat._id === 'Advance') advanceCollectedPaise = stat.totalPaise;
    if (stat._id === 'Balance') balanceCollectedPaise = stat.totalPaise;
  });

  const totalGmvPaise = advanceCollectedPaise + balanceCollectedPaise;

  // 2. Payout analytics: Commission earned, Pending liabilities, Disbursed payouts
  const payoutStats = await Payout.aggregate([
    { $match: payoutMatch },
    {
      $group: {
        _id: '$status',
        totalGrossPaise: { $sum: '$grossAmountPaise' },
        totalCommissionPaise: { $sum: '$commissionPaise' },
        totalNetPaise: { $sum: '$netAmountPaise' },
        count: { $sum: 1 },
      },
    },
  ]);

  let pendingPayoutsPaise = 0;
  let pendingPayoutsCount = 0;
  let paidPayoutsPaise = 0;
  let paidPayoutsCount = 0;
  let totalCommissionEarnedPaise = 0;

  payoutStats.forEach((stat) => {
    totalCommissionEarnedPaise += stat.totalCommissionPaise;
    if (stat._id === 'Pending') {
      pendingPayoutsPaise = stat.totalNetPaise;
      pendingPayoutsCount = stat.count;
    }
    if (stat._id === 'Paid') {
      paidPayoutsPaise = stat.totalNetPaise;
      paidPayoutsCount = stat.count;
    }
  });

  // 3. Issue counts by status
  const issueCounts = await Issue.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const statusMap = {};
  issueCounts.forEach((c) => {
    statusMap[c._id] = c.count;
  });

  return {
    metrics: {
      gmvPaise: totalGmvPaise,
      gmvINR: (totalGmvPaise / 100).toFixed(2),
      advanceCollectedPaise,
      advanceCollectedINR: (advanceCollectedPaise / 100).toFixed(2),
      balanceCollectedPaise,
      balanceCollectedINR: (balanceCollectedPaise / 100).toFixed(2),
      commissionEarnedPaise: totalCommissionEarnedPaise,
      commissionEarnedINR: (totalCommissionEarnedPaise / 100).toFixed(2),
      pendingPayoutsPaise,
      pendingPayoutsINR: (pendingPayoutsPaise / 100).toFixed(2),
      paidPayoutsPaise,
      paidPayoutsINR: (paidPayoutsPaise / 100).toFixed(2),
      payoutCounts: {
        pending: pendingPayoutsCount,
        paid: paidPayoutsCount,
        total: pendingPayoutsCount + paidPayoutsCount,
      },
      paymentCounts: {
        total: totalPaymentsCount,
      },
      issueCounts: statusMap,
    },
  };
};

/**
 * Streams financial export CSV directly to HTTP response.
 * Columns: IssueCode,Category,GrossFeeINR,AdvanceINR,BalanceINR,CommissionINR,NetPayoutINR,Date
 *
 * @param {Object} res - Express response stream
 * @param {Object} [filters]
 */
export const exportFinanceCsvStream = async (res, { startDate, endDate } = {}) => {
  const matchQuery = {};
  const dateQuery = {};
  if (startDate) dateQuery.$gte = new Date(startDate);
  if (endDate) dateQuery.$lte = new Date(endDate);
  if (Object.keys(dateQuery).length > 0) {
    matchQuery.createdAt = dateQuery;
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="finance-overview.csv"');

  // CSV Header
  res.write('IssueCode,Category,GrossFeeINR,AdvanceINR,BalanceINR,CommissionINR,NetPayoutINR,Date\n');

  const cursor = Payout.find(matchQuery)
    .populate({
      path: 'issue',
      populate: { path: 'category', select: 'name' },
      select: 'issueCode fee category createdAt',
    })
    .sort({ createdAt: -1 })
    .cursor();

  for await (const p of cursor) {
    const issue = p.issue;
    const issueCode = issue?.issueCode || 'N/A';
    const category = issue?.category?.name || 'General';
    const grossFeeINR = (p.grossAmountPaise / 100).toFixed(2);
    const advanceINR = issue?.fee?.advancePaise
      ? (issue.fee.advancePaise / 100).toFixed(2)
      : '0.00';
    const balanceINR = issue?.fee?.balancePaise
      ? (issue.fee.balancePaise / 100).toFixed(2)
      : '0.00';
    const commissionINR = (p.commissionPaise / 100).toFixed(2);
    const netPayoutINR = (p.netAmountPaise / 100).toFixed(2);
    const date = p.createdAt ? p.createdAt.toISOString().split('T')[0] : '';

    const row = `"${issueCode}","${category}",${grossFeeINR},${advanceINR},${balanceINR},${commissionINR},${netPayoutINR},"${date}"\n`;
    res.write(row);
  }

  res.end();
};

/**
 * Paginated query for all municipal payments (Admin view).
 */
export const listAdminPayments = async ({ page = 1, limit = 20, type, status, search } = {}) => {
  const query = {};
  if (type) query.type = type;
  if (status) query.status = status;

  if (search) {
    query.$or = [
      { paymentId: { $regex: search, $options: 'i' } },
      { 'gateway.orderId': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Math.max(1, page) - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate('user', 'name email phone')
      .populate('issue', 'issueCode title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(query),
  ]);

  return {
    payments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Paginated query for all contractor payouts (Admin view).
 */
export const listAdminPayouts = async ({ page = 1, limit = 20, status } = {}) => {
  const query = {};
  if (status && status !== 'All') query.status = status;

  const skip = (Math.max(1, page) - 1) * limit;

  const [payouts, total] = await Promise.all([
    Payout.find(query)
      .populate({
        path: 'issue',
        select: 'issueCode title status resolvedAt closedAt',
      })
      .populate({
        path: 'resolver',
        populate: { path: 'user', select: 'name email phone' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payout.countDocuments(query),
  ]);

  return {
    payouts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieves the earnings ledger and balance summary for an authenticated contractor.
 *
 * @param {string} resolverId
 * @param {Object} [pagination]
 * @returns {Promise<Object>}
 */
export const getResolverEarningsLedger = async (resolverId, { page = 1, limit = 10 } = {}) => {
  const resolver = await ResolverProfile.findById(resolverId);
  if (!resolver) {
    throw new AppError('Resolver profile not found', 404);
  }

  const query = { resolver: resolverId };
  const skip = (Math.max(1, page) - 1) * limit;

  const [payouts, total] = await Promise.all([
    Payout.find(query)
      .populate('issue', 'issueCode title status resolvedAt closedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payout.countDocuments(query),
  ]);

  return {
    summary: {
      totalEarningsPaise: resolver.totalEarningsPaise,
      totalEarningsINR: (resolver.totalEarningsPaise / 100).toFixed(2),
      pendingPayoutPaise: resolver.pendingPayoutPaise,
      pendingPayoutINR: (resolver.pendingPayoutPaise / 100).toFixed(2),
      completedTasksCount: resolver.completedTasksCount,
    },
    payouts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

export default {
  verifyResolutionProof,
  requestTaskRework,
  markPayoutPaid,
  submitCitizenFeedback,
  reopenClosedIssue,
  getFinancialAnalytics,
  exportFinanceCsvStream,
  listAdminPayments,
  listAdminPayouts,
  getResolverEarningsLedger,
};
