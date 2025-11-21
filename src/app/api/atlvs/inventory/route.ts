import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const inventorySchema = z.object({
  itemName: z.string().min(1),
  category: z.string(),
  quantity: z.number().int().min(0),
  unit: z.string(),
  minStockLevel: z.number().int().min(0).optional(),
  location: z.string().optional(),
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

    const where: Record<string, unknown> = {};
    if (category) where.category = category;

    const inventory = await prisma.inventory.findMany({
      where,
      orderBy: { itemName: 'asc' }
    });

    const filtered = lowStock 
      ? inventory.filter(item => item.minStockLevel && item.quantity < item.minStockLevel)
      : inventory;

    return NextResponse.json({ 
      inventory: filtered.length > 0 ? filtered : [], 
      total: filtered.length 
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

    const body = await req.json();
    const validated = inventorySchema.parse(body);

    const item = await prisma.inventory.create({
      data: {
        itemName: validated.itemName,
        category: validated.category,
        quantity: validated.quantity,
        unit: validated.unit,
        minStockLevel: validated.minStockLevel,
        location: validated.location,
        supplier: validated.supplier,
        cost: validated.cost,
        status: validated.minStockLevel && validated.quantity < validated.minStockLevel 
          ? 'low-stock' 
          : 'in-stock',
        createdBy: session.user.id
      }
    });

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

    if (!id) {
      return NextResponse.json({ error: 'Inventory item ID required' }, { status: 400 });
    }

    const item = await prisma.inventory.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    const newQuantity = action === 'restock' 
      ? item.quantity + (quantity || 0) 
      : item.quantity - (quantity || 0);

    const updated = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: Math.max(0, newQuantity),
        status: item.minStockLevel && newQuantity < item.minStockLevel 
          ? 'low-stock' 
          : 'in-stock',
        lastRestocked: action === 'restock' ? new Date() : item.lastRestocked
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
