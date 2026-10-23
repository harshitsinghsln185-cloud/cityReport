import { Counter } from '../models/Counter.js';

/**
 * Atomically increments and returns the next integer in a sequence.
 * Safe against race conditions and concurrent requests.
 *
 * @param {string} key - Unique sequence identifier (e.g. 'issue_2026')
 * @param {import('mongoose').ClientSession | null} [session=null] - Optional MongoDB transaction session
 * @returns {Promise<number>} Next sequence integer (1-indexed)
 */
export const getNextSequence = async (key, session = null) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  };

  if (session) {
    options.session = session;
  }

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    options
  );

  return counter.seq;
};

/**
 * Generates an atomic, formatted issue code: CR-YYYY-XXXXXX
 * (e.g. CR-2026-000001)
 *
 * @param {import('mongoose').ClientSession | null} [session=null]
 * @returns {Promise<string>}
 */
export const generateIssueCode = async (session = null) => {
  const year = new Date().getFullYear();
  const key = `issue_${year}`;
  const seq = await getNextSequence(key, session);
  return `CR-${year}-${String(seq).padStart(6, '0')}`;
};

/**
 * Generates an atomic, formatted invoice number: INV-YYYY-XXXXXX
 * (e.g. INV-2026-000001)
 *
 * @param {import('mongoose').ClientSession | null} [session=null]
 * @returns {Promise<string>}
 */
export const generateInvoiceNumber = async (session = null) => {
  const year = new Date().getFullYear();
  const key = `invoice_${year}`;
  const seq = await getNextSequence(key, session);
  return `INV-${year}-${String(seq).padStart(6, '0')}`;
};

export default {
  getNextSequence,
  generateIssueCode,
  generateInvoiceNumber,
};
