/**
 * Token generation and verification utilities
 */

import crypto from 'crypto';

/**
 * Generate a random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a verification token with expiry
 */
export function generateVerificationToken(): {
  token: string;
  expires: Date;
} {
  return {
    token: generateToken(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };
}

/**
 * Generate a password reset token with expiry
 */
export function generatePasswordResetToken(): {
  token: string;
  expires: Date;
} {
  return {
    token: generateToken(),
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  };
}

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Generate an API key
 */
export function generateApiKey(prefix: string = 'gvt'): string {
  const key = generateToken(24);
  return `${prefix}_${key}`;
}

/**
 * Hash a token for storage (one-way)
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a token against its hash
 */
export function verifyTokenHash(token: string, hash: string): boolean {
  return hashToken(token) === hash;
}
