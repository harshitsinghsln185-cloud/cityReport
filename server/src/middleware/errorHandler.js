import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];
  let code = err.code || (statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR');

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
    code = 'RESOURCE_NOT_FOUND';
  }

  // Handle Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}`;
    code = 'DUPLICATE_KEY';
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    errors = Object.values(err.errors || {}).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // Handle Zod validation error
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please authenticate.';
    code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please re-authenticate.';
    code = 'TOKEN_EXPIRED';
  }

  if (statusCode >= 500) {
    logger.error(`[Unhandled Error] ${err.message}`, { stack: err.stack, path: req.originalUrl });
  } else {
    logger.warn(`[Client Error ${statusCode}] ${message}`, { path: req.originalUrl, errors });
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(errors.length > 0 && { errors }),
  });
};
