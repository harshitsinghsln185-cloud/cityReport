import { Router } from 'express';
import categoryController from '../controllers/category.controller.js';

const router = Router();

// Public route to fetch all active civic categories
router.get('/', categoryController.getActiveCategories);

// Public route to fetch active category details by slug with active subcategories
router.get('/:slug', categoryController.getCategoryBySlug);

export default router;
