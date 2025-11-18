import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOrganizationSchema } from '@/lib/validations/organizations';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, getPaginationParams, validateRequest, requireAuth,  } from '@/lib/api/middleware';

// GET /api/organizations - List organizations
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);

    // Build where clause
    const where: Record<string, unknown> = {};

    const type = searchParams.get('type');
    const search = searchParams.get('search');

    if (type) where.type = type;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by user's organizations if not admin
    if (context.userRole !== 'ADMIN') {
      where.members = {
        some: {
          userId: context.userId,
        },
      };
    }

    // Get total count
    const total = await prisma.organization.count({ where });

    // Get organizations
    const organizations = await prisma.organization.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            members: true,
            events: true,
          },
        },
      },
    });

    return successResponse(organizations, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/organizations - Create organization
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = createOrganizationSchema.parse(body);

    // Generate slug if not provided
    const slug =
      validatedData.slug ||
      validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Check if slug is unique
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      throw errors.conflict('Organization with this slug already exists');
    }

    // Create organization with creator as owner
    const organization = await prisma.organization.create({
      data: {
        ...validatedData,
        slug,
        members: {
          create: {
            userId: context.userId!,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return createdResponse(organization);
  } catch (error) {
    return handleApiError(error);
  }
}
