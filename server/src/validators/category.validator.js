import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  slug: z
    .string({ required_error: 'Slug is required' })
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  baseFeePaise: z
    .number({ required_error: 'Base fee in paise is required' })
    .int('Base fee in paise must be a whole integer')
    .nonnegative('Base fee cannot be negative'),
  icon: z.string().trim().optional().default('alert-circle'),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  baseFeePaise: z
    .number()
    .int('Base fee in paise must be a whole integer')
    .nonnegative('Base fee cannot be negative')
    .optional(),
  icon: z.string().trim().optional(),
});

export const toggleCategoryStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'isActive boolean flag is required' }),
});

export default {
  createCategorySchema,
  updateCategorySchema,
  toggleCategoryStatusSchema,
};
