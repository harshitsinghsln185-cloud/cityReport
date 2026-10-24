import { v2 as cloudinary } from 'cloudinary';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { Issue } from '../src/models/Issue.js';
import { User } from '../src/models/User.js';
import { ResolverProfile } from '../src/models/ResolverProfile.js';
import { logger } from '../src/utils/logger.js';

/**
 * Configure Cloudinary SDK with environment secrets
 */
const configureCloudinary = () => {
  if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    return true;
  }
  return false;
};

/**
 * Extracts Cloudinary public_id from a URL or raw identifier string.
 * E.g., "https://res.cloudinary.com/cloud/image/upload/v12345/crowd-report/issues/abc.jpg"
 * -> "crowd-report/issues/abc"
 *
 * @param {string} urlOrId
 * @returns {string | null}
 */
export const extractPublicId = (urlOrId) => {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  if (!urlOrId.includes('cloudinary.com')) {
    // If it's already a public_id (e.g. "crowd-report/...")
    return urlOrId.replace(/\.[^/.]+$/, '');
  }

  const uploadIndex = urlOrId.indexOf('/upload/');
  if (uploadIndex === -1) return null;

  const afterUpload = urlOrId.substring(uploadIndex + 8);
  // Remove version tag if present (e.g., v1712345678/)
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  // Remove file extension
  return withoutVersion.replace(/\.[^/.]+$/, '');
};

/**
 * Scans MongoDB for all active photo references across Issues, Profiles, and Users.
 *
 * @returns {Promise<Set<string>>} Set of active public_ids / URLs
 */
export const collectActiveReferences = async () => {
  const activeIds = new Set();

  // 1. Issues: photos, beforePhotos, afterPhotos
  const issues = await Issue.find({}, {
    photos: 1,
    'resolutionDetails.beforePhotos': 1,
    'resolutionDetails.afterPhotos': 1,
  }).lean();

  for (const issue of issues) {
    if (Array.isArray(issue.photos)) {
      for (const p of issue.photos) {
        const id = extractPublicId(typeof p === 'string' ? p : p?.url || p?.public_id);
        if (id) activeIds.add(id);
      }
    }
    const before = issue.resolutionDetails?.beforePhotos || [];
    for (const p of before) {
      const id = extractPublicId(typeof p === 'string' ? p : p?.url || p?.public_id);
      if (id) activeIds.add(id);
    }
    const after = issue.resolutionDetails?.afterPhotos || [];
    for (const p of after) {
      const id = extractPublicId(typeof p === 'string' ? p : p?.url || p?.public_id);
      if (id) activeIds.add(id);
    }
  }

  // 2. User avatars
  const users = await User.find({ photo: { $ne: null } }, { photo: 1 }).lean();
  for (const u of users) {
    const id = extractPublicId(u.photo);
    if (id) activeIds.add(id);
  }

  // 3. Resolver ID proof documents
  const profiles = await ResolverProfile.find({ idProofDocument: { $ne: null } }, { idProofDocument: 1 }).lean();
  for (const r of profiles) {
    const id = extractPublicId(r.idProofDocument);
    if (id) activeIds.add(id);
  }

  return activeIds;
};

/**
 * Executes orphan image audit and optional deletion.
 *
 * @param {Object} [options]
 * @param {boolean} [options.dryRun=true]
 * @param {string} [options.prefix='crowd-report']
 * @returns {Promise<{ activeCount: number, remoteCount: number, orphanCount: number, deletedCount: number, orphanIds: string[] }>}
 */
export const runCleanupOrphanImages = async ({ dryRun = true, prefix = 'crowd-report' } = {}) => {
  const isCloudinaryConfigured = configureCloudinary();
  const activeIds = await collectActiveReferences();

  logger.info(`Collected ${activeIds.size} active image references from MongoDB.`);

  if (!isCloudinaryConfigured) {
    logger.warn('Cloudinary credentials not configured in environment. Running database reference audit only.');
    return {
      activeCount: activeIds.size,
      remoteCount: 0,
      orphanCount: 0,
      deletedCount: 0,
      orphanIds: [],
    };
  }

  // Fetch remote resources from Cloudinary with matching prefix
  let remoteResources = [];
  let nextCursor = null;

  try {
    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix,
        max_results: 100,
        next_cursor: nextCursor,
      });

      remoteResources = remoteResources.concat(result.resources || []);
      nextCursor = result.next_cursor;
    } while (nextCursor);
  } catch (err) {
    logger.warn(`Could not fetch remote Cloudinary resources: ${err.message}. Simulating scan.`);
    return {
      activeCount: activeIds.size,
      remoteCount: 0,
      orphanCount: 0,
      deletedCount: 0,
      orphanIds: [],
    };
  }

  logger.info(`Fetched ${remoteResources.length} remote Cloudinary assets under prefix "${prefix}".`);

  const orphanIds = [];

  for (const resource of remoteResources) {
    const pubId = resource.public_id;
    if (!activeIds.has(pubId)) {
      orphanIds.push(pubId);
    }
  }

  logger.info(`Identified ${orphanIds.length} orphan Cloudinary assets.`);

  let deletedCount = 0;
  if (!dryRun && orphanIds.length > 0) {
    // Delete in chunks of 50
    for (let i = 0; i < orphanIds.length; i += 50) {
      const chunk = orphanIds.slice(i, i + 50);
      const delResult = await cloudinary.api.delete_resources(chunk);
      deletedCount += Object.keys(delResult.deleted || {}).length;
      logger.info(`Deleted ${deletedCount} orphan images from Cloudinary.`);
    }
  } else if (dryRun && orphanIds.length > 0) {
    logger.info(`[DRY-RUN] Would delete ${orphanIds.length} orphan assets: ${orphanIds.slice(0, 5).join(', ')}...`);
  }

  return {
    activeCount: activeIds.size,
    remoteCount: remoteResources.length,
    orphanCount: orphanIds.length,
    deletedCount,
    orphanIds,
  };
};

// Execute if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('cleanupOrphanImages.js')) {
  const isDelete = process.argv.includes('--delete');
  const dryRun = !isDelete;

  connectDB(env.MONGODB_URI)
    .then(async () => {
      logger.info(`Starting cleanupOrphanImages task (dryRun=${dryRun})...`);
      const result = await runCleanupOrphanImages({ dryRun });
      logger.info('Cleanup summary:', result);
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      logger.error('Failed to run cleanupOrphanImages:', err);
      await disconnectDB().catch(() => {});
      process.exit(1);
    });
}

export default runCleanupOrphanImages;
