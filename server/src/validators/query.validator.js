import { z } from 'zod';

export const createQuerySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(120),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

export const replyQuerySchema = z.object({
  reply: z
    .string({ required_error: 'Reply text is required' })
    .trim()
    .min(5, 'Reply must be at least 5 characters')
    .max(3000, 'Reply cannot exceed 3000 characters'),
});

export default {
  createQuerySchema,
  replyQuerySchema,
};
