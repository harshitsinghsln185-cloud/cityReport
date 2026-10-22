/**
 * Validates file buffer against known binary magic numbers (file signatures).
 * Prevents MIME spoofing (e.g. an executable or script disguised with a .jpg extension).
 *
 * Supported formats:
 * - JPEG: FF D8 FF
 * - PNG: 89 50 4E 47 0D 0A 1A 0A
 * - WebP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
 *
 * @param {Buffer} buffer
 * @returns {{ isValid: boolean, format?: 'jpeg' | 'png' | 'webp' }}
 */
export const validateImageBuffer = (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 12) {
    return { isValid: false };
  }

  // 1. JPEG check: Starts with FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, format: 'jpeg' };
  }

  // 2. PNG check: Starts with 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;

  if (isPng) {
    return { isValid: true, format: 'png' };
  }

  // 3. WebP check: Starts with "RIFF" and has "WEBP" at bytes 8-11
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46; // "RIFF"
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50; // "WEBP"

  if (isRiff && isWebp) {
    return { isValid: true, format: 'webp' };
  }

  return { isValid: false };
};

export default {
  validateImageBuffer,
};
