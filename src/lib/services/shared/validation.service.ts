/**
 * Validation Service
 * Provides data validation and sanitization utilities
 */

import { z } from 'zod';

export class ValidationService {
  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailSchema = z.string().email();
    return emailSchema.safeParse(email).success;
  }

  /**
   * Validate phone number
   */
  isValidPhone(phone: string): boolean {
    const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
    return phoneSchema.safeParse(phone).success;
  }

  /**
   * Validate URL
   */
  isValidURL(url: string): boolean {
    const urlSchema = z.string().url();
    return urlSchema.safeParse(url).success;
  }

  /**
   * Validate UUID
   */
  isValidUUID(uuid: string): boolean {
    const uuidSchema = z.string().uuid();
    return uuidSchema.safeParse(uuid).success;
  }

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(html: string): string {
    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '"')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitize string for SQL (basic)
   */
  sanitizeSQL(input: string): string {
    return input.replace(/['";\\]/g, '');
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate credit card number (Luhn algorithm)
   */
  isValidCreditCard(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');

    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate date range
   */
  isValidDateRange(startDate: Date, endDate: Date): boolean {
    return startDate < endDate;
  }

  /**
   * Validate age (must be 18+)
   */
  isValidAge(birthDate: Date): boolean {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }

    return age >= 18;
  }

  /**
   * Validate file size
   */
  isValidFileSize(sizeInBytes: number, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return sizeInBytes <= maxSizeInBytes;
  }

  /**
   * Validate file type
   */
  isValidFileType(fileName: string, allowedTypes: string[]): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  }

  /**
   * Validate JSON string
   */
  isValidJSON(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate postal code (US format)
   */
  isValidPostalCode(postalCode: string, country = 'US'): boolean {
    const patterns: Record<string, RegExp> = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
      UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/,
    };

    const pattern = patterns[country];
    return pattern ? pattern.test(postalCode) : false;
  }

  /**
   * Validate username
   */
  isValidUsername(username: string): { valid: boolean; error?: string } {
    if (username.length < 3) {
      return { valid: false, error: 'Username must be at least 3 characters' };
    }

    if (username.length > 20) {
      return { valid: false, error: 'Username must be less than 20 characters' };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }

    return { valid: true };
  }

  /**
   * Validate price (must be positive)
   */
  isValidPrice(price: number): boolean {
    return price > 0 && Number.isFinite(price);
  }

  /**
   * Validate quantity
   */
  isValidQuantity(quantity: number, min = 1, max = 1000): boolean {
    return Number.isInteger(quantity) && quantity >= min && quantity <= max;
  }

  /**
   * Trim and normalize whitespace
   */
  normalizeString(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }

  /**
   * Validate array has items
   */
  isNonEmptyArray<T>(arr: T[]): boolean {
    return Array.isArray(arr) && arr.length > 0;
  }

  /**
   * Validate object has required keys
   */
  hasRequiredKeys(obj: Record<string, unknown>, keys: string[]): boolean {
    return keys.every((key) => key in obj && obj[key] !== undefined && obj[key] !== null);
  }
}

export const validationService = new ValidationService();
