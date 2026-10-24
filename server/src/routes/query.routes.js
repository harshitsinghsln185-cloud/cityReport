import { Router } from 'express';
import { queryLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.js';
import { createQuerySchema } from '../validators/query.validator.js';
import { submitQuery } from '../controllers/query.controller.js';

const router = Router();

// Public submission of contact inquiries (Rate limited: 10/hr)
router.post('/', queryLimiter, validate({ body: createQuerySchema }), submitQuery);

export default router;
