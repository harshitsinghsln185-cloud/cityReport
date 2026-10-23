import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  listMyInvoices,
  getInvoice,
  downloadInvoicePdf,
} from '../controllers/invoice.controller.js';

const router = Router();

// All invoice routes require authentication
router.use(authenticate);

// List authenticated citizen's invoices
router.get('/mine', authorize('User', 'Admin'), listMyInvoices);

// Get specific invoice metadata
router.get('/:id', authorize('User', 'Admin'), getInvoice);

// Stream on-demand invoice PDF receipt
router.get('/:id/pdf', authorize('User', 'Admin'), downloadInvoicePdf);

export default router;
