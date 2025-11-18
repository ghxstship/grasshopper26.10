import { z } from 'zod';

// QR code generation schema
export const generateQRCodeSchema = z.object({
  type: z.enum(['ticket', 'credential', 'checkin', 'asset', 'custom']),
  data: z.record(z.string(), z.any()),
  format: z.enum(['png', 'svg', 'pdf']).default('png'),
  size: z.number().int().min(100).max(2000).default(512),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
  includeText: z.boolean().default(true),
  customText: z.string().max(100).optional(),
  foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
  logo: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
});

// QR code scan schema
export const scanQRCodeSchema = z.object({
  code: z.string().min(1, 'QR code data is required'),
  scannedBy: z.string().uuid('Invalid user ID'),
  scannedAt: z.string().datetime(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  deviceInfo: z.object({
    type: z.enum(['mobile', 'tablet', 'desktop', 'scanner']),
    os: z.string().optional(),
    browser: z.string().optional(),
  }).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// QR code validation schema
export const validateQRCodeSchema = z.object({
  code: z.string().min(1, 'QR code data is required'),
  type: z.enum(['ticket', 'credential', 'checkin', 'asset', 'custom']).optional(),
  checkExpiration: z.boolean().default(true),
  checkUsage: z.boolean().default(true),
});

// Batch QR code generation schema
export const batchGenerateQRCodesSchema = z.object({
  type: z.enum(['ticket', 'credential', 'checkin', 'asset', 'custom']),
  items: z.array(z.object({
    id: z.string(),
    data: z.record(z.string(), z.any()),
  })).min(1).max(1000),
  format: z.enum(['png', 'svg', 'pdf']).default('png'),
  size: z.number().int().min(100).max(2000).default(512),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
});

// QR code analytics schema
export const qrCodeAnalyticsSchema = z.object({
  qrCodeId: z.string().uuid('Invalid QR code ID').optional(),
  type: z.enum(['ticket', 'credential', 'checkin', 'asset', 'custom']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month', 'location', 'device']).default('day'),
});

export type GenerateQRCodeInput = z.infer<typeof generateQRCodeSchema>;
export type ScanQRCodeInput = z.infer<typeof scanQRCodeSchema>;
export type ValidateQRCodeInput = z.infer<typeof validateQRCodeSchema>;
export type BatchGenerateQRCodesInput = z.infer<typeof batchGenerateQRCodesSchema>;
export type QRCodeAnalyticsQuery = z.infer<typeof qrCodeAnalyticsSchema>;
