import { z } from 'zod';

export const postMessageSchema = z.object({
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message cannot exceed 500 characters'),
});

export const updateDraftSchema = z.object({
  categoryId: z.string().optional(),
  title: z.string().trim().min(5).max(120).optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  suggestedPriority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      pincode: z.string().optional(),
    })
    .optional(),
  contactNumber: z.string().optional(),
});

export default {
  postMessageSchema,
  updateDraftSchema,
};
