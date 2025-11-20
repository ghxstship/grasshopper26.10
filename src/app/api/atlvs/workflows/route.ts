import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';

const workflowSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(['event-setup', 'production', 'logistics', 'maintenance', 'approval', 'communication']),
  steps: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
    required: z.boolean().default(true),
    assignedRole: z.string().optional()
  })),
  automationLevel: z.enum(['manual', 'semi-automated', 'fully-automated']),
  tags: z.array(z.string()).optional()
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const automationLevel = searchParams.get('automationLevel');
    const search = searchParams.get('search');

    // Mock data for now - replace with actual database query
    const workflows = [
      {
        id: 'WF-001',
        name: 'Event Setup & Teardown',
        description: 'Complete workflow for setting up and tearing down event infrastructure',
        category: 'event-setup',
        steps: 12,
        estimatedTime: '4-6 hours',
        usageCount: 45,
        lastUsed: '2024-11-15',
        tags: ['setup', 'infrastructure', 'logistics'],
        automationLevel: 'semi-automated',
        status: 'active',
        createdBy: session.user.id,
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({ workflows, total: workflows.length });
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
    const validated = workflowSchema.parse(body);

    // Mock response - replace with actual database insert
    const workflow = {
      id: `WF-${Date.now()}`,
      ...validated,
      usageCount: 0,
      status: 'active',
      createdBy: session.user.id,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
