/**
 * Application Service
 * Handles opportunity application submissions and reviews
 */

import { prisma } from '@/lib/prisma';
import { ApplicationStatus, Prisma } from '@prisma/client';
import { AuditService } from './audit.service';
import { NotificationService } from './NotificationService';
import type {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
  ApplicationFilters,
} from '@/lib/validations/opportunities';

const notificationService = new NotificationService();

export class ApplicationService {
  /**
   * Get all applications with filtering and pagination
   */
  static async getAll(params: ApplicationFilters & {
    page?: number;
    limit?: number;
  }) {
    const {
      opportunityId,
      userId,
      status,
      rating,
      submittedAfter,
      submittedBefore,
      page = 1,
      limit = 20,
    } = params;

    const where: Prisma.OpportunityApplicationWhereInput = {
      ...(opportunityId && { opportunityId }),
      ...(userId && { userId }),
      ...(status && { status }),
      ...(rating && { rating }),
      ...(submittedAfter && { createdAt: { gte: submittedAfter } }),
      ...(submittedBefore && { createdAt: { lte: submittedBefore } }),
    };

    const [applications, total] = await Promise.all([
      prisma.opportunityApplication.findMany({
        where,
        include: {
          opportunity: {
            select: {
              id: true,
              title: true,
              category: true,
              status: true,
              organization: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.opportunityApplication.count({ where }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single application by ID
   */
  static async getById(id: string) {
    const application = await prisma.opportunityApplication.findUnique({
      where: { id },
      include: {
        opportunity: {
          include: {
            organization: true,
            project: true,
            event: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  }

  /**
   * Create a new application
   */
  static async create(data: CreateApplicationInput) {
    // Check if user already applied
    const existing = await prisma.opportunityApplication.findUnique({
      where: {
        opportunityId_userId: {
          opportunityId: data.opportunityId,
          userId: data.userId,
        },
      },
    });

    if (existing) {
      throw new Error('You have already applied to this opportunity');
    }

    // Check if opportunity is accepting applications
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: data.opportunityId },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    if (opportunity.status !== 'PUBLISHED') {
      throw new Error('This opportunity is not accepting applications');
    }

    if (opportunity.applicationDeadline && new Date() > opportunity.applicationDeadline) {
      throw new Error('Application deadline has passed');
    }

    // Create application
    const application = await prisma.opportunityApplication.create({
      data: {
        ...data,
        status: ApplicationStatus.SUBMITTED,
        customAnswers: data.customAnswers || undefined,
      },
      include: {
        opportunity: {
          include: {
            organization: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Increment application count on opportunity
    await prisma.opportunity.update({
      where: { id: data.opportunityId },
      data: { applicationCount: { increment: 1 } },
    });

    // Audit log
    await AuditService.log({
      action: 'application.submitted',
      userId: data.userId,
      entityType: 'application',
      entityId: application.id,
      metadata: JSON.parse(JSON.stringify({
        opportunityId: data.opportunityId,
        opportunityTitle: opportunity.title,
      })),
    });

    // Notify organization admins about new application
    // TODO: Get org admins and send notifications

    return application;
  }

  /**
   * Update application status
   */
  static async updateStatus(
    id: string,
    data: UpdateApplicationStatusInput
  ) {
    const existing = await prisma.opportunityApplication.findUnique({
      where: { id },
      include: {
        opportunity: true,
        user: true,
      },
    });

    if (!existing) {
      throw new Error('Application not found');
    }

    const application = await prisma.opportunityApplication.update({
      where: { id },
      data: {
        ...data,
        ...(data.status && { status: data.status }),
        ...(data.reviewedBy && {
          reviewedBy: data.reviewedBy,
          reviewedAt: new Date(),
        }),
        ...(data.status === ApplicationStatus.OFFER_SENT && {
          offerSentAt: new Date(),
        }),
        ...(data.status === ApplicationStatus.ACCEPTED && {
          offerAcceptedAt: new Date(),
        }),
        offerDetails: data.offerDetails || undefined,
      },
      include: {
        opportunity: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Audit log
    await AuditService.log({
      action: 'application.status_updated',
      userId: data.reviewedBy || 'system',
      entityType: 'application',
      entityId: id,
      metadata: JSON.parse(JSON.stringify({
        oldStatus: existing.status,
        newStatus: data.status,
        opportunityId: existing.opportunityId,
      })),
    });

    // Send notification to applicant
    const statusMessages: Record<ApplicationStatus, string> = {
      SUBMITTED: 'Your application has been submitted',
      UNDER_REVIEW: 'Your application is under review',
      SHORTLISTED: 'You have been shortlisted!',
      INTERVIEW: 'Interview scheduled',
      OFFER_PENDING: 'Offer is being prepared',
      OFFER_SENT: 'You have received an offer!',
      ACCEPTED: 'Offer accepted',
      REJECTED: 'Application not selected',
      WITHDRAWN: 'Application withdrawn',
      ONBOARDING: 'Welcome! Onboarding in progress',
      COMPLETED: 'Onboarding completed',
    };

    if (data.status) {
      await notificationService.create({
        userId: existing.userId,
        type: 'application_status_update',
        title: 'Application Status Update',
        message: `${statusMessages[data.status]} for "${existing.opportunity.title}"`,
        metadata: JSON.parse(JSON.stringify({
          applicationId: id,
          opportunityId: existing.opportunityId,
          status: data.status,
        })),
      });
    }

    return application;
  }

  /**
   * Withdraw application
   */
  static async withdraw(id: string, userId: string) {
    const application = await prisma.opportunityApplication.findUnique({
      where: { id },
      include: { opportunity: true },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (application.status === ApplicationStatus.ACCEPTED) {
      throw new Error('Cannot withdraw an accepted application');
    }

    const updated = await prisma.opportunityApplication.update({
      where: { id },
      data: { status: ApplicationStatus.WITHDRAWN },
    });

    // Audit log
    await AuditService.log({
      action: 'application.withdrawn',
      userId,
      entityType: 'application',
      entityId: id,
      metadata: JSON.parse(JSON.stringify({
        opportunityId: application.opportunityId,
      })),
    });

    return updated;
  }

  /**
   * Get application statistics
   */
  static async getStats(params: {
    opportunityId?: string;
    organizationId?: string;
    userId?: string;
  }) {
    const { opportunityId, organizationId, userId } = params;

    const where: Prisma.OpportunityApplicationWhereInput = {
      ...(opportunityId && { opportunityId }),
      ...(organizationId && { opportunity: { organizationId } }),
      ...(userId && { userId }),
    };

    const [
      total,
      submitted,
      underReview,
      shortlisted,
      interview,
      offerSent,
      accepted,
      rejected,
    ] = await Promise.all([
      prisma.opportunityApplication.count({ where }),
      prisma.opportunityApplication.count({
        where: { ...where, status: ApplicationStatus.SUBMITTED },
      }),
      prisma.opportunityApplication.count({
        where: { ...where, status: ApplicationStatus.UNDER_REVIEW },
      }),
      prisma.opportunityApplication.count({
        where: { ...where, status: ApplicationStatus.SHORTLISTED },
      }),
      prisma.opportunityApplication.count({
        where: { ...where, status: ApplicationStatus.INTERVIEW },
      }),
      prisma.opportunityApplication.count({
        where: { ...where, status: ApplicationStatus.OFFER_SENT },
      }),
      prisma.opportunityApplication.count({
        where: { ...where, status: ApplicationStatus.ACCEPTED },
      }),
      prisma.opportunityApplication.count({
        where: { ...where, status: ApplicationStatus.REJECTED },
      }),
    ]);

    return {
      total,
      submitted,
      underReview,
      shortlisted,
      interview,
      offerSent,
      accepted,
      rejected,
      conversionRate: total > 0 ? (accepted / total) * 100 : 0,
    };
  }

  /**
   * Get applications for an opportunity (for reviewers)
   */
  static async getByOpportunity(opportunityId: string, filters?: {
    status?: ApplicationStatus;
    rating?: number;
  }) {
    const where: Prisma.OpportunityApplicationWhereInput = {
      opportunityId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.rating && { rating: filters.rating }),
    };

    const applications = await prisma.opportunityApplication.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return applications;
  }
}
