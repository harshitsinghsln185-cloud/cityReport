import { EmailLog } from '../models/EmailLog.js';
import { sendMailDirect } from './emailService.js';
import { logger } from '../utils/logger.js';

let queue = [];
let isProcessing = false;
let nextTimer = null;
let maxRetries = 3;
let defaultDelays = [2000, 4000, 8000]; // 2s, 4s, 8s exponential backoff

export const setRetryDelays = (delays) => {
  if (Array.isArray(delays) && delays.length > 0) {
    defaultDelays = [...delays];
  }
};

export const resetRetryDelays = () => {
  defaultDelays = [2000, 4000, 8000];
};

export const getQueueLength = () => queue.length;

export const clearQueue = () => {
  if (nextTimer) {
    clearTimeout(nextTimer);
    nextTimer = null;
  }
  queue = [];
  isProcessing = false;
};

/**
 * Process all items that are due for delivery or retry
 */
export const processQueue = async () => {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const now = Date.now();
    // Identify items that are due
    const readyItems = queue.filter((item) => item.nextAttemptAt <= now);

    for (const item of readyItems) {
      item.attempts += 1;

      try {
        await EmailLog.findByIdAndUpdate(item.logId, {
          $inc: { attempts: 1 },
        });

        await sendMailDirect({
          to: item.to,
          subject: item.subject,
          html: item.html,
          attachments: item.attachments,
        });

        // Mark Sent
        await EmailLog.findByIdAndUpdate(item.logId, {
          status: 'Sent',
          sentAt: new Date(),
          lastError: null,
        });

        // Remove from queue
        queue = queue.filter((q) => q !== item);
        logger.info(`[EmailQueue] Sent email to ${item.to} on attempt ${item.attempts}`);
      } catch (err) {
        logger.warn(`[EmailQueue] Delivery attempt ${item.attempts} failed for ${item.to}: ${err.message}`);

        if (item.attempts >= maxRetries) {
          // Permanently Failed
          await EmailLog.findByIdAndUpdate(item.logId, {
            status: 'Failed',
            failedAt: new Date(),
            lastError: err.message,
          });

          // Remove from queue
          queue = queue.filter((q) => q !== item);
          logger.error(`[EmailQueue] Email to ${item.to} marked FAILED after ${item.attempts} attempts`);
        } else {
          // Schedule next retry with exponential backoff
          const delayIndex = Math.min(item.attempts - 1, defaultDelays.length - 1);
          const delay = defaultDelays[delayIndex];
          item.nextAttemptAt = Date.now() + delay;

          await EmailLog.findByIdAndUpdate(item.logId, {
            lastError: err.message,
          });

          logger.info(`[EmailQueue] Scheduled retry #${item.attempts + 1} for ${item.to} in ${delay}ms`);
        }
      }
    }
  } finally {
    isProcessing = false;

    // If there are still items in queue, schedule the earliest due timer
    if (queue.length > 0) {
      if (nextTimer) clearTimeout(nextTimer);
      const earliestDue = Math.min(...queue.map((q) => q.nextAttemptAt));
      const waitTime = Math.max(0, earliestDue - Date.now());
      nextTimer = setTimeout(() => {
        nextTimer = null;
        processQueue().catch((e) => logger.error('[EmailQueue] processQueue timer error:', e));
      }, waitTime);
    }
  }
};

/**
 * Enqueue an email for non-blocking asynchronous delivery with retries
 */
export const enqueueEmail = async ({
  to,
  template = 'generic',
  subject,
  html,
  attachments = [],
  metadata = {},
}) => {
  if (!to || !subject) {
    throw new Error('Email recipient "to" and "subject" are required');
  }

  // Record pending delivery in EmailLog registry immediately
  const log = await EmailLog.create({
    to,
    template,
    subject,
    status: 'Pending',
    attempts: 0,
    metadata,
  });

  queue.push({
    logId: log._id,
    to,
    template,
    subject,
    html,
    attachments,
    attempts: 0,
    nextAttemptAt: Date.now(),
  });

  // Non-blocking kick-off
  setImmediate(() => {
    processQueue().catch((err) => {
      logger.error('[EmailQueue] Background processQueue failed:', err);
    });
  });

  return log;
};

/**
 * Helper to wait until the queue is completely empty (useful for testing retries)
 */
export const drainQueue = async (timeoutMs = 15000) => {
  const start = Date.now();
  while (queue.length > 0) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`drainQueue timed out after ${timeoutMs}ms with ${queue.length} items remaining`);
    }
    // Check if any item is ready and trigger processQueue
    await processQueue();
    await new Promise((res) => setTimeout(res, 30));
  }
};

export default {
  enqueueEmail,
  processQueue,
  setRetryDelays,
  resetRetryDelays,
  getQueueLength,
  clearQueue,
  drainQueue,
};
