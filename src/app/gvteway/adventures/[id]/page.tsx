'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useAdventure } from '@/lib/hooks/gvteway/useAdventures';

export default function AdventureDetailPage() {
  const params = useParams();
  const adventureId = params?.id as string;
  const { data: adventure, isLoading, error } = useAdventure(adventureId);
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading adventure...</p>
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-gvteway-red-500" />
        </div>
      </GvtewayLayout>
    );
  }

  if (error || !adventure) {
    return (
      <GvtewayLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <AlertCircle className="w-12 h-12 text-error mb-4" />
          <h2 className="text-h4 font-bebas text-white mb-2">Adventure Not Found</h2>
          <p className="text-gray-400">{error?.message || 'This adventure could not be loaded'}</p>
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
              <div className="h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-8" />
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h1 className="text-h1 font-bebas text-white mb-4">{adventure.name || 'BACKSTAGE VIP EXPERIENCE'}</h1>
                  <p className="text-gray-300 mb-6">{adventure.description || 'Get exclusive backstage access and meet the artists in person.'}</p>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-5 h-5 mr-3" />
                      3 hours
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="w-5 h-5 mr-3" />
                      20 spots available
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-5 h-5 mr-3" />
                      July 15, 2025
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-3" />
                      Madison Square Garden
                    </div>
                  </div>
                </div>
                <div>
                  <Card variant="gvteway" className="bg-gray-900/50 sticky top-24">
                    <CardContent className="p-6">
                      <p className="text-h2 font-bebas text-gvteway-red-500 mb-6">${adventure.price || '499.99'}</p>
                      <Button variant="gvteway" size="lg" className="w-full">Book Now</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
