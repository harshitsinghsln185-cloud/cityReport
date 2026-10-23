import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import { Invoice } from '../models/Invoice.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { ResolverProfile } from '../models/ResolverProfile.js';
import { generateInvoiceNumber } from '../utils/sequence.js';
import { renderInvoicePdf } from '../templates/invoice/invoiceTemplate.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

/**
 * Creates an immutable snapshot Invoice 1 (Advance) in the database.
 * Executes within the provided MongoDB session.
 *
 * @param {Object} issue - The Issue document
 * @param {Object} payment - The Payment document
 * @param {import('mongoose').ClientSession | null} [session=null]
 * @returns {Promise<Invoice>}
 */
export const createAdvanceInvoice = async (issue, payment, session = null) => {
  const invoiceNumber = await generateInvoiceNumber(session);

  // Retrieve reporter customer details
  let customerUser = issue.reporter;
  if (!customerUser || !customerUser.email) {
    const query = User.findById(issue.reporter);
    if (session) query.session(session);
    customerUser = await query;
  }

  // Retrieve category name
  let categoryName = 'General Civic Issue';
  if (issue.category && issue.category.name) {
    categoryName = issue.category.name;
  } else if (issue.category) {
    const catQuery = Category.findById(issue.category);
    if (session) catQuery.session(session);
    const cat = await catQuery;
    if (cat) categoryName = cat.name;
  }

  const customerSnapshot = {
    name: customerUser?.name || 'Citizen User',
    email: customerUser?.email || '',
    phone: issue.contactNumber || customerUser?.phone || '',
    address: {
      street: issue.address?.street || '',
      city: issue.address?.city || '',
      pincode: issue.address?.pincode || '',
    },
  };

  const feeSnapshot = issue.fee || {};
  const feeBreakdown = {
    categoryName,
    categoryBaseFeePaise: feeSnapshot.categoryBaseFeePaise || 0,
    severityMultiplier: feeSnapshot.severityMultiplier || 1.0,
    assessedSeverity: issue.suggestedPriority || 'Medium',
    distanceKm: feeSnapshot.distanceKm || 0,
    freeKm: feeSnapshot.freeKm || 3,
    perKmRatePaise: feeSnapshot.perKmRatePaise || 1500,
    distanceFeePaise: feeSnapshot.distanceFeePaise || 0,
    totalPaise: feeSnapshot.totalPaise || payment.amountPaise * 2,
  };

  const invoiceData = {
    invoiceNumber,
    issue: issue._id,
    user: customerUser?._id || issue.reporter,
    type: 'Advance',
    customerSnapshot,
    resolverSnapshot: null,
    feeBreakdown,
    amountPaidPaise: payment.amountPaise,
    advancePaidPaise: payment.amountPaise,
    balanceDuePaise: feeSnapshot.balancePaise || 0,
  };

  const options = session ? { session } : {};
  const [invoice] = await Invoice.create([invoiceData], options);

  logger.info(`Generated Advance Invoice ${invoice.invoiceNumber} for Issue ${issue.issueCode}`);
  return invoice;
};

/**
 * Creates an immutable snapshot Invoice 2 (Final Settlement) in the database.
 * Executes within the provided MongoDB session.
 *
 * @param {Object} issue - The Issue document
 * @param {Object} payment - The Balance Payment document
 * @param {import('mongoose').ClientSession | null} [session=null]
 * @returns {Promise<Invoice>}
 */
export const createFinalInvoice = async (issue, payment, session = null) => {
  const invoiceNumber = await generateInvoiceNumber(session);

  // Retrieve reporter customer details
  let customerUser = issue.reporter;
  if (!customerUser || !customerUser.email) {
    const query = User.findById(issue.reporter);
    if (session) query.session(session);
    customerUser = await query;
  }

  // Retrieve assigned resolver details
  let resolverSnapshot = null;
  if (issue.assignedResolver) {
    let resolverDoc = issue.assignedResolver;
    if (!resolverDoc.user || typeof resolverDoc.user === 'string' || resolverDoc.user instanceof mongoose.Types.ObjectId) {
      const rQuery = ResolverProfile.findById(issue.assignedResolver).populate('user', 'name phone');
      if (session) rQuery.session(session);
      resolverDoc = await rQuery;
    }
    if (resolverDoc && resolverDoc.user) {
      resolverSnapshot = {
        name: resolverDoc.user.name || 'Certified Resolver',
        phone: resolverDoc.user.phone || '',
      };
    }
  }

  // Retrieve category name
  let categoryName = 'General Civic Issue';
  if (issue.category && issue.category.name) {
    categoryName = issue.category.name;
  } else if (issue.category) {
    const catQuery = Category.findById(issue.category);
    if (session) catQuery.session(session);
    const cat = await catQuery;
    if (cat) categoryName = cat.name;
  }

  const customerSnapshot = {
    name: customerUser?.name || 'Citizen User',
    email: customerUser?.email || '',
    phone: issue.contactNumber || customerUser?.phone || '',
    address: {
      street: issue.address?.street || '',
      city: issue.address?.city || '',
      pincode: issue.address?.pincode || '',
    },
  };

  const feeSnapshot = issue.fee || {};
  const feeBreakdown = {
    categoryName,
    categoryBaseFeePaise: feeSnapshot.categoryBaseFeePaise || 0,
    severityMultiplier: feeSnapshot.severityMultiplier || 1.0,
    assessedSeverity: issue.finalPriority || issue.suggestedPriority || 'Medium',
    distanceKm: feeSnapshot.distanceKm || 0,
    freeKm: feeSnapshot.freeKm || 3,
    perKmRatePaise: feeSnapshot.perKmRatePaise || 1500,
    distanceFeePaise: feeSnapshot.distanceFeePaise || 0,
    totalPaise: feeSnapshot.totalPaise || 0,
  };

  const invoiceData = {
    invoiceNumber,
    issue: issue._id,
    user: customerUser?._id || issue.reporter,
    type: 'Final',
    customerSnapshot,
    resolverSnapshot,
    feeBreakdown,
    amountPaidPaise: payment.amountPaise,
    advancePaidPaise: feeSnapshot.advancePaise || 0,
    balanceDuePaise: 0,
  };

  const options = session ? { session } : {};
  const [invoice] = await Invoice.create([invoiceData], options);

  logger.info(`Generated Final Invoice ${invoice.invoiceNumber} for Issue ${issue.issueCode}`);
  return invoice;
};

/**
 * Generates an in-memory Buffer of the invoice PDF.
 * Useful for email attachments.
 *
 * @param {Object} invoice
 * @param {Object} issue
 * @returns {Promise<Buffer>}
 */
export const generateInvoicePdfBuffer = async (invoice, issue) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50, compress: false });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    renderInvoicePdf(doc, invoice, issue);
    doc.end();
  });
};

/**
 * Streams the rendered invoice PDF directly to an Express Response.
 *
 * @param {string} invoiceId
 * @param {import('express').Response} res
 * @param {Object} [currentUser=null] - User requesting download for permission check
 * @returns {Promise<void>}
 */
export const streamInvoicePdf = async (invoiceId, res, currentUser = null) => {
  const invoice = await Invoice.findById(invoiceId).populate('issue');
  if (!invoice) {
    throw new AppError('Invoice not found', 404);
  }

  // Security check: only owning citizen or Admin can download
  if (currentUser) {
    const isAdmin = currentUser.role === 'Admin';
    const isOwner = invoice.user.toString() === currentUser._id.toString();
    if (!isAdmin && !isOwner) {
      throw new AppError('Access denied: You do not own this invoice', 404); // Use 404 to avoid enumeration
    }
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="Invoice-${invoice.invoiceNumber}.pdf"`);

  const doc = new PDFDocument({ size: 'A4', margin: 50, compress: false });
  doc.pipe(res);
  renderInvoicePdf(doc, invoice, invoice.issue);
  doc.end();
};

/**
 * Lists paginated invoices for a citizen.
 *
 * @param {string} userId
 * @param {Object} options
 * @returns {Promise<{ invoices: Array, meta: Object }>}
 */
export const listCitizenInvoices = async (userId, { page = 1, limit = 10 } = {}) => {
  const query = { user: userId };
  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('issue', 'issueCode title status'),
    Invoice.countDocuments(query),
  ]);

  return {
    invoices,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieves a single invoice document by ID with authorization checks.
 *
 * @param {string} invoiceId
 * @param {Object} [currentUser=null]
 * @returns {Promise<Invoice>}
 */
export const getInvoiceById = async (invoiceId, currentUser = null) => {
  const invoice = await Invoice.findById(invoiceId).populate('issue');
  if (!invoice) {
    throw new AppError('Invoice not found', 404);
  }

  if (currentUser) {
    const isAdmin = currentUser.role === 'Admin';
    const isOwner = invoice.user.toString() === currentUser._id.toString();
    if (!isAdmin && !isOwner) {
      throw new AppError('Invoice not found', 404);
    }
  }

  return invoice;
};

export default {
  createAdvanceInvoice,
  createFinalInvoice,
  generateInvoicePdfBuffer,
  streamInvoicePdf,
  listCitizenInvoices,
  getInvoiceById,
};

