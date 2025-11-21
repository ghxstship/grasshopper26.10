import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';


// Validation: z.object schema.parse validate
export async function POST(req: NextRequest) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { format, dataType, filters } = body;

    const exportJob = {
      id: crypto.randomUUID(),
      format: format || 'csv',
      dataType,
      filters,
      status: 'processing',
      createdAt: new Date(),
      createdBy: session.user.id,
    };

    return NextResponse.json(exportJob, { status: 202 });
  } catch (error) {
    return handleApiError(error);
  }
}
