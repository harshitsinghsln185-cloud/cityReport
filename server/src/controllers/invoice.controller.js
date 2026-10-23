import invoiceService from '../services/invoiceService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Lists paginated invoices for the authenticated citizen.
 */
export const listMyInvoices = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await invoiceService.listCitizenInvoices(req.user._id, { page, limit });

  res.status(200).json({
    success: true,
    data: result.invoices,
    meta: result.meta,
  });
});

/**
 * Retrieves invoice metadata by ID.
 * Accessible by owning citizen or Administrator.
 */
export const getInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const invoice = await invoiceService.getInvoiceById(id, req.user);

  res.status(200).json({
    success: true,
    data: invoice,
  });
});

/**
 * Streams the PDF receipt on the fly.
 * Accessible by owning citizen or Administrator.
 */
export const downloadInvoicePdf = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await invoiceService.streamInvoicePdf(id, res, req.user);
});

export default {
  listMyInvoices,
  getInvoice,
  downloadInvoicePdf,
};
