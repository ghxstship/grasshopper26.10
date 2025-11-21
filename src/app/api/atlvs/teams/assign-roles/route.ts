import { NextRequest, NextResponse } from 'next/server';
import { assignRoleToUser } from '@/lib/rbac/utils';
import { Role } from '@/lib/rbac/roles';
import { requireAuth } from '@/lib/auth';

export const runtime = 'edge';

/**
 * POST /api/atlvs/teams/assign-roles
 * Assign roles to team members
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { memberIds, roleId } = body;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json(
        { error: 'memberIds array is required' },
        { status: 400 }
      );
    }

    if (!roleId) {
      return NextResponse.json(
        { error: 'roleId is required' },
        { status: 400 }
      );
    }

    // Validate roleId is a valid Role enum value
    if (!Object.values(Role).includes(roleId)) {
      return NextResponse.json(
        { error: 'Invalid role ID' },
        { status: 400 }
      );
    }

    // Assign role to each member
    const results = await Promise.allSettled(
      memberIds.map(async (userId: string) => {
        await assignRoleToUser(userId, roleId as Role, {
          platform: 'atlvs',
          grantedBy: user.id,
        });
        return userId;
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      assigned: successful,
      failed,
      total: memberIds.length,
    });
  } catch (error) {
    console.error('Error assigning roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
