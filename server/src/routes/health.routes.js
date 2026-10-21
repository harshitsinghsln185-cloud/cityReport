import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/response.js';

const router = Router();

router.get('/', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (!isDbConnected) {
    return res.status(503).json({
      success: false,
      message: 'Service degraded: Database not connected',
      data: {
        status: 'DEGRADED',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  }

  return sendSuccess(
    res,
    {
      status: 'UP',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'Service is healthy',
    200
  );
});

export default router;
