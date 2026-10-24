import { connectDB, disconnectDB } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { Issue } from '../src/models/Issue.js';
import { IssueTimeline } from '../src/models/IssueTimeline.js';
import notificationService from '../src/services/notificationService.js';
import { logger } from '../src/utils/logger.js';

/**
 * Maintenance script to expire and auto-cancel civic issues in 'AwaitingAdvance'
 * status whose quotes are older than 24 hours.
 *
 * @param {Object} [options]
 * @param {number} [options.maxAgeHours=24]
 * @param {boolean} [options.dryRun=false]
 * @returns {Promise<{ scanned: number, expired: number, issueCodes: string[] }>}
 */
export const runExpireAwaitingAdvance = async ({ maxAgeHours = 24, dryRun = false } = {}) => {
  const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
  logger.info(`Scanning for issues in AwaitingAdvance created before ${cutoffTime.toISOString()} (> ${maxAgeHours}h)...`);

  const expiredCandidates = await Issue.find({
    status: 'AwaitingAdvance',
    createdAt: { $lt: cutoffTime },
  }).populate('reporter');

  logger.info(`Found ${expiredCandidates.length} issues eligible for expiration.`);

  const expiredCodes = [];

  for (const issue of expiredCandidates) {
    if (dryRun) {
      logger.info(`[DRY-RUN] Would cancel Issue ${issue.issueCode} (Created: ${issue.createdAt.toISOString()})`);
      expiredCodes.push(issue.issueCode);
      continue;
    }

    // Atomic status transition
    issue.status = 'Cancelled';
    issue.cancellationReason = 'Quote expired: 24-hour advance payment window lapsed without confirmation.';
    await issue.save();

    // Append to audit timeline
    await IssueTimeline.create({
      issue: issue._id,
      fromStatus: 'AwaitingAdvance',
      toStatus: 'Cancelled',
      action: 'CANCELLED_EXPIRED',
      actor: null,
      actorRole: 'System',
      remarks: 'Automatically cancelled due to advance payment quote expiration (>24h).',
    });

    // Notify citizen
    if (issue.reporter?._id) {
      await notificationService.createNotification({
        userId: issue.reporter._id,
        type: 'IssueCancelled',
        title: 'Issue Quote Expired',
        message: `Your report (${issue.issueCode}) was automatically cancelled because advance payment was not received within 24 hours.`,
        data: { issueId: issue._id, issueCode: issue.issueCode },
      }).catch((err) => logger.warn(`Failed to send notification for expired issue ${issue.issueCode}: ${err.message}`));
    }

    expiredCodes.push(issue.issueCode);
    logger.info(`Successfully cancelled expired Issue ${issue.issueCode}`);
  }

  return {
    scanned: expiredCandidates.length,
    expired: expiredCodes.length,
    issueCodes: expiredCodes,
  };
};

// Execute if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('expireAwaitingAdvance.js')) {
  const isDryRun = process.argv.includes('--dry-run');
  const hoursArg = process.argv.find((arg) => arg.startsWith('--hours='));
  const hours = hoursArg ? parseFloat(hoursArg.split('=')[1]) : 24;

  connectDB(env.MONGODB_URI)
    .then(async () => {
      logger.info(`Starting expireAwaitingAdvance task (hours=${hours}, dryRun=${isDryRun})...`);
      const result = await runExpireAwaitingAdvance({ maxAgeHours: hours, dryRun: isDryRun });
      logger.info(`ExpireAwaitingAdvance complete: ${result.expired} issues expired. Codes: [${result.issueCodes.join(', ')}]`);
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      logger.error('Failed to run expireAwaitingAdvance:', err);
      await disconnectDB().catch(() => {});
      process.exit(1);
    });
}

export default runExpireAwaitingAdvance;
