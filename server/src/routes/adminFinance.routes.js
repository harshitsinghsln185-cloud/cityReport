import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  getFinanceOverview,
  exportFinanceCsv,
  listPayments,
  listPayouts,
  markPayoutPaid,
} from '../controllers/adminFinance.controller.js';

const router = Router();

// Strict Admin authorization across all finance routes
router.use(authenticate, authorize('Admin'));

// Financial overview metrics & KPIs
router.get('/overview', getFinanceOverview);

// Export finance ledger as CSV stream
router.get('/export.csv', exportFinanceCsv);

// Municipal payments ledger
router.get('/payments', listPayments);

// Contractor payouts ledger
router.get('/payouts', listPayouts);

// Mark payout as disbursed / paid
router.patch('/payouts/:id/mark-paid', markPayoutPaid);

export default router;
