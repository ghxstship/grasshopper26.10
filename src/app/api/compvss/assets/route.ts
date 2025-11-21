import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const assetSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['equipment', 'vehicle', 'tool', 'gear']),
  serialNumber: z.string().optional(),
  location: z.string().optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'needs-repair']).optional(),
  purchaseDate: z.coerce.date().optional(),
  purchasePrice: z.number().optional(),
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

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const assets = await prisma.compvssAsset.findMany({
      where,
      include: {
        checkouts: {
          where: { status: 'checked-out' },
          orderBy: { checkedOutAt: 'desc' },
          take: 1
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ 
      assets: assets.length > 0 ? assets : [], 
      total: assets.length 
    });
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

    const asset = await prisma.compvssAsset.create({
      data: {
        name: validated.name,
        category: validated.category,
        serialNumber: validated.serialNumber,
        location: validated.location,
        condition: validated.condition,
        purchaseDate: validated.purchaseDate,
        purchasePrice: validated.purchasePrice,
        notes: validated.notes,
        status: 'available',
        createdBy: session.user.id
      }
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
