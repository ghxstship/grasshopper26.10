import { NextRequest, NextResponse } from 'next/server';
import { spotifyService } from '@/lib/services/spotify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const artist = await spotifyService.getArtist(resolvedParams.id);
    return NextResponse.json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist' },
      { status: 500 }
    );
  }
}
