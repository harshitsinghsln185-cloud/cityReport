import { Router } from 'express';
import categoryController from '../controllers/category.controller.js';

const router = Router();

// Public route to fetch all active civic categories
router.get('/', categoryController.getActiveCategories);

export default router;
