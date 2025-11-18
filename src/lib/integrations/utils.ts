/**
 * Utility functions for integrations
 */

import { IntegrationResponse } from './types';

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(data: T): IntegrationResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: any
): IntegrationResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}

/**
 * Validates required environment variables
 */
export function validateEnvVars(vars: Record<string, string | undefined>): void {
  const missing: string[] = [];
  
  for (const [key, value] of Object.entries(vars)) {
    if (!value) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Retries a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback?: T): T | null {
  try {
    return JSON.parse(json);
  } catch {
    return fallback ?? null;
  }
}

/**
 * Formats phone number to E.164 format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Add + prefix if not present
  return digits.startsWith('1') ? `+${digits}` : `+1${digits}`;
}

/**
 * Validates email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generates a unique ID
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Sanitizes filename for storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .toLowerCase();
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Validates file type
 */
export function isValidFileType(
  filename: string,
  allowedTypes: string[]
): boolean {
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
}
