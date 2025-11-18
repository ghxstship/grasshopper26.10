import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');

    const reports = [
      {
        id: '1',
        name: 'Monthly Advancing Report',
        type: 'advancing',
        generatedAt: new Date(),
        format: 'pdf',
      },
      {
        id: '2',
        name: 'Budget Utilization Report',
        type: 'budget',
        generatedAt: new Date(),
        format: 'excel',
      },
    ].filter(r => !type || r.type === type);

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error listing reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const report = {
      id: crypto.randomUUID(),
      ...body,
      generatedAt: new Date(),
      generatedBy: session.user.id,
    };

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
