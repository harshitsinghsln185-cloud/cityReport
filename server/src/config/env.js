import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/crowd_report?replicaSet=rs0'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  JWT_ACCESS_SECRET: z.string().min(32).default('default_jwt_access_secret_key_minimum_32_characters_for_dev'),
  JWT_REFRESH_SECRET: z.string().min(32).default('default_jwt_refresh_secret_key_minimum_32_characters_for_dev'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  ADMIN_EMAIL: z.string().email().default('admin@crowdreport.local'),
  ADMIN_PASSWORD: z.string().default('Admin@123456'),
  CLOUDINARY_CLOUD_NAME: z.string().default('crowd-report-dev'),
  CLOUDINARY_API_KEY: z.string().default('123456789012345'),
  CLOUDINARY_API_SECRET: z.string().default('dev_cloudinary_secret_key_abcdef'),
  AI_PROVIDER: z.string().default('gemini'),
  AI_API_KEY: z.string().optional().default(''),
  AI_MODEL: z.string().default('gemini-1.5-flash-8b'),
  AI_TIMEOUT_MS: z.string().default('4000').transform((val) => parseInt(val, 10)),
  AI_DAILY_LIMIT: z.string().default('1000').transform((val) => parseInt(val, 10)),
});

export const validateEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('[FATAL] Environment configuration error:');
    result.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  return result.data;
};

export const env = validateEnv();
