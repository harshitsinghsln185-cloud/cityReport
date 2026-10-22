import { z } from 'zod';

export const registerResolverSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  address: z.union([
    z.string().transform((val) => JSON.parse(val)),
    z.object({
      street: z.string().trim().min(2),
      city: z.string().trim().min(2),
      state: z.string().trim().min(2),
      pincode: z.string().trim().regex(/^\d{6}$/),
    }),
  ]),
  skills: z.union([
    z.string().transform((val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return val.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }),
    z.array(z.string().min(1)),
  ]),
  serviceAddress: z.string().trim().min(5, 'Service address must be at least 5 characters'),
  lat: z.union([z.string().transform(Number), z.number()]).refine((val) => val >= -90 && val <= 90, {
    message: 'Latitude must be between -90 and 90',
  }),
  lng: z.union([z.string().transform(Number), z.number()]).refine((val) => val >= -180 && val <= 180, {
    message: 'Longitude must be between -180 and 180',
  }),
  serviceRadiusKm: z
    .union([z.string().transform(Number), z.number()])
    .refine((val) => val >= 1 && val <= 50, {
      message: 'Coverage radius must be between 1 and 50 km',
    }),
});

export const updateResolverSettingsSchema = z.object({
  serviceRadiusKm: z.number().int().min(1).max(50).optional(),
  isAvailable: z.boolean().optional(),
  skills: z.array(z.string().min(1)).min(1, 'At least one skill category is required').optional(),
});

export const rejectResolverSchema = z.object({
  reason: z
    .string({ required_error: 'Rejection reason is required' })
    .trim()
    .min(5, 'Rejection reason must be at least 5 characters')
    .max(500, 'Rejection reason cannot exceed 500 characters'),
});

export default {
  registerResolverSchema,
  updateResolverSettingsSchema,
  rejectResolverSchema,
};
