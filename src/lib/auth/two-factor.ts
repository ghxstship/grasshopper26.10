/**
 * Two-Factor Authentication (2FA) System
 * Required for Legend roles and optional for all users
 */

import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { logger } from '@/lib/monitoring/logger';

/**
 * Generate 2FA secret for user
 */
export function generate2FASecret(userId: string, email: string): {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
} {
  const secret = authenticator.generateSecret();
  const appName = 'Grasshopper';
  const otpauthUrl = authenticator.keyuri(email, appName, secret);
  
  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  logger.info('Generated 2FA secret', { userId, email });

  return {
    secret,
    qrCodeUrl: otpauthUrl,
    backupCodes,
  };
}

/**
 * Generate QR code image
 */
export async function generateQRCode(otpauthUrl: string): Promise<string> {
  try {
    return await QRCode.toDataURL(otpauthUrl);
  } catch (error) {
    logger.error('Failed to generate QR code', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Verify 2FA token
 */
export function verify2FAToken(secret: string, token: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    logger.error('2FA verification failed', error);
    return false;
  }
}

/**
 * Verify backup code
 */
export function verifyBackupCode(
  backupCodes: string[],
  code: string
): { valid: boolean; remainingCodes?: string[] } {
  const normalizedCode = code.toUpperCase().trim();
  const index = backupCodes.indexOf(normalizedCode);

  if (index === -1) {
    return { valid: false };
  }

  // Remove used backup code
  const remainingCodes = backupCodes.filter((_, i) => i !== index);

  logger.info('Backup code used', { remainingCount: remainingCodes.length });

  return {
    valid: true,
    remainingCodes,
  };
}

/**
 * Check if 2FA is required for user
 */
export function is2FARequired(role: string): boolean {
  // Legend roles require 2FA
  const legendRoles = [
    'LEGEND_SUPER_ADMIN',
    'LEGEND_ADMIN',
    'LEGEND_DEVELOPER',
    'LEGEND_COLLABORATOR',
    'LEGEND_SUPPORT',
    'LEGEND_INCOGNITO',
  ];

  return legendRoles.includes(role);
}

/**
 * 2FA enforcement middleware
 */
export interface TwoFactorCheck {
  required: boolean;
  enabled: boolean;
  verified: boolean;
  canProceed: boolean;
  message?: string;
}

export function check2FAStatus(
  userRole: string,
  twoFactorEnabled: boolean,
  twoFactorVerified: boolean
): TwoFactorCheck {
  const required = is2FARequired(userRole);

  // Not required - can proceed
  if (!required) {
    return {
      required: false,
      enabled: twoFactorEnabled,
      verified: twoFactorVerified,
      canProceed: true,
    };
  }

  // Required but not enabled
  if (!twoFactorEnabled) {
    return {
      required: true,
      enabled: false,
      verified: false,
      canProceed: false,
      message: '2FA setup required for Legend roles',
    };
  }

  // Required and enabled but not verified this session
  if (!twoFactorVerified) {
    return {
      required: true,
      enabled: true,
      verified: false,
      canProceed: false,
      message: '2FA verification required',
    };
  }

  // All checks passed
  return {
    required: true,
    enabled: true,
    verified: true,
    canProceed: true,
  };
}

/**
 * Session 2FA verification
 */
const verifiedSessions = new Map<string, { userId: string; expiresAt: number }>();

export function mark2FAVerified(sessionId: string, userId: string, ttlMs: number = 8 * 60 * 60 * 1000): void {
  verifiedSessions.set(sessionId, {
    userId,
    expiresAt: Date.now() + ttlMs,
  });

  logger.info('2FA verified for session', { sessionId, userId });
}

export function is2FAVerifiedForSession(sessionId: string, userId: string): boolean {
  const session = verifiedSessions.get(sessionId);
  
  if (!session) return false;
  if (session.userId !== userId) return false;
  if (session.expiresAt < Date.now()) {
    verifiedSessions.delete(sessionId);
    return false;
  }

  return true;
}

export function clear2FAVerification(sessionId: string): void {
  verifiedSessions.delete(sessionId);
  logger.info('2FA verification cleared', { sessionId });
}

/**
 * Cleanup expired sessions periodically
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of verifiedSessions.entries()) {
      if (session.expiresAt < now) {
        verifiedSessions.delete(sessionId);
      }
    }
  }, 60 * 60 * 1000); // Every hour
}
