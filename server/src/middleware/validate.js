import { AppError } from '../utils/AppError.js';

export const validate = (schemas = {}) => (req, res, next) => {
  try {
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.headers) {
      schemas.headers.parse(req.headers);
    }
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const formattedErrors = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(new AppError('Validation failed', 400, formattedErrors));
    }
    next(error);
  }
};
