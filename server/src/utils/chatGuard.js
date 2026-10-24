/**
 * Security and sanitization utilities for civic chatbot sessions.
 */

const PII_PATTERNS = [
  { regex: /(\+?91[\-\s]?)?[6-9]\d{9}/g, replacement: '[REDACTED_PHONE]' },
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[REDACTED_EMAIL]' },
  { regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED_CARD]' },
  { regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, replacement: '[REDACTED_ID]' },
];

const INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?(?:previous\s+)?instructions/i,
  /system\s+prompt/i,
  /set\s+fee\s+(?:to\s+)?0/i,
  /bypass\s+(?:fee|payment|verification)/i,
  /admin\s+override/i,
  /make\s+(?:it\s+)?free/i,
  /discount\s+100%/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
];

// In-memory sliding window store for session rate limits: sessionId -> Array<number> (timestamps)
const sessionTimestamps = new Map();
const sessionTotalCount = new Map();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_MESSAGES_PER_MINUTE = 15;
const MAX_TOTAL_MESSAGES = 30;

/**
 * Strips PII, strips HTML injection, checks length bounds, and flags prompt injection.
 *
 * @param {string} text - Raw user message
 * @returns {{ cleanText: string, isFlagged: boolean }}
 */
export const sanitizeChatInput = (text = '') => {
  let cleaned = String(text || '');

  // 1. Strip raw HTML tags / script injection
  cleaned = cleaned.replace(/<[^>]*>?/gm, '');

  // 2. Check for adversarial / prompt injection patterns
  let isFlagged = false;
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(cleaned)) {
      isFlagged = true;
      break;
    }
  }

  // 3. Scrub PII
  for (const { regex, replacement } of PII_PATTERNS) {
    cleaned = cleaned.replace(regex, replacement);
  }

  // 4. Enforce 500 characters cap
  if (cleaned.length > 500) {
    cleaned = cleaned.substring(0, 500);
  }

  return {
    cleanText: cleaned.trim(),
    isFlagged,
  };
};

/**
 * Enforces per-session message rate limits (15 msgs/min, 30 msgs total).
 *
 * @param {string} sessionId
 * @returns {boolean} True if within rate limit; False if rate limit exceeded
 */
export const checkSessionRateLimit = (sessionId) => {
  if (!sessionId) return false;

  const now = Date.now();
  const timestamps = sessionTimestamps.get(sessionId) || [];
  const validTimestamps = timestamps.filter((t) => now - t < WINDOW_MS);

  if (validTimestamps.length >= MAX_MESSAGES_PER_MINUTE) {
    return false;
  }

  const currentTotal = (sessionTotalCount.get(sessionId) || 0) + 1;
  if (currentTotal > MAX_TOTAL_MESSAGES) {
    return false;
  }

  validTimestamps.push(now);
  sessionTimestamps.set(sessionId, validTimestamps);
  sessionTotalCount.set(sessionId, currentTotal);

  return true;
};

/**
 * Resets rate limit tracker (useful in automated test suites).
 */
export const resetChatLimits = () => {
  sessionTimestamps.clear();
  sessionTotalCount.clear();
};

export default {
  sanitizeChatInput,
  checkSessionRateLimit,
  resetChatLimits,
};
