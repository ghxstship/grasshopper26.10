import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const maintenanceSchema = z.object({
  type: z.enum(['ROUTINE', 'REPAIR', 'INSPECTION', 'EMERGENCY', 'UPGRADE']),
  description: z.string(),
  performedBy: z.string(),
  cost: z.number().optional(),
  notes: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const logs = await prisma.maintenanceLog.findMany({
      where: { equipmentId: params.id },
      orderBy: { performedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: { logs },
    });
  } catch (error) {
    console.error('Maintenance logs fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch logs' } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = maintenanceSchema.parse(body);

    const log = await prisma.maintenanceLog.create({
      data: {
        equipmentId: params.id,
        type: data.type,
        description: data.description,
        performedBy: data.performedBy,
        performedAt: new Date(),
        cost: data.cost,
        metadata: data.notes ? { notes: data.notes } : undefined,
      },
    });

    return NextResponse.json({ success: true, data: { log } }, { status: 201 });
  } catch (error) {
    console.error('Maintenance log creation error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create log' } },
      { status: 500 }
    );
  }
}
