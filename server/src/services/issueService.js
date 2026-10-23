import { Issue } from '../models/Issue.js';
import { IssueTimeline } from '../models/IssueTimeline.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';
import feeService from './feeService.js';
import cloudinaryService from './cloudinaryService.js';
import sequence from '../utils/sequence.js';
import { validateImageBuffer } from '../utils/fileValidation.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

/**
 * Creates a new civic issue reported by a citizen.
 *
 * @param {Object} params
 * @param {string} params.reporterId
 * @param {string} params.categoryId
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} [params.suggestedPriority='Medium']
 * @param {string} params.contactNumber
 * @param {[number, number]} params.coordinates - [lng, lat]
 * @param {Object} params.address - { street, city, pincode }
 * @param {Array<Object>} [params.files=[]] - Multer file objects
 * @param {string} [params.source='form']
 * @returns {Promise<{ issue: Object, quote: Object | null }>}
 */
export const createIssue = async ({
  reporterId,
  categoryId,
  title,
  description,
  suggestedPriority = 'Medium',
  contactNumber,
  coordinates,
  address,
  files = [],
  source = 'form',
}) => {
  const reporter = await User.findById(reporterId);
  if (!reporter) {
    throw new AppError('Reporter user not found', 404);
  }

  const category = await Category.findById(categoryId);
  if (!category || !category.isActive) {
    throw new AppError('Civic service category not found or inactive', 404);
  }

  // 1. Calculate fee quote and discover nearest certified resolver
  const quoteResult = await feeService.calculateQuote({
    categoryId,
    coordinates,
    suggestedPriority,
    description,
  });

  // 2. Determine initial status and snapshot fee
  let initialStatus = 'AwaitingAdvance';
  let feeSnapshot;

  if (quoteResult.hasEligibleResolver && quoteResult.fee) {
    initialStatus = 'AwaitingAdvance';
    feeSnapshot = quoteResult.fee;
  } else {
    // If no eligible resolver found within radius, issue is routed to AwaitingQuote
    initialStatus = 'AwaitingQuote';
    feeSnapshot = {
      categoryBaseFeePaise: 0,
      severityMultiplier: 1.0,
      distanceKm: 0,
      freeKm: 3,
      perKmRatePaise: 1500,
      distanceFeePaise: 0,
      totalPaise: 0,
      advancePaise: 0,
      balancePaise: 0,
      commissionPercent: 10,
      isManualQuote: true,
      manualQuoteSetBy: null,
    };
  }

  // 3. Generate atomic sequential issue code: CR-YYYY-XXXXXX
  const issueCode = await sequence.generateIssueCode();

  // 4. Create Issue document
  const issue = new Issue({
    issueCode,
    reporter: reporterId,
    category: categoryId,
    title,
    description,
    suggestedPriority,
    location: {
      type: 'Point',
      coordinates, // [lng, lat]
    },
    address,
    contactNumber,
    status: initialStatus,
    source,
    aiAssessment: quoteResult.aiAssessment || null,
    fee: feeSnapshot,
  });

  // 5. Upload attached images to Cloudinary (crowd-report/<env>/issues/<issueId>)
  if (files && files.length > 0) {
    const uploadedImages = [];
    const uploadFolder = `crowd-report/${env.NODE_ENV}/issues/${issue._id}`;

    for (const file of files) {
      if (!file.buffer) continue;
      const validation = validateImageBuffer(file.buffer);
      if (validation.isValid) {
        const asset = await cloudinaryService.uploadStream(file.buffer, {
          folder: uploadFolder,
          format: validation.format,
          access_type: 'public',
        });
        uploadedImages.push(asset);
      }
    }
    issue.images = uploadedImages;
  }

  await issue.save();

  // 6. Record initial audit log in IssueTimeline
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: '(new)',
    toStatus: initialStatus,
    action: 'CREATED',
    actor: reporterId,
    actorRole: 'User',
    remarks:
      initialStatus === 'AwaitingAdvance'
        ? `Issue created with automated fee quote of ₹${feeSnapshot.totalPaise / 100}.`
        : 'Issue created; routed to admin for manual fee quote (no certified resolver in coverage radius).',
  });

  return {
    issue,
    quote: quoteResult.fee,
  };
};

/**
 * Retrieves a single issue by ID or issueCode with privacy safeguards.
 * Enforces that citizens can only access their own issues (returns 404 on violation).
 *
 * @param {string} issueId - MongoDB ObjectId or issueCode
 * @param {Object} user - Authenticated user object
 * @returns {Promise<{ issue: Object, timeline: Array }>}
 */
export const getIssueById = async (issueId, user) => {
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(issueId);
  const query = isMongoId ? { _id: issueId } : { issueCode: issueId };

  const issue = await Issue.findOne(query)
    .populate('reporter', 'name email phone photo')
    .populate('category', 'name slug description icon baseFeePaise')
    .populate({
      path: 'assignedResolver',
      populate: { path: 'user', select: 'name email phone photo' },
    })
    .populate('resolution')
    .populate('feedback')
    .populate('payments.advanceInvoice')
    .populate('payments.finalInvoice');

  if (!issue) {
    throw new AppError('Civic issue not found', 404);
  }

  // Privacy Check: Citizen A cannot view Citizen B's issue
  if (
    user.role === 'User' &&
    issue.reporter._id.toString() !== user._id.toString()
  ) {
    throw new AppError('Civic issue not found', 404);
  }

  const timeline = await IssueTimeline.find({ issue: issue._id })
    .sort({ createdAt: 1 })
    .populate('actor', 'name role');

  return {
    issue,
    timeline,
  };
};

/**
 * Lists paginated issues reported by a specific citizen.
 *
 * @param {string} userId
 * @param {Object} options
 * @returns {Promise<{ issues: Array, meta: Object }>}
 */
export const listCitizenIssues = async (
  userId,
  { status, page = 1, limit = 10, search = '' }
) => {
  const query = { reporter: userId };

  if (status && status !== 'All') {
    query.status = status;
  }

  if (search && search.trim() !== '') {
    const s = search.trim();
    query.$or = [
      { title: { $regex: s, $options: 'i' } },
      { issueCode: { $regex: s, $options: 'i' } },
      { 'address.street': { $regex: s, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [issues, total] = await Promise.all([
    Issue.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug icon baseFeePaise')
      .populate('reporter', 'name email phone'),
    Issue.countDocuments(query),
  ]);

  return {
    issues,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Cancels an issue awaiting payment or quote.
 *
 * @param {string} issueId
 * @param {string} userId
 * @returns {Promise<Object>} Updated Issue
 */
export const cancelIssue = async (issueId, userId) => {
  const issue = await Issue.findById(issueId);

  if (!issue || issue.reporter.toString() !== userId.toString()) {
    throw new AppError('Civic issue not found', 404);
  }

  if (issue.status !== 'AwaitingAdvance' && issue.status !== 'AwaitingQuote') {
    throw new AppError(
      `Cannot cancel issue in '${issue.status}' status. Only unpaid issues awaiting advance payment or quote can be cancelled.`,
      400
    );
  }

  const priorStatus = issue.status;
  issue.status = 'Cancelled';
  await issue.save();

  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: priorStatus,
    toStatus: 'Cancelled',
    action: 'CANCELLED',
    actor: userId,
    actorRole: 'User',
    remarks: 'Issue cancelled by citizen.',
  });

  return issue;
};

/**
 * Transaction hook to transition an issue from 'AwaitingAdvance' to 'Submitted'
 * when advance payment is confirmed.
 *
 * @param {string} issueId
 * @param {string} paymentId
 * @param {import('mongoose').ClientSession} session
 * @returns {Promise<Object>}
 */
export const markAdvancePaid = async (issueId, paymentId, session = null) => {
  const query = Issue.findOneAndUpdate(
    { _id: issueId, status: 'AwaitingAdvance' },
    {
      $set: {
        status: 'Submitted',
        'payments.advancePayment': paymentId,
      },
    },
    { new: true }
  ).populate('category');

  if (session) {
    query.session(session);
  }

  const issue = await query;
  if (!issue) {
    throw new AppError('Issue is not in AwaitingAdvance status or does not exist', 400);
  }

  return issue;
};

export default {
  createIssue,
  getIssueById,
  listCitizenIssues,
  cancelIssue,
  markAdvancePaid,
};
