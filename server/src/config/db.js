import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnection...');
    });
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    // In production or test environments, let callers or supervisor decide on retry
    throw error;
  }
};
