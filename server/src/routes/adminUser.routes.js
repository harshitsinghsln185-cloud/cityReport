import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { listUsers, toggleBlockUser } from '../controllers/adminUser.controller.js';
import { getOverview } from '../controllers/adminDashboard.controller.js';

const router = Router();

// Strict Admin authorization across all admin user routes
router.use(authenticate, authorize('Admin'));

// System KPI and executive dashboard overview
router.get('/overview', getOverview);

// User directory list with filtering and search
router.get('/', listUsers);

// Toggle account block status
router.patch('/:id/block', toggleBlockUser);

export default router;
