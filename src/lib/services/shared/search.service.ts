/**
 * Search Service
 */

import { prisma } from '@/lib/prisma';

export class SearchService {
  static async searchAll(query: string, limit = 20) {
    const [events, venues, artists, projects, tasks] = await Promise.all([
      this.searchEvents(query, limit),
      this.searchVenues(query, limit),
      this.searchArtists(query, limit),
      this.searchProjects(query, limit),
      this.searchTasks(query, limit),
    ]);

    return {
      events,
      venues,
      artists,
      projects,
      tasks,
    };
  }

  static async searchEvents(query: string, limit = 20) {
    return prisma.event.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        venue: {
          select: {
            name: true,
            city: true,
          },
        },
      },
      take: limit,
    });
  }

  static async searchVenues(query: string, limit = 20) {
    return prisma.venue.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
  }

  static async searchArtists(query: string, limit = 20) {
    return prisma.artist.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
  }

  static async searchProjects(query: string, limit = 20) {
    return prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
    });
  }

  static async searchTasks(query: string, limit = 20) {
    return prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
    });
  }
}
