import { Query } from '../models/Query.js';
import emailQueue from '../services/emailQueue.js';
import queryReplyTemplate from '../templates/email/queryReply.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

/**
 * Lists all citizen queries for admin review with filtering and pagination.
 */
export const getQueries = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status && ['Pending', 'Replied'].includes(req.query.status)) {
    filter.status = req.query.status;
  }

  const [queries, total] = await Promise.all([
    Query.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('repliedBy', 'name email'),
    Query.countDocuments(filter),
  ]);

  const meta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };

  return sendPaginated(res, queries, meta, 200);
});

/**
 * Dispatches an administrative reply to a citizen inquiry and updates status.
 */
export const replyToQuery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  const query = await Query.findById(id);
  if (!query) {
    throw new AppError('Inquiry query record not found', 404);
  }

  query.reply = reply;
  query.status = 'Replied';
  query.repliedBy = req.user._id;
  query.repliedAt = new Date();
  await query.save();

  // Render and enqueue email to the inquirer
  const emailHtml = queryReplyTemplate({
    name: query.name,
    subject: query.subject,
    originalMessage: query.message,
    replyText: reply,
    repliedAt: query.repliedAt,
  });

  await emailQueue.enqueueEmail({
    to: query.email,
    template: 'queryReply',
    subject: `Re: ${query.subject} - Crowd Report Support`,
    html: emailHtml,
    metadata: {
      queryId: query._id,
      adminId: req.user._id,
    },
  });

  return sendSuccess(res, query, 'Administrative reply dispatched successfully', 200);
});

export default {
  getQueries,
  replyToQuery,
};
