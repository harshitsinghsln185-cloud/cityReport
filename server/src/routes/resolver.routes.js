import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { uploadResolverFields } from '../middleware/upload.js';
import resolverController from '../controllers/resolver.controller.js';

import { requireApprovedResolver } from '../middleware/requireApprovedResolver.js';

const router = Router();

// Public: Resolver candidate onboarding with ID proof
router.post('/register', uploadResolverFields(), resolverController.register);

// Protected: Authenticated resolver profile details
router.get('/me', authenticate, authorize('Resolver', 'Admin'), resolverController.getMe);
router.patch('/me', authenticate, authorize('Resolver'), resolverController.updateSettings);

// Guarded: Active contractor tasks authorization check (M4 / M8)
router.get(
  '/active-check',
  authenticate,
  authorize('Resolver'),
  requireApprovedResolver,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Resolver is approved and authorized for active dispatch.',
      data: {
        resolverId: req.resolverProfile._id,
        status: req.resolverProfile.status,
      },
    });
  }
);

export default router;
