import { NextRequest } from 'next/server';
import { GET, POST } from '../compvss/advancing/route';

// Mock Prisma
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    advancingRequest: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          category: 'ACCESS_CREDENTIALS',
          title: 'Test Request',
          status: 'PENDING',
          priority: 'HIGH',
          createdAt: new Date(),
        },
      ]),
      create: jest.fn().mockResolvedValue({
        id: '1',
        category: 'ACCESS_CREDENTIALS',
        title: 'New Request',
        status: 'PENDING',
        priority: 'MEDIUM',
        createdAt: new Date(),
      }),
    },
  },
}));

describe('/api/compvss/advancing', () => {
  describe('GET', () => {
    it('should return advancing requests list', async () => {
      const request = new NextRequest('http://localhost:3000/api/compvss/advancing');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.requests).toHaveLength(1);
      expect(data.requests[0].title).toBe('Test Request');
    });

    it('should filter by category', async () => {
      const request = new NextRequest('http://localhost:3000/api/compvss/advancing?category=ACCESS_CREDENTIALS');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.requests[0].category).toBe('ACCESS_CREDENTIALS');
    });
  });

  describe('POST', () => {
    it('should create a new advancing request', async () => {
      const request = new NextRequest('http://localhost:3000/api/compvss/advancing', {
        method: 'POST',
        body: JSON.stringify({
          eventId: '123e4567-e89b-12d3-a456-426614174000',
          category: 'ACCESS_CREDENTIALS',
          title: 'New Request',
          description: 'Test description',
          priority: 'MEDIUM',
          requestedBy: '123e4567-e89b-12d3-a456-426614174001',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.request.title).toBe('New Request');
    });

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/compvss/advancing', {
        method: 'POST',
        body: JSON.stringify({
          category: 'ACCESS_CREDENTIALS',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
