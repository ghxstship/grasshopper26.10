'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Camera, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useAdventures } from '@/lib/hooks/gvteway/useAdventures';

export default function MeetGreetPage() {
  const { data: adventuresData, isLoading, error, refetch } = useAdventures();

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading meet & greet sessions...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Sessions</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  const sessions = adventuresData || [];

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-12">
                <Camera className="w-16 h-16 text-gvteway-red-500 mx-auto mb-4" />
                <h1 className="text-5xl font-bebas gvteway-text-gradient mb-4">MEET & GREET</h1>
                <p className="text-xl text-gray-400">Personal sessions with your favorite artists</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {sessions.map((session: any) => (
                  <Link key={session.id} href={`/gvteway/adventures/${session.id}`}>
                    <Card variant="gvteway" className="bg-gray-900/50 hover:scale-105 transition-transform cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gray-700 rounded-full" />
                          <div>
                            <h3 className="text-2xl font-bebas text-white">{session.title || session.name}</h3>
                            <div className="flex items-center text-gray-400">
                              <Users className="w-4 h-4 mr-2" />
                              {session.capacity - (session.bookings?.length || 0)} spots left
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          <span className="text-3xl font-bebas text-gvteway-red-500">${session.price}</span>
                          <Button variant="gvteway">Book Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
