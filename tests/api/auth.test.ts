import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { prisma } from '@/lib/prisma';

describe('Authentication API Tests', () => {
  let testUserId: string;
  let authToken: string;

  beforeAll(async () => {
    // Setup test database
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test User',
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
      testUserId = data.user.id;
    });

    it('should reject duplicate email', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test User',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should validate email format', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'SecurePass123!',
          name: 'Test User',
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'SecurePass123!',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.token).toBeDefined();
      expect(data.user).toBeDefined();
      authToken = data.token;
    });

    it('should reject invalid credentials', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'WrongPassword',
        }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout authenticated user', async () => {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token', async () => {
      const response = await fetch('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: 'valid-refresh-token',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.accessToken).toBeDefined();
    });
  });
});
