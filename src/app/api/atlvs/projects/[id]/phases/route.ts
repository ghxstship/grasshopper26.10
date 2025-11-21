import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createPhaseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  order: z.number().int(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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

    const phases = await prisma.projectPhase.findMany({
      where: { projectId: params.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: { phases },
    });
  } catch (error) {
    console.error('Phases fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch phases' } },
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
    const data = createPhaseSchema.parse(body);

    const phase = await prisma.projectPhase.create({
      data: {
        projectId: params.id,
        name: data.name,
        description: data.description,
        order: data.order,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return NextResponse.json({ success: true, data: { phase } }, { status: 201 });
  } catch (error) {
    console.error('Phase creation error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create phase' } },
      { status: 500 }
    );
  }
}
