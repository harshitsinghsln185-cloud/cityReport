import { Issue } from '../models/Issue.js';
import { ResolverProfile } from '../models/ResolverProfile.js';
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Returns executive dashboard overview metrics and counts for administrative supervision.
 */
export const getOverview = asyncHandler(async (req, res) => {
  const [
    totalIssues,
    activeIssues,
    resolvedIssues,
    needsAssignment,
    pendingResolvers,
    approvedResolvers,
    totalCitizens,
    paymentAgg,
    statusAgg,
    recentIssues,
  ] = await Promise.all([
    Issue.countDocuments({}),
    Issue.countDocuments({ status: { $in: ['Submitted', 'UnderReview', 'Assigned', 'Accepted', 'InProgress'] } }),
    Issue.countDocuments({ status: { $in: ['Resolved', 'BalanceDue', 'Closed'] } }),
    Issue.countDocuments({ status: { $in: ['Submitted', 'ReassignNeeded'] } }),
    ResolverProfile.countDocuments({ status: 'Pending' }),
    ResolverProfile.countDocuments({ status: 'Approved' }),
    User.countDocuments({ role: 'User' }),
    Payment.aggregate([
      { $match: { status: 'Completed', type: { $in: ['Advance', 'Balance'] } } },
      { $group: { _id: null, totalPaise: { $sum: '$amountPaise' } } },
    ]),
    Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Issue.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('category', 'name')
      .populate('reporter', 'name email'),
  ]);

  const totalGrossVolumePaise = paymentAgg[0]?.totalPaise || 0;

  const statusBreakdown = {};
  statusAgg.forEach((item) => {
    statusBreakdown[item._id] = item.count;
  });

  res.status(200).json({
    success: true,
    data: {
      metrics: {
        totalIssues,
        activeIssues,
        resolvedIssues,
        needsAssignment,
        pendingResolvers,
        approvedResolvers,
        totalCitizens,
        totalGrossVolumePaise,
      },
      statusBreakdown,
      recentIssues,
    },
  });
});

export default {
  getOverview,
};
