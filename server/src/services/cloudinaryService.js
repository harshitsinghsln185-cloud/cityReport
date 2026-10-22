import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';

const isMockCredentials =
  env.CLOUDINARY_API_KEY === '123456789012345' ||
  !env.CLOUDINARY_API_KEY ||
  env.NODE_ENV === 'test';

/**
 * Uploads a memory buffer to Cloudinary using a readable stream.
 *
 * @param {Buffer} buffer
 * @param {Object} options - e.g. { folder, public_id, transformation, access_type }
 * @returns {Promise<Object>} FileSchema formatted document
 */
export const uploadStream = async (buffer, options = {}) => {
  if (isMockCredentials) {
    logger.info(`[DEV CLOUDINARY MOCK] Simulating upload for folder: ${options.folder}`);
    const mockId = options.public_id || `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const fullPublicId = options.folder ? `${options.folder}/${mockId}` : mockId;
    return {
      publicId: fullPublicId,
      url: `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/${fullPublicId}.jpg`,
      resourceType: 'image',
      format: options.format || 'jpg',
      bytes: buffer.length,
      width: 800,
      height: 800,
      accessType: options.access_type || 'public',
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', { error });
          return reject(new AppError(`Cloudinary upload failed: ${error.message}`, 500));
        }

        resolve({
          publicId: result.public_id,
          url: result.secure_url || result.url,
          resourceType: result.resource_type || 'image',
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          accessType: options.access_type || 'public',
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

/**
 * Permanently deletes an asset from Cloudinary by its public ID.
 *
 * @param {string} publicId
 * @returns {Promise<void>}
 */
export const destroyAsset = async (publicId) => {
  if (!publicId) return;

  if (isMockCredentials) {
    logger.info(`[DEV CLOUDINARY MOCK] Simulating deletion of asset: ${publicId}`);
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Cloudinary asset destroyed: ${publicId} (result: ${result.result})`);
  } catch (error) {
    logger.warn(`Failed to destroy Cloudinary asset: ${publicId}`, { error: error.message });
  }
};

/**
 * Generates an authenticated, time-limited download URL for protected media (e.g. ID proofs).
 *
 * @param {string} publicId
 * @param {number} [expiresInMinutes=60]
 * @returns {string}
 */
export const generateSignedUrl = (publicId, expiresInMinutes = 60) => {
  if (!publicId) return '';

  if (isMockCredentials) {
    return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/s--mock--/${publicId}`;
  }

  const expiresAt = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  return cloudinary.utils.private_download_url(publicId, 'jpg', {
    expires_at: expiresAt,
  });
};

export default {
  uploadStream,
  destroyAsset,
  generateSignedUrl,
};
