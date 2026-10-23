/**
 * Deterministic baseline severity and keyword scoring.
 * Used as standalone calculation and as a strict guardrail/circuit breaker for AI output.
 */

const KEYWORDS = {
  critical: [
    'sparking',
    'wire',
    'collapse',
    'fire',
    'gas',
    'bursting',
    'explosion',
    'live wire',
    'structural',
    'emergency',
  ],
  high: [
    'deep',
    'sewer',
    'open manhole',
    'dark',
    'overflow',
    'contaminated',
    'blockage',
    'flooding',
    'traffic stall',
  ],
  moderate: [
    'pothole',
    'slow',
    'dim',
    'puddle',
    'garbage',
    'bin',
    'smell',
    'leaking',
    'delay',
    'bump',
  ],
  minor: [
    'paint',
    'scratch',
    'faded',
    'cosmetic',
    'sign',
    'litter',
    'overgrown',
    'minor',
    'rust',
    'small',
  ],
};

const PRIORITY_MAP = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

/**
 * Computes deterministic rule severity integer (1 to 4).
 *
 * @param {string} [suggestedPriority='Medium']
 * @param {string} [description='']
 * @returns {number} Integer between 1 and 4
 */
export const computeRuleSeverity = (suggestedPriority = 'Medium', description = '') => {
  const baseScore = PRIORITY_MAP[suggestedPriority] || 2;
  const text = (description || '').toLowerCase();

  let criticalMatches = 0;
  let highMatches = 0;
  let moderateMatches = 0;
  let minorMatches = 0;

  for (const kw of KEYWORDS.critical) {
    if (text.includes(kw)) criticalMatches++;
  }
  for (const kw of KEYWORDS.high) {
    if (text.includes(kw)) highMatches++;
  }
  for (const kw of KEYWORDS.moderate) {
    if (text.includes(kw)) moderateMatches++;
  }
  for (const kw of KEYWORDS.minor) {
    if (text.includes(kw)) minorMatches++;
  }

  let finalSeverity = baseScore;

  if (criticalMatches > 0) {
    finalSeverity = Math.max(finalSeverity, 4);
  } else if (highMatches > 0) {
    finalSeverity = Math.max(finalSeverity, 3);
  } else if (minorMatches > 1 && baseScore <= 2) {
    finalSeverity = 1;
  } else if (moderateMatches > 0 && baseScore === 1) {
    finalSeverity = 2;
  }

  // Ensure bounded between 1 and 4
  return Math.max(1, Math.min(4, finalSeverity));
};

export default {
  computeRuleSeverity,
  KEYWORDS,
};
