import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

/**
 * Lists registered users (Citizens, Resolvers, Admins) with filtering and pagination.
 */
export const listUsers = asyncHandler(async (req, res) => {
  const { role, isBlocked, search, page = 1, limit = 10 } = req.query;

  const query = {};

  if (role && role !== 'All') {
    query.role = role;
  }

  if (isBlocked !== undefined && isBlocked !== '') {
    query.isBlocked = isBlocked === 'true';
  }

  if (search && search.trim() !== '') {
    const s = search.trim();
    query.$or = [
      { name: { $regex: s, $options: 'i' } },
      { email: { $regex: s, $options: 'i' } },
      { phone: { $regex: s, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-password'),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

/**
 * Toggles account block status for a citizen or resolver.
 */
export const toggleBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isBlocked, reason } = req.body;

  if (typeof isBlocked !== 'boolean') {
    throw new AppError('isBlocked must be a boolean', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role === 'Admin') {
    throw new AppError('Administrator accounts cannot be blocked', 400);
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new AppError('Cannot block your own account', 400);
  }

  user.isBlocked = isBlocked;
  user.blockReason = isBlocked ? (reason || 'Blocked by system administration').trim() : null;
  await user.save();

  logger.warn(`Admin ${req.user._id} ${isBlocked ? 'blocked' : 'unblocked'} user ${user._id} (${user.email}). Reason: ${user.blockReason}`);

  res.status(200).json({
    success: true,
    message: isBlocked ? 'User has been blocked' : 'User has been unblocked',
    data: user,
  });
});

export default {
  listUsers,
  toggleBlockUser,
};
