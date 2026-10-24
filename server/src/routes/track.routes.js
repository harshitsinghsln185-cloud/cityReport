import { Router } from 'express';
import { trackLimiter } from '../middleware/rateLimiters.js';
import { trackIssue } from '../controllers/track.controller.js';

const router = Router();

// Anonymous public issue tracking (Rate limited: 30 requests/15 mins)
router.get('/:issueCode', trackLimiter, trackIssue);

export default router;
