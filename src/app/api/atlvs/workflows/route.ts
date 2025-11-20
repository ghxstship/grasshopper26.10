import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const workflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
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

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (automationLevel) where.automationLevel = automationLevel;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const workflows = await prisma.workflow.findMany({
      where,
      orderBy: { usageCount: 'desc' }
    });

    return NextResponse.json({ 
      workflows: workflows.length > 0 ? workflows : [], 
      total: workflows.length 
    });
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

    const workflow = await prisma.workflow.create({
      data: {
        name: validated.name,
        description: validated.description,
        category: validated.category,
        steps: validated.steps,
        automationLevel: validated.automationLevel,
        tags: validated.tags || [],
        usageCount: 0,
        status: 'active',
        createdBy: session.user.id
      }
    });

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
