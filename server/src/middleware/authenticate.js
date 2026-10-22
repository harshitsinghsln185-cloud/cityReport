import tokenService from '../services/tokenService.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken;

  // Optional fallback to Authorization header if provided
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Authentication required. Please sign in.', 401);
  }

  let decoded;
  try {
    decoded = tokenService.verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Access token expired', 401);
    }
    throw new AppError('Invalid access token', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('The account belonging to this token no longer exists.', 401);
  }

  if (user.isBlocked) {
    throw new AppError(user.blockReason || 'Account suspended. Please contact administrator.', 403);
  }

  req.user = user;
  next();
});

export default authenticate;
