import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { SocialService } from '@/lib/services/social/friends/id/add.service';



// Validation: z.object schema.parse validate
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const friendship = await new SocialService().create({
      data: {
        userId: session.user.id,
        friendId: id,
        status: 'PENDING',
      },
    });

    return NextResponse.json(friendship, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
