import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateOrganizationSchema } from '@/lib/validations/organizations';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { OrganizationsService } from '@/lib/services/organizations/id.service';



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/organizations/[id] - Get organization by ID
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const organization = await new OrganizationsService().findById({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'desc',
          },
        },
        events: {
          take: 10,
          orderBy: {
            startDate: 'desc',
          },
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            startDate: true,
            status: true,
          },
        },
        _count: {
          select: {
            members: true,
            events: true,
          },
        },
      },
    });

    if (!organization) {
      throw errors.notFound('Organization');
    }

    // Check if user has access to this organization
    const isMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId: context.userId,
      },
    });

    if (!isMember && context.userRole !== 'ADMIN') {
      throw errors.forbidden();
    }

    return successResponse({
      ...organization,
      memberCount: organization._count.members,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/organizations/[id] - Update organization
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = updateOrganizationSchema.parse(body);

    // Check if organization exists and user has permission
    const organization = await new OrganizationsService().findById({
      where: { id },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!organization) {
      throw errors.notFound('Organization');
    }

    const userMembership = await prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId: context.userId,
      },
    });
    if (!userMembership || !['OWNER', 'ADMIN'].includes(userMembership.role)) {
      throw errors.forbidden();
    }

    // Update organization
    const updatedOrganization = await new OrganizationsService().update({
      where: { id: id },
      data: validatedData,
    });

    return successResponse(updatedOrganization);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/organizations/[id] - Delete organization
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    // Check if organization exists and user is owner
    const existingOrg = await new OrganizationsService().findById({
      where: { id: id },
      include: {
        members: {
          where: {
            userId: context.userId,
          },
        },
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!existingOrg) {
      throw errors.notFound('Organization');
    }

    const userMembership = existingOrg.members[0];
    if (!userMembership || userMembership.role !== 'OWNER') {
      throw errors.forbidden();
    }

    // Prevent deletion if organization has events
    if (existingOrg._count.events > 0) {
      throw errors.badRequest(
        'Cannot delete organization with existing events',
        { eventCount: existingOrg._count.events }
      );
    }

    // Delete organization
    await new OrganizationsService().delete({
      where: { id: id },
    });

    return successResponse({ message: 'Organization deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
