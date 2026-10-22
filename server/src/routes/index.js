import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';

import categoryRoutes from './category.routes.js';
import userRoutes from './user.routes.js';
import resolverRoutes from './resolver.routes.js';
import adminResolverRoutes from './adminResolver.routes.js';

const router = Router();

// Health & System Diagnostics
router.use('/health', healthRoutes);

// Authentication & Session Routes
router.use('/auth', authRoutes);

// User Profile & Media Management
router.use('/users', userRoutes);

// Public Category Discovery
router.use('/categories', categoryRoutes);

// Resolver Contractor Onboarding & Self-Management
router.use('/resolvers', resolverRoutes);

// Administration Routes (Admin role required)
router.use('/admin/resolvers', adminResolverRoutes);
router.use('/admin', adminRoutes);

export default router;
