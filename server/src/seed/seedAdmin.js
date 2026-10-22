import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';

dotenv.config();

const seedAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crowd_report';
  const email = (process.env.ADMIN_EMAIL || 'admin@crowdreport.local').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const name = process.env.ADMIN_NAME || 'System Administrator';
  const phone = process.env.ADMIN_PHONE || '9876543210';

  try {
    logger.info(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    logger.info('Connected to database.');

    let admin = await User.findOne({ email }).select('+password');

    if (admin) {
      logger.info(`Admin user with email ${email} already exists. Updating credentials and status...`);
      admin.name = name;
      admin.phone = phone;
      admin.password = password; // Will be hashed by pre-save hook
      admin.role = 'Admin';
      admin.isEmailVerified = true;
      admin.isBlocked = false;
      admin.failedLoginAttempts = 0;
      admin.lockUntil = null;
      await admin.save();
      logger.info('Admin user credentials successfully synchronized.');
    } else {
      logger.info(`Creating initial System Administrator (${email})...`);
      admin = await User.create({
        name,
        email,
        phone,
        password,
        role: 'Admin',
        address: {
          street: 'Municipal Administrative Complex',
          city: 'Central',
          state: 'Delhi',
          pincode: '110001',
        },
        isEmailVerified: true,
        isBlocked: false,
      });
      logger.info(`System Administrator created successfully. (ID: ${admin._id})`);
    }

    await mongoose.disconnect();
    logger.info('Disconnected from database. Seeding complete.');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to seed system administrator:', { error: error.message });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

seedAdmin();
