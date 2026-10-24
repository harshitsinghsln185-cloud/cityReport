import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { replyQuerySchema } from '../validators/query.validator.js';
import { getQueries, replyToQuery } from '../controllers/adminQuery.controller.js';

const router = Router();

// Strictly restrict all routes to Admin role
router.use(authenticate, authorize('Admin'));

// List all citizen inquiries
router.get('/', getQueries);

// Dispatch administrative reply
router.patch('/:id/reply', validate({ body: replyQuerySchema }), replyToQuery);

export default router;
