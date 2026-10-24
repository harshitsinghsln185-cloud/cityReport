import { Router } from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate.js';
import { chatLimiter } from '../middleware/rateLimiters.js';
import { uploadSingleImage } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { postMessageSchema } from '../validators/chat.validator.js';
import {
  createSession,
  getSession,
  postMessage,
  attachImage,
  submitDraft,
} from '../controllers/chat.controller.js';

const router = Router();

// Rate limit all chat endpoints (15 req/min)
router.use(chatLimiter);

// 1. Initialize session (Public or Authenticated)
router.post('/sessions', optionalAuthenticate, createSession);

// 2. Fetch active session state (Public or Authenticated)
router.get('/sessions/:id', optionalAuthenticate, getSession);

// 3. Send conversational message (Public or Authenticated)
router.post(
  '/sessions/:id/messages',
  optionalAuthenticate,
  validate({ body: postMessageSchema }),
  postMessage
);

// 4. Attach photo to draft (Public or Authenticated)
router.post(
  '/sessions/:id/images',
  optionalAuthenticate,
  uploadSingleImage('image'),
  attachImage
);

// 5. Finalize and submit issue report (Strictly Authenticated)
router.post('/sessions/:id/submit', authenticate, submitDraft);

export default router;
