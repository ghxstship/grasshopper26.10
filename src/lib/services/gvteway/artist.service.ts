/**
 * GVTEWAY Artist Service
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class ArtistService {
  static async getAll(params: {
    verified?: boolean;
    genre?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { verified, genre, search, page = 1, limit = 20 } = params;

    const where: Prisma.ArtistWhereInput = {
      ...(verified !== undefined && { verified }),
      ...(genre && { genres: { has: genre } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.artist.count({ where }),
    ]);

    return {
      artists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        events: {
          where: {
            event: {
              startDate: { gte: new Date() },
            },
          },
          orderBy: {
            order: 'asc',
          },
          include: {
            event: true,
          },
        },
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!artist) {
      throw new Error('Artist not found');
    }

    return artist;
  }

  static async create(data: {
    userId: string;
    name: string;
    slug: string;
    bio?: string;
    genres?: string[];
    imageUrl?: string;
    metadata?: Prisma.JsonValue;
  }) {
    const artist = await prisma.artist.create({
      data: {
        name: data.name,
        slug: data.slug,
        bio: data.bio,
        genre: data.genres?.join(', '),
        imageUrl: data.imageUrl,
        verified: false,
      },
    });

    await AuditService.log({
      userId: data.userId,
      action: 'CREATE',
      entity: 'Artist',
      entityId: artist.id,
      metadata: { name: data.name },
    });

    return artist;
  }

  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      slug: string;
      bio: string;
      genres: string[];
      imageUrl: string;
      metadata: Prisma.JsonValue;
    }>
  ) {
    const updated = await prisma.artist.update({
      where: { id },
      data,
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Artist',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  static async verify(id: string, userId: string) {
    const verified = await prisma.artist.update({
      where: { id },
      data: {
        verified: true,
      },
    });

    await AuditService.log({
      userId,
      action: 'VERIFY',
      entity: 'Artist',
      entityId: id,
    });

    return verified;
  }

  // Note: Artist following would require a separate ArtistFollow model
  // Currently Follow model is for user-to-user follows only
}
