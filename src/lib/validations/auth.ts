import { z } from 'zod';
import { emailSchema, userRoleSchema } from './common';

// User registration
export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100),
  role: userRoleSchema.optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// User login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Password reset request
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

// Password reset
export const passwordResetSchema = z.object({
  token: z.string(),
  password: z.string().min(8).max(100),
});

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

// Email verification
export const emailVerificationSchema = z.object({
  token: z.string(),
});

export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;

// Update profile
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  image: z.string().url().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Change password
export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).max(100),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
