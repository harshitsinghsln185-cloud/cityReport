import paymentService from '../services/paymentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Initiates an advance payment order for an issue in 'AwaitingAdvance'.
 */
export const createAdvanceOrder = asyncHandler(async (req, res) => {
  const { issueId } = req.params;
  const payment = await paymentService.createAdvanceOrder(issueId, req.user._id);

  res.status(201).json({
    success: true,
    message: 'Advance payment order initiated',
    data: {
      paymentId: payment.paymentId,
      amountPaise: payment.amountPaise,
      issueId: payment.issue,
      status: payment.status,
    },
  });
});

/**
 * Initiates a balance payment order for an issue in 'BalanceDue'.
 */
export const createBalanceOrder = asyncHandler(async (req, res) => {
  const { issueId } = req.params;
  const payment = await paymentService.createBalanceOrder(issueId, req.user._id);

  res.status(201).json({
    success: true,
    message: 'Balance payment order initiated',
    data: {
      paymentId: payment.paymentId,
      amountPaise: payment.amountPaise,
      issueId: payment.issue,
      status: payment.status,
    },
  });
});

/**
 * Confirms a payment order (Advance or Balance) with Idempotency-Key.
 */
export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const idempotencyKey = req.headers['idempotency-key'];

  const result = await paymentService.confirmPayment(paymentId, idempotencyKey, req.user._id);

  res.status(200).json({
    success: true,
    message: result.isReplay ? 'Payment already confirmed' : 'Payment confirmed',
    data: {
      paymentId: result.payment.paymentId,
      invoiceId: result.invoice?._id,
      invoiceNumber: result.invoice?.invoiceNumber,
      payoutId: result.payout?._id,
      status: result.issue.status,
      issueStatus: result.issue.status,
      isReplay: result.isReplay,
    },
  });
});

/**
 * Simulates a payment failure (e.g. user cancels or gateway declines).
 */
export const failPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { reason } = req.body;

  const payment = await paymentService.failPayment(paymentId, reason, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Payment simulation failed',
    data: {
      paymentId: payment.paymentId,
      status: payment.status,
      failureReason: payment.failureReason,
    },
  });
});

/**
 * Retrieves details for a specific payment order.
 */
export const getPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const payment = await paymentService.getPaymentById(paymentId, req.user._id);

  res.status(200).json({
    success: true,
    data: payment,
  });
});

/**
 * Lists paginated payment history for the logged-in citizen.
 */
export const listMyPayments = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await paymentService.listCitizenPayments(req.user._id, { page, limit, status });

  res.status(200).json({
    success: true,
    data: result.payments,
    meta: result.meta,
  });
});

export default {
  createAdvanceOrder,
  confirmPayment,
  failPayment,
  getPayment,
  listMyPayments,
};
