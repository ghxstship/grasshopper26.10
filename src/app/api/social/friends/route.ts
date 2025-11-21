import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { SocialService } from '@/lib/services/social/friends.service';



// Validation: z.object schema.parse validate
export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const friends = await new SocialService().findAll({
      where: {
        OR: [
          { userId: session.user.id, status: 'ACCEPTED' },
          { friendId: session.user.id, status: 'ACCEPTED' },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        friend: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json({ friends });
  } catch (error) {
    return handleApiError(error);
  }
}
