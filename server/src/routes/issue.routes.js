import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { uploadMultipleImages } from '../middleware/upload.js';
import issueController from '../controllers/issue.controller.js';

const router = Router();

// Citizen creates civic issue with up to 5 photos
router.post(
  '/',
  authenticate,
  uploadMultipleImages('images', 5),
  issueController.create
);

// Citizen estimates live fee quote before submitting
router.post('/estimate-quote', authenticate, issueController.estimateQuote);

// Citizen lists their own issues
router.get('/', authenticate, issueController.list);

// Single issue details and timeline
router.get('/:id', authenticate, issueController.getById);

// Citizen cancels unpaid issue
router.patch('/:id/cancel', authenticate, issueController.cancel);

// Citizen submits feedback on Closed issue
router.post('/:id/feedback', authenticate, issueController.submitFeedback);

// Citizen reopens Closed issue (only allowed while payout is Pending)
router.post('/:id/reopen', authenticate, issueController.reopen);

export default router;
