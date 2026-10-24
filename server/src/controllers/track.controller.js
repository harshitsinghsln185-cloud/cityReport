import { Issue } from '../models/Issue.js';
import { IssueTimeline } from '../models/IssueTimeline.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

/**
 * Anonymous public issue tracking by issue code (e.g. CR-YYYY-XXXXXX).
 *
 * Privacy Invariant:
 * Strictly excludes citizen name, phone number, email, and exact street address.
 */
export const trackIssue = asyncHandler(async (req, res) => {
  const { issueCode } = req.params;

  if (!issueCode || typeof issueCode !== 'string' || issueCode.trim().length === 0) {
    throw new AppError('Issue tracking code is required', 400);
  }

  // Exact match with case insensitivity
  const issue = await Issue.findOne({
    issueCode: { $regex: new RegExp(`^${issueCode.trim()}$`, 'i') },
  })
    .select('issueCode title description status suggestedPriority address createdAt updatedAt category fee images')
    .populate('category', 'name slug');

  if (!issue) {
    throw new AppError(`No civic issue found with tracking code "${issueCode}". Please verify your reference number.`, 404);
  }

  // Fetch audit timeline (actions and state transitions)
  const timeline = await IssueTimeline.find({ issue: issue._id })
    .sort({ createdAt: 1 })
    .select('action fromStatus toStatus remarks createdAt actorRole');

  // Construct zero-PII public response payload
  const publicPayload = {
    issueCode: issue.issueCode,
    status: issue.status,
    title: issue.title,
    description: issue.description,
    category: {
      name: issue.category?.name || 'Civic Service',
      slug: issue.category?.slug || 'civic-service',
    },
    city: issue.address?.city || 'Municipal Ward',
    pincode: issue.address?.pincode ? issue.address.pincode.substring(0, 3) + '***' : '***',
    suggestedPriority: issue.suggestedPriority,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    imagesCount: issue.images?.length || 0,
    timeline: timeline.map((entry) => ({
      action: entry.action,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      remarks: entry.remarks,
      createdAt: entry.createdAt,
    })),
  };

  return sendSuccess(res, publicPayload, 'Issue tracking details retrieved successfully', 200);
});

export default {
  trackIssue,
};
