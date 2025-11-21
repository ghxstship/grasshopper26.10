import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

/**
 * GET /api/atlvs/teams/members
 * Get all team members with their role assignments
 */
export async function GET(_request: NextRequest) {
  try {
    await requireAuth();

    // Get all users with their role assignments and team memberships
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        roleAssignments: {
          where: {
            platform: 'atlvs',
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          },
          select: {
            role: true,
            context: true,
            platform: true,
          },
        },
        teamMemberships: {
          select: {
            team: {
              select: {
                name: true,
                type: true,
              },
            },
          },
          take: 1,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Format response with member details
    const members = users.map(user => ({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      image: user.image,
      roles: user.roleAssignments.map(ra => ra.role),
      currentRole: user.roleAssignments[0]?.role || 'No role assigned',
      department: user.teamMemberships[0]?.team.type || user.teamMemberships[0]?.team.name || 'General',
    }));

    return NextResponse.json({
      members,
      total: members.length,
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
