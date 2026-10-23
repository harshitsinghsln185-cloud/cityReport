import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  listIssues,
  getIssueDetails,
  updatePriority,
  getCandidates,
  assignResolver,
  rejectIssue,
  setManualQuote,
  verifyResolutionProof,
  requestRework,
} from '../controllers/adminIssue.controller.js';

const router = Router();

// Strict Admin authorization across all admin issue routes
router.use(authenticate, authorize('Admin'));

// List all issues with filters, search, and pagination
router.get('/', listIssues);

// Retrieve full administrative issue details
router.get('/:id', getIssueDetails);

// Override operational priority
router.patch('/:id/priority', updatePriority);

// Candidate resolver proximity search
router.get('/:id/candidates', getCandidates);

// Assign resolver to issue
router.patch('/:id/assign', assignResolver);

// Reject issue with automated refund
router.patch('/:id/reject', rejectIssue);

// Set manual quote for out-of-coverage issues
router.patch('/:id/manual-quote', setManualQuote);

// Verify contractor resolution proof -> status 'BalanceDue'
router.patch('/:id/verify', verifyResolutionProof);

// Request rework on resolution proof -> status 'InProgress'
router.patch('/:id/request-rework', requestRework);

export default router;
