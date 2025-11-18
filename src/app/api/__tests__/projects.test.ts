import { NextRequest } from 'next/server';
import { GET, POST } from '../atlvs/projects/route';

// Mock Prisma
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    project: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          name: 'Test Project',
          status: 'ACTIVE',
          startDate: new Date('2024-01-01'),
          createdAt: new Date(),
        },
      ]),
      create: jest.fn().mockResolvedValue({
        id: '1',
        name: 'New Project',
        status: 'PLANNING',
        startDate: new Date('2024-01-01'),
        createdAt: new Date(),
      }),
    },
  },
}));

describe('/api/atlvs/projects', () => {
  describe('GET', () => {
    it('should return projects list', async () => {
      const request = new NextRequest('http://localhost:3000/api/atlvs/projects');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.projects).toHaveLength(1);
      expect(data.projects[0].name).toBe('Test Project');
    });

    it('should filter by status', async () => {
      const request = new NextRequest('http://localhost:3000/api/atlvs/projects?status=ACTIVE');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.projects[0].status).toBe('ACTIVE');
    });
  });

  describe('POST', () => {
    it('should create a new project', async () => {
      const request = new NextRequest('http://localhost:3000/api/atlvs/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Project',
          description: 'Test description',
          startDate: '2024-01-01',
          managerId: '123e4567-e89b-12d3-a456-426614174001',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.project.name).toBe('New Project');
    });

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/atlvs/projects', {
        method: 'POST',
        body: JSON.stringify({
          description: 'Missing name',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
