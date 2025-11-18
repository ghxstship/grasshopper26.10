import { z } from 'zod';

// File Type Enum
export const fileTypeSchema = z.enum([
  'IMAGE',
  'DOCUMENT',
  'VIDEO',
  'AUDIO',
  'ARCHIVE',
  'OTHER'
]);

// Upload File Schema
export const uploadFileSchema = z.object({
  file: z.instanceof(File),
  bucket: z.string().min(1),
  path: z.string().min(1).optional(),
  isPublic: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).optional()
});

// Upload Multiple Files Schema
export const uploadMultipleFilesSchema = z.object({
  files: z.array(z.instanceof(File)).min(1).max(10),
  bucket: z.string().min(1),
  path: z.string().min(1).optional(),
  isPublic: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).optional()
});

// Delete File Schema
export const deleteFileSchema = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1)
});

// Get Signed URL Schema
export const getSignedUrlSchema = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1),
  expiresIn: z.number().int().min(60).max(604800).default(3600)
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type UploadMultipleFilesInput = z.infer<typeof uploadMultipleFilesSchema>;
export type DeleteFileInput = z.infer<typeof deleteFileSchema>;
export type GetSignedUrlInput = z.infer<typeof getSignedUrlSchema>;
