import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Phone number must be a valid 10-digit Indian mobile number')
    .optional(),
  address: z
    .object({
      street: z.string().trim().min(2, 'Street must be at least 2 characters'),
      city: z.string().trim().min(2, 'City must be at least 2 characters'),
      state: z.string().trim().min(2, 'State must be at least 2 characters'),
      pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
    })
    .optional(),
});

export default {
  updateProfileSchema,
};
