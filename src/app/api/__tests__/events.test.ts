import { NextRequest } from 'next/server';
import { GET, POST } from '../events/route';

// Mock Prisma
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    event: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          name: 'Test Event',
          date: new Date('2024-12-01'),
          venue: 'Test Venue',
        },
      ]),
      create: jest.fn().mockResolvedValue({
        id: '1',
        name: 'New Event',
        date: new Date('2024-12-01'),
        venue: 'Test Venue',
      }),
    },
  },
}));

describe('/api/events', () => {
  describe('GET', () => {
    it('should return events list', async () => {
      const request = new NextRequest('http://localhost:3000/api/events');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.events).toHaveLength(1);
      expect(data.events[0].name).toBe('Test Event');
    });
  });

  describe('POST', () => {
    it('should create a new event', async () => {
      const request = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Event',
          date: '2024-12-01',
          venue: 'Test Venue',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.event.name).toBe('New Event');
    });
  });
});
