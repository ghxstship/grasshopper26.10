'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Users, Music, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useArtist, useEvents } from '@/lib/hooks/gvteway';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/events/artist/[id]

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: artist, isLoading: artistLoading, isError: artistError } = useArtist(id);
  const { data: eventsData } = useEvents();
  const events = eventsData?.events || [];

  if (artistLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gvteway-red-500" />
        </div>
      </GvtewayLayout>
    );
  }

  if (artistError || !artist) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <BodyText className="text-white mb-4">Failed to load artist</BodyText>
            <Button variant="gvteway" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-8 flex items-center justify-center">
                <Music className="w-32 h-32 text-white/20" />
              </div>
              
              <div className="text-center mb-12">
                <h1 className="text-white mb-4">{artist.name}</h1>
                <Badge variant="gvteway" className="mb-4">{artist.genre}</Badge>
                <div className="flex items-center justify-center gap-2 text-grey-400">
                  <Users className="w-5 h-5" />
                  <span>{artist.followers.toLocaleString()} followers</span>
                </div>
                <p className="text-grey-300 mt-4 max-w-2xl mx-auto">{artist.bio}</p>
                <Button variant="gvteway" size="lg" className="mt-6">Follow Artist</Button>
              </div>

              <SectionHeader className="text-white mb-6">Upcoming Shows</SectionHeader>
              <div className="grid md:grid-cols-2 gap-6">
                {events && events.length > 0 ? (
                  events.map((event) => (
                    <Link key={event.id} href={`/gvteway/events/${event.id}`}>
                      <Card variant="gvteway" className="bg-grey-900/50 hover:scale-105 transition-transform cursor-pointer">
                        <CardContent className="p-6">
                          <h3 className="text-white mb-3">{event.name}</h3>
                          <div className="space-y-2 text-grey-400 text-body-sm mb-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(event.startDate).toLocaleDateString()}
                            </div>
                            <div>{event.location || 'Venue TBA'}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gvteway-red-500">View Event</span>
                            <Button variant="gvteway" size="sm">Get Tickets</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <BodyText className="text-grey-400 col-span-2">No upcoming events</BodyText>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
