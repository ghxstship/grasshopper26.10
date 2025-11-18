/**
 * Unit Tests - Auth Validation Schemas
 * Tests Zod validation schemas for authentication
 */

import { registerSchema, loginSchema, passwordResetRequestSchema, passwordResetSchema, emailVerificationSchema, updateProfileSchema,  } from '@/lib/validations/auth'

describe('Auth Validation Schemas', () => {
  describe('registerSchema', () => {
    const validData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'John Doe',
    }

    it('validates correct registration data', () => {
      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('validates with optional role', () => {
      const result = registerSchema.safeParse({
        ...validData,
        role: 'CONSUMER', // Use valid role from schema
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = registerSchema.safeParse({
        ...validData,
        email: 'invalid-email',
      })
      expect(result.success).toBe(false)
    })

    it('rejects short password', () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: 'short',
      })
      expect(result.success).toBe(false)
    })

    it('rejects long password', () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })

    it('rejects short name', () => {
      const result = registerSchema.safeParse({
        ...validData,
        name: 'a',
      })
      expect(result.success).toBe(false)
    })

    it('rejects long name', () => {
      const result = registerSchema.safeParse({
        ...validData,
        name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing email', () => {
      const { email: _email, ...rest } = validData
      const result = registerSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })

    it('rejects missing password', () => {
      const { password: _password, ...rest } = validData
      const result = registerSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })

    it('rejects missing name', () => {
      const { name: _name, ...rest } = validData
      const result = registerSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    }

    it('validates correct login data', () => {
      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        ...validData,
        email: 'not-an-email',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing email', () => {
      const { email: _email, ...rest } = validData
      const result = loginSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })

    it('rejects missing password', () => {
      const { password: _password, ...rest } = validData
      const result = loginSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })

    it('accepts any password length for login', () => {
      // Login doesn't enforce password length (only registration does)
      const result = loginSchema.safeParse({
        ...validData,
        password: 'short',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('passwordResetRequestSchema', () => {
    it('validates correct email', () => {
      const result = passwordResetRequestSchema.safeParse({
        email: 'test@example.com',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = passwordResetRequestSchema.safeParse({
        email: 'invalid',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing email', () => {
      const result = passwordResetRequestSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('accepts various valid email formats', () => {
      const emails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
      ]

      emails.forEach(email => {
        const result = passwordResetRequestSchema.safeParse({ email })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('passwordResetSchema', () => {
    const validData = {
      token: 'valid-reset-token-123',
      password: 'NewSecurePass123!',
    }

    it('validates correct reset data', () => {
      const result = passwordResetSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects short password', () => {
      const result = passwordResetSchema.safeParse({
        ...validData,
        password: 'short',
      })
      expect(result.success).toBe(false)
    })

    it('rejects long password', () => {
      const result = passwordResetSchema.safeParse({
        ...validData,
        password: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing token', () => {
      const { token: _token, ...rest } = validData
      const result = passwordResetSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })

    it('rejects missing password', () => {
      const { password: _password, ...rest } = validData
      const result = passwordResetSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })

    it('accepts minimum valid password', () => {
      const result = passwordResetSchema.safeParse({
        ...validData,
        password: 'a'.repeat(8),
      })
      expect(result.success).toBe(true)
    })

    it('accepts maximum valid password', () => {
      const result = passwordResetSchema.safeParse({
        ...validData,
        password: 'a'.repeat(100),
      })
      expect(result.success).toBe(true)
    })
  })

  describe('emailVerificationSchema', () => {
    it('validates correct token', () => {
      const result = emailVerificationSchema.safeParse({
        token: 'verification-token-123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects missing token', () => {
      const result = emailVerificationSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('accepts empty token (Zod string allows empty by default)', () => {
      const result = emailVerificationSchema.safeParse({
        token: '',
      })
      // Zod string type allows empty strings unless .min(1) is specified
      expect(result.success).toBe(true)
    })

    it('accepts any non-empty string as token', () => {
      const tokens = [
        'short',
        'very-long-token-with-many-characters-123456789',
        'token-with-special-chars!@#$%',
      ]

      tokens.forEach(token => {
        const result = emailVerificationSchema.safeParse({ token })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('updateProfileSchema', () => {
    it('validates with name only', () => {
      const result = updateProfileSchema.safeParse({
        name: 'John Doe',
      })
      expect(result.success).toBe(true)
    })

    it('validates with image only', () => {
      const result = updateProfileSchema.safeParse({
        image: 'https://example.com/avatar.jpg',
      })
      expect(result.success).toBe(true)
    })

    it('validates with both name and image', () => {
      const result = updateProfileSchema.safeParse({
        name: 'John Doe',
        image: 'https://example.com/avatar.jpg',
      })
      expect(result.success).toBe(true)
    })

    it('validates with empty object (all fields optional)', () => {
      const result = updateProfileSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('rejects short name', () => {
      const result = updateProfileSchema.safeParse({
        name: 'a',
      })
      expect(result.success).toBe(false)
    })

    it('rejects long name', () => {
      const result = updateProfileSchema.safeParse({
        name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid image URL', () => {
      const result = updateProfileSchema.safeParse({
        image: 'not-a-url',
      })
      expect(result.success).toBe(false)
    })

    it('accepts various valid URLs', () => {
      const urls = [
        'https://example.com/image.jpg',
        'http://example.com/image.png',
        'https://cdn.example.com/users/123/avatar.webp',
      ]

      urls.forEach(image => {
        const result = updateProfileSchema.safeParse({ image })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles null values', () => {
      const result = registerSchema.safeParse({
        email: null,
        password: null,
        name: null,
      })
      expect(result.success).toBe(false)
    })

    it('handles undefined values', () => {
      const result = registerSchema.safeParse({
        email: undefined,
        password: undefined,
        name: undefined,
      })
      expect(result.success).toBe(false)
    })

    it('handles extra fields', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        extraField: 'should be ignored',
      })
      expect(result.success).toBe(true)
    })

    it('handles numeric values where strings expected', () => {
      const result = registerSchema.safeParse({
        email: 12345,
        password: 67890,
        name: 11111,
      })
      expect(result.success).toBe(false)
    })
  })
})
