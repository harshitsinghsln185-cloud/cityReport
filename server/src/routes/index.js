import { Router } from 'express';
import healthRoutes from './health.routes.js';

const router = Router();

// Health & System Diagnostics
router.use('/health', healthRoutes);

export default router;
