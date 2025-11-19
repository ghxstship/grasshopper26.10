/**
 * API Route: /api/atlvs/tasks/[id]/time-entries
 * Add time entry to a task
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TaskService } from '@/lib/services/atlvs/task.service';
import { z } from 'zod';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';



const timeEntrySchema = z.object({
  description: z.string().optional(),
  hours: z.number().positive(),
  date: z.string().datetime(),
  billable: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = timeEntrySchema.parse(body);

    const entry = await TaskService.addTimeEntry({
      taskId: id,
      userId: session.user.id,
      description: validated.description,
      hours: validated.hours,
      date: new Date(validated.date),
      billable: validated.billable,
      metadata: validated.metadata ? JSON.parse(JSON.stringify(validated.metadata)) : undefined,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error adding time entry:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add time entry' },
      { status: 500 }
    );
  }
}
