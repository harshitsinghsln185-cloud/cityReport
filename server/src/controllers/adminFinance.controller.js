import financeService from '../services/financeService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Returns comprehensive financial analytics overview.
 */
export const getFinanceOverview = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await financeService.getFinancialAnalytics({ startDate, endDate });

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * Streams financial analytics report as CSV file download.
 */
export const exportFinanceCsv = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  await financeService.exportFinanceCsvStream(res, { startDate, endDate });
});

/**
 * Lists all citizen municipal payments with filters and pagination.
 */
export const listPayments = asyncHandler(async (req, res) => {
  const { page, limit, type, status, search } = req.query;
  const result = await financeService.listAdminPayments({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    type,
    status,
    search,
  });

  res.status(200).json({
    success: true,
    data: result.payments,
    pagination: result.pagination,
  });
});

/**
 * Lists all contractor remediation payouts with filters and pagination.
 */
export const listPayouts = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await financeService.listAdminPayouts({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    status,
  });

  res.status(200).json({
    success: true,
    data: result.payouts,
    pagination: result.pagination,
  });
});

/**
 * Marks contractor payout as Paid and disburses funds.
 */
export const markPayoutPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payout = await financeService.markPayoutPaid(id, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Contractor payout marked as Paid successfully',
    data: payout,
  });
});

export default {
  getFinanceOverview,
  exportFinanceCsv,
  listPayments,
  listPayouts,
  markPayoutPaid,
};
