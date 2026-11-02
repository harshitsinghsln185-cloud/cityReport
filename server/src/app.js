import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { csrfProtection } from './middleware/csrf.js';
import { globalLimiter } from './middleware/rateLimiters.js';

const app = express();

// Security HTTP headers with cross-origin resource policy
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing (Supports local development + Vercel deployments seamlessly)
const configuredOrigins = (env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
];

const allAllowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...configuredOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, server-to-server, mobile, postman)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.replace(/\/+$/, '');
    const isDirectMatch = allAllowedOrigins.includes(cleanOrigin);
    const isVercelDomain = /^https:\/\/[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.vercel\.app$/.test(cleanOrigin);
    const isLocalDev = cleanOrigin.includes('localhost') || cleanOrigin.includes('127.0.0.1');

    if (isDirectMatch || isVercelDomain || isLocalDev) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'x-csrf-token',
    'x-xsrf-token',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['set-cookie', 'authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Global Rate Limiting for API routes
app.use('/api', globalLimiter);

// Cookie parsing
app.use(cookieParser());

// Body parsing with 1mb limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Double-submit CSRF protection on API endpoints
app.use('/api', csrfProtection);

// Mount all API routes under /api
app.use('/api', apiRouter);

// 404 handler for undefined routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export default app;
