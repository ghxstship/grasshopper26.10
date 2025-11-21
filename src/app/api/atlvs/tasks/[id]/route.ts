import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { AtlvsService } from '@/lib/services/atlvs/tasks/id.service';



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const task = await new AtlvsService().findById({
      where: { id: id },
      include: {
        project: true,
        assignee: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true } },
        timeEntries: true,
      },
    });

    if (!task) {
      throw errors.notFound('Task not found');
    }

    return successResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const task = await new AtlvsService().update({
      where: { id: id },
      data: body,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    return successResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    await new AtlvsService().delete({
      where: { id: id },
    });

    return successResponse({ message: 'Task deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
