import { prisma } from '@/lib/prisma';

/**
 * GvtewayToAtlvsService
 * Business logic for /sync/gvteway-to-atlvs
 */

export class GvtewayToAtlvsService {
  // Service methods for syncing GVTEWAY events to ATLVS projects
  async findById(id: string) {
    // Fetch event from GVTEWAY
    return await prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
        organization: true,
      },
    });
  }
}
