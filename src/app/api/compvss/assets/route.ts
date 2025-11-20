import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';

const assetSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['equipment', 'vehicle', 'tool', 'gear']),
  serialNumber: z.string(),
  location: z.string(),
  condition: z.enum(['excellent', 'good', 'fair', 'needs-repair']),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  notes: z.string().optional()
});

const checkoutSchema = z.object({
  assetId: z.string(),
  userId: z.string(),
  dueDate: z.string(),
  purpose: z.string().optional(),
  notes: z.string().optional()
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    // Mock data - replace with actual database query
    const assets = [
      {
        id: 'COMP-001',
        name: 'Camera Package - Sony FX6',
        category: 'equipment',
        status: 'checked-out',
        location: 'Production Site A',
        checkedOutTo: 'Sarah Johnson',
        checkedOutDate: '2024-11-18',
        dueDate: '2024-11-22',
        condition: 'excellent',
        serialNumber: 'SN-FX6-2024-001'
      }
    ];

    return NextResponse.json({ assets, total: assets.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check RBAC permissions
    const allowedRoles = ['admin', 'crew', 'production'];
    if (!session.user.role || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const validated = assetSchema.parse(body);

    // Mock response - replace with actual database insert
    const asset = {
      id: `COMP-${Date.now()}`,
      ...validated,
      status: 'available',
      createdBy: session.user.id,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
