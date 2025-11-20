import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';

const maintenanceSchema = z.object({
  assetId: z.string(),
  type: z.enum(['preventive', 'repair', 'inspection', 'calibration', 'service']),
  scheduledDate: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
  estimatedDuration: z.number().optional()
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const overdue = searchParams.get('overdue') === 'true';

    // Mock data - replace with actual database query
    const maintenance = [
      {
        id: 'MAINT-001',
        assetId: 'AST-001',
        assetName: 'LED Wall Panel System',
        type: 'preventive',
        scheduledDate: '2024-11-20',
        priority: 'high',
        status: 'scheduled',
        assignedTo: 'Mike Chen',
        notes: 'Regular maintenance check',
        estimatedDuration: 2,
        createdAt: '2024-11-10'
      },
      {
        id: 'MAINT-002',
        assetId: 'AST-004',
        assetName: 'Power Distribution Unit',
        type: 'repair',
        scheduledDate: '2024-11-18',
        priority: 'critical',
        status: 'in-progress',
        assignedTo: 'Alex Kim',
        notes: 'Circuit breaker replacement',
        estimatedDuration: 4,
        createdAt: '2024-11-15'
      }
    ];

    return NextResponse.json({ maintenance, total: maintenance.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = maintenanceSchema.parse(body);

    // Mock response - replace with actual database insert
    const task = {
      id: `MAINT-${Date.now()}`,
      ...validated,
      status: 'scheduled',
      createdBy: session.user.id,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, completionNotes } = body;

    // Mock response - replace with actual database update
    const updated = {
      id,
      status,
      completionNotes,
      completedBy: session.user.id,
      completedAt: new Date().toISOString()
    };

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
