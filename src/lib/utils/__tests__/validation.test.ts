import { validateEmail, validatePhone, validateUrl, sanitizeInput } from '../validation';

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate US phone numbers', () => {
      expect(validatePhone('(555) 123-4567')).toBe(true);
      expect(validatePhone('555-123-4567')).toBe(true);
      expect(validatePhone('5551234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc-def-ghij')).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com/path')).toBe(true);
      expect(validateUrl('https://sub.example.com:8080')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not a url')).toBe(false);
      expect(validateUrl('ftp://example.com')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('');
      expect(sanitizeInput('Hello <b>World</b>')).toBe('Hello World');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });
});
