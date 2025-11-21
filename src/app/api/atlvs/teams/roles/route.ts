import { NextRequest, NextResponse } from 'next/server';
import { Role, RoleMetadataMap } from '@/lib/rbac/roles';
import { requireAuth } from '@/lib/auth';

// Note: Cannot use Edge runtime due to NextAuth/Prisma dependencies

/**
 * GET /api/atlvs/teams/roles
 * Get all ATLVS team roles with metadata
 */
export async function GET(_request: NextRequest) {
  try {
    await requireAuth();

    // Filter roles for ATLVS platform
    const atlvsRoles = Object.entries(Role)
      .filter(([_, value]) => 
        typeof value === 'string' && 
        (value.startsWith('atlvs:') || value.startsWith('legend:'))
      )
      .map(([key, value]) => {
        const metadata = RoleMetadataMap[value as Role];
        return {
          id: value,
          key,
          name: metadata?.name || key,
          description: metadata?.description || '',
          platform: metadata?.platform || 'atlvs',
          level: metadata?.level || 'member',
          // Assign colors based on level
          color: metadata?.level === 'god' ? 'purple' :
                 metadata?.level === 'admin' ? 'blue' :
                 metadata?.level === 'manager' ? 'green' :
                 metadata?.level === 'member' ? 'yellow' : 'indigo',
        };
      });

    return NextResponse.json({
      roles: atlvsRoles,
      total: atlvsRoles.length,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
