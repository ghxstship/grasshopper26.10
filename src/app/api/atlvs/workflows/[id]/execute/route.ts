import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 });
    }

    const body = await request.json();

    const workflow = await prisma.n8NWorkflow.findUnique({
      where: { id: params.id },
    });

    if (!workflow) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Workflow not found' } }, { status: 404 });
    }

    const execution = await prisma.n8NExecution.create({
      data: {
        workflowId: params.id,
        executionId: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'running',
        mode: 'manual',
        startedAt: new Date(),
        data: body.data || {},
      },
    });

    return NextResponse.json({ success: true, data: { execution } }, { status: 201 });
  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to execute workflow' } }, { status: 500 });
  }
}
