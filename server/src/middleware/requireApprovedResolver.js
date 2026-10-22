import { ResolverProfile } from '../models/ResolverProfile.js';
import { AppError } from '../utils/AppError.js';

/**
 * Middleware ensuring that the authenticated user is a Resolver whose profile has been
 * explicitly approved by an administrator.
 *
 * Rejects pending or rejected contractors with 403 Forbidden.
 */
export const requireApprovedResolver = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (req.user.role !== 'Resolver' && req.user.role !== 'Admin') {
      return next(new AppError('Access restricted to certified resolvers.', 403));
    }

    // Admins can bypass resolver verification for administrative inspections
    if (req.user.role === 'Admin') {
      return next();
    }

    const profile = await ResolverProfile.findOne({ user: req.user._id });

    if (!profile) {
      return next(
        new AppError(
          'Contractor profile not found. Please complete resolver onboarding.',
          403
        )
      );
    }

    if (profile.status !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your contractor profile is currently ${profile.status}. Work routes are restricted until approved by an administrator.`,
        data: {
          status: profile.status,
          rejectionReason: profile.rejectionReason,
        },
      });
    }

    req.resolverProfile = profile;
    next();
  } catch (error) {
    next(error);
  }
};

export default requireApprovedResolver;
