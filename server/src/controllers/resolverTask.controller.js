import resolutionService from '../services/resolutionService.js';
import { Issue } from '../models/Issue.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * Lists tasks assigned to the authenticated resolver with status filtering and pagination.
 */
export const listTasks = asyncHandler(async (req, res) => {
  const resolverId = req.resolver._id;
  const { status, page, limit } = req.query;

  const result = await resolutionService.getResolverTasks(resolverId, status, { page, limit });

  res.status(200).json({
    success: true,
    data: result.tasks,
    meta: result.meta,
  });
});

/**
 * Retrieves single task details with privacy filtering.
 */
export const getTaskDetails = asyncHandler(async (req, res) => {
  const resolverId = req.resolver._id;
  const { id } = req.params;

  const result = await resolutionService.getTaskDetails(id, resolverId);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * Contractor accepts an assigned task. Unlocks citizen contact details.
 */
export const acceptTask = asyncHandler(async (req, res) => {
  const resolverId = req.resolver._id;
  const { id } = req.params;

  const issue = await resolutionService.acceptTask(id, resolverId, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Task accepted successfully. Citizen contact details unlocked.',
    data: issue,
  });
});

/**
 * Contractor declines an assigned task with a required explanation.
 */
export const rejectTask = asyncHandler(async (req, res) => {
  const resolverId = req.resolver._id;
  const { id } = req.params;
  const { reason } = req.body;

  const issue = await resolutionService.rejectAssignment(id, resolverId, reason, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Assignment declined and returned to operations triage queue.',
    data: issue,
  });
});

/**
 * Contractor marks work in progress.
 */
export const startTask = asyncHandler(async (req, res) => {
  const resolverId = req.resolver._id;
  const { id } = req.params;

  const issue = await resolutionService.startTask(id, resolverId, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Remediation work marked as In Progress.',
    data: issue,
  });
});

/**
 * Contractor submits before and after photographic proof and completion remarks.
 */
export const resolveTask = asyncHandler(async (req, res) => {
  const resolverId = req.resolver._id;
  const { id } = req.params;
  const { remarks } = req.body;

  const beforeFiles = req.files?.beforeImages || [];
  const afterFiles = req.files?.afterImages || [];

  if (!remarks || typeof remarks !== 'string' || remarks.trim().length < 10) {
    throw new AppError('Completion remarks must be at least 10 characters long', 400);
  }

  const result = await resolutionService.submitResolutionProof({
    taskId: id,
    resolverId,
    remarks: remarks.trim(),
    beforeFiles,
    afterFiles,
    userId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: 'Resolution proof successfully uploaded. Task transitioned to Resolved.',
    data: result,
  });
});

/**
 * Retrieves contractor dashboard overview metrics and recent assigned tasks.
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const resolverId = req.resolver._id;

  const [
    assignedOffersCount,
    activeTasksCount,
    completedTasksCount,
    recentTasks,
  ] = await Promise.all([
    Issue.countDocuments({ assignedResolver: resolverId, status: 'Assigned' }),
    Issue.countDocuments({ assignedResolver: resolverId, status: { $in: ['Accepted', 'InProgress'] } }),
    Issue.countDocuments({ assignedResolver: resolverId, status: { $in: ['Resolved', 'BalanceDue', 'Closed'] } }),
    Issue.find({ assignedResolver: resolverId })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('category', 'name slug icon baseFeePaise')
      .populate('reporter', 'name email phone photo'),
  ]);

  const sanitizedRecent = recentTasks.map((t) => resolutionService.sanitizeTaskPrivacy(t));

  res.status(200).json({
    success: true,
    data: {
      metrics: {
        assignedOffersCount,
        activeTasksCount,
        completedTasksCount,
        totalEarningsPaise: req.resolver.totalEarningsPaise || 0,
        pendingPayoutPaise: req.resolver.pendingPayoutPaise || 0,
      },
      recentTasks: sanitizedRecent,
    },
  });
});

export default {
  listTasks,
  getTaskDetails,
  acceptTask,
  rejectTask,
  startTask,
  resolveTask,
  getDashboardSummary,
};
