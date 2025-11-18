'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useAdventures } from '@/lib/hooks/gvteway/useAdventures';

export default function ToursPage() {
  const { data: adventuresData, isLoading, error } = useAdventures();
  const tours = adventuresData || [];

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading tours...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Tours</h2>
            <p className="text-gray-400">Unable to load venue tours</p>
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
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">VENUE TOURS</h1>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <Link key={tour.id} href={`/gvteway/adventures/${tour.id}`}>
                    <Card variant="gvteway" className="bg-gray-900/50 hover:scale-105 transition-transform cursor-pointer">
                      <div className="h-48 bg-gray-800" />
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bebas text-white mb-3">{tour.name}</h3>
                        <div className="space-y-2 text-sm text-gray-400 mb-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {tour.duration}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Behind the scenes access
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bebas text-gvteway-red-500">${tour.price}</span>
                          <Button variant="gvteway" size="sm">Book</Button>
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
