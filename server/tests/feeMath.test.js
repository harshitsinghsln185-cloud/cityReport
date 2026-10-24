import { describe, it, expect } from 'vitest';

/**
 * Pure calculation helper replicating feeService.js and FINANCE.md formulas
 */
export const calculateFeeQuote = ({
  baseFeePaise,
  severityMultiplier,
  distanceKm,
  freeKm = 3,
  perKmRatePaise = 1500,
  minFeePaise = 10000,
  maxFeePaise = 500000,
  commissionPercent = 10,
}) => {
  // 1. Distance fee in integer paise
  const billableKm = Math.max(0, distanceKm - freeKm);
  const distanceFeePaise = Math.round(billableKm * perKmRatePaise);

  // 2. Base * severity multiplier
  const baseSeverityPaise = Math.round(baseFeePaise * severityMultiplier);

  // 3. Subtotal
  const subtotalPaise = baseSeverityPaise + distanceFeePaise;

  // 4. Round to nearest ₹10 (1000 paise)
  const roundedPaise = Math.round(subtotalPaise / 1000) * 1000;

  // 5. Clamp within [minFeePaise, maxFeePaise]
  const totalPaise = Math.min(Math.max(roundedPaise, minFeePaise), maxFeePaise);

  // 6. 50% split with floor protection
  const advancePaise = Math.floor(totalPaise / 2);
  const balancePaise = totalPaise - advancePaise;

  // 7. Commission & resolver payout
  const commissionPaise = Math.round(totalPaise * (commissionPercent / 100));
  const resolverPayoutPaise = totalPaise - commissionPaise;

  return {
    distanceFeePaise,
    subtotalPaise,
    roundedPaise,
    totalPaise,
    advancePaise,
    balancePaise,
    commissionPaise,
    resolverPayoutPaise,
  };
};

describe('M13 Security & Hardening: 5 Worked Numeric Fee Test Vectors', () => {
  it('Vector 1: Standard Drainage Repair (Worked Example Section 3.2)', () => {
    const result = calculateFeeQuote({
      baseFeePaise: 50000, // ₹500
      severityMultiplier: 1.6, // High
      distanceKm: 7.0,
      freeKm: 3,
      perKmRatePaise: 1500,
      minFeePaise: 10000,
      maxFeePaise: 500000,
      commissionPercent: 10,
    });

    expect(result.distanceFeePaise).toBe(6000); // 4km * 1500
    expect(result.subtotalPaise).toBe(86000); // 80000 + 6000
    expect(result.totalPaise).toBe(86000); // ₹860
    expect(result.advancePaise).toBe(43000); // ₹430 (50%)
    expect(result.balancePaise).toBe(43000); // ₹430 (50%)
    expect(result.commissionPaise).toBe(8600); // ₹86 (10%)
    expect(result.resolverPayoutPaise).toBe(77400); // ₹774
    expect(result.advancePaise + result.balancePaise).toBe(result.totalPaise);
  });

  it('Vector 2: Local Garbage Overflow (Inside Free Radius, Odd Math Check)', () => {
    const result = calculateFeeQuote({
      baseFeePaise: 30000, // ₹300
      severityMultiplier: 1.3, // Moderate
      distanceKm: 2.4, // < freeKm (3km)
      freeKm: 3,
      perKmRatePaise: 1500,
      commissionPercent: 10,
    });

    expect(result.distanceFeePaise).toBe(0);
    expect(result.subtotalPaise).toBe(39000);
    expect(result.totalPaise).toBe(39000); // ₹390
    expect(result.advancePaise).toBe(19500); // ₹195
    expect(result.balancePaise).toBe(19500); // ₹195
    expect(result.commissionPaise).toBe(3900); // ₹39
    expect(result.resolverPayoutPaise).toBe(35100); // ₹351
    expect(result.advancePaise + result.balancePaise).toBe(result.totalPaise);
  });

  it('Vector 3: Critical Electrical Sparking (Fractional Km Rounding)', () => {
    const result = calculateFeeQuote({
      baseFeePaise: 35000, // ₹350
      severityMultiplier: 2.0, // Critical
      distanceKm: 8.35, // 5.35 billable km
      freeKm: 3,
      perKmRatePaise: 1500,
      commissionPercent: 10,
    });

    expect(result.distanceFeePaise).toBe(8025); // Math.round(5.35 * 1500)
    expect(result.subtotalPaise).toBe(78025); // 70000 + 8025
    expect(result.roundedPaise).toBe(78000); // round to nearest 1000 paise (₹10)
    expect(result.totalPaise).toBe(78000); // ₹780
    expect(result.advancePaise).toBe(39000); // ₹390
    expect(result.balancePaise).toBe(39000); // ₹390
    expect(result.commissionPaise).toBe(7800); // ₹78
    expect(result.resolverPayoutPaise).toBe(70200); // ₹702
    expect(result.advancePaise + result.balancePaise).toBe(result.totalPaise);
  });

  it('Vector 4: Minor Pothole (Minimum Fee Clamp Trigger)', () => {
    const result = calculateFeeQuote({
      baseFeePaise: 5000, // ₹50 artificially low
      severityMultiplier: 1.0, // Minor
      distanceKm: 1.5,
      freeKm: 3,
      minFeePaise: 10000, // ₹100 floor
      maxFeePaise: 500000,
      commissionPercent: 10,
    });

    expect(result.subtotalPaise).toBe(5000);
    expect(result.totalPaise).toBe(10000); // Clamped up to minFeePaise (₹100)
    expect(result.advancePaise).toBe(5000); // ₹50
    expect(result.balancePaise).toBe(5000); // ₹50
    expect(result.commissionPaise).toBe(1000); // ₹10
    expect(result.resolverPayoutPaise).toBe(9000); // ₹90
    expect(result.advancePaise + result.balancePaise).toBe(result.totalPaise);
  });

  it('Vector 5: Massive Road Repair with Long Distance (Odd Cent Commission)', () => {
    const result = calculateFeeQuote({
      baseFeePaise: 60000, // ₹600
      severityMultiplier: 2.0, // Critical
      distanceKm: 19.7, // 16.7 billable km
      freeKm: 3,
      perKmRatePaise: 1500,
      commissionPercent: 15, // Custom 15%
    });

    expect(result.distanceFeePaise).toBe(25050); // 16.7 * 1500
    expect(result.subtotalPaise).toBe(145050); // 120000 + 25050
    expect(result.roundedPaise).toBe(145000); // round to nearest ₹10
    expect(result.totalPaise).toBe(145000); // ₹1450
    expect(result.advancePaise).toBe(72500); // ₹725
    expect(result.balancePaise).toBe(72500); // ₹725
    expect(result.commissionPaise).toBe(21750); // ₹217.50 (15%)
    expect(result.resolverPayoutPaise).toBe(123250); // ₹1232.50
    expect(result.advancePaise + result.balancePaise).toBe(result.totalPaise);
  });

  it('Clamp Limits: Massive quote is capped at maxFeePaise (₹5,000 / 500,000 paise)', () => {
    const result = calculateFeeQuote({
      baseFeePaise: 400000,
      severityMultiplier: 2.0,
      distanceKm: 50.0,
      freeKm: 3,
      perKmRatePaise: 2000,
      minFeePaise: 10000,
      maxFeePaise: 500000,
      commissionPercent: 10,
    });

    expect(result.subtotalPaise).toBeGreaterThan(500000);
    expect(result.totalPaise).toBe(500000); // Clamped at maxFeePaise
    expect(result.advancePaise).toBe(250000);
    expect(result.balancePaise).toBe(250000);
    expect(result.advancePaise + result.balancePaise).toBe(500000);
  });

  it('Integer Invariant: Odd total amounts guarantee exact floor advance and balance parity', () => {
    // Artificial test for odd amount e.g. 10010 paise
    const totalPaise = 10010;
    const advancePaise = Math.floor(totalPaise / 2);
    const balancePaise = totalPaise - advancePaise;

    expect(advancePaise).toBe(5005);
    expect(balancePaise).toBe(5005);
    expect(advancePaise + balancePaise).toBe(totalPaise);

    // If an odd rupee occurred (e.g. 10001)
    const oddPaise = 10001;
    const adv = Math.floor(oddPaise / 2);
    const bal = oddPaise - adv;
    expect(adv).toBe(5000);
    expect(bal).toBe(5001);
    expect(adv + bal).toBe(oddPaise);
  });
});
