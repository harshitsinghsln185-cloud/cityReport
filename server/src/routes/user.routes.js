import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import uploadSingleImage from '../middleware/upload.js';
import userController from '../controllers/user.controller.js';
import { updateProfileSchema } from '../validators/user.validator.js';

const router = Router();

// Protect all /api/users routes with authentication
router.use(authenticate);

// Profile management endpoints
router.get('/me', userController.getProfile);
router.patch('/me', validate(updateProfileSchema), userController.updateProfile);

// Profile photo upload and deletion
router.put('/me/photo', uploadSingleImage('photo'), userController.uploadPhoto);
router.delete('/me/photo', userController.deletePhoto);

export default router;
