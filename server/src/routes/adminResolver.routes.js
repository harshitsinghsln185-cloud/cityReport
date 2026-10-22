import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import adminResolverController from '../controllers/adminResolver.controller.js';

const router = Router();

// Strictly restricted to Administrator role
router.use(authenticate, authorize('Admin'));

// Inspection, signed URLs, and approval management
router.get('/', adminResolverController.listResolvers);
router.get('/:id', adminResolverController.getResolverById);
router.patch('/:id/approve', adminResolverController.approveResolver);
router.patch('/:id/reject', adminResolverController.rejectResolver);

export default router;
