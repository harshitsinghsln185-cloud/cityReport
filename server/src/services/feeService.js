import { Category } from '../models/Category.js';
import { FeeSettings } from '../models/FeeSettings.js';
import geoService from './geoService.js';
import aiService from './aiService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Maps severity integer (1 to 4) to FeeSettings multiplier.
 *
 * @param {number} severity - 1, 2, 3, or 4
 * @param {Object} multipliers - { minor, moderate, high, critical }
 * @returns {number} Float multiplier
 */
export const getSeverityMultiplier = (severity, multipliers) => {
  switch (severity) {
    case 1:
      return multipliers.minor || 1.0;
    case 2:
      return multipliers.moderate || 1.3;
    case 3:
      return multipliers.high || 1.6;
    case 4:
      return multipliers.critical || 2.0;
    default:
      return multipliers.moderate || 1.3;
  }
};

/**
 * Calculates a civic issue fee quote using the mathematical formulas in Section 3.2 of FINANCE.md.
 * Discards all client-supplied prices; pricing is strictly server-computed and deterministic.
 *
 * @param {Object} params
 * @param {string} params.categoryId
 * @param {[number, number]} params.coordinates - [lng, lat]
 * @param {string} [params.suggestedPriority='Medium']
 * @param {string} [params.description='']
 * @param {number | null} [params.overrideDistanceKm=null] - For unit testing / simulation
 * @param {number | null} [params.overrideSeverityMultiplier=null] - For manual quoting
 * @returns {Promise<{ hasEligibleResolver: boolean, fee: Object | null, aiAssessment: Object | null, nearestResolver: Object | null }>}
 */
export const calculateQuote = async ({
  categoryId,
  coordinates,
  suggestedPriority = 'Medium',
  description = '',
  overrideDistanceKm = null,
  overrideSeverityMultiplier = null,
}) => {
  const category = await Category.findById(categoryId);
  if (!category || !category.isActive) {
    throw new AppError('Civic service category not found or inactive', 404);
  }

  const feeSettings = await FeeSettings.getSettings();

  // 1. Find nearest certified eligible resolver
  let distanceKm = 0;
  let nearestResolver = null;

  if (overrideDistanceKm !== null) {
    distanceKm = overrideDistanceKm;
  } else {
    const discovery = await geoService.findNearestEligibleResolver({
      categoryId: category._id,
      coordinates,
    });

    if (!discovery) {
      // No eligible resolver in radius -> issue will be AwaitingQuote
      return {
        hasEligibleResolver: false,
        fee: null,
        aiAssessment: null,
        nearestResolver: null,
      };
    }

    distanceKm = discovery.distanceKm;
    nearestResolver = discovery.resolver;
  }

  // 2. Assess severity
  const aiAssessment = await aiService.assessSeverity({
    categoryName: category.name,
    description,
    suggestedPriority,
  });

  const severityMultiplier =
    overrideSeverityMultiplier !== null
      ? overrideSeverityMultiplier
      : getSeverityMultiplier(aiAssessment.severity, feeSettings.multipliers);

  // 3. Distance fee calculation (in integer paise)
  // distanceFee = max(0, distanceKm - freeKm) * perKmRate
  const billableKm = Math.max(0, distanceKm - feeSettings.freeKm);
  const distanceFeePaise = Math.round(billableKm * feeSettings.perKmRatePaise);

  // 4. Base * Severity
  const baseSeverityPaise = Math.round(category.baseFeePaise * severityMultiplier);

  // 5. Subtotal
  const subtotalPaise = baseSeverityPaise + distanceFeePaise;

  // 6. Round to nearest ₹10 (1000 paise)
  const roundedPaise = Math.round(subtotalPaise / 1000) * 1000;

  // 7. Clamp within [minFeePaise, maxFeePaise]
  const totalPaise = Math.min(
    Math.max(roundedPaise, feeSettings.minFeePaise),
    feeSettings.maxFeePaise
  );

  // 8. 50% split with floor protection
  const advancePaise = Math.floor(totalPaise / 2);
  const balancePaise = totalPaise - advancePaise;

  const feeSnapshot = {
    categoryBaseFeePaise: category.baseFeePaise,
    severityMultiplier,
    distanceKm,
    freeKm: feeSettings.freeKm,
    perKmRatePaise: feeSettings.perKmRatePaise,
    distanceFeePaise,
    totalPaise,
    advancePaise,
    balancePaise,
    commissionPercent: feeSettings.commissionPercent,
    isManualQuote: false,
    manualQuoteSetBy: null,
  };

  return {
    hasEligibleResolver: true,
    fee: feeSnapshot,
    aiAssessment,
    nearestResolver,
  };
};

export default {
  calculateQuote,
  getSeverityMultiplier,
};
