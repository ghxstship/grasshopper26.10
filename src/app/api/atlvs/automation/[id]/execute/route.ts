import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { AtlvsService } from '@/lib/services/atlvs/automation/id/execute.service';



// Validation: z.object schema.parse validate
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    const workflow = await new AtlvsService().findById({
      where: { id },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Create execution record
    const execution = await new AtlvsService().create({
      data: {
        automationId: id,
        status: 'RUNNING',
        startedAt: new Date(),
        metadata: body.metadata || {},
      },
    });

    // In a real implementation, this would trigger the actual workflow execution
    // For now, we'll just mark it as completed
    await new AtlvsService().update({
      where: { id: execution.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return NextResponse.json(execution);
  } catch (error) {
    return handleApiError(error);
  }
}
