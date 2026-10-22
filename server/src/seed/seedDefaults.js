import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category.js';
import { FeeSettings } from '../models/FeeSettings.js';
import { logger } from '../utils/logger.js';

dotenv.config();

const DEFAULT_CATEGORIES = [
  {
    name: 'Road damage',
    slug: 'road-damage',
    description: 'Potholes, broken roads, damaged pavements, and street surface issues.',
    baseFeePaise: 60000, // ₹600.00
    icon: 'road',
    isActive: true,
  },
  {
    name: 'Water supply',
    slug: 'water-supply',
    description: 'Pipeline leakages, contaminated municipal supply, and low water pressure.',
    baseFeePaise: 40000, // ₹400.00
    icon: 'droplet',
    isActive: true,
  },
  {
    name: 'Drainage',
    slug: 'drainage',
    description: 'Blocked sewers, overflowing drains, and rainwater stagnation.',
    baseFeePaise: 50000, // ₹500.00
    icon: 'waves',
    isActive: true,
  },
  {
    name: 'Streetlight & electricity',
    slug: 'streetlight-electricity',
    description: 'Non-functional streetlights, dangling power cables, and open transformer hazards.',
    baseFeePaise: 35000, // ₹350.00
    icon: 'zap',
    isActive: true,
  },
  {
    name: 'Garbage',
    slug: 'garbage',
    description: 'Uncollected domestic waste, illegal dumping, and overflowing municipal bins.',
    baseFeePaise: 30000, // ₹300.00
    icon: 'trash-2',
    isActive: true,
  },
  {
    name: 'Other',
    slug: 'other',
    description: 'General civic problems, illegal hoardings, park maintenance, and public property hazards.',
    baseFeePaise: 30000, // ₹300.00
    icon: 'help-circle',
    isActive: true,
  },
];

const DEFAULT_FEE_SETTINGS = {
  singleton: true,
  freeKm: 3,
  perKmRatePaise: 1500, // ₹15/km
  minFeePaise: 10000, // ₹100 min clamp
  maxFeePaise: 500000, // ₹5,000 max clamp
  commissionPercent: 10,
  multipliers: {
    minor: 1.0,
    moderate: 1.3,
    high: 1.6,
    critical: 2.0,
  },
};

export const seedDefaults = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crowd_report';

  try {
    logger.info(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    logger.info('Connected to database.');

    // 1. Seed or synchronize 6 baseline categories
    logger.info('Seeding default civic categories...');
    let seededCategoriesCount = 0;
    for (const catData of DEFAULT_CATEGORIES) {
      const existing = await Category.findOne({ slug: catData.slug });
      if (!existing) {
        await Category.create(catData);
        seededCategoriesCount++;
        logger.info(`  + Created category: ${catData.name} (${catData.slug}) - Base fee: ₹${catData.baseFeePaise / 100}`);
      } else {
        logger.info(`  • Category already exists: ${catData.name} (${catData.slug})`);
      }
    }
    logger.info(`Categories check complete. ${seededCategoriesCount} new categories seeded.`);

    // 2. Seed or synchronize singleton FeeSettings
    logger.info('Seeding singleton fee settings...');
    let feeSettings = await FeeSettings.findOne({ singleton: true });
    if (!feeSettings) {
      feeSettings = await FeeSettings.create(DEFAULT_FEE_SETTINGS);
      logger.info('  + Created baseline singleton FeeSettings (freeKm: 3, perKm: ₹15, min: ₹100, max: ₹5000, commission: 10%)');
    } else {
      logger.info('  • FeeSettings singleton already exists.');
    }

    await mongoose.disconnect();
    logger.info('Disconnected from database. Seeding defaults complete.');
  } catch (error) {
    logger.error('Failed to seed defaults:', { error: error.message });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

// If run directly via CLI
if (process.argv[1] && process.argv[1].endsWith('seedDefaults.js')) {
  seedDefaults().then(() => process.exit(0));
}

export default seedDefaults;
