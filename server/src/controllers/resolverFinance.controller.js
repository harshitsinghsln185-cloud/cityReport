import financeService from '../services/financeService.js';
import { ResolverProfile } from '../models/ResolverProfile.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * Returns earnings summary and paginated payouts ledger for authenticated resolver.
 */
export const getResolverEarnings = asyncHandler(async (req, res) => {
  let resolverId;

  if (req.user.role === 'Resolver') {
    const profile = req.resolverProfile || (await ResolverProfile.findOne({ user: req.user._id }));
    if (!profile) {
      throw new AppError('Resolver profile not found for authenticated account', 404);
    }
    resolverId = profile._id;
  } else if (req.user.role === 'Admin') {
    if (req.query.resolverId) {
      resolverId = req.query.resolverId;
    } else {
      const profile = await ResolverProfile.findOne({ user: req.user._id });
      if (profile) {
        resolverId = profile._id;
      } else {
        throw new AppError('resolverId query parameter required for administrator inspection', 400);
      }
    }
  } else {
    throw new AppError('Access restricted to contractors and municipal administrators', 403);
  }

  const { page = 1, limit = 10 } = req.query;
  const result = await financeService.getResolverEarningsLedger(resolverId, {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });

  res.status(200).json({
    success: true,
    data: result.summary,
    payouts: result.payouts,
    pagination: result.pagination,
  });
});

export default {
  getResolverEarnings,
};
