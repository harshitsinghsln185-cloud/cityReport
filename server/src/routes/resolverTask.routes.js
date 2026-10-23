import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { requireApprovedResolver } from '../middleware/requireApprovedResolver.js';
import { validate } from '../middleware/validate.js';
import { uploadResolutionProof } from '../middleware/upload.js';
import { rejectAssignmentSchema } from '../validators/resolution.validator.js';
import {
  listTasks,
  getTaskDetails,
  acceptTask,
  rejectTask,
  startTask,
  resolveTask,
  getDashboardSummary,
} from '../controllers/resolverTask.controller.js';

const router = Router();

// Strict Authentication and Approved Contractor Verification across all resolver task routes
router.use(authenticate, requireApprovedResolver);

// Contractor Dashboard summary KPIs & recent stream
router.get('/summary', getDashboardSummary);

// Paginated task queue with status filtering
router.get('/', listTasks);

// Detailed task view (privacy protected for Assigned status)
router.get('/:id', getTaskDetails);

// Accept assigned task offer
router.patch('/:id/accept', acceptTask);

// Decline assigned task offer with mandatory explanation
router.patch('/:id/reject', validate({ body: rejectAssignmentSchema }), rejectTask);

// Mark accepted task as In Progress
router.patch('/:id/start', startTask);

// Submit completion resolution proof (before & after photos, remarks)
router.post('/:id/resolve', uploadResolutionProof(), resolveTask);

export default router;
