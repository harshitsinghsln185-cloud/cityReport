import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
    email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
    phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    address: z.object({
      street: z.string().trim().min(1, 'Street is required'),
      city: z.string().trim().min(1, 'City is required'),
      state: z.string().trim().min(1, 'State is required'),
      pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be a 6-digit number'),
    }),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
};

export const verifyEmailSchema = {
  body: z.object({
    token: z.string().trim().min(1, 'Verification token is required'),
  }),
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    token: z.string().trim().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
};
