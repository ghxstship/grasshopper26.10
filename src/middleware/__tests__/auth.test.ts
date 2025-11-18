import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '../auth';

// Mock auth utilities
jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}));

import { getSession } from '@/lib/auth/session';

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow authenticated requests', async () => {
    (getSession as jest.Mock).mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
    });

    const request = new NextRequest('http://localhost:3000/api/protected');
    const response = await authMiddleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).not.toBe(401);
  });

  it('should reject unauthenticated requests', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/protected');
    const response = await authMiddleware(request);

    expect(response.status).toBe(401);
  });

  it('should allow public routes', async () => {
    const request = new NextRequest('http://localhost:3000/api/public');
    const response = await authMiddleware(request);

    expect(response).toBeInstanceOf(NextResponse);
  });
});
