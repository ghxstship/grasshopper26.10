/**
 * Opportunity Service
 * Handles all opportunity/job posting operations across ATLVS and COMPVSS
 */

import { prisma } from '@/lib/prisma';
import { OpportunityStatus, ApplicationStatus, Prisma } from '@prisma/client';
import { AuditService } from './audit.service';
import { NotificationService } from './NotificationService';
import type {
  CreateOpportunityInput,
  UpdateOpportunityInput,
  OpportunityFilters,
} from '@/lib/validations/opportunities';

const notificationService = new NotificationService();

export class OpportunityService {
  /**
   * Get all opportunities with filtering and pagination
   */
  static async getAll(params: OpportunityFilters & {
    page?: number;
    limit?: number;
  }) {
    const {
      organizationId,
      projectId,
      eventId,
      category,
      status,
      locationType,
      compensationType,
      search,
      tags,
      deadlineBefore,
      deadlineAfter,
      page = 1,
      limit = 20,
    } = params;

    const where: Prisma.OpportunityWhereInput = {
      ...(organizationId && { organizationId }),
      ...(projectId && { projectId }),
      ...(eventId && { eventId }),
      ...(category && { category }),
      ...(status && { status }),
      ...(locationType && { locationType }),
      ...(compensationType && { compensationType }),
      ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
      ...(deadlineBefore && { applicationDeadline: { lte: deadlineBefore } }),
      ...(deadlineAfter && { applicationDeadline: { gte: deadlineAfter } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              startDate: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.opportunity.count({ where }),
    ]);

    return {
      opportunities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single opportunity by ID
   */
  static async getById(id: string, includeApplications = false) {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            location: true,
          },
        },
        ...(includeApplications && {
          applications: {
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
            orderBy: {
              createdAt: 'desc',
            },
          },
        }),
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    // Increment view count
    await prisma.opportunity.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return opportunity;
  }

  /**
   * Create a new opportunity
   */
  static async create(data: CreateOpportunityInput & { createdBy: string }) {
    const { createdBy, ...opportunityData } = data;

    // Convert arrays to JSON for Prisma
    const jsonData = {
      ...opportunityData,
      requirements: opportunityData.requirements || undefined,
      qualifications: opportunityData.qualifications || undefined,
      responsibilities: opportunityData.responsibilities || undefined,
      benefits: opportunityData.benefits || undefined,
      customQuestions: opportunityData.customQuestions || undefined,
    };

    const opportunity = await prisma.opportunity.create({
      data: {
        ...jsonData,
        createdBy,
        status: OpportunityStatus.DRAFT,
      },
      include: {
        organization: true,
        project: true,
        event: true,
      },
    });

    // Audit log
    await AuditService.log({
      action: 'opportunity.created',
      userId: createdBy,
      entityType: 'opportunity',
      entityId: opportunity.id,
      metadata: JSON.parse(JSON.stringify({ title: opportunity.title, category: opportunity.category })),
    });

    return opportunity;
  }

  /**
   * Update an opportunity
   */
  static async update(
    id: string,
    data: UpdateOpportunityInput,
    userId: string
  ) {
    const existing = await prisma.opportunity.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Opportunity not found');
    }

    // Convert arrays to JSON for Prisma
    const jsonData = {
      ...data,
      requirements: data.requirements || undefined,
      qualifications: data.qualifications || undefined,
      responsibilities: data.responsibilities || undefined,
      benefits: data.benefits || undefined,
      customQuestions: data.customQuestions || undefined,
    };

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: jsonData,
      include: {
        organization: true,
        project: true,
        event: true,
      },
    });

    // Audit log
    await AuditService.log({
      action: 'opportunity.updated',
      userId,
      entityType: 'opportunity',
      entityId: id,
      metadata: JSON.parse(JSON.stringify({ updates: Object.keys(data) })),
    });

    return opportunity;
  }

  /**
   * Update opportunity status
   */
  static async updateStatus(
    id: string,
    status: OpportunityStatus,
    userId: string
  ) {
    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: { status },
    });

    // Audit log
    await AuditService.log({
      action: 'opportunity.status_changed',
      userId,
      entityType: 'opportunity',
      entityId: id,
      metadata: JSON.parse(JSON.stringify({ status })),
    });

    // Notify applicants if opportunity is closed or filled
    if (status === OpportunityStatus.CLOSED || status === OpportunityStatus.FILLED) {
      const applications = await prisma.opportunityApplication.findMany({
        where: {
          opportunityId: id,
          status: {
            in: [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW],
          },
        },
        include: { user: true },
      });

      for (const application of applications) {
        await notificationService.create({
          userId: application.userId,
          type: 'opportunity_closed',
          title: 'Opportunity Closed',
          message: `The opportunity "${opportunity.title}" has been ${status.toLowerCase()}.`,
          metadata: JSON.parse(JSON.stringify({ opportunityId: id, applicationId: application.id })),
        });
      }
    }

    return opportunity;
  }

  /**
   * Publish an opportunity
   */
  static async publish(id: string, userId: string) {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    if (opportunity.status !== OpportunityStatus.DRAFT) {
      throw new Error('Only draft opportunities can be published');
    }

    const published = await prisma.opportunity.update({
      where: { id },
      data: {
        status: OpportunityStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: {
        organization: true,
        project: true,
        event: true,
      },
    });

    // Audit log
    await AuditService.log({
      action: 'opportunity.published',
      userId,
      entityType: 'opportunity',
      entityId: id,
      metadata: JSON.parse(JSON.stringify({ title: published.title })),
    });

    return published;
  }

  /**
   * Delete an opportunity
   */
  static async delete(id: string, userId: string) {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    // Prevent deletion if there are applications
    if (opportunity._count.applications > 0) {
      throw new Error('Cannot delete opportunity with existing applications');
    }

    await prisma.opportunity.delete({
      where: { id },
    });

    // Audit log
    await AuditService.log({
      action: 'opportunity.deleted',
      userId,
      entityType: 'opportunity',
      entityId: id,
      metadata: { title: opportunity.title },
    });

    return { success: true };
  }

  /**
   * Get opportunity statistics
   */
  static async getStats(organizationId?: string) {
    const where: Prisma.OpportunityWhereInput = organizationId
      ? { organizationId }
      : {};

    const [
      total,
      published,
      draft,
      filled,
      totalApplications,
      recentOpportunities,
    ] = await Promise.all([
      prisma.opportunity.count({ where }),
      prisma.opportunity.count({
        where: { ...where, status: OpportunityStatus.PUBLISHED },
      }),
      prisma.opportunity.count({
        where: { ...where, status: OpportunityStatus.DRAFT },
      }),
      prisma.opportunity.count({
        where: { ...where, status: OpportunityStatus.FILLED },
      }),
      prisma.opportunityApplication.count({
        where: organizationId
          ? { opportunity: { organizationId } }
          : {},
      }),
      prisma.opportunity.findMany({
        where: { ...where, status: OpportunityStatus.PUBLISHED },
        take: 5,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          category: true,
          publishedAt: true,
          _count: {
            select: { applications: true },
          },
        },
      }),
    ]);

    return {
      total,
      published,
      draft,
      filled,
      totalApplications,
      recentOpportunities,
    };
  }
}
