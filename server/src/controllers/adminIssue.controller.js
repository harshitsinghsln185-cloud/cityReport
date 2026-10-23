import { Issue } from '../models/Issue.js';
import { IssueTimeline } from '../models/IssueTimeline.js';
import { Payment } from '../models/Payment.js';
import { Invoice } from '../models/Invoice.js';
import assignmentService from '../services/assignmentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * Lists all issues across the platform with filtering, search, and pagination.
 */
export const listIssues = asyncHandler(async (req, res) => {
  const { status, priority, search, page = 1, limit = 10 } = req.query;

  const query = {};

  if (status && status !== 'All') {
    query.status = status;
  }

  if (priority && priority !== 'All') {
    query.$or = [{ finalPriority: priority }, { suggestedPriority: priority }];
  }

  if (search && search.trim() !== '') {
    const s = search.trim();
    query.$or = [
      { issueCode: { $regex: s, $options: 'i' } },
      { title: { $regex: s, $options: 'i' } },
      { 'address.street': { $regex: s, $options: 'i' } },
      { 'address.city': { $regex: s, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [issues, total] = await Promise.all([
    Issue.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug icon baseFeePaise')
      .populate('reporter', 'name email phone photo')
      .populate({
        path: 'assignedResolver',
        populate: { path: 'user', select: 'name email phone photo' },
      }),
    Issue.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: issues,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

/**
 * Retrieves full administrative details for a specific issue.
 */
export const getIssueDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const issue = await Issue.findById(id)
    .populate('category')
    .populate('reporter', 'name email phone photo address')
    .populate({
      path: 'assignedResolver',
      populate: { path: 'user', select: 'name email phone photo' },
    })
    .populate('resolution')
    .populate('feedback');

  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  const [timeline, payments, invoices] = await Promise.all([
    IssueTimeline.find({ issue: issue._id })
      .sort({ createdAt: 1 })
      .populate('actor', 'name role'),
    Payment.find({ issue: issue._id }).sort({ createdAt: -1 }),
    Invoice.find({ issue: issue._id }).sort({ createdAt: -1 }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      issue,
      timeline,
      payments,
      invoices,
    },
  });
});

/**
 * Overrides / updates an issue's operational priority.
 */
export const updatePriority = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;

  if (!['Low', 'Medium', 'High', 'Critical'].includes(priority)) {
    throw new AppError('Priority must be one of Low, Medium, High, or Critical', 400);
  }

  const issue = await Issue.findById(id);
  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  const oldPriority = issue.finalPriority || issue.suggestedPriority;
  issue.finalPriority = priority;
  await issue.save();

  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: issue.status,
    toStatus: issue.status,
    action: 'PRIORITY_OVERRIDDEN',
    actor: req.user._id,
    actorRole: 'Admin',
    remarks: `Priority updated from ${oldPriority} to ${priority} by operations administrator.`,
  });

  res.status(200).json({
    success: true,
    message: `Issue priority updated to ${priority}`,
    data: issue,
  });
});

/**
 * Searches and returns nearby candidate resolvers matching the issue's category and coverage territory.
 */
export const getCandidates = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const candidates = await assignmentService.getCandidateResolvers(id);

  res.status(200).json({
    success: true,
    data: candidates,
  });
});

/**
 * Assigns an issue to a certified contractor with concurrency protection.
 */
export const assignResolver = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resolverId } = req.body;

  if (!resolverId) {
    throw new AppError('resolverId is required', 400);
  }

  const issue = await assignmentService.assignResolver(id, resolverId, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Resolver successfully assigned to issue',
    data: issue,
  });
});

/**
 * Rejects an issue and processes automated mock refund.
 */
export const rejectIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const result = await assignmentService.rejectIssue(id, reason, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Issue has been rejected and advance payment refunded',
    data: result,
  });
});

/**
 * Sets a manual fee quote for an issue in 'AwaitingQuote'.
 */
export const setManualQuote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quotePaise } = req.body;

  if (!quotePaise || typeof quotePaise !== 'number') {
    throw new AppError('quotePaise must be provided as a number', 400);
  }

  const issue = await assignmentService.setManualQuote(id, quotePaise, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Manual fee quote established successfully',
    data: issue,
  });
});

import financeService from '../services/financeService.js';

/**
 * Verifies resolution proof submitted by contractor.
 * Transitions issue Resolved -> BalanceDue.
 */
export const verifyResolutionProof = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const issue = await financeService.verifyResolutionProof(id, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Resolution proof verified successfully. Issue transitioned to BalanceDue.',
    data: issue,
  });
});

/**
 * Requests task rework from contractor with remarks.
 * Transitions issue Resolved -> InProgress.
 */
export const requestRework = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body;

  const issue = await financeService.requestTaskRework(id, remarks, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Task rework requested successfully. Issue returned to InProgress.',
    data: issue,
  });
});

export default {
  listIssues,
  getIssueDetails,
  updatePriority,
  getCandidates,
  assignResolver,
  rejectIssue,
  setManualQuote,
  verifyResolutionProof,
  requestRework,
};
