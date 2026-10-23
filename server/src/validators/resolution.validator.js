import { z } from 'zod';

export const rejectAssignmentSchema = z.object({
  reason: z
    .string({
      required_error: 'Decline reason is required',
    })
    .trim()
    .min(5, 'Reason for declining assignment must be at least 5 characters long')
    .max(500, 'Reason cannot exceed 500 characters'),
});

export const resolutionProofSchema = z.object({
  remarks: z
    .string({
      required_error: 'Resolution remarks are required',
    })
    .trim()
    .min(10, 'Completion remarks must be at least 10 characters long')
    .max(2000, 'Remarks cannot exceed 2000 characters'),
});

export default {
  rejectAssignmentSchema,
  resolutionProofSchema,
};
