import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
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
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
