import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import categoryController from '../controllers/category.controller.js';
import feeSettingsController from '../controllers/feeSettings.controller.js';
import { getOverview } from '../controllers/adminDashboard.controller.js';
import {
  createCategorySchema,
  updateCategorySchema,
  toggleCategoryStatusSchema,
} from '../validators/category.validator.js';
import { updateFeeSettingsSchema } from '../validators/feeSettings.validator.js';

const router = Router();

// Require authentication and 'Admin' role for all /api/admin routes
router.use(authenticate, authorize('Admin'));

// Platform KPI overview
router.get('/overview', getOverview);

// Base Admin health/status endpoint
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Admin access granted.',
    data: {
      adminId: req.user._id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// Category Management Endpoints
router.get('/categories', categoryController.getAdminCategories);
router.post('/categories', validate(createCategorySchema), categoryController.createCategory);
router.put('/categories/:id', validate(updateCategorySchema), categoryController.updateCategory);
router.patch(
  '/categories/:id/status',
  validate(toggleCategoryStatusSchema),
  categoryController.toggleCategoryStatus
);

import {
  markPayoutPaid,
  listPayouts,
  listPayments,
} from '../controllers/adminFinance.controller.js';

// Global Pricing & Fee Calculation Settings
router.get('/fee-settings', feeSettingsController.getFeeSettings);
router.put(
  '/fee-settings',
  validate(updateFeeSettingsSchema),
  feeSettingsController.updateFeeSettings
);

// Contractor Payouts & Payments
router.get('/payouts', listPayouts);
router.patch('/payouts/:id/mark-paid', markPayoutPaid);
router.get('/payments', listPayments);

export default router;
