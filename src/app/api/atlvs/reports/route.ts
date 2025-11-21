import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createReportSchema = z.object({
  name: z.string(),
  type: z.enum(['PROJECT', 'BUDGET', 'TEAM', 'ADVANCING', 'CUSTOM']),
  filters: z.record(z.string(), z.any()).optional(),
  schedule: z.string().optional(),
});

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: { reports },
    });
  } catch (error) {
    console.error('Reports fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch reports' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = createReportSchema.parse(body);

    const report = await prisma.report.create({
      data: {
        name: data.name,
        type: data.type,
        query: data.filters || {},
        schedule: data.schedule,
        recipients: [],
      },
    });

    return NextResponse.json(
      { success: true, data: { report } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Report creation error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create report' } },
      { status: 500 }
    );
  }
}
