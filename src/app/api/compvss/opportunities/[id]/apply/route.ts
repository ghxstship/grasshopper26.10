import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApplicationService } from '@/lib/services/shared/application.service';
import { createApplicationSchema } from '@/lib/validations/opportunities';
import { handleApiError } from '@/lib/api/response';


/**
 * POST /api/compvss/opportunities/[id]/apply
 * Submit an application to an opportunity
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const validated = createApplicationSchema.parse({
      ...body,
      opportunityId: id,
      userId: session.user.id,
    });

    const application = await ApplicationService.create(validated);
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
