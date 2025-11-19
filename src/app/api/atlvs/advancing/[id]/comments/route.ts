import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { CommentService } from '@/lib/services/atlvs/advancing/CommentService';
import { z } from 'zod';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';


const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});

/**
 * GET /api/atlvs/advancing/[id]/comments
 * List comments for an advancing request
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = new CommentService();
    const comments = await service.listByRequest(id);

    return NextResponse.json(comments);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/atlvs/advancing/[id]/comments
 * Create a new comment on an advancing request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const validated = createCommentSchema.parse(body);

    const service = new CommentService();
    const comment = await service.create({
      requestId: id,
      userId: session.user.id,
      content: validated.content,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid comment data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
