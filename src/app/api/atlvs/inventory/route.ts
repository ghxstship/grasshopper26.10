import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';

const inventorySchema = z.object({
  itemName: z.string().min(1),
  category: z.string(),
  quantity: z.number().int().min(0),
  unit: z.string(),
  minStockLevel: z.number().int().min(0).optional(),
  location: z.string(),
  supplier: z.string().optional(),
  cost: z.number().min(0).optional()
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const lowStock = searchParams.get('lowStock') === 'true';

    // Mock data - replace with actual database query
    const inventory = [
      {
        id: 'INV-001',
        itemName: 'LED Panels',
        category: 'Lighting',
        quantity: 150,
        unit: 'pieces',
        minStockLevel: 100,
        location: 'Warehouse A',
        supplier: 'Tech Lighting Co',
        cost: 250,
        lastRestocked: '2024-11-18',
        status: 'in-stock'
      },
      {
        id: 'INV-002',
        itemName: 'Audio Cables',
        category: 'Audio',
        quantity: 15,
        unit: 'pieces',
        minStockLevel: 50,
        location: 'Storage Room B',
        supplier: 'Sound Solutions',
        cost: 25,
        lastRestocked: '2024-11-10',
        status: 'low-stock'
      }
    ];

    const filtered = lowStock 
      ? inventory.filter(item => item.quantity < (item.minStockLevel || 0))
      : inventory;

    return NextResponse.json({ inventory: filtered, total: filtered.length });
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

    const body = await req.json();
    const validated = inventorySchema.parse(body);

    // Mock response - replace with actual database insert
    const item = {
      id: `INV-${Date.now()}`,
      ...validated,
      status: 'in-stock',
      createdBy: session.user.id,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, quantity, action } = body;

    // Mock response - replace with actual database update
    const updated = {
      id,
      quantity,
      action, // 'restock' or 'deplete'
      updatedBy: session.user.id,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
