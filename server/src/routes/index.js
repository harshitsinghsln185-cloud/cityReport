import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';

import categoryRoutes from './category.routes.js';
import userRoutes from './user.routes.js';
import resolverRoutes from './resolver.routes.js';
import resolverTaskRoutes from './resolverTask.routes.js';
import adminResolverRoutes from './adminResolver.routes.js';
import adminIssueRoutes from './adminIssue.routes.js';
import adminUserRoutes from './adminUser.routes.js';
import issueRoutes from './issue.routes.js';
import paymentRoutes from './payment.routes.js';
import invoiceRoutes from './invoice.routes.js';
import adminFinanceRoutes from './adminFinance.routes.js';

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
router.use('/resolver', resolverRoutes);
router.use('/resolvers', resolverRoutes);

// Resolver Task Execution & Resolution Proof
router.use('/resolver/tasks', resolverTaskRoutes);
router.use('/resolvers/tasks', resolverTaskRoutes);

// Civic Issue Reporting & Citizen Management
router.use('/issues', issueRoutes);

// Financial Mock Payments & Idempotent Confirmations
router.use('/payments', paymentRoutes);

// Immutable Legal Invoices & PDF Streaming
router.use('/invoices', invoiceRoutes);

// Administration Routes (Admin role required)
router.use('/admin/issues', adminIssueRoutes);
router.use('/admin/resolvers', adminResolverRoutes);
router.use('/admin/users', adminUserRoutes);
router.use('/admin/finance', adminFinanceRoutes);
router.use('/admin', adminRoutes);

export default router;
