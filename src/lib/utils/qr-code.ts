/**
 * QR Code Generation Utility
 * Provides QR code generation for tickets, passes, and credentials
 */

import QRCode from 'qrcode';

export interface QRCodeOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  type?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
  margin?: number;
  width?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export interface QRCodeData {
  type: 'ticket' | 'pass' | 'credential' | 'asset' | 'access';
  id: string;
  userId?: string;
  eventId?: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
  signature?: string;
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(
  data: string | QRCodeData,
  options: QRCodeOptions = {}
): Promise<string> {
  const qrOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel || 'H',
    type: (options.type || 'image/png') as 'image/png',
    quality: options.quality || 0.95,
    margin: options.margin || 1,
    width: options.width || 512,
    color: options.color || {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };

  const dataString = typeof data === 'string' ? data : JSON.stringify(data);

  return new Promise<string>((resolve, reject) => {
    QRCode.toDataURL(dataString, qrOptions as any, (error: Error | null | undefined, url: string) => {
      if (error) {
        console.error('Error generating QR code:', error);
        reject(new Error('Failed to generate QR code'));
      } else {
        resolve(url);
      }
    });
  });
}

/**
 * Generate QR code as buffer
 */
export async function generateQRCodeBuffer(
  data: string | QRCodeData,
  options: Partial<QRCodeOptions> = {}
): Promise<Buffer> {
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);

  try {
    const buffer = await QRCode.toBuffer(dataString, {
      errorCorrectionLevel: options.errorCorrectionLevel || 'H',
      margin: options.margin || 1,
      width: options.width || 512,
      color: options.color,
    });
    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

/**
 * Generate branded QR code with GVTEWAY colors
 */
export async function generateBrandedQRCode(
  data: string | QRCodeData,
  brand: 'gvteway' | 'compvss' | 'atlvs' = 'gvteway'
): Promise<string> {
  const brandColors = {
    gvteway: { dark: '#EF4444', light: '#000000' },
    compvss: { dark: '#3B82F6', light: '#000000' },
    atlvs: { dark: '#10B981', light: '#000000' },
  };

  return generateQRCode(data, {
    color: brandColors[brand],
    width: 512,
    errorCorrectionLevel: 'H',
  });
}

/**
 * Generate ticket QR code
 */
export async function generateTicketQRCode(
  ticketId: string,
  userId: string,
  eventId: string,
  metadata?: Record<string, any>
): Promise<string> {
  const qrData: QRCodeData = {
    type: 'ticket',
    id: ticketId,
    userId,
    eventId,
    metadata,
    timestamp: Date.now(),
  };

  return generateBrandedQRCode(qrData, 'gvteway');
}

/**
 * Generate wallet pass QR code
 */
export async function generatePassQRCode(
  passId: string,
  userId: string,
  passType: string,
  metadata?: Record<string, any>
): Promise<string> {
  const qrData: QRCodeData = {
    type: 'pass',
    id: passId,
    userId,
    metadata: { ...metadata, passType },
    timestamp: Date.now(),
  };

  return generateBrandedQRCode(qrData, 'gvteway');
}

/**
 * Generate credential QR code
 */
export async function generateCredentialQRCode(
  credentialId: string,
  userId: string,
  metadata?: Record<string, any>
): Promise<string> {
  const qrData: QRCodeData = {
    type: 'credential',
    id: credentialId,
    userId,
    metadata,
    timestamp: Date.now(),
  };

  return generateBrandedQRCode(qrData, 'compvss');
}

/**
 * Generate asset QR code for ATLVS
 */
export async function generateAssetQRCode(
  assetId: string,
  assetType: string,
  metadata?: Record<string, any>
): Promise<string> {
  const qrData: QRCodeData = {
    type: 'asset',
    id: assetId,
    metadata: { ...metadata, assetType },
    timestamp: Date.now(),
  };

  return generateBrandedQRCode(qrData, 'atlvs');
}

/**
 * Parse QR code data
 */
export function parseQRCodeData(dataString: string): QRCodeData | null {
  try {
    const data = JSON.parse(dataString);
    if (data.type && data.id && data.timestamp) {
      return data as QRCodeData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate QR code data
 */
export function validateQRCodeData(
  data: QRCodeData,
  maxAge: number = 24 * 60 * 60 * 1000 // 24 hours
): boolean {
  const now = Date.now();
  const age = now - data.timestamp;

  if (age > maxAge) {
    return false;
  }

  if (!data.type || !data.id) {
    return false;
  }

  return true;
}

/**
 * Generate verification URL with QR code
 */
export function generateVerificationURL(
  baseUrl: string,
  qrData: QRCodeData
): string {
  const params = new URLSearchParams({
    type: qrData.type,
    id: qrData.id,
    timestamp: qrData.timestamp.toString(),
  });

  if (qrData.userId) {
    params.append('userId', qrData.userId);
  }

  if (qrData.eventId) {
    params.append('eventId', qrData.eventId);
  }

  return `${baseUrl}/verify?${params.toString()}`;
}
