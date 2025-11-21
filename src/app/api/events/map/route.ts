import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bounds = searchParams.get('bounds'); // "swLat,swLng,neLat,neLng"
    const category = searchParams.get('category');
    const dateFrom = searchParams.get('dateFrom');

    const where: any = {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    };

    if (category) {
      where.categoryId = category;
    }

    if (dateFrom) {
      where.startDate = { gte: new Date(dateFrom) };
    }

    // Parse bounds for geo filtering
    if (bounds) {
      const [swLat, swLng, neLat, neLng] = bounds.split(',').map(parseFloat);
      where.venue = {
        latitude: { gte: swLat, lte: neLat },
        longitude: { gte: swLng, lte: neLng },
      };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        venue: {
          select: {
            name: true,
            address: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
          },
        },
        ticketTypes: {
          select: {
            price: true,
            available: true,
          },
          orderBy: { price: 'asc' },
          take: 1,
        },
      },
      take: 500, // Limit for map view
    });

    // Transform to GeoJSON
    const geoJSON = {
      type: 'FeatureCollection',
      features: events.map((event) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [event.venue.longitude, event.venue.latitude],
        },
        properties: {
          id: event.id,
          name: event.name,
          startDate: event.startDate,
          venue: event.venue.name,
          city: event.venue.city,
          minPrice: event.ticketTypes[0]?.price || 0,
          imageUrl: event.imageUrl,
        },
      })),
    };

    return NextResponse.json({
      success: true,
      data: geoJSON,
    });
  } catch (error) {
    console.error('Map events error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to load map data' } },
      { status: 500 }
    );
  }
}
