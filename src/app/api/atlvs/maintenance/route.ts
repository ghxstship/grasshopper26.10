import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const maintenanceSchema = z.object({
  equipmentId: z.string(),
  type: z.enum(['ROUTINE', 'REPAIR', 'INSPECTION']),
  description: z.string(),
  performedAt: z.coerce.date(),
  cost: z.number().optional(),
  performedBy: z.string().optional(),
  nextDue: z.coerce.date().optional()
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const equipmentId = searchParams.get('equipmentId');
    const type = searchParams.get('type');

    const where: Record<string, unknown> = {};
    if (equipmentId) where.equipmentId = equipmentId;
    if (type) where.type = type;

    const maintenance = await prisma.maintenanceLog.findMany({
      where,
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: { performedAt: 'desc' }
    });

    return NextResponse.json({ 
      maintenance: maintenance.length > 0 ? maintenance : [], 
      total: maintenance.length 
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
    const validated = maintenanceSchema.parse(body);

    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        equipmentId: validated.equipmentId,
        type: validated.type,
        description: validated.description,
        performedAt: validated.performedAt,
        cost: validated.cost,
        performedBy: validated.performedBy || session.user.name || session.user.id,
        nextDue: validated.nextDue
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    return NextResponse.json(maintenanceLog, { status: 201 });
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Maintenance log ID required' }, { status: 400 });
    }

    const updated = await prisma.maintenanceLog.update({
      where: { id },
      data: updateData,
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
