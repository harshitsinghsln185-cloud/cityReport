import { Issue } from '../models/Issue.js';
import { Resolution } from '../models/Resolution.js';
import { IssueTimeline } from '../models/IssueTimeline.js';
import { ResolverProfile } from '../models/ResolverProfile.js';
import { User } from '../models/User.js';
import cloudinaryService from './cloudinaryService.js';
import emailService from './emailService.js';
import resolverAcceptedTemplate from '../templates/email/resolverAccepted.js';
import assignmentRejectedTemplate from '../templates/email/assignmentRejected.js';
import issueResolvedTemplate from '../templates/email/issueResolved.js';
import { validateImageBuffer } from '../utils/fileValidation.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Sanitizes issue document to respect citizen privacy rules:
 * In 'Assigned' status, phone numbers and street details are hidden until accepted.
 */
export const sanitizeTaskPrivacy = (issueDoc) => {
  if (!issueDoc) return null;
  const obj = typeof issueDoc.toObject === 'function' ? issueDoc.toObject() : { ...issueDoc };

  if (obj.status === 'Assigned') {
    delete obj.contactNumber;
    if (obj.reporter) {
      obj.reporter = {
        _id: obj.reporter._id,
        name: obj.reporter.name,
      };
    }
    if (obj.address) {
      obj.address = {
        city: obj.address.city,
        pincode: obj.address.pincode,
      };
    }
  }

  return obj;
};

/**
 * Retrieves paginated list of tasks assigned to a specific resolver contractor.
 *
 * @param {string} resolverId - ResolverProfile ObjectId
 * @param {string} [statusFilter] - Optional status filter
 * @param {Object} [pagination] - { page, limit }
 */
export const getResolverTasks = async (resolverId, statusFilter, { page = 1, limit = 10 } = {}) => {
  const query = { assignedResolver: resolverId };

  if (statusFilter && statusFilter !== 'All') {
    if (statusFilter === 'Active') {
      query.status = { $in: ['Accepted', 'InProgress'] };
    } else if (statusFilter === 'Completed') {
      query.status = { $in: ['Resolved', 'BalanceDue', 'Closed'] };
    } else {
      query.status = statusFilter;
    }
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Issue.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug icon baseFeePaise')
      .populate('reporter', 'name email phone photo')
      .populate('resolution'),
    Issue.countDocuments(query),
  ]);

  const sanitizedTasks = tasks.map((t) => sanitizeTaskPrivacy(t));

  return {
    tasks: sanitizedTasks,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

/**
 * Retrieves detailed information for a single task assigned to the resolver.
 * Enforces ownership check: returns 404 if issue does not exist or is not assigned to this resolver.
 *
 * @param {string} taskId - Issue ObjectId
 * @param {string} resolverId - ResolverProfile ObjectId
 */
export const getTaskDetails = async (taskId, resolverId) => {
  const issue = await Issue.findById(taskId)
    .populate('category')
    .populate('reporter', 'name email phone photo address')
    .populate('resolution');

  if (!issue) {
    throw new AppError('Task not found', 404);
  }

  // Strict ownership check: only assigned contractor may access task details
  if (!issue.assignedResolver || issue.assignedResolver.toString() !== resolverId.toString()) {
    throw new AppError('Task not found or not assigned to you', 404);
  }

  const timeline = await IssueTimeline.find({ issue: issue._id })
    .sort({ createdAt: 1 })
    .populate('actor', 'name role');

  const sanitized = sanitizeTaskPrivacy(issue);

  return {
    task: sanitized,
    timeline,
  };
};

/**
 * Contractor accepts an assigned task.
 * Unlocks citizen contact information, moves status to 'Accepted', and notifies citizen.
 *
 * @param {string} taskId
 * @param {string} resolverId
 * @param {string} userId - AuthUser ObjectId for timeline attribution
 */
export const acceptTask = async (taskId, resolverId, userId) => {
  const existingIssue = await Issue.findById(taskId);
  if (!existingIssue) {
    throw new AppError('Task not found', 404);
  }

  if (!existingIssue.assignedResolver || existingIssue.assignedResolver.toString() !== resolverId.toString()) {
    throw new AppError('Task not found or not assigned to you', 404);
  }

  // Atomic conditional update
  const issue = await Issue.findOneAndUpdate(
    { _id: taskId, status: 'Assigned', assignedResolver: resolverId },
    { $set: { status: 'Accepted', acceptedAt: new Date() } },
    { new: true }
  )
    .populate('category')
    .populate('reporter', 'name email phone');

  if (!issue) {
    throw new AppError(
      `Cannot accept task: Issue is currently in status "${existingIssue.status}". Only tasks in "Assigned" status can be accepted.`,
      400
    );
  }

  // Append timeline record
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'Assigned',
    toStatus: 'Accepted',
    action: 'TASK_ACCEPTED',
    actor: userId,
    actorRole: 'Resolver',
    remarks: 'Contractor accepted assignment and reviewed incident details.',
  });

  // Dispatch email notification to citizen (asynchronous)
  (async () => {
    try {
      const resolver = await ResolverProfile.findById(resolverId).populate('user', 'name phone');
      if (issue.reporter?.email) {
        const issueUrl = `${env.CLIENT_URL || 'http://localhost:5173'}/user/issues/${issue._id}`;
        await emailService.sendMail({
          to: issue.reporter.email,
          subject: `Task Accepted: ${issue.issueCode}`,
          html: resolverAcceptedTemplate({
            citizenName: issue.reporter.name,
            issueCode: issue.issueCode,
            issueTitle: issue.title,
            resolverName: resolver?.user?.name || 'Assigned Contractor',
            resolverPhone: resolver?.user?.phone || '',
            issueUrl,
          }),
        });
      }
    } catch (err) {
      logger.error(`Error sending task acceptance notification: ${err.message}`);
    }
  })();

  return issue;
};

/**
 * Contractor declines an assigned task with a required explanation.
 * Transitions issue status to 'ReassignNeeded', clears assignedResolver, and alerts admin.
 *
 * @param {string} taskId
 * @param {string} resolverId
 * @param {string} reason
 * @param {string} userId - AuthUser ObjectId for timeline attribution
 */
export const rejectAssignment = async (taskId, resolverId, reason, userId) => {
  const existingIssue = await Issue.findById(taskId);
  if (!existingIssue) {
    throw new AppError('Task not found', 404);
  }

  if (!existingIssue.assignedResolver || existingIssue.assignedResolver.toString() !== resolverId.toString()) {
    throw new AppError('Task not found or not assigned to you', 404);
  }

  const issue = await Issue.findOneAndUpdate(
    { _id: taskId, status: 'Assigned', assignedResolver: resolverId },
    {
      $set: {
        status: 'ReassignNeeded',
        assignedResolver: null,
        rejectionReason: reason,
      },
    },
    { new: true }
  ).populate('category');

  if (!issue) {
    throw new AppError(
      `Cannot decline assignment: Issue is currently in status "${existingIssue.status}". Only tasks in "Assigned" status can be declined.`,
      400
    );
  }

  // Append timeline record
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'Assigned',
    toStatus: 'ReassignNeeded',
    action: 'ASSIGNMENT_DECLINED',
    actor: userId,
    actorRole: 'Resolver',
    remarks: `Contractor declined assignment. Reason: ${reason}`,
  });

  // Alert admin for re-triage (asynchronous)
  (async () => {
    try {
      const resolver = await ResolverProfile.findById(resolverId).populate('user', 'name');
      const triageUrl = `${env.CLIENT_URL || 'http://localhost:5173'}/admin/issues/${issue._id}`;
      await emailService.sendMail({
        to: env.ADMIN_EMAIL,
        subject: `Action Required: Assignment Declined for ${issue.issueCode}`,
        html: assignmentRejectedTemplate({
          issueCode: issue.issueCode,
          issueTitle: issue.title,
          resolverName: resolver?.user?.name || 'Contractor',
          declineReason: reason,
          triageUrl,
        }),
      });
    } catch (err) {
      logger.error(`Error sending assignment decline alert: ${err.message}`);
    }
  })();

  return issue;
};

/**
 * Contractor marks work in progress.
 * Moves status from 'Accepted' to 'InProgress'.
 *
 * @param {string} taskId
 * @param {string} resolverId
 * @param {string} userId - AuthUser ObjectId
 */
export const startTask = async (taskId, resolverId, userId) => {
  const existingIssue = await Issue.findById(taskId);
  if (!existingIssue) {
    throw new AppError('Task not found', 404);
  }

  if (!existingIssue.assignedResolver || existingIssue.assignedResolver.toString() !== resolverId.toString()) {
    throw new AppError('Task not found or not assigned to you', 404);
  }

  const issue = await Issue.findOneAndUpdate(
    { _id: taskId, status: 'Accepted', assignedResolver: resolverId },
    { $set: { status: 'InProgress', startedAt: new Date() } },
    { new: true }
  ).populate('category reporter');

  if (!issue) {
    throw new AppError(
      `Cannot start work: Issue is currently in status "${existingIssue.status}". Only tasks in "Accepted" status can be started.`,
      400
    );
  }

  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'Accepted',
    toStatus: 'InProgress',
    action: 'WORK_STARTED',
    actor: userId,
    actorRole: 'Resolver',
    remarks: 'Contractor commenced physical on-site remediation work.',
  });

  return issue;
};

/**
 * Contractor submits resolution proof (before & after photos, remarks).
 * Moves status from 'InProgress' to 'Resolved' and stores Resolution document.
 *
 * @param {Object} params
 * @param {string} params.taskId
 * @param {string} params.resolverId
 * @param {string} params.remarks
 * @param {Array<Object>} [params.beforeFiles]
 * @param {Array<Object>} params.afterFiles
 * @param {string} params.userId
 */
export const submitResolutionProof = async ({
  taskId,
  resolverId,
  remarks,
  beforeFiles = [],
  afterFiles = [],
  userId,
}) => {
  // 1. Mandatory after-photo invariant
  if (!afterFiles || afterFiles.length === 0) {
    throw new AppError('At least one after-repair proof photo is required to resolve a task.', 400);
  }

  // 2. Magic bytes binary validation on all files
  const allFiles = [...beforeFiles, ...afterFiles];
  for (const file of allFiles) {
    const check = validateImageBuffer(file.buffer);
    if (!check.isValid) {
      throw new AppError(
        `Invalid image file signature for '${file.originalname}'. Only authentic JPEG, PNG, and WebP images are allowed.`,
        400
      );
    }
  }

  // 3. Issue and state pre-check
  const existingIssue = await Issue.findById(taskId).populate('reporter');
  if (!existingIssue) {
    throw new AppError('Task not found', 404);
  }

  if (!existingIssue.assignedResolver || existingIssue.assignedResolver.toString() !== resolverId.toString()) {
    throw new AppError('Task not found or not assigned to you', 404);
  }

  if (existingIssue.status !== 'InProgress') {
    throw new AppError(
      `Cannot submit resolution proof: Issue is currently in status "${existingIssue.status}". Proof can only be submitted for tasks in "InProgress" status.`,
      400
    );
  }

  // 4. Cloudinary Stream Uploads to folder `crowd-report/<env>/resolutions/<issueId>`
  const folder = `crowd-report/${env.NODE_ENV}/resolutions/${taskId}`;

  const beforeUploadPromises = beforeFiles.map((f, i) =>
    cloudinaryService.uploadStream(f.buffer, {
      folder,
      public_id: `before_${Date.now()}_${i}`,
      access_type: 'public',
    })
  );

  const afterUploadPromises = afterFiles.map((f, i) =>
    cloudinaryService.uploadStream(f.buffer, {
      folder,
      public_id: `after_${Date.now()}_${i}`,
      access_type: 'public',
    })
  );

  const [beforeImages, afterImages] = await Promise.all([
    Promise.all(beforeUploadPromises),
    Promise.all(afterUploadPromises),
  ]);

  // 5. Create Resolution Record
  const resolution = await Resolution.create({
    issue: taskId,
    resolver: resolverId,
    beforeImages,
    afterImages,
    remarks,
    submittedAt: new Date(),
  });

  // 6. Update Issue Status to 'Resolved'
  const issue = await Issue.findOneAndUpdate(
    { _id: taskId, status: 'InProgress', assignedResolver: resolverId },
    {
      $set: {
        status: 'Resolved',
        resolvedAt: new Date(),
        resolution: resolution._id,
      },
    },
    { new: true }
  )
    .populate('category')
    .populate('reporter', 'name email phone');

  // 7. Append audit timeline entry
  await IssueTimeline.create({
    issue: issue._id,
    fromStatus: 'InProgress',
    toStatus: 'Resolved',
    action: 'PROOF_SUBMITTED',
    actor: userId,
    actorRole: 'Resolver',
    remarks: `Repair completed. ${remarks} (${afterImages.length} after photo(s) submitted)`,
  });

  // 8. Notifications to Citizen and Administrator (asynchronous)
  (async () => {
    try {
      const resolver = await ResolverProfile.findById(resolverId).populate('user', 'name');
      const citizenUrl = `${env.CLIENT_URL || 'http://localhost:5173'}/user/issues/${issue._id}`;
      const adminUrl = `${env.CLIENT_URL || 'http://localhost:5173'}/admin/issues/${issue._id}`;

      // Notify citizen
      if (issue.reporter?.email) {
        await emailService.sendMail({
          to: issue.reporter.email,
          subject: `Repairs Completed: ${issue.issueCode}`,
          html: issueResolvedTemplate({
            recipientName: issue.reporter.name,
            issueCode: issue.issueCode,
            issueTitle: issue.title,
            resolverName: resolver?.user?.name || 'Contractor',
            remarks,
            viewUrl: citizenUrl,
            isCitizen: true,
          }),
        });
      }

      // Notify admin
      await emailService.sendMail({
        to: env.ADMIN_EMAIL,
        subject: `Completion Proof Uploaded: ${issue.issueCode}`,
        html: issueResolvedTemplate({
          recipientName: 'Operations Administrator',
          issueCode: issue.issueCode,
          issueTitle: issue.title,
          resolverName: resolver?.user?.name || 'Contractor',
          remarks,
          viewUrl: adminUrl,
          isCitizen: false,
        }),
      });
    } catch (err) {
      logger.error(`Error sending issue resolution notifications: ${err.message}`);
    }
  })();

  return {
    issue,
    resolution,
  };
};

export default {
  sanitizeTaskPrivacy,
  getResolverTasks,
  getTaskDetails,
  acceptTask,
  rejectAssignment,
  startTask,
  submitResolutionProof,
};
