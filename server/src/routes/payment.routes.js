import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { confirmPaymentSchema, failPaymentSchema } from '../validators/payment.validator.js';
import {
  createAdvanceOrder,
  createBalanceOrder,
  confirmPayment,
  failPayment,
  getPayment,
  listMyPayments,
} from '../controllers/payment.controller.js';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

// List authenticated citizen's payments
router.get('/mine', authorize('User', 'Admin'), listMyPayments);

// Initiate advance payment order
router.post('/advance/:issueId/order', authorize('User', 'Admin'), createAdvanceOrder);

// Initiate balance payment order
router.post('/balance/:issueId/order', authorize('User', 'Admin'), createBalanceOrder);

// Confirm payment order with Idempotency-Key
router.post('/:paymentId/confirm', authorize('User', 'Admin'), validate(confirmPaymentSchema), confirmPayment);

// Simulate payment failure
router.post('/:paymentId/fail', authorize('User', 'Admin'), validate(failPaymentSchema), failPayment);

// Get specific payment details
router.get('/:paymentId', authorize('User', 'Admin'), getPayment);

export default router;
