import { z } from 'zod';

export const updateFeeSettingsSchema = z
  .object({
    freeKm: z
      .number({ required_error: 'freeKm is required' })
      .int('freeKm must be an integer')
      .min(0, 'freeKm must be at least 0')
      .max(20, 'freeKm cannot exceed 20'),
    perKmRatePaise: z
      .number({ required_error: 'perKmRatePaise is required' })
      .int('perKmRatePaise must be an integer')
      .min(0, 'perKmRatePaise cannot be negative'),
    minFeePaise: z
      .number({ required_error: 'minFeePaise is required' })
      .int('minFeePaise must be an integer')
      .min(1000, 'minFeePaise must be at least ₹10 (1000 paise)'),
    maxFeePaise: z
      .number({ required_error: 'maxFeePaise is required' })
      .int('maxFeePaise must be an integer')
      .max(10000000, 'maxFeePaise cannot exceed ₹100,000 (10000000 paise)'),
    commissionPercent: z
      .number({ required_error: 'commissionPercent is required' })
      .min(0, 'commissionPercent cannot be negative')
      .max(50, 'commissionPercent cannot exceed 50%'),
    multipliers: z.object({
      minor: z.number().min(1.0, 'Minor multiplier must be >= 1.0').max(5.0, 'Minor multiplier must be <= 5.0'),
      moderate: z.number().min(1.0, 'Moderate multiplier must be >= 1.0').max(5.0, 'Moderate multiplier must be <= 5.0'),
      high: z.number().min(1.0, 'High multiplier must be >= 1.0').max(5.0, 'High multiplier must be <= 5.0'),
      critical: z.number().min(1.0, 'Critical multiplier must be >= 1.0').max(5.0, 'Critical multiplier must be <= 5.0'),
    }),
  })
  .refine((data) => data.minFeePaise <= data.maxFeePaise, {
    message: 'minFeePaise cannot exceed maxFeePaise',
    path: ['minFeePaise'],
  });

export default {
  updateFeeSettingsSchema,
};
