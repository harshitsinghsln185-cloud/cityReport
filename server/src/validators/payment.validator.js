import { z } from 'zod';

export const confirmPaymentSchema = {
  headers: z.object({
    'idempotency-key': z
      .string({ required_error: 'Idempotency-Key header is required' })
      .min(8, 'Idempotency-Key must be at least 8 characters')
      .max(128, 'Idempotency-Key too long'),
  }),
  params: z.object({
    paymentId: z.string({ required_error: 'Payment ID is required' }).trim(),
  }),
};

export const failPaymentSchema = {
  params: z.object({
    paymentId: z.string({ required_error: 'Payment ID is required' }).trim(),
  }),
  body: z.object({
    reason: z
      .string({ required_error: 'Failure reason is required' })
      .trim()
      .min(3, 'Failure reason must be at least 3 characters')
      .max(500, 'Failure reason must not exceed 500 characters'),
  }),
};

export default {
  confirmPaymentSchema,
  failPaymentSchema,
};
