import { z } from 'zod';

// Profile update validation
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  website: z.string().url().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  dateOfBirth: z.string().datetime().or(z.date()).optional(),
  avatar: z.string().url().optional(),
  coverImage: z.string().url().optional(),
});

// Profile settings validation
export const profileSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
  language: z.string().length(2).default('en'),
  timezone: z.string().default('UTC'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  currency: z.string().length(3).default('USD'),
});

// Privacy settings validation
export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS_ONLY']).default('PUBLIC'),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  showLocation: z.boolean().default(true),
  allowFriendRequests: z.boolean().default(true),
  allowMessages: z.boolean().default(true),
});

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Email change validation
export const emailChangeSchema = z.object({
  newEmail: z.string().email(),
  password: z.string().min(8),
});

// Phone verification validation
export const phoneVerificationSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  code: z.string().length(6).regex(/^\d{6}$/),
});

// Account deletion validation
export const accountDeletionSchema = z.object({
  password: z.string().min(8),
  confirmation: z.literal('DELETE'),
  reason: z.string().max(1000).optional(),
});

// Export types
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type ProfileSettings = z.infer<typeof profileSettingsSchema>;
export type PrivacySettings = z.infer<typeof privacySettingsSchema>;
export type PasswordChange = z.infer<typeof passwordChangeSchema>;
export type EmailChange = z.infer<typeof emailChangeSchema>;
export type PhoneVerification = z.infer<typeof phoneVerificationSchema>;
export type AccountDeletion = z.infer<typeof accountDeletionSchema>;
