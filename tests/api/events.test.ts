import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { prisma } from '@/lib/prisma';

describe('Events API Tests', () => {
  let authToken: string;
  let testEventId: string;

  beforeAll(async () => {
    await prisma.$connect();
    // Get auth token from login
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'SecurePass123!',
      }),
    });
    const loginData = await loginResponse.json();
    authToken = loginData.token;
  });

  afterAll(async () => {
    if (testEventId) {
      await prisma.event.delete({ where: { id: testEventId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('GET /api/events', () => {
    it('should list events with pagination', async () => {
      const response = await fetch('http://localhost:3000/api/events?page=1&limit=10');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.events).toBeDefined();
      expect(data.pagination).toBeDefined();
      expect(Array.isArray(data.events)).toBe(true);
    });

    it('should filter events by status', async () => {
      const response = await fetch('http://localhost:3000/api/events?status=PUBLISHED');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.events).toBeDefined();
    });

    it('should search events by name', async () => {
      const response = await fetch('http://localhost:3000/api/events?search=concert');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.events).toBeDefined();
    });
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Test Concert',
          description: 'A test concert event',
          startDate: new Date(Date.now() + 86400000).toISOString(),
          endDate: new Date(Date.now() + 90000000).toISOString(),
          venueId: 'test-venue-id',
          organizationId: 'test-org-id',
          status: 'DRAFT',
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.id).toBeDefined();
      expect(data.name).toBe('Test Concert');
      testEventId = data.id;
    });

    it('should require authentication', async () => {
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Concert',
          description: 'A test concert event',
        }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/events/[id]', () => {
    it('should get event details', async () => {
      const response = await fetch(`http://localhost:3000/api/events/${testEventId}`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe(testEventId);
      expect(data.name).toBe('Test Concert');
    });

    it('should return 404 for non-existent event', async () => {
      const response = await fetch('http://localhost:3000/api/events/non-existent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/events/[id]', () => {
    it('should update event', async () => {
      const response = await fetch(`http://localhost:3000/api/events/${testEventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Updated Concert Name',
          status: 'PUBLISHED',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.name).toBe('Updated Concert Name');
      expect(data.status).toBe('PUBLISHED');
    });
  });

  describe('GET /api/events/featured', () => {
    it('should list featured events', async () => {
      const response = await fetch('http://localhost:3000/api/events/featured');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.events)).toBe(true);
    });
  });
});
