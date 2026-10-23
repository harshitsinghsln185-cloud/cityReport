import { z } from 'zod';

export const createIssueSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  category: z
    .string({ required_error: 'Category is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID'),
  suggestedPriority: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .default('Medium'),
  contactNumber: z
    .string({ required_error: 'Contact number is required' })
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Contact number must be a valid 10-digit Indian mobile number'),
  lat: z.union([z.string().transform(Number), z.number()]).refine((val) => val >= -90 && val <= 90, {
    message: 'Latitude must be between -90 and 90',
  }),
  lng: z.union([z.string().transform(Number), z.number()]).refine((val) => val >= -180 && val <= 180, {
    message: 'Longitude must be between -180 and 180',
  }),
  address: z.union([
    z.string().transform((val) => {
      try {
        return JSON.parse(val);
      } catch {
        return { street: val, city: 'New Delhi', pincode: '110001' };
      }
    }),
    z.object({
      street: z.string().trim().min(2, 'Street address is required'),
      city: z.string().trim().min(2, 'City is required'),
      pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    }),
  ]),
  source: z.enum(['form', 'chatbot']).default('form'),
});

export const estimateQuoteSchema = z.object({
  category: z
    .string({ required_error: 'Category is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID'),
  lat: z.union([z.string().transform(Number), z.number()]).refine((val) => val >= -90 && val <= 90, {
    message: 'Latitude must be between -90 and 90',
  }),
  lng: z.union([z.string().transform(Number), z.number()]).refine((val) => val >= -180 && val <= 180, {
    message: 'Longitude must be between -180 and 180',
  }),
  suggestedPriority: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .default('Medium'),
  description: z.string().optional().default(''),
});

export default {
  createIssueSchema,
  estimateQuoteSchema,
};
