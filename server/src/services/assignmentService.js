import mongoose from 'mongoose';
import { Issue } from '../models/Issue.js';
import { ResolverProfile } from '../models/ResolverProfile.js';
import { Payment } from '../models/Payment.js';
import { IssueTimeline } from '../models/IssueTimeline.js';
import { User } from '../models/User.js';
import paymentService from './paymentService.js';
import emailService from './emailService.js';
import notificationService from './notificationService.js';
import issueAssignedTemplate from '../templates/email/issueAssigned.js';
import issueRejectedTemplate from '../templates/email/issueRejected.js';
import quoteReadyTemplate from '../templates/email/quoteReady.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

/**
 * Searches and returns approved candidate resolvers whose coverage radius includes the issue location
 * and whose skills match the issue category, ordered by distance.
 *
 * @param {string} issueId
 * @returns {Promise<Array<{ resolver: Object, distanceKm: number, activeTasksCount: number }>>}
 */
export const getCandidateResolvers = async (issueId) => {
  const issue = await Issue.findById(issueId).populate('category');
  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  const coordinates = issue.location?.coordinates;
  if (!coordinates || coordinates.length !== 2) {
    throw new AppError('Issue location coordinates are invalid or missing', 400);
  }

  const [lng, lat] = coordinates;
  const categoryId = issue.category?._id || issue.category;

  // Use $geoNear aggregation to find certified resolvers within their service territory
  const candidateProfiles = await ResolverProfile.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        distanceField: 'distanceMeters',
        spherical: true,
        query: {
          $or: [{ status: 'Approved' }, { approvalStatus: 'Approved' }],
          isAvailable: true,
          skills: new mongoose.Types.ObjectId(categoryId.toString()),
        },
      },
    },
    {
      $addFields: {
        distanceKm: { $round: [{ $divide: ['$distanceMeters', 1000] }, 1] },
      },
    },
    {
      $match: {
        $expr: {
          $lte: ['$distanceMeters', { $multiply: ['$serviceRadiusKm', 1000] }],
        },
      },
    },
    {
      $sort: { distanceMeters: 1 },
    },
  ]);

  // Populate user data and calculate active task count for each candidate
  const candidateIds = candidateProfiles.map((p) => p._id);
  const userIds = candidateProfiles.map((p) => p.user);

  const [users, activeTaskCounts] = await Promise.all([
    User.find({ _id: { $in: userIds } }).select('name email phone photo'),
    Issue.aggregate([
      {
        $match: {
          assignedResolver: { $in: candidateIds },
          status: { $in: ['Assigned', 'Accepted', 'InProgress'] },
        },
      },
      {
        $group: {
          _id: '$assignedResolver',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const userMap = new Map(users.map((u) => [u._id.toString(), u]));
  const countMap = new Map(activeTaskCounts.map((c) => [c._id.toString(), c.count]));

  return candidateProfiles.map((profile) => ({
    resolver: {
      ...profile,
      user: userMap.get(profile.user.toString()) || null,
    },
    distanceKm: profile.distanceKm,
    activeTasksCount: countMap.get(profile._id.toString()) || 0,
  }));
};

/**
 * Assigns an issue to a certified resolver with atomic conditional concurrency protection.
 * Throws 409 Conflict if another admin assigned the issue concurrently.
 *
 * @param {string} issueId
 * @param {string} resolverId
 * @param {string} adminId
 * @returns {Promise<Issue>}
 */
export const assignResolver = async (issueId, resolverId, adminId) => {
  const resolver = await ResolverProfile.findById(resolverId).populate('user');
  if (!resolver) {
    throw new AppError('Resolver profile not found', 404);
  }

  if (resolver.status !== 'Approved' && resolver.approvalStatus !== 'Approved') {
    throw new AppError('Cannot assign issue: Resolver is not approved by administration', 400);
  }

  // Atomic conditional update to guard against race conditions
  const issue = await Issue.findOneAndUpdate(
    {
      _id: issueId,
      status: { $in: ['Submitted', 'UnderReview', 'ReassignNeeded', 'Reopened'] },
    },
    {
      $set: {
        status: 'Assigned',
        assignedResolver: resolver._id,
        assignedAt: new Date(),
      },
    },
    { new: true }
  )
    .populate('category')
    .populate('reporter');

  if (!issue) {
    const existing = await Issue.findById(issueId);
    if (!existing) {
      throw new AppError('Civic issue not found', 404);
    }
    // Concurrent assignment collision
    throw new AppError(
      `Conflict: This issue is currently in status "${existing.status}" and cannot be assigned. It may have already been assigned by another administrator.`,
      409
    );
  }

  // Log timeline event
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'Submitted',
    toStatus: 'Assigned',
    action: 'ASSIGNED',
    actor: adminId,
    actorRole: 'Admin',
    remarks: `Assigned to contractor ${resolver.user?.name || 'Resolver'} (${resolver.serviceAddress}).`,
  });

  logger.info(`Admin ${adminId} assigned Issue ${issue.issueCode} to Resolver ${resolver.user?.name}`);

  // In-app alert & email dispatch to assigned resolver
  if (resolver.user?._id) {
    const taskUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/resolver/tasks`;
    notificationService
      .notify({
        recipientId: resolver.user._id,
        title: `New Task Assignment: ${issue.issueCode}`,
        message: `You have been assigned to ${issue.title} (${issue.address?.street}, ${issue.address?.city}).`,
        type: 'ASSIGNMENT',
        link: `/resolver/tasks/${issue._id}`,
        emailOptions: {
          to: resolver.user.email,
          template: 'issueAssigned',
          subject: `New Task Assignment: ${issue.issueCode}`,
          html: issueAssignedTemplate({
            resolverName: resolver.user.name,
            issueCode: issue.issueCode,
            issueTitle: issue.title,
            categoryName: issue.category?.name || 'Civic Issue',
            address: `${issue.address?.street}, ${issue.address?.city}`,
            priority: issue.finalPriority || issue.suggestedPriority,
            taskUrl,
          }),
        },
      })
      .catch((err) => logger.warn(`Issue assignment notification skipped: ${err.message}`));
  }

  return issue;
};

/**
 * Rejects an issue and executes an automated mock refund for the advance payment.
 *
 * @param {string} issueId
 * @param {string} reason
 * @param {string} adminId
 * @returns {Promise<{ issue: Issue, refundPayment: Payment | null }>}
 */
export const rejectIssue = async (issueId, reason, adminId) => {
  if (!reason || reason.trim().length < 5) {
    throw new AppError('Rejection reason must be at least 5 characters', 400);
  }

  // Atomic conditional update: status must be in rejectable state
  const issue = await Issue.findOneAndUpdate(
    {
      _id: issueId,
      status: { $in: ['Submitted', 'UnderReview', 'ReassignNeeded', 'AwaitingAdvance', 'AwaitingQuote'] },
    },
    {
      $set: {
        status: 'Rejected',
        rejectionReason: reason.trim(),
      },
    },
    { new: true }
  )
    .populate('category')
    .populate('reporter');

  if (!issue) {
    const existing = await Issue.findById(issueId);
    if (!existing) {
      throw new AppError('Civic issue not found', 404);
    }
    throw new AppError(`Cannot reject issue currently in status "${existing.status}"`, 400);
  }

  // Look for any completed advance payment that requires refunding
  let refundPayment = null;
  const advancePayment = await Payment.findOne({
    issue: issue._id,
    type: 'Advance',
    status: 'Completed',
  });

  if (advancePayment) {
    // Create Refund Payment record
    const refundPaymentId = `PAY-REF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    refundPayment = await Payment.create({
      paymentId: refundPaymentId,
      idempotencyKey: `refund_${advancePayment.paymentId}_${Date.now()}`,
      issue: issue._id,
      user: issue.reporter._id || issue.reporter,
      type: 'Refund',
      amountPaise: advancePayment.amountPaise,
      status: 'Completed',
      failureReason: `Issue rejected by administration: ${reason.trim()}`,
      completedAt: new Date(),
      gatewayResponse: {
        provider: 'MockGateway',
        status: 'REFUNDED',
        originalPaymentId: advancePayment.paymentId,
      },
    });

    advancePayment.status = 'Refunded';
    advancePayment.failureReason = reason.trim();
    await advancePayment.save();

    logger.info(`Issued mock refund ${refundPayment.paymentId} for Issue ${issue.issueCode} (₹${refundPayment.amountPaise / 100})`);
  }

  // Log timeline event
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'Submitted',
    toStatus: 'Rejected',
    action: 'REJECTED_BY_ADMIN',
    actor: adminId,
    actorRole: 'Admin',
    remarks: `Issue rejected. Reason: ${reason.trim()}${refundPayment ? `. Advance payment of ₹${refundPayment.amountPaise / 100} refunded.` : ''}`,
  });

  // In-app alert & email dispatch to citizen
  const citizenId = issue.reporter?._id || issue.reporter;
  if (citizenId) {
    notificationService
      .notify({
        recipientId: citizenId,
        title: `Issue Report Update: ${issue.issueCode}`,
        message: `Your issue report was rejected. Reason: ${reason.trim()}`,
        type: 'ISSUE',
        link: `/user/issues/${issue._id}`,
        emailOptions: {
          to: issue.reporter?.email,
          template: 'issueRejected',
          subject: `Update on Your Issue Report: ${issue.issueCode} (Rejected)`,
          html: issueRejectedTemplate({
            name: issue.reporter?.name || 'Citizen',
            issueCode: issue.issueCode,
            issueTitle: issue.title,
            reason: reason.trim(),
            refundAmountFormatted: refundPayment ? (refundPayment.amountPaise / 100).toFixed(2) : null,
          }),
        },
      })
      .catch((err) => logger.warn(`Issue rejection notification skipped: ${err.message}`));
  }

  return {
    issue,
    refundPayment,
  };
};

/**
 * Sets a manual fee quote for an issue in 'AwaitingQuote' status and moves it to 'AwaitingAdvance'.
 *
 * @param {string} issueId
 * @param {number} quotePaise - Integer paise quote amount
 * @param {string} adminId
 * @returns {Promise<Issue>}
 */
export const setManualQuote = async (issueId, quotePaise, adminId) => {
  if (!Number.isInteger(quotePaise) || quotePaise <= 0) {
    throw new AppError('Manual quote amount must be a positive integer in paise', 400);
  }

  const issue = await Issue.findById(issueId).populate('category').populate('reporter');
  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  if (issue.status !== 'AwaitingQuote') {
    throw new AppError(`Manual quote can only be set for issues in "AwaitingQuote" status (current: "${issue.status}")`, 400);
  }

  const advancePaise = Math.floor(quotePaise / 2);
  const balancePaise = quotePaise - advancePaise;

  issue.fee = {
    categoryBaseFeePaise: quotePaise,
    severityMultiplier: 1.0,
    distanceKm: 0,
    freeKm: 3,
    perKmRatePaise: 0,
    distanceFeePaise: 0,
    totalPaise: quotePaise,
    advancePaise,
    balancePaise,
    commissionPercent: 10,
    isManualQuote: true,
    manualQuoteSetBy: adminId,
  };

  issue.status = 'AwaitingAdvance';
  await issue.save();

  // Log timeline event
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'AwaitingQuote',
    toStatus: 'AwaitingAdvance',
    action: 'MANUAL_QUOTE_SET',
    actor: adminId,
    actorRole: 'Admin',
    remarks: `Manual fee quote established by administration: ₹${(quotePaise / 100).toFixed(2)} (Advance: ₹${(advancePaise / 100).toFixed(2)}).`,
  });

  logger.info(`Admin ${adminId} established manual fee quote of ₹${quotePaise / 100} for Issue ${issue.issueCode}`);

  // In-app alert & email dispatch to citizen
  const citizenId = issue.reporter?._id || issue.reporter;
  if (citizenId) {
    const checkoutUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/user/checkout/${issue._id}`;
    notificationService
      .notify({
        recipientId: citizenId,
        title: `Quote Ready: ${issue.issueCode}`,
        message: `A manual fee quote of ₹${(quotePaise / 100).toFixed(2)} has been prepared for your issue. Please review and pay advance.`,
        type: 'PAYMENT',
        link: `/user/checkout/${issue._id}`,
        emailOptions: {
          to: issue.reporter?.email,
          template: 'quoteReady',
          subject: `Quote Ready for Your Civic Issue: ${issue.issueCode}`,
          html: quoteReadyTemplate({
            name: issue.reporter?.name || 'Citizen',
            issueCode: issue.issueCode,
            issueTitle: issue.title,
            totalFeeFormatted: (quotePaise / 100).toFixed(2),
            advanceFeeFormatted: (advancePaise / 100).toFixed(2),
            checkoutUrl,
          }),
        },
      })
      .catch((err) => logger.warn(`Manual quote notification skipped: ${err.message}`));
  }

  return issue;
};

export default {
  getCandidateResolvers,
  assignResolver,
  rejectIssue,
  setManualQuote,
};
